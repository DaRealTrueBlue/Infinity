// Browser State
let currentTabId = 0;
let tabs = [{
    id: 0,
    title: 'New Tab',
    url: '',
    history: [],
    historyIndex: -1
}];

let bookmarks = [];
let browsingHistory = [];
let downloads = [];
let quickLinks = [];

// Default quick links
const defaultQuickLinks = [
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'GitHub', url: 'https://www.github.com' },
    { name: 'Wikipedia', url: 'https://www.wikipedia.org' }
];

// DOM Elements
const urlBar = document.getElementById('url-bar');
const homeSearch = document.getElementById('home-search');
const webview = document.getElementById('webview');
const webviewContainer = document.getElementById('webview-container');
const homePage = document.getElementById('home-page');
const tabsBar = document.getElementById('tabs-bar');
const bookmarksBar = document.getElementById('bookmarks-bar');
const loadingBar = document.getElementById('loading-bar');
const statusBar = document.getElementById('status-bar');
const statusText = document.getElementById('status-text');
const downloadStatus = document.getElementById('download-status');
const pageInfo = document.getElementById('page-info');

// Navigation Buttons
const backBtn = document.getElementById('back-btn');
const forwardBtn = document.getElementById('forward-btn');
const refreshBtn = document.getElementById('refresh-btn');
const homeBtn = document.getElementById('home-btn');
const newTabBtn = document.getElementById('new-tab-btn');
const bookmarksBtn = document.getElementById('bookmarks-btn');
const menuBtn = document.getElementById('menu-btn');
const bookmarkStarBtn = document.getElementById('bookmark-star-btn');

// Modals
const downloadModal = document.getElementById('download-modal');
const historyModal = document.getElementById('history-modal');
const contextMenu = document.getElementById('context-menu');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Boot screen animation with video playback
    const bootScreen = document.getElementById('boot-screen');
    const bootVideo = document.querySelector('.boot-logo-video');
    
    if (bootVideo) {
        // Ensure video plays
        bootVideo.play().catch(err => {
            console.log('Video autoplay blocked or format not supported:', err);
        });
        
        bootVideo.addEventListener('error', (e) => {
            console.log('Video loading error:', e);
            // Show text logo as fallback
            bootVideo.style.display = 'none';
            const fallbackLogo = document.createElement('div');
            fallbackLogo.className = 'boot-logo';
            fallbackLogo.textContent = '∞';
            bootVideo.parentElement.insertBefore(fallbackLogo, bootVideo);
        });
    }
    
    // Hide boot screen after initialization
    setTimeout(() => {
        if (bootScreen) {
            setTimeout(() => {
                bootScreen.classList.add('hidden');
            }, 2500); // Wait for animation to complete
        }
    }, 100);
    
    // Create the initial tab dynamically
    createInitialTab();
    
    setupEventListeners();
    loadBookmarks();
    loadHistory();
    loadQuickLinks();
    renderQuickLinks();
    
    // Wait for webview to be ready - listen for dom-ready event
    webview.addEventListener('dom-ready', () => {
        console.log('Webview is ready');
        setupWebviewListeners();
        updateNavigationButtons();
    });
});

// Create initial tab with proper event listeners
function createInitialTab() {
    const tabElement = document.createElement('div');
    tabElement.className = 'tab active';
    tabElement.setAttribute('data-tab-id', '0');
    tabElement.innerHTML = `
        <span class="tab-title">New Tab</span>
        <button class="tab-close">×</button>
    `;
    
    // Tab click event
    tabElement.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
            switchToTab(0);
        }
    });
    
    // Close button event
    tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(0);
    });
    
    tabsBar.appendChild(tabElement);
}

// Event Listeners
function setupEventListeners() {
    // URL Bar
    urlBar.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToURL(urlBar.value);
        }
    });

    urlBar.addEventListener('focus', () => {
        urlBar.select();
    });

    // Home Search
    homeSearch.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            navigateToURL(homeSearch.value);
        }
    });

    // Navigation Buttons
    backBtn.addEventListener('click', goBack);
    forwardBtn.addEventListener('click', goForward);
    refreshBtn.addEventListener('click', refresh);
    homeBtn.addEventListener('click', goHome);
    newTabBtn.addEventListener('click', createNewTab);
    bookmarksBtn.addEventListener('click', toggleBookmarks);
    menuBtn.addEventListener('click', showContextMenu);
    bookmarkStarBtn.addEventListener('click', toggleCurrentPageBookmark);

    // Modal Close Buttons
    document.getElementById('close-download-modal').addEventListener('click', () => {
        downloadModal.classList.remove('active');
    });

    document.getElementById('close-history-modal').addEventListener('click', () => {
        historyModal.classList.remove('active');
    });

    // Context Menu Items
    document.getElementById('menu-new-tab').addEventListener('click', () => {
        createNewTab();
        hideContextMenu();
    });

    document.getElementById('menu-downloads').addEventListener('click', () => {
        showDownloads();
        hideContextMenu();
    });

    document.getElementById('menu-history').addEventListener('click', () => {
        showHistory();
        hideContextMenu();
    });

    document.getElementById('menu-settings').addEventListener('click', () => {
        alert('Settings panel coming soon!');
        hideContextMenu();
    });

    document.getElementById('menu-about').addEventListener('click', () => {
        showAbout();
        hideContextMenu();
    });

    // Close modals when clicking outside
    downloadModal.addEventListener('click', (e) => {
        if (e.target === downloadModal) {
            downloadModal.classList.remove('active');
        }
    });

    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) {
            historyModal.classList.remove('active');
        }
    });

    // Hide context menu on click anywhere
    document.addEventListener('click', (e) => {
        if (!e.target.closest('#menu-btn')) {
            hideContextMenu();
        }
    });
}

// Webview Setup
function setupWebviewListeners() {
    // Wait for webview to be ready
    if (!webview) {
        console.error('Webview not found');
        return;
    }

    // Loading started
    webview.addEventListener('did-start-loading', () => {
        loadingBar.classList.add('loading');
        statusText.textContent = 'Loading...';
        refreshBtn.style.opacity = '0.5';
    });

    // Loading finished
    webview.addEventListener('did-stop-loading', () => {
        loadingBar.classList.remove('loading');
        loadingBar.style.width = '0';
        statusText.textContent = 'Done';
        refreshBtn.style.opacity = '1';
        
        setTimeout(() => {
            statusText.textContent = 'Ready';
        }, 2000);
    });

    // Page loaded
    webview.addEventListener('did-finish-load', () => {
        console.log('Page finished loading');
        const currentTab = getCurrentTab();
        try {
            const url = webview.getURL();
            console.log('Loaded URL:', url);
            
            if (url && url !== 'about:blank') {
                currentTab.url = url;
                urlBar.value = url;
                
                // Function to update title
                const updateTitle = () => {
                    webview.executeJavaScript('document.title').then(title => {
                        console.log('Got title from page:', title);
                        if (title && title.trim() !== '') {
                            currentTab.title = title;
                            updateTabTitle(currentTabId, title);
                        } else {
                            // Fallback to hostname
                            try {
                                const urlObj = new URL(url);
                                const hostname = urlObj.hostname.replace('www.', '');
                                currentTab.title = hostname;
                                updateTabTitle(currentTabId, hostname);
                            } catch (e) {
                                currentTab.title = 'Web Page';
                                updateTabTitle(currentTabId, 'Web Page');
                            }
                        }
                    }).catch((err) => {
                        console.log('Error getting title:', err);
                        // Fallback to hostname
                        try {
                            const urlObj = new URL(url);
                            const hostname = urlObj.hostname.replace('www.', '');
                            currentTab.title = hostname;
                            updateTabTitle(currentTabId, hostname);
                        } catch (e) {
                            currentTab.title = 'Web Page';
                            updateTabTitle(currentTabId, 'Web Page');
                        }
                    });
                };
                
                // Try immediately and after delays
                updateTitle();
                setTimeout(updateTitle, 500);
                setTimeout(updateTitle, 1000);

                // Add to history
                addToHistory(currentTab.title, url);
            }
        } catch (e) {
            console.error('Error in did-finish-load:', e);
        }
        updateNavigationButtons();
        updateBookmarkStar();
    });

    // Page title updated
    webview.addEventListener('page-title-updated', (e) => {
        const currentTab = getCurrentTab();
        if (e.title && e.title.trim() !== '') {
            currentTab.title = e.title;
            updateTabTitle(currentTabId, e.title);
            console.log('Page title updated:', e.title);
        }
    });

    // Navigation
    webview.addEventListener('will-navigate', (e) => {
        try {
            const hostname = new URL(e.url).hostname;
            statusText.textContent = `Navigating to ${hostname}...`;
            
            // Update tab title to show we're loading
            const currentTab = getCurrentTab();
            updateTabTitle(currentTabId, `Loading ${hostname}...`);
        } catch (err) {
            statusText.textContent = 'Navigating...';
        }
    });

    // New window request
    webview.addEventListener('new-window', (e) => {
        e.preventDefault();
        // Open in new tab
        createNewTab();
        navigateToURL(e.url);
    });

    // Error handling
    webview.addEventListener('did-fail-load', (e) => {
        if (e.errorCode !== -3) { // Ignore aborted loads
            statusText.textContent = `Failed to load page (Error: ${e.errorCode})`;
            console.error('Load failed:', e);
        }
    });

    // Console messages (for debugging)
    webview.addEventListener('console-message', (e) => {
        console.log('Guest page:', e.message);
    });

    // Context menu on webview
    webview.addEventListener('context-menu', (e) => {
        e.preventDefault();
        // Could add custom context menu here
    });
}

// Navigation Functions
function navigateToURL(input) {
    if (!input || input.trim() === '') return;

    let url = input.trim();
    
    // Check if it's a search query or URL
    if (!url.includes('.') && !url.startsWith('http://') && !url.startsWith('https://')) {
        // It's a search query
        url = `https://www.google.com/search?q=${encodeURIComponent(url)}`;
    } else if (!url.startsWith('http://') && !url.startsWith('https://')) {
        // Add https:// if not present
        url = 'https://' + url;
    }

    const currentTab = getCurrentTab();
    
    // Add to history
    if (currentTab.historyIndex < currentTab.history.length - 1) {
        // Remove forward history
        currentTab.history = currentTab.history.slice(0, currentTab.historyIndex + 1);
    }
    currentTab.history.push(url);
    currentTab.historyIndex = currentTab.history.length - 1;
    
    currentTab.url = url;
    urlBar.value = url;
    
    // Show webview, hide home page
    homePage.classList.add('hidden');
    webviewContainer.classList.add('active');
    
    // Load URL
    webview.loadURL(url);
    updateNavigationButtons();
    updateBookmarkStar();
}

function goBack() {
    const currentTab = getCurrentTab();
    if (currentTab.historyIndex > 0) {
        currentTab.historyIndex--;
        const url = currentTab.history[currentTab.historyIndex];
        webview.loadURL(url);
        urlBar.value = url;
        currentTab.url = url;
        updateNavigationButtons();
    } else {
        try {
            if (webview.canGoBack()) {
                webview.goBack();
            }
        } catch (e) {
            console.log('Webview not ready for goBack');
        }
    }
}

function goForward() {
    const currentTab = getCurrentTab();
    if (currentTab.historyIndex < currentTab.history.length - 1) {
        currentTab.historyIndex++;
        const url = currentTab.history[currentTab.historyIndex];
        webview.loadURL(url);
        urlBar.value = url;
        currentTab.url = url;
        updateNavigationButtons();
    } else {
        try {
            if (webview.canGoForward()) {
                webview.goForward();
            }
        } catch (e) {
            console.log('Webview not ready for goForward');
        }
    }
}

function refresh() {
    try {
        const url = webview.getURL();
        if (url && url !== 'about:blank') {
            refreshBtn.classList.add('loading');
            webview.reload();
            setTimeout(() => {
                refreshBtn.classList.remove('loading');
            }, 500);
        }
    } catch (e) {
        console.log('Webview not ready for refresh');
    }
}

function goHome() {
    const currentTab = getCurrentTab();
    currentTab.url = '';
    urlBar.value = '';
    webview.loadURL('about:blank');
    homePage.classList.remove('hidden');
    webviewContainer.classList.remove('active');
    updateNavigationButtons();
}

function updateNavigationButtons() {
    const currentTab = getCurrentTab();
    try {
        backBtn.disabled = currentTab.historyIndex <= 0 && !webview.canGoBack();
        forwardBtn.disabled = currentTab.historyIndex >= currentTab.history.length - 1 && !webview.canGoForward();
    } catch (e) {
        // Webview not ready yet
        backBtn.disabled = currentTab.historyIndex <= 0;
        forwardBtn.disabled = currentTab.historyIndex >= currentTab.history.length - 1;
    }
}

// Tab Management
function createNewTab() {
    const newTabId = Date.now(); // Use timestamp for unique ID
    const newTab = {
        id: newTabId,
        title: 'New Tab',
        url: '',
        history: [],
        historyIndex: -1
    };
    
    tabs.push(newTab);
    
    // Create tab element
    const tabElement = document.createElement('div');
    tabElement.className = 'tab';
    tabElement.setAttribute('data-tab-id', newTabId);
    tabElement.innerHTML = `
        <span class="tab-title">New Tab</span>
        <button class="tab-close">×</button>
    `;
    
    // Tab click event
    tabElement.addEventListener('click', (e) => {
        if (!e.target.classList.contains('tab-close')) {
            switchToTab(newTabId);
        }
    });
    
    // Close button event
    tabElement.querySelector('.tab-close').addEventListener('click', (e) => {
        e.stopPropagation();
        closeTab(newTabId);
    });
    
    tabsBar.appendChild(tabElement);
    switchToTab(newTabId);
}

function switchToTab(tabId) {
    currentTabId = tabId;
    
    // Update tab UI
    document.querySelectorAll('.tab').forEach(tab => {
        if (parseInt(tab.getAttribute('data-tab-id')) === tabId) {
            tab.classList.add('active');
        } else {
            tab.classList.remove('active');
        }
    });
    
    // Load tab content
    const currentTab = getCurrentTab();
    if (currentTab.url) {
        urlBar.value = currentTab.url;
        webview.loadURL(currentTab.url);
        homePage.classList.add('hidden');
        webviewContainer.classList.add('active');
    } else {
        urlBar.value = '';
        webview.loadURL('about:blank');
        homePage.classList.remove('hidden');
        webviewContainer.classList.remove('active');
    }
    
    updateNavigationButtons();
    updateBookmarkStar();
}

function closeTab(tabId) {
    if (tabs.length === 1) {
        // Don't close last tab, just reset it
        goHome();
        return;
    }
    
    // Remove tab from array
    const tabIndex = tabs.findIndex(tab => tab.id === tabId);
    if (tabIndex !== -1) {
        tabs.splice(tabIndex, 1);
    }
    
    // Remove tab element
    const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    if (tabElement) {
        tabElement.remove();
    }
    
    // Switch to another tab if current tab was closed
    if (currentTabId === tabId) {
        const newCurrentTab = tabs[Math.max(0, tabIndex - 1)];
        switchToTab(newCurrentTab.id);
    }
}

function updateTabTitle(tabId, title) {
    const tabElement = document.querySelector(`.tab[data-tab-id="${tabId}"]`);
    console.log('updateTabTitle called:', tabId, title, 'found element:', !!tabElement);
    if (tabElement) {
        const titleElement = tabElement.querySelector('.tab-title');
        if (titleElement) {
            titleElement.textContent = title || 'New Tab';
            console.log('Tab title set to:', titleElement.textContent);
        }
    }
}

function getCurrentTab() {
    return tabs.find(tab => tab.id === currentTabId) || tabs[0];
}

// Bookmarks Management
function toggleBookmarks() {
    if (bookmarksBar.style.display === 'none') {
        bookmarksBar.style.display = 'flex';
    } else {
        bookmarksBar.style.display = 'none';
    }
}

function toggleCurrentPageBookmark() {
    const currentTab = getCurrentTab();
    if (!currentTab.url || currentTab.url === '') {
        statusText.textContent = 'No page to bookmark';
        setTimeout(() => {
            statusText.textContent = 'Ready';
        }, 2000);
        return;
    }
    
    const existingIndex = bookmarks.findIndex(b => b.url === currentTab.url);
    
    if (existingIndex !== -1) {
        // Remove bookmark
        removeBookmark(existingIndex);
        statusText.textContent = 'Bookmark removed';
        bookmarkStarBtn.classList.remove('bookmarked');
    } else {
        // Add bookmark
        addBookmark(currentTab.title, currentTab.url);
        statusText.textContent = 'Bookmark added!';
        bookmarkStarBtn.classList.add('bookmarked');
    }
    
    setTimeout(() => {
        statusText.textContent = 'Ready';
    }, 2000);
}

// Quick Links Management
function loadQuickLinks() {
    const saved = localStorage.getItem('infinity-quick-links');
    if (saved) {
        quickLinks = JSON.parse(saved);
    } else {
        quickLinks = [...defaultQuickLinks];
        saveQuickLinks();
    }
}

function saveQuickLinks() {
    localStorage.setItem('infinity-quick-links', JSON.stringify(quickLinks));
}

function renderQuickLinks() {
    const container = document.getElementById('quick-links');
    container.innerHTML = '';
    
    quickLinks.forEach((link, index) => {
        const linkElement = document.createElement('div');
        linkElement.className = 'quick-link';
        
        // Get favicon URL
        const faviconUrl = getFaviconUrl(link.url);
        const fallbackLetter = link.name.charAt(0).toUpperCase();
        
        linkElement.innerHTML = `
            <button class="quick-link-remove" title="Remove">×</button>
            <div class="quick-link-icon">
                <img src="${faviconUrl}" alt="${link.name}" onerror="this.style.display='none'; this.nextSibling.style.display='flex';" />
                <span style="display: none;">${fallbackLetter}</span>
            </div>
            <div class="quick-link-name">${link.name}</div>
        `;
        
        // Click to navigate
        linkElement.addEventListener('click', (e) => {
            if (!e.target.closest('.quick-link-remove')) {
                navigateToURL(link.url);
            }
        });
        
        // Remove button
        const removeBtn = linkElement.querySelector('.quick-link-remove');
        removeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            removeQuickLink(index);
        });
        
        container.appendChild(linkElement);
    });
    
    // Setup add button after rendering
    const addBtn = document.getElementById('add-quick-link-btn');
    if (addBtn) {
        // Remove old listener if any
        const newAddBtn = addBtn.cloneNode(true);
        addBtn.parentNode.replaceChild(newAddBtn, addBtn);
        
        // Add new listener
        newAddBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            console.log('Add quick link button clicked');
            showAddQuickLinkDialog();
        });
    }
}

function getFaviconUrl(url) {
    try {
        const urlObj = new URL(url);
        // Force HTTPS in the encoded URL parameter
        const httpsUrl = `https://${urlObj.hostname}${urlObj.pathname}`;
        return `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${encodeURIComponent(httpsUrl)}&size=64`;
    } catch (e) {
        return '';
    }
}

function showAddQuickLinkDialog() {
    const modal = document.getElementById('add-quick-link-modal');
    const nameInput = document.getElementById('quick-link-name');
    const urlInput = document.getElementById('quick-link-url');
    
    // Clear previous values
    nameInput.value = '';
    urlInput.value = '';
    
    // Show modal
    modal.classList.add('active');
    nameInput.focus();
    
    // Handle close
    const closeModal = () => {
        modal.classList.remove('active');
    };
    
    // Close button
    document.getElementById('close-add-link-modal').onclick = closeModal;
    document.getElementById('cancel-add-link').onclick = closeModal;
    
    // Click outside to close
    modal.onclick = (e) => {
        if (e.target === modal) closeModal();
    };
    
    // Save button
    document.getElementById('save-add-link').onclick = () => {
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();
        
        if (!name) {
            alert('Please enter a name');
            nameInput.focus();
            return;
        }
        
        if (!url) {
            alert('Please enter a URL');
            urlInput.focus();
            return;
        }
        
        let fullUrl = url;
        if (!fullUrl.startsWith('http://') && !fullUrl.startsWith('https://')) {
            fullUrl = 'https://' + fullUrl;
        }
        
        addQuickLink(name, fullUrl);
        closeModal();
    };
    
    // Enter key to submit
    const handleEnter = (e) => {
        if (e.key === 'Enter') {
            document.getElementById('save-add-link').click();
        }
    };
    nameInput.onkeypress = handleEnter;
    urlInput.onkeypress = handleEnter;
}

function addQuickLink(name, url) {
    quickLinks.push({ name, url });
    saveQuickLinks();
    renderQuickLinks();
    statusText.textContent = 'Quick link added!';
    setTimeout(() => {
        statusText.textContent = 'Ready';
    }, 2000);
}

function removeQuickLink(index) {
    if (confirm(`Remove "${quickLinks[index].name}" from quick links?`)) {
        quickLinks.splice(index, 1);
        saveQuickLinks();
        renderQuickLinks();
        statusText.textContent = 'Quick link removed';
        setTimeout(() => {
            statusText.textContent = 'Ready';
        }, 2000);
    }
}

function updateBookmarkStar() {
    const currentTab = getCurrentTab();
    if (currentTab.url && bookmarks.some(b => b.url === currentTab.url)) {
        bookmarkStarBtn.classList.add('bookmarked');
    } else {
        bookmarkStarBtn.classList.remove('bookmarked');
    }
}

function loadBookmarks() {
    // Load from localStorage
    const saved = localStorage.getItem('infinity-bookmarks');
    if (saved) {
        bookmarks = JSON.parse(saved);
        renderBookmarks();
    }
}

function saveBookmarks() {
    localStorage.setItem('infinity-bookmarks', JSON.stringify(bookmarks));
}

function addBookmark(title, url) {
    // Check if already bookmarked
    if (bookmarks.some(b => b.url === url)) {
        alert('This page is already bookmarked!');
        return;
    }
    
    bookmarks.push({ title, url });
    saveBookmarks();
    renderBookmarks();
}

function removeBookmark(index) {
    bookmarks.splice(index, 1);
    saveBookmarks();
    renderBookmarks();
}

function renderBookmarks() {
    const bookmarkItems = bookmarksBar.querySelector('.bookmark-items');
    bookmarkItems.innerHTML = '';
    
    bookmarks.forEach((bookmark, index) => {
        const item = document.createElement('div');
        item.className = 'bookmark-item';
        item.textContent = bookmark.title;
        item.title = bookmark.url;
        
        item.addEventListener('click', () => {
            navigateToURL(bookmark.url);
        });
        
        // Right-click to delete
        item.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            if (confirm(`Delete bookmark "${bookmark.title}"?`)) {
                removeBookmark(index);
            }
        });
        
        bookmarkItems.appendChild(item);
    });
}

// History Management
function addToHistory(title, url) {
    const historyItem = {
        title: title || url,
        url: url,
        timestamp: Date.now()
    };
    
    browsingHistory.unshift(historyItem);
    
    // Keep only last 100 items
    if (browsingHistory.length > 100) {
        browsingHistory = browsingHistory.slice(0, 100);
    }
    
    saveHistory();
}

function loadHistory() {
    const saved = localStorage.getItem('infinity-history');
    if (saved) {
        browsingHistory = JSON.parse(saved);
    }
}

function saveHistory() {
    localStorage.setItem('infinity-history', JSON.stringify(browsingHistory));
}

function showHistory() {
    const historyList = document.getElementById('history-list');
    
    if (browsingHistory.length === 0) {
        historyList.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No history yet</p>';
    } else {
        historyList.innerHTML = '';
        
        browsingHistory.forEach((item) => {
            const historyItem = document.createElement('div');
            historyItem.className = 'history-item';
            
            const timeStr = new Date(item.timestamp).toLocaleString();
            
            historyItem.innerHTML = `
                <div class="history-title">${item.title}</div>
                <div class="history-url">${item.url}</div>
                <div class="history-time">${timeStr}</div>
            `;
            
            historyItem.addEventListener('click', () => {
                navigateToURL(item.url);
                historyModal.classList.remove('active');
            });
            
            historyList.appendChild(historyItem);
        });
    }
    
    historyModal.classList.add('active');
}

function clearHistory() {
    if (confirm('Clear all browsing history?')) {
        browsingHistory = [];
        saveHistory();
        historyModal.classList.remove('active');
    }
}

// Download Management
function showDownloads() {
    const downloadList = document.getElementById('download-list');
    
    if (downloads.length === 0) {
        downloadList.innerHTML = '<p style="color: #888; text-align: center; padding: 20px;">No downloads yet</p>';
    } else {
        downloadList.innerHTML = '';
        
        downloads.forEach((item, index) => {
            const downloadItem = document.createElement('div');
            downloadItem.className = 'download-item';
            downloadItem.innerHTML = `
                <div class="download-info">
                    <div class="download-name">${item.name}</div>
                    <div class="download-status">${item.status}</div>
                    ${item.progress !== undefined ? `
                        <div class="download-progress">
                            <div class="download-progress-bar" style="width: ${item.progress}%"></div>
                        </div>
                    ` : ''}
                </div>
            `;
            downloadList.appendChild(downloadItem);
        });
    }
    
    downloadModal.classList.add('active');
}

// Context Menu
function showContextMenu(e) {
    e.stopPropagation();
    const rect = menuBtn.getBoundingClientRect();
    contextMenu.style.display = 'block';
    contextMenu.style.top = rect.bottom + 5 + 'px';
    contextMenu.style.right = (window.innerWidth - rect.right) + 'px';
}

function hideContextMenu() {
    contextMenu.style.display = 'none';
}

function showAbout() {
    alert(`Infinity Browser ∞

Version 1.0.0

A modern, feature-rich web browser built with Electron.

Features:
• Multi-tab browsing
• Bookmark management
• Browsing history
• Keyboard shortcuts
• Download manager
• Modern UI

Built with ❤️ using Electron`);
}

// Keyboard Shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl+T - New Tab
    if (e.ctrlKey && e.key === 't') {
        e.preventDefault();
        createNewTab();
    }
    
    // Ctrl+W - Close Tab
    if (e.ctrlKey && e.key === 'w') {
        e.preventDefault();
        closeTab(currentTabId);
    }
    
    // Ctrl+Tab - Next Tab
    if (e.ctrlKey && e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
        const nextIndex = (currentIndex + 1) % tabs.length;
        switchToTab(tabs[nextIndex].id);
    }
    
    // Ctrl+Shift+Tab - Previous Tab
    if (e.ctrlKey && e.shiftKey && e.key === 'Tab') {
        e.preventDefault();
        const currentIndex = tabs.findIndex(tab => tab.id === currentTabId);
        const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
        switchToTab(tabs[prevIndex].id);
    }
    
    // Ctrl+L - Focus URL Bar
    if (e.ctrlKey && e.key === 'l') {
        e.preventDefault();
        urlBar.focus();
        urlBar.select();
    }
    
    // Ctrl+R or F5 - Refresh
    if ((e.ctrlKey && e.key === 'r') || e.key === 'F5') {
        e.preventDefault();
        refresh();
    }
    
    // Ctrl+D - Bookmark
    if (e.ctrlKey && e.key === 'd') {
        e.preventDefault();
        const currentTab = getCurrentTab();
        if (currentTab.url) {
            addBookmark(currentTab.title, currentTab.url);
            statusText.textContent = 'Bookmark added!';
            setTimeout(() => {
                statusText.textContent = 'Ready';
            }, 2000);
        }
    }
    
    // Ctrl+H - History
    if (e.ctrlKey && e.key === 'h') {
        e.preventDefault();
        showHistory();
    }
    
    // Ctrl+J - Downloads
    if (e.ctrlKey && e.key === 'j') {
        e.preventDefault();
        showDownloads();
    }
    
    // Ctrl+Shift+B - Toggle Bookmarks Bar
    if (e.ctrlKey && e.shiftKey && e.key === 'B') {
        e.preventDefault();
        toggleBookmarks();
    }
    
    // Alt+Left - Back
    if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault();
        goBack();
    }
    
    // Alt+Right - Forward
    if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault();
        goForward();
    }
    
    // Alt+Home - Home
    if (e.altKey && e.key === 'Home') {
        e.preventDefault();
        goHome();
    }
    
    // Escape - Close modals
    if (e.key === 'Escape') {
        downloadModal.classList.remove('active');
        historyModal.classList.remove('active');
        hideContextMenu();
    }
});
