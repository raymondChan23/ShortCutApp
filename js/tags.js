// Tags tab functions

function renderTags() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.tags) jsonData.tags = [];
    
    if (jsonData.tags.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Tags:');
        return;
    }

    let visibleCount = 0;
    jsonData.tags.forEach((tag, index) => {
        const matchesSearch = !searchTerm || 
            tag.code.toLowerCase().includes(searchTerm) ||
            tag.textEn.toLowerCase().includes(searchTerm) ||
            tag.textZh.toLowerCase().includes(searchTerm);

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        // Convert ARGB to displayable colors
        const textColor = argbToRgba(tag.textColorArgb);
        const bgColor = argbToRgba(tag.bgColorArgb);

        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${tag.code}</span>
                <div class="action-buttons">
                    <button class="btn-icon" onclick="cloneTag(${index})" title="Clone">📄</button>
                    <button class="btn-icon btn-edit" onclick="editTag(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteTag(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-detail"><strong>English:</strong> ${tag.textEn}</div>
                <div class="action-detail"><strong>Chinese:</strong> ${tag.textZh}</div>
                <div class="action-detail">
                    <strong>Preview:</strong>
                    <span style="display: inline-block; padding: 4px 12px; border-radius: 4px; background: ${bgColor}; color: ${textColor}; margin-left: 8px;">
                        ${tag.textEn}
                    </span>
                </div>
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.tags.length, visibleCount, 'Total Tags:');
}

function argbToRgba(argb) {
    if (!argb) return '#000000';
    // ARGB format: #AARRGGBB
    const hex = argb.replace('#', '');
    const a = parseInt(hex.substr(0, 2), 16) / 255;
    const r = parseInt(hex.substr(2, 2), 16);
    const g = parseInt(hex.substr(4, 2), 16);
    const b = parseInt(hex.substr(6, 2), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function argbToHex(argb) {
    if (!argb) return '#000000';
    // Convert #AARRGGBB to #RRGGBB for color picker
    const hex = argb.replace('#', '');
    return '#' + hex.substr(2, 6);
}

function hexToArgb(hex, alpha = 'FF') {
    // Convert #RRGGBB to #AARRGGBB
    return '#' + alpha + hex.replace('#', '');
}

function setupColorPickers() {
    const textColorPicker = document.getElementById('editTextColorPicker');
    const textColorArgb = document.getElementById('editTextColorArgb');
    const textColorPreview = document.getElementById('textColorPreview');
    
    const bgColorPicker = document.getElementById('editBgColorPicker');
    const bgColorArgb = document.getElementById('editBgColorArgb');
    const bgColorPreview = document.getElementById('bgColorPreview');

    // Text color picker change
    textColorPicker.addEventListener('input', (e) => {
        const currentArgb = textColorArgb.value || '#FFFFFFFF';
        const alpha = currentArgb.substring(1, 3);
        const newArgb = hexToArgb(e.target.value, alpha);
        textColorArgb.value = newArgb;
        textColorPreview.style.background = argbToRgba(newArgb);
    });

    // Text color ARGB input change
    textColorArgb.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        if (value.length === 9) {
            textColorPicker.value = argbToHex(value);
            textColorPreview.style.background = argbToRgba(value);
        }
    });

    // Background color picker change
    bgColorPicker.addEventListener('input', (e) => {
        const currentArgb = bgColorArgb.value || '#FF004BD2';
        const alpha = currentArgb.substring(1, 3);
        const newArgb = hexToArgb(e.target.value, alpha);
        bgColorArgb.value = newArgb;
        bgColorPreview.style.background = argbToRgba(newArgb);
    });

    // Background color ARGB input change
    bgColorArgb.addEventListener('input', (e) => {
        let value = e.target.value.toUpperCase();
        if (!value.startsWith('#')) value = '#' + value;
        if (value.length === 9) {
            bgColorPicker.value = argbToHex(value);
            bgColorPreview.style.background = argbToRgba(value);
        }
    });
}

function editTag(index) {
    currentEditIndex = index;
    const tag = jsonData.tags[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Tag';
    document.getElementById('editCode').value = tag.code;
    document.getElementById('editTitleEn').value = tag.textEn;
    document.getElementById('editTitleZh').value = tag.textZh;
    document.getElementById('editTextColorArgb').value = tag.textColorArgb;
    document.getElementById('editBgColorArgb').value = tag.bgColorArgb;
    
    // Set color pickers
    document.getElementById('editTextColorPicker').value = argbToHex(tag.textColorArgb);
    document.getElementById('editBgColorPicker').value = argbToHex(tag.bgColorArgb);
    
    // Set color previews
    document.getElementById('textColorPreview').style.background = argbToRgba(tag.textColorArgb);
    document.getElementById('bgColorPreview').style.background = argbToRgba(tag.bgColorArgb);
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Hide unnecessary fields
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
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Show color fields
    document.getElementById('textColorGroup').style.display = 'block';
    document.getElementById('bgColorGroup').style.display = 'block';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function addNewTag() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Tag';
    document.getElementById('editForm').reset();
    document.getElementById('editTextColorArgb').value = '#FFFFFFFF';
    document.getElementById('editBgColorArgb').value = '#FF004BD2';
    
    // Set color pickers to defaults
    document.getElementById('editTextColorPicker').value = '#FFFFFF';
    document.getElementById('editBgColorPicker').value = '#004BD2';
    
    // Set color previews
    document.getElementById('textColorPreview').style.background = 'rgba(255, 255, 255, 1)';
    document.getElementById('bgColorPreview').style.background = 'rgba(0, 75, 210, 1)';
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Hide unnecessary fields
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
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';
    
    // Show color fields
    document.getElementById('textColorGroup').style.display = 'block';
    document.getElementById('bgColorGroup').style.display = 'block';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteTag(index) {
    if (confirm('Are you sure you want to delete this tag?')) {
        jsonData.tags.splice(index, 1);
        renderTags();
        showNotification('Tag deleted successfully!');
    }
}

// Initialize color pickers when page loads
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupColorPickers);
} else {
    setupColorPickers();
}

function cloneTag(index) {
    const original = jsonData.tags[index];
    if (!original) return;
    const clone = JSON.parse(JSON.stringify(original));
    const baseCode = original.code || 'TAG';
    let candidate = `${baseCode}-copy`;
    let counter = 2;
    const existingCodes = new Set((jsonData.tags || []).map(t => t.code));
    while (existingCodes.has(candidate)) {
        candidate = `${baseCode}-copy${counter}`;
        counter++;
    }
    clone.code = candidate;
    jsonData.tags.splice(index + 1, 0, clone);
    currentEditIndex = index + 1;
    editTag(currentEditIndex);
    showNotification('Cloned tag. Please review and save.');
}
