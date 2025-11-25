# Infinity Browser

A modern, fast web browser built with Electron featuring a sleek dark gradient UI and powerful browsing capabilities.

<div align="center">
  <img src="logo.png" alt="Infinity Logo" width="128" height="128">
  
  **A Modern, Feature-Rich Code Editor Built with Python & Tkinter**
  
  ![Version](https://img.shields.io/badge/version-1.0.0-orange)
  ![License](https://img.shields.io/badge/license-MIT-blue)
  ![Platform](https://img.shields.io/badge/platform-Windows-lightgrey)
  [![GitHub](https://img.shields.io/badge/GitHub-Repository-181717?logo=github)](https://github.com/DaRealTrueBlue/CodeForge)
  
  [Download](https://darealtrueblue.ddns.net) • [Contributing](CONTRIBUTING.md)
</div>

## ✨ Features

- **🚀 Lightning Fast** - Built on Chromium engine for blazing-fast performance
- **🎨 Beautiful UI** - Dark gradient theme with smooth animations and glassmorphism effects
- **📑 Tab Management** - Efficient multi-tab system with dynamic tab titles
- **🔖 Bookmarks** - Easy bookmark management with star button and quick access bar
- **⚡ Quick Links** - Customizable home page with your favorite sites and favicon support
- **📜 History Tracking** - Keep track of your browsing history
- **🎬 Boot Animation** - Stunning animated logo on startup
- **🔍 Smart URL Bar** - Auto-detects URLs vs search queries (Google search integration)
- **⌨️ Keyboard Shortcuts** - Full keyboard navigation support

## 🛠️ Installation

### Download Pre-built

Download the latest installer from [Releases](https://github.com/DaRealTrueBlue/Infinity/releases) or visit [darealtrueblue.ddns.net](https://darealtrueblue.ddns.net)

### Build from Source

1. **Clone the repository**
   ```bash
   git clone https://github.com/DaRealTrueBlue/Infinity.git
   cd Infinity
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run in development**
   ```bash
   npm start
   ```

4. **Build installer (Windows)**
   ```powershell
   .\build-installer.ps1
   ```
   The installer will be created at `dist\InfinityBrowserSetup.exe`

## 🎯 Usage

### Navigation
- **Back/Forward** - Navigate through your browsing history
- **Refresh** - Reload the current page
- **Home** - Return to the quick links home page

### Tabs
- **New Tab** - Click the `+` button or press `Ctrl+T`
- **Close Tab** - Click the `×` on any tab or press `Ctrl+W`
- **Switch Tabs** - Click on tab headers or use `Ctrl+Tab`

### Bookmarks
- **Add Bookmark** - Click the ⭐ star icon in the URL bar or press `Ctrl+D`
- **View Bookmarks** - Toggle the bookmarks bar with `Ctrl+Shift+B`
- **Navigate** - Click any bookmark to visit that page

### Quick Links
- **Add Link** - Click the `+` button on the home page
- **Remove Link** - Hover over a link and click the `×` button
- **Custom Icons** - Automatically fetches favicons for your links

## ⚙️ Configuration

All user data is stored locally using `localStorage`:
- Bookmarks
- Browsing history
- Quick links
- Tab states

## 🧰 Tech Stack

- **[Electron](https://www.electronjs.org/)** v28.0.0 - Desktop application framework
- **HTML5/CSS3** - Modern web technologies with gradient themes
- **JavaScript** - Browser logic and state management
- **7-Zip** - Self-extracting installer creation
- **rcedit** - Custom icon embedding

## 📦 Project Structure

```
Infinity/
├── index.html          # Main browser UI
├── styles.css          # Dark gradient theme styling (900+ lines)
├── renderer.js         # Browser logic and functionality (1050+ lines)
├── main.js            # Electron main process
├── package.json       # Project configuration
├── build-installer.ps1 # Build script for Windows installer
├── sfx-config.txt     # 7-Zip installer configuration
├── animatedlogo.webm  # Boot animation video (transparent)
├── logo.ico           # Application icon
├── logo.png           # Logo image
└── start.bat          # Quick start script
```

## 🔧 Development

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Windows OS (for building .exe installers)
- 7-Zip (automatically installed by build script)
- PowerShell 5.1+

### Available Scripts

- `npm start` - Run the browser in development mode
- `.\build-installer.ps1` - Create Windows installer with custom icon and setup dialog

### Build Process

The build script automatically:
1. Packages the app with Electron
2. Renames folder to `Infinity`
3. Creates 7z archive
4. Applies custom icon with rcedit
5. Generates self-extracting installer with setup dialog

## ⌨️ Keyboard Shortcuts

- **Ctrl+T** - New tab
- **Ctrl+W** - Close current tab
- **Ctrl+Tab** - Switch to next tab
- **Ctrl+L** - Focus address bar
- **Ctrl+R / F5** - Refresh page
- **Ctrl+D** - Add bookmark
- **Ctrl+Shift+B** - Toggle bookmarks bar
- **Alt+Left** - Go back
- **Alt+Right** - Go forward
- **Alt+Home** - Go to home page

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🎨 Credits

- UI Design inspired by modern browser aesthetics
- Built with ❤️ using Electron
- Dark gradient theme (#1e1e1e to #2a2a2a with purple accents)
- Animated logo created with transparency support

## 🐛 Known Issues

- Some websites may have compatibility issues with Electron webview
- Download manager tracked but not fully implemented
- First-time boot animation requires video codec support

## 🗺️ Roadmap

- [ ] Extension support
- [ ] Download manager improvements
- [ ] Settings panel with theme customization
- [ ] Sync across devices
- [ ] Password manager
- [ ] Developer tools integration
- [ ] Ad blocker
- [ ] VPN integration

## 📧 Contact

Created by [@DaRealTrueBlue](https://github.com/DaRealTrueBlue)

- Website: [darealtrueblue.ddns.net](https://darealtrueblue.ddns.net)
- Email: darealtrueblue.contact@gmail.com
- YouTube: [@darealtrueblue](https://www.youtube.com/@darealtrueblue)
- Discord: [Join Server](https://discord.gg/z6rybp6rvS)

---

⭐ Star this repo if you like it!
