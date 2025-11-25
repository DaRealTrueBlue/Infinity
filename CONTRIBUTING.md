# Contributing to Infinity Browser

First off, thank you for considering contributing to Infinity Browser! 🎉 It's people like you that make Infinity such a great tool.

## 🤝 Code of Conduct

By participating in this project, you are expected to uphold our Code of Conduct:

- Use welcoming and inclusive language
- Be respectful of differing viewpoints and experiences
- Gracefully accept constructive criticism
- Focus on what is best for the community
- Show empathy towards other community members

## 🐛 Found a Bug?

If you find a bug in the source code, you can help by submitting an issue to our [GitHub Repository](https://github.com/DaRealTrueBlue/Infinity/issues). Even better, you can submit a Pull Request with a fix.

**Before submitting a bug report:**
- Check the issue tracker to see if the bug has already been reported
- Try to reproduce the issue with the latest version
- Collect information about the bug (OS version, Electron version, steps to reproduce)

**How to submit a good bug report:**
```markdown
**Bug Description:**
A clear and concise description of what the bug is.

**To Reproduce:**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior:**
What you expected to happen.

**Screenshots:**
If applicable, add screenshots to help explain your problem.

**Environment:**
- OS: [e.g., Windows 10, macOS 12.0]
- Infinity Version: [e.g., 1.0.0]
- Electron Version: [e.g., 28.0.0]

**Additional Context:**
Any other context about the problem.
```

## 💡 Suggesting Features

Feature requests are welcome! Before submitting:
- Check if the feature has already been requested
- Provide a clear use case for why the feature would be useful
- Be open to discussion and feedback

**Feature request template:**
```markdown
**Feature Description:**
A clear and concise description of the feature.

**Problem it Solves:**
Explain what problem this feature would solve.

**Proposed Solution:**
Describe how you envision this feature working.

**Alternatives Considered:**
Describe any alternative solutions or features you've considered.

**Additional Context:**
Any other context, mockups, or examples.
```

## 🔧 Development Setup

### Prerequisites
- Node.js 16 or higher
- npm or yarn
- Git
- Windows OS (for building installers)
- 7-Zip (auto-installed by build script)

### Setting Up Your Development Environment

1. **Fork the repository**
   - Click the "Fork" button at the top right of the repository page

2. **Clone your fork**
   ```bash
   git clone https://github.com/YOUR-USERNAME/Infinity.git
   cd Infinity
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/DaRealTrueBlue/Infinity.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

6. **Start development**
   ```bash
   npm start
   ```

## 📝 Coding Guidelines

### JavaScript Style Guide
- Use ES6+ features where appropriate
- Use meaningful variable and function names
- Add comments for complex logic
- Keep functions small and focused
- Avoid global variables

### Code Formatting
- Indentation: 2 or 4 spaces (be consistent)
- Use single quotes for strings
- Add semicolons at the end of statements
- Keep lines under 100 characters when possible

### Example:
```javascript
// Good
function navigateToURL(url) {
  if (!url) {
    return;
  }
  
  const finalUrl = url.includes('://') 
    ? url 
    : `https://www.google.com/search?q=${encodeURIComponent(url)}`;
  
  webview.loadURL(finalUrl);
}

// Avoid
function nav(u){if(!u)return;webview.loadURL(u.includes('://')?u:'https://www.google.com/search?q='+u);}
```

### CSS Guidelines
- Use meaningful class names
- Organize properties logically (positioning, display, colors, etc.)
- Use CSS variables for theme colors
- Keep selectors specific but not overly complex

### HTML Guidelines
- Use semantic HTML elements
- Add appropriate ARIA labels for accessibility
- Keep structure clean and well-indented
- Use meaningful IDs and classes

## 🔄 Pull Request Process

1. **Update your fork**
   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Make your changes**
   - Write clean, readable code
   - Follow the coding guidelines
   - Test your changes thoroughly

3. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add awesome new feature"
   ```

   **Commit message format:**
   - `feat:` for new features
   - `fix:` for bug fixes
   - `docs:` for documentation changes
   - `style:` for formatting changes
   - `refactor:` for code refactoring
   - `test:` for adding tests
   - `chore:` for maintenance tasks

4. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

5. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "Compare & pull request"
   - Fill out the PR template
   - Submit the pull request

### Pull Request Template
```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
How has this been tested?
- [ ] Manual testing
- [ ] Added unit tests
- [ ] Tested on Windows
- [ ] Tested on macOS
- [ ] Tested on Linux

## Screenshots (if applicable)
Add screenshots to show the changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation
- [ ] My changes generate no new warnings
- [ ] I have tested my changes thoroughly
```

## 🎯 Areas to Contribute

Here are some areas where contributions would be especially valuable:

### High Priority
- 🐛 Bug fixes
- 📱 Cross-platform compatibility (macOS, Linux)
- ⚡ Performance improvements
- 🔒 Security enhancements

### Medium Priority
- 🎨 UI/UX improvements
- 📝 Documentation improvements
- 🌐 Internationalization (i18n)
- ♿ Accessibility improvements

### Features to Implement
- 📥 Download manager completion
- ⚙️ Settings panel
- 🎨 Theme customization
- 🔌 Extension support
- 🔐 Password manager
- 🛡️ Ad blocker

## 📚 Resources

- [Electron Documentation](https://www.electronjs.org/docs)
- [JavaScript MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
- [Git Documentation](https://git-scm.com/doc)

## 🤔 Questions?

If you have questions, feel free to:
- Open a [GitHub Discussion](https://github.com/DaRealTrueBlue/Infinity/discussions)
- Join our [Discord Server](https://discord.gg/z6rybp6rvS)
- Email: darealtrueblue.contact@gmail.com

## 🏆 Recognition

Contributors will be:
- Listed in the README.md
- Mentioned in release notes
- Given credit in commit history

Thank you for contributing to Infinity Browser! 💙

---

*This document was inspired by open source contribution guidelines from various projects.*
