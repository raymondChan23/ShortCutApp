// SearchHints tab functions

function renderSearchHints() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.searchHints) jsonData.searchHints = [];
    
    if (jsonData.searchHints.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Search Hints:');
        return;
    }

    let visibleCount = 0;
    jsonData.searchHints.forEach((hint, index) => {
        const matchesSearch = !searchTerm || 
            hint.code.toLowerCase().includes(searchTerm) ||
            hint.titleEn.toLowerCase().includes(searchTerm) ||
            hint.titleZh.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        const platforms = hint.platforms || [];
        const platformsHTML = platforms.map(p => 
            `<span class="platform-badge">${p}</span>`
        ).join('');

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${hint.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="cloneSearchHint(${index})" title="Clone">📄</button>
                    <button class="btn-icon btn-edit" onclick="editSearchHint(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteSearchHint(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-title">${hint.titleEn}</div>
                <div class="action-title">${hint.titleZh}</div>
                <div class="action-platforms">${platformsHTML}</div>
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.searchHints.length, visibleCount, 'Total Search Hints:');
}

function cloneSearchHint(index) {
    const original = jsonData.searchHints[index];
    if (!original) return;
    const clone = JSON.parse(JSON.stringify(original));
    const baseCode = original.code || 'SEARCHHINT';
    let candidate = `${baseCode}-copy`;
    let counter = 2;
    const existingCodes = new Set((jsonData.searchHints || []).map(h => h.code));
    while (existingCodes.has(candidate)) {
        candidate = `${baseCode}-copy${counter}`;
        counter++;
    }
    clone.code = candidate;
    jsonData.searchHints.splice(index + 1, 0, clone);
    currentEditIndex = index + 1;
    editSearchHint(currentEditIndex);
    showNotification('Cloned search hint. Please review and save.');
}

function editSearchHint(index) {
    currentEditIndex = index;
    const hint = jsonData.searchHints[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Search Hint';
    document.getElementById('editCode').value = hint.code;
    document.getElementById('editTitleEn').value = hint.titleEn;
    document.getElementById('editTitleZh').value = hint.titleZh;
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Show only code and titles for search hints
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'block';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    // Set platforms
    document.getElementById('platformARD').checked = (hint.platforms || []).includes('ARD');
    document.getElementById('platformIOS').checked = (hint.platforms || []).includes('IOS');
    document.getElementById('platformHWI').checked = (hint.platforms || []).includes('HWI');
    
    document.getElementById('editModal').classList.add('active');
}

function addNewSearchHint() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Search Hint';
    document.getElementById('editForm').reset();
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Show only code and titles for search hints
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'block';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteSearchHint(index) {
    if (confirm('Are you sure you want to delete this search hint?')) {
        jsonData.searchHints.splice(index, 1);
        renderSearchHints();
        showNotification('Search hint deleted successfully!');
    }
}
