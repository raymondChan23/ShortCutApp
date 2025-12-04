// Common utility functions

function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.background = type === 'error' ? '#dc3545' : '#28a745';
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function updateStats(total, visible, label = 'Total Shortcuts:') {
    document.getElementById('totalLabel').textContent = label;
    document.getElementById('totalCount').textContent = total;
    document.getElementById('visibleCount').textContent = visible;
}

function closeModal() {
    document.getElementById('editModal').classList.remove('active');
    currentEditIndex = -1;
}

function saveToFile() {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
    const blob = new Blob([JSON.stringify(jsonData, null, 4)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shortcuts_${timestamp}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('JSON file saved successfully!');
}

function loadFile(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                jsonData = JSON.parse(e.target.result);
                
                // Hide welcome page and show content
                const welcomePage = document.getElementById('welcomePage');
                if (welcomePage) {
                    welcomePage.style.display = 'none';
                }
                // Show toolbar and stats after data load
                const tb = document.getElementById('toolbar');
                const sb = document.getElementById('statsBar');
                const sidebar = document.getElementById('sidebar');
                if (tb) tb.style.display = 'flex';
                if (sb) sb.style.display = 'flex';
                if (sidebar) sidebar.style.display = 'block';
                
                // Switch to grouping tab if no tab is selected
                if (!currentTab) {
                    currentTab = 'grouping';
                    // Manually activate the grouping nav item
                    document.querySelectorAll('.nav-item').forEach(item => {
                        item.classList.remove('active');
                        if (item.textContent.includes('Grouping')) {
                            item.classList.add('active');
                        }
                    });
                }
                
                renderCurrentTab();
                showNotification('File loaded successfully!');
            } catch (error) {
                showNotification('Error parsing JSON file: ' + error.message, 'error');
                console.error('JSON Parse Error:', error);
            }
        };
        reader.readAsText(file);
    }
}

// Removed downloadProductionJson; using direct hyperlink in UI instead.

function switchTab(tab) {
    currentTab = tab;
    
    // Remove active from all tabs
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    
    // Add active to clicked tab
    if (event && event.target) {
        event.target.classList.add('active');
    }
    
    // Update "Add New" button text and handler based on current tab
    const addNewBtn = document.querySelector('.toolbar .btn-primary');
    if (addNewBtn) {
        if (currentTab === 'categories') {
            addNewBtn.textContent = '➕ Add New Category';
            addNewBtn.onclick = addNewCategory;
        } else if (currentTab === 'grouping') {
            addNewBtn.textContent = '➕ Add New Category';
            addNewBtn.onclick = addNewGroupingCategory;
        } else if (currentTab === 'actions') {
            addNewBtn.textContent = '➕ Add New Action';
            addNewBtn.onclick = addNewAction;
        } else if (currentTab === 'discovers') {
            addNewBtn.textContent = '➕ Add New Discover';
            addNewBtn.onclick = addNewDiscover;
        } else if (currentTab === 'recommends') {
            addNewBtn.textContent = '➕ Add New Recommend';
            addNewBtn.onclick = addNewRecommend;
        } else if (currentTab === 'searchHints') {
            addNewBtn.textContent = '➕ Add New Search Hint';
            addNewBtn.onclick = addNewSearchHint;
        } else if (currentTab === 'defaultActions') {
            addNewBtn.textContent = '➕ Add New Default Action';
            addNewBtn.onclick = addNewDefaultAction;
        } else if (currentTab === 'updateInstructions') {
            addNewBtn.textContent = '➕ Add New Update Instruction';
            addNewBtn.onclick = addNewUpdateInstruction;
        } else if (currentTab === 'tags') {
            addNewBtn.textContent = '➕ Add New Tag';
            addNewBtn.onclick = addNewTag;
        } else if (currentTab === 'walletActions') {
            addNewBtn.textContent = '➕ Add New Wallet Action';
            addNewBtn.onclick = addNewWalletAction;
        } else {
            addNewBtn.textContent = '➕ Add New';
            addNewBtn.onclick = addNewAction;
        }
    }
    
    renderCurrentTab();
}

function renderCurrentTab() {
    const container = document.getElementById('actionsContainer');
    const welcomePage = document.getElementById('welcomePage');
    
    // Show welcome page if no tab is selected
    if (!currentTab) {
        if (welcomePage) welcomePage.style.display = 'flex';
        container.innerHTML = '';
        // Keep toolbar and stats hidden while on welcome page
        const tb = document.getElementById('toolbar');
        const sb = document.getElementById('statsBar');
        const sidebar = document.getElementById('sidebar');
        if (tb) tb.style.display = 'none';
        if (sb) sb.style.display = 'none';
        if (sidebar) sidebar.style.display = 'none';
        return;
    }
    
    // Hide welcome page when viewing any tab
    if (welcomePage) welcomePage.style.display = 'none';
    // Ensure toolbar and stats are visible when a tab is active
    const tb = document.getElementById('toolbar');
    const sb = document.getElementById('statsBar');
    const sidebar = document.getElementById('sidebar');
    if (tb) tb.style.display = 'flex';
    if (sb) sb.style.display = 'flex';
    if (sidebar) sidebar.style.display = 'block';
    
    if (currentTab === 'grouping') {
        container.className = '';
    } else {
        container.className = 'actions-grid';
    }
    
    switch(currentTab) {
        case 'actions':
            renderActions();
            break;
        case 'categories':
            renderCategories();
            break;
        case 'grouping':
            renderGrouping();
            break;
        case 'discovers':
            renderDiscovers();
            break;
        case 'recommends':
            renderRecommends();
            break;
        case 'searchHints':
            renderSearchHints();
            break;
        case 'defaultActions':
            renderDefaultActions();
            break;
        case 'updateInstructions':
            renderUpdateInstructions();
            break;
        case 'tags':
            renderTags();
            break;
        case 'walletActions':
            renderWalletActions();
            break;
    }
}

// (Removed reloadFromRemote; use downloadProductionJson() for fetching and saving)
