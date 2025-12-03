// WalletActions tab functions

let draggedWalletActionIndex = null;

function renderWalletActions() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.walletActions) jsonData.walletActions = [];
    
    if (jsonData.walletActions.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Wallet Actions:');
        return;
    }

    let visibleCount = 0;
    jsonData.walletActions.forEach((walletAction, index) => {
        const matchesSearch = !searchTerm || 
            walletAction.code.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        card.draggable = true;
        card.dataset.index = index;
        
        if (matchesSearch) visibleCount++;

        // Add drag event listeners
        card.addEventListener('dragstart', handleWalletActionDragStart);
        card.addEventListener('dragover', handleWalletActionDragOver);
        card.addEventListener('drop', handleWalletActionDrop);
        card.addEventListener('dragend', handleWalletActionDragEnd);

        card.innerHTML = `
            <div class="action-header">
                <span class="drag-handle" style="cursor: move; margin-right: 8px; color: #888;">⋮⋮</span>
                <span class="action-code">${walletAction.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editWalletAction(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteWalletAction(${index})" title="Delete">🗑️</button>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.walletActions.length, visibleCount, 'Total Wallet Actions:');
}

// Drag and drop handlers
function handleWalletActionDragStart(e) {
    const card = e.currentTarget;
    draggedWalletActionIndex = parseInt(card.dataset.index);
    card.style.opacity = '0.4';
}

function handleWalletActionDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

function handleWalletActionDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropIndex = parseInt(e.currentTarget.dataset.index);
    
    if (draggedWalletActionIndex !== null && draggedWalletActionIndex !== dropIndex) {
        const draggedItem = jsonData.walletActions[draggedWalletActionIndex];
        jsonData.walletActions.splice(draggedWalletActionIndex, 1);
        
        const newIndex = draggedWalletActionIndex < dropIndex ? dropIndex - 1 : dropIndex;
        jsonData.walletActions.splice(newIndex, 0, draggedItem);
        
        renderWalletActions();
        showNotification('Wallet action order updated!');
    }
    
    return false;
}

function handleWalletActionDragEnd(e) {
    const card = e.currentTarget;
    card.style.opacity = '1';
    draggedWalletActionIndex = null;
}

function editWalletAction(index) {
    currentEditIndex = index;
    const walletAction = jsonData.walletActions[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Wallet Action';
    document.getElementById('editCode').value = walletAction.code;
    
    // Clear and hide title fields - remove required attributes
    document.getElementById('editTitleEn').value = '';
    document.getElementById('editTitleZh').value = '';
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    document.getElementById('editTitleEn').closest('.form-group').style.display = 'none';
    document.getElementById('editTitleZh').closest('.form-group').style.display = 'none';
    
    // Hide all other fields
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
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

function addNewWalletAction() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Wallet Action';
    document.getElementById('editForm').reset();
    
    // Clear and hide title fields - remove required attributes
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    document.getElementById('editTitleEn').closest('.form-group').style.display = 'none';
    document.getElementById('editTitleZh').closest('.form-group').style.display = 'none';
    
    // Hide all other fields
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
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

function deleteWalletAction(index) {
    if (confirm('Are you sure you want to delete this wallet action?')) {
        jsonData.walletActions.splice(index, 1);
        renderWalletActions();
        showNotification('Wallet action deleted successfully!');
    }
}
