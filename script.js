/* ===== FOOTBALLAI24 - PROFESSIONAL FOOTBALL DATA PLATFORM ===== */

// ===== CONFIGURATION =====
const CONFIG = {
  API_FOOTBALL: {
    BASE_URL: 'https://v3.football.api-sports.io',
    KEY: getEnvVariable('API_FOOTBALL_KEY') || 'demo_key_replace_me',
    ENDPOINTS: {
      LIVE: '/fixtures?live=all',
      FIXTURES: '/fixtures?next=10&league=39&season=2024',
      STANDINGS: '/standings?league=39&season=2024',
      PLAYERS: '/players/topscorers?league=39&season=2024'
    }
  },
  GNEWS: {
    BASE_URL: 'https://gnews.io/api/v4',
    KEY: getEnvVariable('GNEWS_API_KEY') || 'demo_key_replace_me',
    ENDPOINTS: {
      NEWS: '/search?q=football&lang=en&sortby=publishedAt&max=12'
    }
  },
  REFRESH_INTERVAL: 60000, // 60 seconds
  CACHE_DURATION: 55000 // 55 seconds
};

// ===== INTERNATIONALIZATION =====
const TRANSLATIONS = {
  en: {
    title: '⚽ FootballAI24',
    subtitle: 'AI-Powered Football News & Live Scores',
    lastUpdate: 'Last updated:',
    autoRefresh: 'Auto-refresh in',
    loading: 'Loading...',
    noData: 'No data available',
    liveMatches: '🔴 Live Matches',
    upcomingFixtures: '📅 Upcoming Fixtures',
    standings: '🏆 League Standings',
    topScorers: '👑 Top Scorers',
    footballNews: '📰 Football News',
    allRightsReserved: 'All rights reserved.',
    footerDesc: 'Powered by API-Football & GNews | Built for Football Fans',
    noLiveMatches: 'No live matches at the moment',
    viewDetails: 'View Details',
    readMore: 'Read More',
    position: 'Position',
    team: 'Team',
    played: 'Played',
    won: 'Won',
    drawn: 'Drawn',
    lost: 'Lost',
    goals: 'Goals',
    assists: 'Assists',
    errorLoading: 'Error loading data. Please try again later.',
    leagueStandings: 'League Standings',
    apiError: 'Failed to fetch data from API. Please check your API keys.'
  },
  ar: {
    title: '⚽ FootballAI24',
    subtitle: 'منصة أخبار كرة القدم المدعومة بالذكاء الاصطناعي',
    lastUpdate: 'آخر تحديث:',
    autoRefresh: 'التحديث التلقائي في',
    loading: 'جاري التحميل...',
    noData: 'لا توجد بيانات متاحة',
    liveMatches: '🔴 المباريات المباشرة',
    upcomingFixtures: '📅 المباريات القادمة',
    standings: '🏆 جدول الترتيب',
    topScorers: '👑 أفضل هدافين',
    footballNews: '📰 أخبار كرة القدم',
    allRightsReserved: 'جميع الحقوق محفوظة.',
    footerDesc: 'مدعوم من API-Football و GNews | تم بناؤه لعشاق كرة القدم',
    noLiveMatches: 'لا توجد مباريات مباشرة في الوقت الحالي',
    viewDetails: 'عرض التفاصيل',
    readMore: 'اقرأ المزيد',
    position: 'المركز',
    team: 'الفريق',
    played: 'المباريات',
    won: 'الفوز',
    drawn: 'التعادل',
    lost: 'الخسارة',
    goals: 'الأهداف',
    assists: 'التمريرات',
    errorLoading: 'خطأ في تحميل البيانات. يرجى المحاولة لاحقا.',
    leagueStandings: 'جدول ترتيب الدوري',
    apiError: 'فشل في جلب البيانات من API. يرجى التحقق من مفاتيح API الخاصة بك.'
  }
};

// ===== STATE MANAGEMENT =====
const STATE = {
  currentLanguage: localStorage.getItem('language') || 'en',
  currentSection: 'live',
  liveMatches: [],
  fixtures: [],
  standings: [],
  topScorers: [],
  news: [],
  lastRefresh: null,
  refreshTimer: 60,
  cache: {}
};

// ===== UTILITY FUNCTIONS =====

/**
 * Get environment variable (client-side workaround)
 */
function getEnvVariable(key) {
  // In production, this would come from your backend
  const params = new URLSearchParams(window.location.search);
  return params.get(key);
}

/**
 * Translate text
 */
function t(key) {
  return TRANSLATIONS[STATE.currentLanguage]?.[key] || TRANSLATIONS.en[key] || key;
}

/**
 * Update all translations in the DOM
 */
function updateTranslations() {
  document.documentElement.lang = STATE.currentLanguage;
  document.documentElement.dir = STATE.currentLanguage === 'ar' ? 'rtl' : 'ltr';
  
  document.querySelectorAll('[data-i18n]').forEach(element => {
    const key = element.dataset.i18n;
    element.textContent = t(key);
  });
  
  localStorage.setItem('language', STATE.currentLanguage);
}

/**
 * Fetch with error handling
 */
async function fetchWithTimeout(url, options = {}, timeout = 8000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Fetch error:', error);
    throw error;
  }
}

/**
 * Get cached data
 */
function getCache(key) {
  const cached = STATE.cache[key];
  if (cached && Date.now() - cached.timestamp < CONFIG.CACHE_DURATION) {
    return cached.data;
  }
  return null;
}

/**
 * Set cached data
 */
function setCache(key, data) {
  STATE.cache[key] = {
    data,
    timestamp: Date.now()
  };
}

/**
 * Show loading spinner
 */
function showLoading() {
  document.getElementById('loadingSpinner').classList.remove('hidden');
}

/**
 * Hide loading spinner
 */
function hideLoading() {
  document.getElementById('loadingSpinner').classList.add('hidden');
}

/**
 * Show error message
 */
function showError(message) {
  const errorEl = document.getElementById('errorMessage');
  errorEl.textContent = message;
  errorEl.classList.remove('hidden');
  setTimeout(() => errorEl.classList.add('hidden'), 5000);
}

/**
 * Format date
 */
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString(STATE.currentLanguage === 'ar' ? 'ar-EG' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

/**
 * Get flag emoji for country
 */
function getCountryFlag(countryName) {
  const flags = {
    'England': '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    'Spain': '🇪🇸',
    'Italy': '🇮🇹',
    'Germany': '🇩🇪',
    'France': '🇫🇷',
    'Portugal': '🇵🇹',
    'Netherlands': '🇳🇱',
    'Belgium': '🇧🇪',
    'Brazil': '🇧🇷',
    'Argentina': '🇦🇷',
    'Saudi Arabia': '🇸🇦',
    'UAE': '🇦🇪',
    'Egypt': '🇪🇬'
  };
  return flags[countryName] || '🌍';
}

/**
 * Update last refresh time
 */
function updateLastRefresh() {
  const now = new Date();
  STATE.lastRefresh = now;
  document.getElementById('lastUpdate').textContent = now.toLocaleTimeString(
    STATE.currentLanguage === 'ar' ? 'ar-EG' : 'en-US'
  );
}

/**
 * Start refresh countdown
 */
function startRefreshCountdown() {
  STATE.refreshTimer = 60;
  const timerEl = document.getElementById('refreshTimer');
  
  const countdown = setInterval(() => {
    STATE.refreshTimer--;
    timerEl.textContent = STATE.refreshTimer;
    
    if (STATE.refreshTimer <= 0) {
      clearInterval(countdown);
      refreshAllData();
    }
  }, 1000);
}

// ===== API FUNCTIONS =====

/**
 * Fetch live matches
 */
async function fetchLiveMatches() {
  try {
    const cached = getCache('live_matches');
    if (cached) return cached;
    
    const url = `${CONFIG.API_FOOTBALL.BASE_URL}${CONFIG.API_FOOTBALL.ENDPOINTS.LIVE}`;
    const response = await fetchWithTimeout(url, {
      headers: { 'x-apisports-key': CONFIG.API_FOOTBALL.KEY }
    });
    
    if (response.errors?.length > 0) {
      throw new Error('API Error: ' + Object.values(response.errors)[0]);
    }
    
    const matches = response.response || [];
    setCache('live_matches', matches);
    STATE.liveMatches = matches;
    return matches;
  } catch (error) {
    console.error('Error fetching live matches:', error);
    showError(t('errorLoading'));
    return [];
  }
}

/**
 * Fetch upcoming fixtures
 */
async function fetchFixtures(leagueId = '39', season = '2024') {
  try {
    const cacheKey = `fixtures_${leagueId}_${season}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    
    const url = `${CONFIG.API_FOOTBALL.BASE_URL}/fixtures?league=${leagueId}&season=${season}&next=10`;
    const response = await fetchWithTimeout(url, {
      headers: { 'x-apisports-key': CONFIG.API_FOOTBALL.KEY }
    });
    
    if (response.errors?.length > 0) {
      throw new Error('API Error: ' + Object.values(response.errors)[0]);
    }
    
    const fixtures = response.response || [];
    setCache(cacheKey, fixtures);
    STATE.fixtures = fixtures;
    return fixtures;
  } catch (error) {
    console.error('Error fetching fixtures:', error);
    showError(t('errorLoading'));
    return [];
  }
}

/**
 * Fetch standings
 */
async function fetchStandings(leagueId = '39', season = '2024') {
  try {
    const cacheKey = `standings_${leagueId}_${season}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    
    const url = `${CONFIG.API_FOOTBALL.BASE_URL}/standings?league=${leagueId}&season=${season}`;
    const response = await fetchWithTimeout(url, {
      headers: { 'x-apisports-key': CONFIG.API_FOOTBALL.KEY }
    });
    
    if (response.errors?.length > 0) {
      throw new Error('API Error: ' + Object.values(response.errors)[0]);
    }
    
    const standings = response.response || [];
    setCache(cacheKey, standings);
    STATE.standings = standings;
    return standings;
  } catch (error) {
    console.error('Error fetching standings:', error);
    showError(t('errorLoading'));
    return [];
  }
}

/**
 * Fetch top scorers
 */
async function fetchTopScorers(leagueId = '39', season = '2024') {
  try {
    const cacheKey = `scorers_${leagueId}_${season}`;
    const cached = getCache(cacheKey);
    if (cached) return cached;
    
    const url = `${CONFIG.API_FOOTBALL.BASE_URL}/players/topscorers?league=${leagueId}&season=${season}`;
    const response = await fetchWithTimeout(url, {
      headers: { 'x-apisports-key': CONFIG.API_FOOTBALL.KEY }
    });
    
    if (response.errors?.length > 0) {
      throw new Error('API Error: ' + Object.values(response.errors)[0]);
    }
    
    const scorers = response.response || [];
    setCache(cacheKey, scorers);
    STATE.topScorers = scorers;
    return scorers;
  } catch (error) {
    console.error('Error fetching top scorers:', error);
    showError(t('errorLoading'));
    return [];
  }
}

/**
 * Fetch football news
 */
async function fetchNews(query = 'football') {
  try {
    const cached = getCache('news');
    if (cached) return cached;
    
    const url = `${CONFIG.GNEWS.BASE_URL}${CONFIG.GNEWS.ENDPOINTS.NEWS}`;
    const params = new URLSearchParams({
      q: query,
      lang: STATE.currentLanguage,
      sortby: 'publishedAt',
      max: 12,
      apikey: CONFIG.GNEWS.KEY
    });
    
    const response = await fetchWithTimeout(`${url}&${params}`, {});
    
    const articles = response.articles || [];
    setCache('news', articles);
    STATE.news = articles;
    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// ===== RENDER FUNCTIONS =====

/**
 * Render live matches
 */
function renderLiveMatches() {
  const container = document.getElementById('liveMatches');
  
  if (STATE.liveMatches.length === 0) {
    container.innerHTML = `<p class="text-center">${t('noLiveMatches')}</p>`;
    return;
  }
  
  container.innerHTML = STATE.liveMatches.map(match => {
    const fixture = match.fixture;
    const goals = match.goals;
    const status = fixture.status;
    const isLive = status.short === 'LIVE' || status.short === '1H' || status.short === '2H';
    
    return `
      <div class="match-card ${isLive ? 'live' : ''}">
        <div class="match-header">
          <span class="league-name">${match.league?.name || 'Match'}</span>
          <span class="match-time">${status.elapsed || status.short}'</span>
        </div>
        
        <div class="match-body">
          <div class="team">
            <span class="team-name">
              <span class="team-flag">${getCountryFlag(match.teams.home.name)}</span>
              ${match.teams.home.name}
            </span>
            <span class="team-score">${goals.home}</span>
          </div>
          
          <div class="vs-text">VS</div>
          
          <div class="team">
            <span class="team-score">${goals.away}</span>
            <span class="team-name">
              ${match.teams.away.name}
              <span class="team-flag">${getCountryFlag(match.teams.away.name)}</span>
            </span>
          </div>
          
          ${match.statistics ? `
            <div class="match-stats">
              <div class="stat-item">
                <div class="stat-label">Possession</div>
                <div class="stat-value">${match.statistics[0]?.possession || '-'}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Shots</div>
                <div class="stat-value">${match.statistics[0]?.shots?.on || '-'}</div>
              </div>
              <div class="stat-item">
                <div class="stat-label">Corners</div>
                <div class="stat-value">${match.statistics[0]?.corner?.total || '-'}</div>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render fixtures
 */
function renderFixtures() {
  const container = document.getElementById('fixtures');
  
  if (STATE.fixtures.length === 0) {
    container.innerHTML = `<p class="text-center">${t('noData')}</p>`;
    return;
  }
  
  container.innerHTML = STATE.fixtures.map(match => {
    const fixture = match.fixture;
    const goals = match.goals;
    
    return `
      <div class="match-card">
        <div class="match-header">
          <span class="league-name">${match.league?.name || 'Match'}</span>
          <span class="match-time">${formatDate(fixture.date)}</span>
        </div>
        
        <div class="match-body">
          <div class="team">
            <span class="team-name">
              <span class="team-flag">${getCountryFlag(match.teams.home.name)}</span>
              ${match.teams.home.name}
            </span>
            <span class="team-score">-</span>
          </div>
          
          <div class="vs-text">VS</div>
          
          <div class="team">
            <span class="team-score">-</span>
            <span class="team-name">
              ${match.teams.away.name}
              <span class="team-flag">${getCountryFlag(match.teams.away.name)}</span>
            </span>
          </div>
        </div>
        
        <div class="match-footer">
          <button class="action-btn">${t('viewDetails')}</button>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render standings
 */
function renderStandings() {
  const container = document.getElementById('standingsTable');
  
  if (STATE.standings.length === 0) {
    container.innerHTML = `<p class="text-center">${t('noData')}</p>`;
    return;
  }
  
  const league = STATE.standings[0];
  const standings = league.standings[0] || [];
  
  const tableHTML = `
    <table>
      <thead>
        <tr>
          <th>${t('position')}</th>
          <th>${t('team')}</th>
          <th>${t('played')}</th>
          <th>${t('won')}</th>
          <th>${t('drawn')}</th>
          <th>${t('lost')}</th>
          <th>${t('goals')}</th>
          <th>Points</th>
        </tr>
      </thead>
      <tbody>
        ${standings.map(team => `
          <tr>
            <td><span class="position">${team.rank}</span></td>
            <td>
              <div class="team-col">
                <span class="team-flag">${getCountryFlag(team.team.name)}</span>
                <span>${team.team.name}</span>
              </div>
            </td>
            <td>${team.all.played}</td>
            <td>${team.all.win}</td>
            <td>${team.all.draw}</td>
            <td>${team.all.lose}</td>
            <td>${team.all.goals.for}:${team.all.goals.against}</td>
            <td><strong>${team.points}</strong></td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  
  container.innerHTML = tableHTML;
}

/**
 * Render top scorers
 */
function renderTopScorers() {
  const container = document.getElementById('topScorers');
  
  if (STATE.topScorers.length === 0) {
    container.innerHTML = `<p class="text-center">${t('noData')}</p>`;
    return;
  }
  
  container.innerHTML = STATE.topScorers.slice(0, 12).map((scorer, index) => {
    return `
      <div class="scorer-card">
        <div class="scorer-rank">#${index + 1}</div>
        ${scorer.player.photo ? `
          <img src="${scorer.player.photo}" alt="${scorer.player.name}" class="scorer-photo" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>👤</text></svg>'">
        ` : '<div style="width: 80px; height: 80px; margin: 0 auto 15px; border-radius: 50%; background: #e2e8f0; display: flex; align-items: center; justify-content: center; font-size: 40px;">👤</div>'}
        <div class="scorer-name">${scorer.player.name}</div>
        <div class="scorer-team">${scorer.statistics[0]?.team?.name || 'N/A'}</div>
        <div class="scorer-stats">
          <div class="scorer-stat">
            <div class="scorer-stat-label">${t('goals')}</div>
            <div class="scorer-stat-value">${scorer.statistics[0]?.goals?.total || 0}</div>
          </div>
          <div class="scorer-stat">
            <div class="scorer-stat-label">${t('assists')}</div>
            <div class="scorer-stat-value">${scorer.statistics[0]?.goals?.assists || 0}</div>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

/**
 * Render news
 */
function renderNews() {
  const container = document.getElementById('newsFeed');
  
  if (STATE.news.length === 0) {
    container.innerHTML = `<p class="text-center">${t('noData')}</p>`;
    return;
  }
  
  container.innerHTML = STATE.news.map(article => {
    return `
      <article class="news-card">
        ${article.image ? `
          <img src="${article.image}" alt="${article.title}" class="news-image" onerror="this.src='data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 400 300%22><rect fill=%22%23e2e8f0%22 width=%22400%22 height=%22300%22/><text x=%22200%22 y=%22150%22 text-anchor=%22middle%22 dy=%22.3em%22 font-size=%2248%22>📰</text></svg>'">
        ` : ''}
        <div class="news-content">
          <div class="news-source">${new URL(article.url).hostname.replace('www.', '')}</div>
          <h3 class="news-title">${article.title}</h3>
          <p class="news-description">${article.description || 'Click to read more...'}</p>
          <div class="news-footer">
            <span class="news-date">${formatDate(article.publishedAt)}</span>
            <a href="${article.url}" target="_blank" rel="noopener noreferrer" class="read-more">${t('readMore')}</a>
          </div>
        </div>
      </article>
    `;
  }).join('');
}

// ===== SECTION MANAGEMENT =====

/**
 * Switch section
 */
async function switchSection(sectionName) {
  STATE.currentSection = sectionName;
  
  // Update navigation
  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.section === sectionName) {
      link.classList.add('active');
    }
  });
  
  // Hide all sections
  document.querySelectorAll('.section').forEach(section => {
    section.classList.remove('active');
  });
  
  // Show selected section
  const section = document.getElementById(sectionName);
  if (section) {
    section.classList.add('active');
    
    // Load data if needed
    switch(sectionName) {
      case 'live':
        showLoading();
        await fetchLiveMatches();
        renderLiveMatches();
        hideLoading();
        break;
      case 'fixtures':
        showLoading();
        const leagueId = document.getElementById('fixtureLeague')?.value || '39';
        await fetchFixtures(leagueId);
        renderFixtures();
        hideLoading();
        break;
      case 'standings':
        showLoading();
        const standingLeague = document.getElementById('standingsLeague')?.value || '39';
        const standingSeason = document.getElementById('standingsSeason')?.value || '2024';
        await fetchStandings(standingLeague, standingSeason);
        renderStandings();
        hideLoading();
        break;
      case 'top-scorers':
        showLoading();
        const scorersLeague = document.getElementById('scorersLeague')?.value || '39';
        const scorersSeason = document.getElementById('scorersSeason')?.value || '2024';
        await fetchTopScorers(scorersLeague, scorersSeason);
        renderTopScorers();
        hideLoading();
        break;
      case 'news':
        showLoading();
        await fetchNews();
        renderNews();
        hideLoading();
        break;
    }
  }
}

/**
 * Refresh all data
 */
async function refreshAllData() {
  const btn = document.getElementById('refreshBtn');
  btn.classList.add('loading');
  
  showLoading();
  
  try {
    // Clear cache
    STATE.cache = {};
    
    // Fetch all data
    await Promise.all([
      fetchLiveMatches(),
      fetchFixtures(),
      fetchNews()
    ]);
    
    // Re-render current section
    await switchSection(STATE.currentSection);
    
    updateLastRefresh();
    startRefreshCountdown();
  } catch (error) {
    console.error('Error refreshing data:', error);
    showError(t('errorLoading'));
  } finally {
    btn.classList.remove('loading');
    hideLoading();
  }
}

// ===== EVENT LISTENERS =====

document.addEventListener('DOMContentLoaded', () => {
  // Initialize translations
  updateTranslations();
  
  // Language selector
  document.getElementById('languageSelect').addEventListener('change', (e) => {
    STATE.currentLanguage = e.target.value;
    updateTranslations();
  });
  
  // Navigation links
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const section = link.dataset.section;
      switchSection(section);
      // Close mobile menu
      document.getElementById('menuToggle').classList.remove('active');
      document.querySelector('.nav-menu').classList.remove('active');
    });
  });
  
  // Mobile menu toggle
  document.getElementById('menuToggle').addEventListener('click', () => {
    const menu = document.querySelector('.nav-menu');
    menu.classList.toggle('active');
  });
  
  // Refresh button
  document.getElementById('refreshBtn').addEventListener('click', refreshAllData);
  
  // Fixtures filters
  document.getElementById('fixtureDate')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('fixtureLeague').value || '39';
    await fetchFixtures(leagueId);
    renderFixtures();
  });
  
  document.getElementById('fixtureLeague')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('fixtureLeague').value || '39';
    await fetchFixtures(leagueId);
    renderFixtures();
  });
  
  // Standings filters
  document.getElementById('standingsLeague')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('standingsLeague').value || '39';
    const season = document.getElementById('standingsSeason').value || '2024';
    await fetchStandings(leagueId, season);
    renderStandings();
  });
  
  document.getElementById('standingsSeason')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('standingsLeague').value || '39';
    const season = document.getElementById('standingsSeason').value || '2024';
    await fetchStandings(leagueId, season);
    renderStandings();
  });
  
  // Top scorers filters
  document.getElementById('scorersLeague')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('scorersLeague').value || '39';
    const season = document.getElementById('scorersSeason').value || '2024';
    await fetchTopScorers(leagueId, season);
    renderTopScorers();
  });
  
  document.getElementById('scorersSeason')?.addEventListener('change', async () => {
    const leagueId = document.getElementById('scorersLeague').value || '39';
    const season = document.getElementById('scorersSeason').value || '2024';
    await fetchTopScorers(leagueId, season);
    renderTopScorers();
  });
  
  // Initial load
  switchSection('live');
  updateLastRefresh();
  startRefreshCountdown();
  
  // Auto-refresh every 60 seconds
  setInterval(() => {
    if (STATE.currentSection === 'live') {
      refreshAllData();
    }
  }, CONFIG.REFRESH_INTERVAL);
});

console.log('⚽ FootballAI24 initialized successfully!');
