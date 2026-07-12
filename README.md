# ⚽ FootballAI24 - AI-Powered Football News Platform

A professional, modern football news and live scores website powered by AI, featuring real-time match updates, standings, player statistics, and breaking football news.

## 🌟 Features

### 📺 Live Matches
- Real-time live match updates with instant score notifications
- Complete match statistics (possession, shots, corners)
- Beautiful animated match cards with live status indicators
- Multi-league support

### 📅 Upcoming Fixtures
- Browse upcoming matches from top leagues
- Advanced filtering by league and date
- Fixture details and scheduled times
- Team information and predictions

### 🏆 League Standings
- Complete interactive league tables
- Team positions, records, and goal differentials
- Points tracking and rankings
- Multiple leagues and seasons

### 👑 Top Scorers
- Golden Boot race tracking
- Player statistics (goals, assists, appearances)
- Player photos and team information
- Season and league filtering

### 📰 Football News
- Real-time news aggregation from trusted sources
- Multi-language support (English & Arabic)
- Beautiful news cards with featured images
- Direct links to full articles

### 🌐 Multi-Language & RTL Support
- Full English interface
- Complete Arabic translation with RTL layout
- Easy language switching with persistent preferences
- Localized date and number formatting

### 📱 Fully Responsive Design
- Mobile-first progressive design
- Optimized for all screen sizes
- Touch-friendly interface
- Smooth animations and transitions

### ⚡ Performance & Caching
- Auto-refresh every 60 seconds
- Intelligent client-side caching
- Fast API calls with timeout protection
- Loading indicators and error handling

## 🚀 Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **APIs**:
  - [API-Football](https://www.api-football.com) - Comprehensive football data
  - [GNews API](https://gnews.io) - Real-time news aggregation
- **Hosting**: Vercel
- **Styling**: Modern CSS with CSS Variables
- **State Management**: Client-side with LocalStorage

## 🔑 Getting Your API Keys

### API-Football
1. Visit https://www.api-football.com
2. Create a free account
3. Get your API key from the dashboard
4. Free tier: 100 requests/day

### GNews API
1. Visit https://gnews.io
2. Sign up for free
3. Generate your API key
4. Free tier available

## 📦 Installation & Setup

### Local Development

```bash
# Clone the repository
git clone https://github.com/smailsaghir4/FootballAI24.git
cd FootballAI24

# Create environment file
cp .env.example .env.local

# Add your API keys
# Edit .env.local and add:
# API_FOOTBALL_KEY=your_key_here
# GNEWS_API_KEY=your_key_here

# Start local server
python -m http.server 8000
# Visit: http://localhost:8000
```

### Deploy to Vercel

1. Push code to GitHub
2. Go to https://vercel.com
3. Import your FootballAI24 repository
4. Add environment variables in settings
5. Deploy automatically on push

## ⚙️ Configuration

### Add API Keys to Vercel

In your Vercel project settings:

1. Go to Settings → Environment Variables
2. Add `API_FOOTBALL_KEY` with your API-Football key
3. Add `GNEWS_API_KEY` with your GNews key
4. Redeploy

### Customize Refresh Rate

Edit `script.js` CONFIG object:

```javascript
REFRESH_INTERVAL: 60000    // Refresh every 60 seconds
CACHE_DURATION: 55000      // Cache for 55 seconds
```

## 📋 Project Files

```
FootballAI24/
├── index.html           # Main HTML structure
├── style.css            # Complete styling (1000+ lines)
├── script.js            # JavaScript logic (900+ lines)
├── vercel.json          # Vercel configuration
├── .env.example         # Environment template
├── .gitignore           # Git ignore rules
├── package.json         # Project metadata
├── README.md            # Documentation
└── LICENSE              # MIT License
```

## 🎨 Design & UX

### Color Palette
- **Primary**: Green (#0b8f3a) - Football association
- **Secondary**: Blue (#1e3a8a) - Professional
- **Accent**: Amber (#f59e0b) - Highlights
- **Dark**: Slate (#0f172a) - Modern

### Responsive Breakpoints
- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: 480px - 767px
- Small: < 480px

## 🌍 Supported Competitions

- 🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League
- 🇪🇸 La Liga
- 🇮🇹 Serie A
- 🇩🇪 Bundesliga
- 🇫🇷 Ligue 1
- 🏆 Champions League

## 📊 Data & Updates

- **Live Matches**: Updates every 60 seconds
- **Fixtures**: 10 upcoming matches
- **Standings**: Complete league tables
- **Top Scorers**: Top 12 players
- **News**: Latest 12 articles

## 🔒 Security & Best Practices

- API keys in environment variables only
- No credentials in client code
- CORS-protected API calls
- Input validation and sanitization
- Graceful error handling

## 📱 Browser Compatibility

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Mobile Safari
- ✅ Chrome Mobile
- ✅ RTL browsers

## 🚦 Performance Metrics

- **Load Time**: < 2 seconds
- **Time to Interactive**: < 3 seconds
- **API Response**: < 5 seconds cached
- **Animations**: GPU-accelerated

## 🎯 Future Roadmap

- [ ] Player detail pages
- [ ] Advanced team analytics
- [ ] Match predictions
- [ ] User authentication
- [ ] Dark mode toggle
- [ ] Favorites system
- [ ] Push notifications
- [ ] PWA support
- [ ] Statistics dashboard
- [ ] Player comparison tool

## 🤝 Contributing

We welcome contributions! To contribute:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Make your changes
4. Commit changes (`git commit -m 'Add feature'`)
5. Push to branch (`git push origin feature/amazing`)
6. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Credits

- **API-Football** - Comprehensive sports data
- **GNews API** - News aggregation
- **Vercel** - Hosting & deployment
- **Football Fans** - Inspiration

## 💬 Support

- Issues: https://github.com/smailsaghir4/FootballAI24/issues
- Email: Contact via GitHub profile
- Discord: Coming soon

## 🔗 Important Links

- **Live Website**: https://football-ai-24.vercel.app
- **GitHub Repo**: https://github.com/smailsaghir4/FootballAI24
- **Author**: [@smailsaghir4](https://github.com/smailsaghir4)

---

<div align="center">

**⚽ Made with ❤️ for Football Fans Worldwide ⚽**

Give us a ⭐ if you like this project!

</div>
