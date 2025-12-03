# 🎯 Shortcuts Editor

A modern, responsive web-based editor for managing `shortcuts.json` files. Built with vanilla JavaScript, HTML, and CSS - no frameworks required.

![Shortcuts Editor](https://img.shields.io/badge/status-production-green)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)

## 📋 Overview

The Shortcuts Editor is a comprehensive tool designed for managing complex JSON configurations for mobile app shortcuts. It provides an intuitive interface for editing actions, categories, groupings, and various app features without directly manipulating JSON code.

## ✨ Features

### Core Functionality
- **📥 Download & Load**: Fetch production JSON or load local files
- **💾 Save**: Export modified JSON with proper formatting
- **🔍 Search**: Real-time search across all data structures
- **📊 Statistics**: Live count of total and visible items

### Data Management Modules
1. **⚡ Actions** - Individual shortcut actions with platform-specific URLs
2. **📁 Categories** - Grouping containers for organizing actions
3. **🔗 Grouping** - Hierarchical relationships between categories and actions
4. **🏷️ Tags** - Visual labels with custom colors for actions
5. **🌟 Discovers** - Featured content sections
6. **💡 Recommends** - Recommended shortcuts
7. **🔎 Search Hints** - Search suggestions and hints
8. **🎯 Default Actions** - Pre-configured default shortcuts
9. **💳 Wallet Actions** - Wallet-specific shortcuts
10. **📋 Update Instructions** - App update notifications

### UI/UX Highlights
- **Modern Sidebar Navigation** - Organized into 3 logical sections
- **Welcome Page** - Onboarding guide for new users
- **Responsive Layout** - Full viewport usage on all screen sizes
- **Modal Forms** - Comprehensive editing with validation
- **Drag & Drop** (Grouping) - Reorder actions within categories
- **Live Updates** - Debounced real-time editing
- **Icon Support** - Emoji and image URL rendering

## 🏗️ Project Structure

```
ShortCutApp/
├── editor.html              # Main application entry point
├── README.md                 # This file
├── REFACTORING_SUMMARY.md    # Development history
└── js/                       # JavaScript modules
    ├── utils.js              # Core utilities (file I/O, tab switching, rendering)
    ├── actions.js            # Actions CRUD operations
    ├── categories.js         # Categories CRUD operations
    ├── grouping.js           # Grouping relationships management
    ├── tags.js               # Tag management with ARGB colors
    ├── discovers.js          # Discovers section handling
    ├── recommends.js         # Recommends section handling
    ├── searchHints.js        # Search hints management
    ├── defaultActions.js     # Default actions configuration
    ├── walletActions.js      # Wallet-specific actions
    ├── updateInstructions.js # Update notifications
    └── formHandler.js        # Modal form logic and validation
```

## 🎨 UI Architecture

### Layout Components

#### Header
- **Title & Description** - Centered branding
- **Quick Actions** - Download, Save, Load buttons (always visible)
- **Glass-morphism Design** - Semi-transparent buttons on orange gradient

#### Sidebar Navigation
- **Fixed 240px width** - Consistent left panel
- **3 Sections**:
  - 📊 Data Management (Grouping, Categories, Actions, Tags)
  - 🔍 Discovery (Discovers, Recommends, Search Hints)
  - ⚙️ Settings (Default Actions, Wallet Actions, Update Instructions)
- **Active State** - Orange left border and highlight

#### Main Content Area
- **Toolbar** - Search box + context-aware "Add New" button
- **Content** - Grid layout (cards) or table layout (grouping)
- **Stats Bar** - Fixed bottom display with counts

#### Welcome Page (Default View)
- **Onboarding Flow** - 4-step visual guide
- **Call-to-Action** - Large Download/Load buttons
- **Animated Icon** - Bouncing emoji for engagement

### Color Scheme
- **Primary Orange**: `#ff7a1a` - Actions, highlights, active states
- **Success Green**: `#28a745` - Save actions
- **Danger Red**: `#dc3545` - Delete actions
- **Gray Scale**: `#f8f9fa` to `#333` - Backgrounds and text
- **Gradients**: Orange gradient (`#ff8c00` → `#ff6a00`) for header

## 📊 Data Structure

### JSON Schema Overview

```json
{
  "actions": [
    {
      "code": "string",
      "titleEn": "string",
      "titleZh": "string",
      "iconEn": "url",
      "iconZh": "url",
      "urlEn": "url",
      "urlZh": "url",
      "tag": { "code": "string" },
      "platforms": ["ARD", "IOS", "HWI"],
      "showOnAllPlatforms": boolean,
      "startDate": "ISO-8601",
      "endDate": "ISO-8601"
    }
  ],
  "categories": [
    {
      "code": "string",
      "titleEn": "string",
      "titleZh": "string",
      "iconEn": "url",
      "iconZh": "url"
    }
  ],
  "grouping": [
    {
      "category": "string (code)",
      "actions": [
        {
          "action": "string (code)",
          "visible": boolean,
          "pinned": boolean
        }
      ]
    }
  ],
  "tags": [
    {
      "code": "string",
      "textColorArgb": "#AARRGGBB",
      "bgColorArgb": "#AARRGGBB"
    }
  ]
  // ... other sections
}
```

## 🔧 Key Functions

### Core Utilities (`utils.js`)

```javascript
// File Operations
saveToFile()              // Export JSON with download
loadFile(event)           // Import JSON from file input
downloadProductionJson()  // Fetch from production URL

// Navigation
switchTab(tab)            // Change active content view
renderCurrentTab()        // Render current tab content

// UI Helpers
showNotification(msg)     // Toast notifications
updateStats()             // Update bottom stats bar
```

### Data Operations (Example: `actions.js`)

```javascript
// CRUD Operations
renderActions()           // Display actions grid
addNewAction()            // Open modal for new action
editAction(index)         // Open modal with existing data
deleteAction(index)       // Remove action with confirmation
saveAction()              // Persist changes to jsonData

// Search & Filter
filterActions()           // Real-time search implementation
```

### Grouping Features (`grouping.js`)

```javascript
renderGrouping()          // Table view with resolved titles/icons
addNewGroupingCategory()  // Add category to grouping
deleteGroupingCategory()  // Remove category section
updateGroupingAction()    // Debounced action updates (150ms)
addActionToGrouping()     // Add action row to category
removeActionFromGrouping() // Delete action row

// Lookup Maps (Performance)
categoryByCode            // Map<code, category>
actionByCode              // Map<code, action>
tagByCode                 // Map<code, tag>
```

### Form Handling (`formHandler.js`)

```javascript
handleFormSubmit(e)       // Universal form submission
populateEditForm(data)    // Fill modal with existing data
getFormData()             // Extract form values
validateForm()            // Input validation
clearForm()               // Reset modal fields

// Color Conversion
argbToRgba(argb)          // Convert #AARRGGBB to rgba()
rgbaToArgb(r,g,b,a)       // Convert RGBA to #AARRGGBB
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No build tools or dependencies required

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/raymondChan23/ShortCutApp.git
   cd ShortCutApp
   ```

2. **Open in browser**
   ```bash
   open editor.html
   # or
   python -m http.server 8000  # then visit http://localhost:8000/editor.html
   ```

### Usage Flow

1. **Start** → Welcome page displays
2. **Download** → Click "Download Production JSON" to fetch latest
3. **Load** → Automatically loads into editor and downloads file
4. **Edit** → Navigate tabs, use search, modify data
5. **Save** → Export modified JSON to downloads folder

## 🛠️ Development

### Code Style
- **Vanilla JavaScript** - ES6+ features, no transpiling needed
- **Modular Structure** - Each tab has its own JS file
- **Global State** - `jsonData` object shared across modules
- **Event-Driven** - Listeners for search, modal, form submission

### Adding New Features

1. **New Tab/Section**
   ```javascript
   // 1. Create js/newFeature.js
   function renderNewFeature() { /* ... */ }
   
   // 2. Add to editor.html
   <script src="js/newFeature.js"></script>
   
   // 3. Add switch case in utils.js renderCurrentTab()
   case 'newFeature':
       renderNewFeature();
       break;
   
   // 4. Add nav item in sidebar
   <button class="nav-item" onclick="switchTab('newFeature')">
       🆕 New Feature
   </button>
   ```

2. **Extend Data Model**
   - Add new properties to JSON structure
   - Update form fields in editor.html
   - Modify corresponding render function
   - Update formHandler.js if needed

### Performance Optimizations
- **Map Lookups** - O(1) access for code resolution
- **Debounced Updates** - 150ms delay for live editing
- **Lazy Rendering** - Only render active tab content
- **CSS Transforms** - Hardware-accelerated animations

## 📱 Responsive Design

### Breakpoints
- **Desktop** - Full sidebar + content (>768px)
- **Mobile** - Stacked layout (<768px)
  - Sidebar remains fixed 240px
  - Content wraps below
  - Cards go single column

### Accessibility
- ✅ Keyboard navigation support
- ✅ Semantic HTML structure
- ✅ ARIA labels on interactive elements
- ✅ Focus states for all buttons
- ✅ Color contrast compliance

## 🌐 Deployment

### GitHub Pages
1. Enable Pages in repo settings
2. Source: main branch / (root)
3. Access: `https://raymondchan23.github.io/ShortCutApp/editor.html`

### Alternative Platforms
- **Netlify** - Drag & drop deployment
- **Vercel** - Connect GitHub repo
- **Cloudflare Pages** - Auto-deploy on push

## 🐛 Known Issues

- **CORS Restrictions** - Direct production download may fail (fallback: open in new tab)
- **Large Files** - JSON files >5MB may slow rendering
- **Browser Storage** - No automatic save/recovery (use Save button)

## 🔒 Security Notes

- ✅ No external dependencies - no supply chain risks
- ✅ Client-side only - no data sent to servers
- ✅ Input sanitization in forms
- ⚠️ JSON validation needed for malformed files

## 📄 License

MIT License - Free to use, modify, and distribute

## 👥 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/raymondChan23/ShortCutApp/issues)
- **Documentation**: See inline code comments
- **Updates**: Check REFACTORING_SUMMARY.md for change history

---

**Built with ❤️ using vanilla web technologies**
