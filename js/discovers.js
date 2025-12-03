// Discovers tab functions

function renderDiscovers() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.discovers) jsonData.discovers = [];
    
    if (jsonData.discovers.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Discovers:');
        return;
    }

    let visibleCount = 0;
    jsonData.discovers.forEach((discover, index) => {
        const matchesSearch = !searchTerm || 
            discover.code.toLowerCase().includes(searchTerm) ||
            discover.titleEn.toLowerCase().includes(searchTerm) ||
            discover.titleZh.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        const iconEnHTML = discover.iconEn ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon EN:</strong><br><img src="${discover.iconEn}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${discover.iconEn}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${discover.iconEn}</a></div>` : '';
        const iconZhHTML = discover.iconZh ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon ZH:</strong><br><img src="${discover.iconZh}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${discover.iconZh}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${discover.iconZh}</a></div>` : '';

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${discover.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editDiscover(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteDiscover(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-title">${discover.titleEn}</div>
                <div class="action-title">${discover.titleZh}</div>
                <div class="action-detail"><strong>URL EN:</strong> ${discover.urlEn}</div>
                <div class="action-detail"><strong>URL ZH:</strong> ${discover.urlZh}</div>
                ${iconEnHTML}
                ${iconZhHTML}
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.discovers.length, visibleCount, 'Total Discovers:');
}

function editDiscover(index) {
    currentEditIndex = index;
    const discover = jsonData.discovers[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Discover';
    document.getElementById('editCode').value = discover.code;
    document.getElementById('editTitleEn').value = discover.titleEn;
    document.getElementById('editTitleZh').value = discover.titleZh;
    document.getElementById('editIconEn').value = discover.iconEn || '';
    document.getElementById('editIconZh').value = discover.iconZh || '';
    document.getElementById('editUrlEn').value = discover.urlEn || '';
    document.getElementById('editUrlZh').value = discover.urlZh || '';
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'block';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';

    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';

    document.getElementById('editModal').classList.add('active');
}

function addNewDiscover() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Discover';
    document.getElementById('editForm').reset();
    
    // Show URL fields, hide platforms and search labels for discovers
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteDiscover(index) {
    if (confirm('Are you sure you want to delete this discover item?')) {
        jsonData.discovers.splice(index, 1);
        renderDiscovers();
        showNotification('Discover item deleted successfully!');
    }
}
