// Recommends tab functions

function renderRecommends() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.recommends) jsonData.recommends = [];
    
    if (jsonData.recommends.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Recommends:');
        return;
    }

    let visibleCount = 0;
    jsonData.recommends.forEach((recommend, index) => {
        const matchesSearch = !searchTerm || 
            recommend.code.toLowerCase().includes(searchTerm) ||
            recommend.titleEn.toLowerCase().includes(searchTerm) ||
            recommend.titleZh.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        card.draggable = true;
        card.dataset.index = index;
        
        // Add drag events for recommend reordering
        card.addEventListener('dragstart', handleRecommendDragStart);
        card.addEventListener('dragover', handleRecommendDragOver);
        card.addEventListener('drop', handleRecommendDrop);
        card.addEventListener('dragend', handleRecommendDragEnd);
        
        if (matchesSearch) visibleCount++;

        const startDate = recommend.startDate ? new Date(recommend.startDate).toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }) : 'Not set';
        const endDate = recommend.endDate ? new Date(recommend.endDate).toLocaleString('en-US', { timeZone: 'Asia/Hong_Kong' }) : 'Not set';

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code" style="cursor: move; display: flex; align-items: center; gap: 8px;">
                    <span style="color: #999; font-size: 18px;">⋮⋮</span>
                    ${recommend.code}
                </span>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="cloneRecommend(${index})" title="Clone">📄</button>
                    <button class="btn-icon btn-edit" onclick="editRecommend(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteRecommend(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-title">${recommend.titleEn}</div>
                <div class="action-title">${recommend.titleZh}</div>
                ${recommend.urlEn || recommend.urlZh ? `<div class="action-detail"><strong>URL EN:</strong> ${recommend.urlEn || 'N/A'}</div>` : ''}
                ${recommend.urlEn || recommend.urlZh ? `<div class="action-detail"><strong>URL ZH:</strong> ${recommend.urlZh || 'N/A'}</div>` : ''}
                ${recommend.startDate ? `<div class="action-detail" style="margin-top: 10px;"><strong>Start:</strong> ${startDate}</div>` : ''}
                ${recommend.endDate ? `<div class="action-detail"><strong>End:</strong> ${endDate}</div>` : ''}
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.recommends.length, visibleCount, 'Total Recommends:');
}

function cloneRecommend(index) {
    const original = jsonData.recommends[index];
    if (!original) return;
    const clone = JSON.parse(JSON.stringify(original));
    const baseCode = original.code || 'RECOMMEND';
    let candidate = `${baseCode}-copy`;
    let counter = 2;
    const existingCodes = new Set((jsonData.recommends || []).map(r => r.code));
    while (existingCodes.has(candidate)) {
        candidate = `${baseCode}-copy${counter}`;
        counter++;
    }
    clone.code = candidate;
    jsonData.recommends.splice(index + 1, 0, clone);
    currentEditIndex = index + 1;
    editRecommend(currentEditIndex);
    showNotification('Cloned recommend. Please review and save.');
}

function editRecommend(index) {
    currentEditIndex = index;
    const recommend = jsonData.recommends[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Recommend';
    document.getElementById('editCode').value = recommend.code;
    document.getElementById('editTitleEn').value = recommend.titleEn;
    document.getElementById('editTitleZh').value = recommend.titleZh;
    document.getElementById('editIconEn').value = recommend.iconEn || '';
    document.getElementById('editIconZh').value = recommend.iconZh || '';
    document.getElementById('editUrlEn').value = recommend.urlEn || '';
    document.getElementById('editUrlZh').value = recommend.urlZh || '';
    document.getElementById('editUrlEnAndroid').value = recommend.urlEnAndroid || '';
    document.getElementById('editUrlZhAndroid').value = recommend.urlZhAndroid || '';
    document.getElementById('editUrlEnHuawei').value = recommend.urlEnHuawei || '';
    document.getElementById('editUrlZhHuawei').value = recommend.urlZhHuawei || '';
    document.getElementById('editUrlEnIos').value = recommend.urlEnIos || '';
    document.getElementById('editUrlZhIos').value = recommend.urlZhIos || '';
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Show URL fields, platforms, and dates for recommends
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    
    // Always show platform-specific URL fields
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'block';
    
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Show date fields for recommends
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'block';
    if (endDateGroup) endDateGroup.style.display = 'block';
    
    // Show clear date buttons
    const clearStartBtn = document.getElementById('btnClearStartDate');
    const clearEndBtn = document.getElementById('btnClearEndDate');
    if (clearStartBtn) clearStartBtn.style.display = 'inline-block';
    if (clearEndBtn) clearEndBtn.style.display = 'inline-block';
    
    // Set dates (convert from ISO format to datetime-local format)
    if (recommend.startDate) {
        const startDate = new Date(recommend.startDate);
        document.getElementById('editStartDate').value = formatDateForInput(startDate);
    } else {
        document.getElementById('editStartDate').value = '';
    }
    
    if (recommend.endDate) {
        const endDate = new Date(recommend.endDate);
        document.getElementById('editEndDate').value = formatDateForInput(endDate);
    } else {
        document.getElementById('editEndDate').value = '';
    }

    document.getElementById('editModal').classList.add('active');
}

function formatDateForInput(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function formatDateToISO(dateString) {
    if (!dateString) return null;
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+08:00`;
}

function addNewRecommend() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Recommend';
    document.getElementById('editForm').reset();
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Show URL fields, platforms, and dates for recommends
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    
    // Always show platform-specific URL fields
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'block';
    
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'none';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'none';
    document.getElementById('editSearchLabels').closest('.form-group').style.display = 'none';
    document.getElementById('editIconEn').closest('.form-group').style.display = 'none';
    document.getElementById('editIconZh').closest('.form-group').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Show date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'block';
    if (endDateGroup) endDateGroup.style.display = 'block';
    
    // Show clear date buttons
    const clearStartBtn = document.getElementById('btnClearStartDate');
    const clearEndBtn = document.getElementById('btnClearEndDate');
    if (clearStartBtn) clearStartBtn.style.display = 'inline-block';
    if (clearEndBtn) clearEndBtn.style.display = 'inline-block';
    
    document.getElementById('editModal').classList.add('active');
}

function clearStartDate() {
    document.getElementById('editStartDate').value = '';
}

function clearEndDate() {
    document.getElementById('editEndDate').value = '';
}

// Expose functions to global scope for onclick handlers
window.clearStartDate = clearStartDate;
window.clearEndDate = clearEndDate;

function togglePlatformSpecificUrls() {
    const urlFields = [
        document.getElementById('editUrlEnAndroid').closest('.form-group'),
        document.getElementById('editUrlZhAndroid').closest('.form-group'),
        document.getElementById('editUrlEnHuawei').closest('.form-group'),
        document.getElementById('editUrlZhHuawei').closest('.form-group'),
        document.getElementById('editUrlEnIos').closest('.form-group'),
        document.getElementById('editUrlZhIos').closest('.form-group')
    ];
    
    const isVisible = urlFields[0].style.display !== 'none';
    urlFields.forEach(field => {
        field.style.display = isVisible ? 'none' : 'block';
    });
}

function deleteRecommend(index) {
    if (confirm('Are you sure you want to delete this recommend item?')) {
        jsonData.recommends.splice(index, 1);
        renderRecommends();
        showNotification('Recommend item deleted successfully!');
    }
}

// Drag and drop handlers for recommend reordering
let draggedRecommendElement = null;
let draggedRecommendIndex = null;

function handleRecommendDragStart(e) {
    draggedRecommendElement = e.currentTarget;
    draggedRecommendIndex = parseInt(draggedRecommendElement.dataset.index);
    e.currentTarget.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleRecommendDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    
    // Only show indicator if dragging over a different card
    if (targetElement !== draggedRecommendElement && targetElement.classList.contains('action-card') && draggedRecommendElement) {
        e.dataTransfer.dropEffect = 'move';
        
        // Remove previous indicators
        document.querySelectorAll('.action-card').forEach(card => {
            card.style.borderTop = '';
            card.style.borderBottom = '';
        });
        
        // Determine if we should show indicator on top or bottom
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (e.clientY < midpoint) {
            targetElement.style.borderTop = '3px solid #667eea';
        } else {
            targetElement.style.borderBottom = '3px solid #667eea';
        }
    }
    
    return false;
}

function handleRecommendDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    targetElement.style.borderTop = '';
    targetElement.style.borderBottom = '';
    
    const targetIndex = parseInt(targetElement.dataset.index);
    
    if (draggedRecommendIndex !== null && targetElement !== draggedRecommendElement) {
        // Determine insert position based on drop location
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        let insertIndex = targetIndex;
        
        if (e.clientY >= midpoint) {
            insertIndex = targetIndex + 1;
        }
        
        // Remove from source
        const movedRecommend = jsonData.recommends.splice(draggedRecommendIndex, 1)[0];
        
        // Adjust insert index if moving down
        if (draggedRecommendIndex < insertIndex) {
            insertIndex--;
        }
        
        // Insert at target
        jsonData.recommends.splice(insertIndex, 0, movedRecommend);
        
        renderRecommends();
        showNotification('Recommend order updated!');
    }
    
    return false;
}

function handleRecommendDragEnd(e) {
    e.currentTarget.style.opacity = '';
    document.querySelectorAll('.action-card').forEach(card => {
        card.style.borderTop = '';
        card.style.borderBottom = '';
    });
    draggedRecommendElement = null;
    draggedRecommendIndex = null;
}
