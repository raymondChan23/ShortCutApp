// Categories tab functions

function renderCategories() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.categories) jsonData.categories = [];
    
    if (jsonData.categories.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Categories:');
        return;
    }

    let visibleCount = 0;
    jsonData.categories.forEach((category, index) => {
        const matchesSearch = !searchTerm || 
            category.code.toLowerCase().includes(searchTerm) ||
            category.titleEn.toLowerCase().includes(searchTerm) ||
            category.titleZh.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        const searchLabels = category.searchLabels || [];
        const searchLabelsHTML = searchLabels.length > 0 ? 
            `<div style="margin-top: 10px;"><strong style="font-size: 12px; color: #666;">Search Labels:</strong><br><span style="font-size: 11px; color: #888;">${searchLabels.join(', ')}</span></div>` : '';

        const iconEnHTML = category.iconEn ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon EN:</strong><br><img src="${category.iconEn}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${category.iconEn}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${category.iconEn}</a></div>` : '';
        const iconZhHTML = category.iconZh ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon ZH:</strong><br><img src="${category.iconZh}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${category.iconZh}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${category.iconZh}</a></div>` : '';

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${category.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editCategory(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteCategory(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-title">${category.titleEn}</div>
                <div class="action-title">${category.titleZh}</div>
                ${searchLabelsHTML}
                ${iconEnHTML}
                ${iconZhHTML}
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.categories.length, visibleCount, 'Total Categories:');
}

function editCategory(index) {
    currentEditIndex = index;
    const category = jsonData.categories[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Category';
    document.getElementById('editCode').value = category.code;
    document.getElementById('editTitleEn').value = category.titleEn;
    document.getElementById('editTitleZh').value = category.titleZh;
    document.getElementById('editIconEn').value = category.iconEn || '';
    document.getElementById('editIconZh').value = category.iconZh || '';
    document.getElementById('editSearchLabels').value = (category.searchLabels || []).join(', ');
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Hide URL fields and platforms for categories
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';;
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
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

function addNewCategory() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Category';
    document.getElementById('editForm').reset();
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Hide URL fields and platforms for categories
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
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

function deleteCategory(index) {
    if (confirm('Are you sure you want to delete this category?')) {
        jsonData.categories.splice(index, 1);
        renderCategories();
        showNotification('Category deleted successfully!');
    }
}
