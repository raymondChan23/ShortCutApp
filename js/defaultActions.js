// DefaultActions tab functions

function renderDefaultActions() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.defaultActions) jsonData.defaultActions = [];
    
    if (jsonData.defaultActions.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Default Actions:');
        return;
    }

    let visibleCount = 0;
    jsonData.defaultActions.forEach((action, index) => {
        const matchesSearch = !searchTerm || 
            action.code.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${action.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editDefaultAction(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteDefaultAction(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-detail"><strong>Removable:</strong> ${action.isRemovable ? 'Yes' : 'No'}</div>
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.defaultActions.length, visibleCount, 'Total Default Actions:');
}

function editDefaultAction(index) {
    currentEditIndex = index;
    const action = jsonData.defaultActions[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Default Action';
    document.getElementById('editCode').value = action.code;
    document.getElementById('editIsRemovable').checked = action.isRemovable !== false;
    
    // Remove required attribute from hidden fields
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    
    // Hide all unnecessary fields for default actions
    document.getElementById('editTitleEn').closest('.form-group').style.display = 'none';
    document.getElementById('editTitleZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    // Show isRemovable checkbox
    document.getElementById('isRemovableGroup').style.display = 'block';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function addNewDefaultAction() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Default Action';
    document.getElementById('editForm').reset();
    document.getElementById('editIsRemovable').checked = true;
    
    // Remove required attribute from hidden fields
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    
    // Hide all unnecessary fields for default actions
    document.getElementById('editTitleEn').closest('.form-group').style.display = 'none';
    document.getElementById('editTitleZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    // Show isRemovable checkbox
    document.getElementById('isRemovableGroup').style.display = 'block';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteDefaultAction(index) {
    if (confirm('Are you sure you want to delete this default action?')) {
        jsonData.defaultActions.splice(index, 1);
        renderDefaultActions();
        showNotification('Default action deleted successfully!');
    }
}
