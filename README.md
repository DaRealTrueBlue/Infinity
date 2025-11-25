# Infinity Browser

∞ A modern, lightweight web browser built with Electron.

## Features

- **Clean Interface** - Modern, minimalist design with a beautiful gradient home page
- **Tab Management** - Multiple tabs with easy switching and closing
- **Navigation Controls** - Back, forward, refresh, and home buttons
- **Smart URL Bar** - Automatically detects URLs vs search queries
- **Quick Links** - Fast access to popular websites from the home page
- **Bookmarks** - Save and manage your favorite websites (Ctrl+D to bookmark)
- **Keyboard Shortcuts** - Full keyboard support for power users
- **History Navigation** - Track and navigate through browsing history

## Installation

1. Install Node.js if you haven't already
2. Navigate to the Infinity directory
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the Browser

To start Infinity Browser:

```bash
npm start
```

## Keyboard Shortcuts

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
- **Ctrl+Shift+I** - Developer tools

## Building for Distribution

To build the browser for your platform:

```bash
npm run build
```

This will create a distributable package in the `dist` folder.

## Technical Details

- **Framework**: Electron
- **UI**: HTML, CSS, JavaScript
- **Features**: Multi-tab browsing, history tracking, bookmarks, keyboard shortcuts

## Project Structure

```
Infinity/
├── index.html       # Main browser interface
├── styles.css       # Browser styling
├── renderer.js      # Browser logic and functionality
├── main.js          # Electron main process
├── package.json     # Project configuration
└── README.md        # This file
```

## Notes

- The browser uses iframes with sandbox restrictions for security
- Bookmarks are stored in localStorage
- Some websites may not load due to X-Frame-Options security policies
- For full web compatibility, consider using Electron's webview tag or BrowserView

## License

MIT
