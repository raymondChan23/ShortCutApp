// Actions tab functions

function argbToRgbaCss(argb) {
    if (!argb || !/^#([A-Fa-f0-9]{8})$/.test(argb)) return '';
    const a = parseInt(argb.slice(1, 3), 16) / 255;
    const r = parseInt(argb.slice(3, 5), 16);
    const g = parseInt(argb.slice(5, 7), 16);
    const b = parseInt(argb.slice(7, 9), 16);
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

function renderActions() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData) {
        jsonData = { actions: [] };
    }
    if (!jsonData.actions) {
        jsonData.actions = [];
    }
    
    if (jsonData.actions.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Actions:');
        return;
    }

    let visibleCount = 0;
    jsonData.actions.forEach((action, index) => {
        const matchesSearch = !searchTerm || 
            action.code.toLowerCase().includes(searchTerm) ||
            action.titleEn.toLowerCase().includes(searchTerm) ||
            action.titleZh.toLowerCase().includes(searchTerm) ||
            (action.descEn && action.descEn.toLowerCase().includes(searchTerm)) ||
            (action.descZh && action.descZh.toLowerCase().includes(searchTerm));

        const card = document.createElement('div');
        card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        
        if (matchesSearch) visibleCount++;

        const platforms = action.platforms || [];
        const platformsHTML = platforms.map(p => 
            `<span class="platform-badge">${p}</span>`
        ).join('');

        const searchLabels = action.searchLabels || [];
        const searchLabelsHTML = searchLabels.length > 0 ? 
            `<div style="margin-top: 10px;"><strong style="font-size: 12px; color: #666;">Search Labels:</strong><br><span style="font-size: 11px; color: #888;">${searchLabels.join(', ')}</span></div>` : '';

        const iconEnHTML = action.iconEn ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon EN:</strong><br><img src="${action.iconEn}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${action.iconEn}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${action.iconEn}</a></div>` : '';
        const iconZhHTML = action.iconZh ? `<div style="margin-top: 12px;"><strong style="font-size: 12px; color: #666;">Icon ZH:</strong><br><img src="${action.iconZh}" style="width: 48px; height: 48px; margin: 8px 0; border-radius: 8px; border: 1px solid #e0e0e0;" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"><div style="display: none; font-size: 10px; color: #dc3545;">Failed to load image</div><a href="${action.iconZh}" target="_blank" style="font-size: 10px; color: #667eea; word-break: break-all;">${action.iconZh}</a></div>` : '';

        let tagBadge = '';
        if (action.tag && action.tag.code) {
            const tagDef = (jsonData.tags || []).find(t => t.code === action.tag.code);
            const bg = tagDef ? argbToRgbaCss(tagDef.bgColorArgb) : '';
            const fg = tagDef ? argbToRgbaCss(tagDef.textColorArgb) : '';
            const bgStyle = bg ? `background:${bg};` : 'background:#ffeeba;';
            const fgStyle = fg ? `color:${fg};` : 'color:#212529;';
            tagBadge = `<span class="platform-badge" style="${bgStyle}${fgStyle}margin-left:8px;">${action.tag.code}</span>`;
        }
        card.innerHTML = `
            <div class="action-header">
                <span class="action-code">${action.code}</span>
                ${tagBadge}
                <div class="action-buttons">
                    <button class="btn-icon btn-edit" onclick="editAction(${index})" title="Edit">✏️</button>
                    <button class="btn-icon btn-delete" onclick="deleteAction(${index})" title="Delete">🗑️</button>
                </div>
            </div>
            <div class="action-info">
                <div class="action-title">${action.titleEn}</div>
                <div class="action-title">${action.titleZh}</div>
                ${action.descEn ? `<div class="action-desc">${action.descEn}</div>` : ''}
                <div class="action-platforms">${platformsHTML}</div>
                ${searchLabelsHTML}
                ${iconEnHTML}
                ${iconZhHTML}
            </div>
        `;
        
        container.appendChild(card);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.actions.length, visibleCount, 'Total Actions:');
}

function editAction(index) {
    currentEditIndex = index;
    const action = jsonData.actions[index];
    
    document.getElementById('modalTitle').textContent = 'Edit Shortcut';
    document.getElementById('editCode').value = action.code;
    document.getElementById('editTitleEn').value = action.titleEn;
    document.getElementById('editTitleZh').value = action.titleZh;
    document.getElementById('editIconEn').value = action.iconEn || '';
    document.getElementById('editIconZh').value = action.iconZh || '';
    document.getElementById('editUrlEn').value = action.urlEn || '';
    document.getElementById('editUrlZh').value = action.urlZh || '';
    document.getElementById('editSearchLabels').value = (action.searchLabels || []).join(', ');
    document.getElementById('editShowOnAllPlatforms').checked = action.showOnAllPlatforms || false;

    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');

    // Show URL fields and platforms for actions
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'block';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'block';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';

    // Show Tag Code field and populate if existing
    const tagCodeGroup = document.getElementById('tagCodeGroup');
    tagCodeGroup.style.display = 'block';
    document.getElementById('editTagCode').value = (action.tag && action.tag.code) ? action.tag.code : '';

    // Set platforms
    document.getElementById('platformARD').checked = (action.platforms || []).includes('ARD');
    document.getElementById('platformIOS').checked = (action.platforms || []).includes('IOS');
    document.getElementById('platformHWI').checked = (action.platforms || []).includes('HWI');

    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';

    document.getElementById('editModal').classList.add('active');
}

function addNewAction() {
    currentEditIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Shortcut';
    document.getElementById('editForm').reset();
    
    // Restore required attribute for title fields
    document.getElementById('editTitleEn').setAttribute('required', '');
    document.getElementById('editTitleZh').setAttribute('required', '');
    
    // Show all fields for new actions
    document.getElementById('editUrlEn').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlZh').closest('.form-group').style.display = 'block';
    document.getElementById('editUrlEnAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhAndroid').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhHuawei').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlEnIos').closest('.form-group').style.display = 'none';
    document.getElementById('editUrlZhIos').closest('.form-group').style.display = 'none';
    document.querySelector('.platforms-group').closest('.form-group').style.display = 'block';
    document.getElementById('editShowOnAllPlatforms').closest('.form-group').style.display = 'block';
    document.getElementById('isRemovableGroup').style.display = 'none';
    document.getElementById('versionGroup').style.display = 'none';
    document.getElementById('typeGroup').style.display = 'none';

    // Show Tag Code field empty for new
    const tagCodeGroup = document.getElementById('tagCodeGroup');
    tagCodeGroup.style.display = 'block';
    document.getElementById('editTagCode').value = '';

    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteAction(index) {
    if (confirm('Are you sure you want to delete this shortcut?')) {
        jsonData.actions.splice(index, 1);
        renderActions();
        showNotification('Shortcut deleted successfully!');
    }
}
