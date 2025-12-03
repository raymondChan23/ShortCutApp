// Grouping tab functions

function renderGrouping() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.grouping) jsonData.grouping = [];
    
    if (jsonData.grouping.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Groupings:');
        return;
    }

    // Add collapse/expand all buttons at the top
    const controlsDiv = document.createElement('div');
    controlsDiv.style.cssText = 'display: flex; gap: 10px; margin-bottom: 20px;';
    controlsDiv.innerHTML = `
        <button class="btn btn-secondary" onclick="collapseAllGroups()" style="flex: 1;">📁 Collapse All</button>
        <button class="btn btn-secondary" onclick="expandAllGroups()" style="flex: 1;">📂 Expand All</button>
    `;
    container.appendChild(controlsDiv);

    let visibleCount = 0;

    // Build an action lookup by code for quick resolution
    const actionByCode = new Map();
    if (Array.isArray(jsonData.actions)) {
        jsonData.actions.forEach(a => actionByCode.set(a.code, a));
    }

    jsonData.grouping.forEach((group, groupIndex) => {
        // Resolve category details by matching categories.code
        let categoryDisplayEn = group.category;
        let categoryDisplayZh = '';
        let categoryIcon = null;
        if (Array.isArray(jsonData.categories)) {
            const matched = jsonData.categories.find(c => c.code === group.category);
            if (matched) {
                categoryDisplayEn = matched.titleEn || matched.code || group.category;
                categoryDisplayZh = matched.titleZh || '';
                categoryIcon = matched.iconEn || matched.iconZh || null;
            }
        }
        const matchesSearch = !searchTerm || 
            group.category.toLowerCase().includes(searchTerm) ||
            (group.actions && group.actions.some(a => a.action.toLowerCase().includes(searchTerm)));

        if (matchesSearch) visibleCount++;

        const groupDiv = document.createElement('div');
        groupDiv.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
        groupDiv.style.padding = '20px';
        groupDiv.style.marginBottom = '20px';
        groupDiv.draggable = true;
        groupDiv.dataset.groupIndex = groupIndex;
        
        // Add drag events for category reordering
        groupDiv.addEventListener('dragstart', handleCategoryDragStart);
        groupDiv.addEventListener('dragover', handleCategoryDragOver);
        groupDiv.addEventListener('drop', handleCategoryDrop);
        groupDiv.addEventListener('dragend', handleCategoryDragEnd);
        
        let actionsTableHTML = '';
        if (group.actions && group.actions.length > 0) {
            actionsTableHTML = `
                <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
                    <thead>
                        <tr style="background-color: #f8f9fa; border-bottom: 2px solid #dee2e6;">
                            <th style="padding: 10px; text-align: center; font-size: 12px; color: #495057; width: 40px;">⋮⋮</th>
                            <th style="padding: 10px; text-align: left; font-size: 12px; color: #495057;">Action Code</th>
                            <th style="padding: 10px; text-align: left; font-size: 12px; color: #495057;">Action Title</th>
                            <th style="padding: 10px; text-align: left; font-size: 12px; color: #495057; width: 120px;">Tag</th>
                            <th style="padding: 10px; text-align: center; font-size: 12px; color: #495057; width: 80px;">Visible</th>
                            <th style="padding: 10px; text-align: center; font-size: 12px; color: #495057; width: 80px;">Pinned</th>
                            <th style="padding: 10px; text-align: center; font-size: 12px; color: #495057; width: 120px;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="actions-tbody-${groupIndex}">
                        ${group.actions.map((actionObj, actionIndex) => `
                            ${(() => { const act = actionByCode.get(actionObj.action); const title = act ? `${act.titleEn || ''}${act.titleZh ? ' / ' + act.titleZh : ''}` : ''; return '' })()}
                            <tr draggable="true" data-group-index="${groupIndex}" data-action-index="${actionIndex}" 
                                style="border-bottom: 1px solid #e9ecef; cursor: move;"
                                ondragstart="handleActionDragStart(event)" 
                                ondragover="handleActionDragOver(event)" 
                                ondrop="handleActionDrop(event)"
                                ondragend="handleActionDragEnd(event)">
                                <td style="padding: 10px; text-align: center; color: #999; font-size: 18px; cursor: grab;">⋮⋮</td>
                                <td style="padding: 10px;">
                                    <input type="text" 
                                           value="${actionObj.action}" 
                                           onchange="updateGroupingAction(${groupIndex}, ${actionIndex}, 'action', this.value)"
                                           style="width: 100%; padding: 6px 10px; border: 1px solid #ced4da; border-radius: 4px; font-size: 13px;">
                                </td>
                                <td style="padding: 10px; color: #495057; font-size: 15px; display:flex; align-items:center; gap:10px;">
                                    ${(() => {
                                        const act = actionByCode.get(actionObj.action);
                                        if (!act) return '<span style="color:#999">(unknown)</span>';
                                        const icon = act.iconEn || act.iconZh || '';
                                        const title = `${act.titleEn || ''}${act.titleZh ? ' / ' + act.titleZh : ''}`;
                                        const imgHtml = icon ? `<img src="${icon}" alt="${act.code}" style="width:28px;height:28px;border-radius:4px;object-fit:contain;">` : '';
                                        return `${imgHtml}<span>${title}</span>`;
                                    })()}
                                </td>
                                <td style="padding: 10px;">
                                    ${(() => {
                                        const act = actionByCode.get(actionObj.action);
                                        if (!act || !act.tag || !act.tag.code) return '';
                                        const tagCode = act.tag.code;
                                        const t = (Array.isArray(jsonData.tags) ? jsonData.tags.find(x => x.code === tagCode) : null);
                                        const textArgb = t && t.textColorArgb ? t.textColorArgb : '#FFFFFFFF';
                                        const bgArgb = t && t.bgColorArgb ? t.bgColorArgb : '#FF7A1A';
                                        const toRgba = (argb) => {
                                            // Expect #AARRGGBB or #RRGGBB
                                            if (!argb) return 'rgba(255,255,255,1)';
                                            const hex = argb.replace('#','');
                                            let a = 255, r, g, b;
                                            if (hex.length === 8) { a = parseInt(hex.substring(0,2),16); r = parseInt(hex.substring(2,4),16); g = parseInt(hex.substring(4,6),16); b = parseInt(hex.substring(6,8),16); }
                                            else if (hex.length === 6) { r = parseInt(hex.substring(0,2),16); g = parseInt(hex.substring(2,4),16); b = parseInt(hex.substring(4,6),16); }
                                            else { return 'rgba(255,255,255,1)'; }
                                            const alpha = (a/255).toFixed(3);
                                            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                                        };
                                        const textCss = toRgba(textArgb);
                                        const bgCss = toRgba(bgArgb);
                                        return `<span style=\"display:inline-block;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;color:${textCss};background:${bgCss};\">${tagCode}</span>`;
                                    })()}
                                </td>
                                <td style="padding: 10px; text-align: center;">
                                    <input type="checkbox" 
                                           ${actionObj.visible ? 'checked' : ''} 
                                           onchange="updateGroupingAction(${groupIndex}, ${actionIndex}, 'visible', this.checked)"
                                           style="width: 18px; height: 18px; cursor: pointer;">
                                </td>
                                <td style="padding: 10px; text-align: center;">
                                    <input type="checkbox" 
                                           ${actionObj.pinned ? 'checked' : ''} 
                                           onchange="updateGroupingAction(${groupIndex}, ${actionIndex}, 'pinned', this.checked)"
                                           style="width: 18px; height: 18px; cursor: pointer;">
                                </td>
                                <td style="padding: 10px; text-align: center; display:flex; gap:6px; justify-content:center;">
                                    <button onclick="cloneGroupingAction(${groupIndex}, ${actionIndex})" 
                                        style="background: #17a2b8; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                        title="Clone Row">🧬 Clone</button>
                                    <button onclick="deleteGroupingAction(${groupIndex}, ${actionIndex})" 
                                        style="background: #dc3545; color: white; border: none; padding: 5px 10px; border-radius: 4px; cursor: pointer; font-size: 12px;"
                                        title="Delete Action">🗑️ Delete</button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            `;
        }
        
        groupDiv.innerHTML = `
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                <h3 style="margin: 0; color: #ff7a1a; font-size: 18px; font-weight: 600; cursor: move; display: flex; align-items: center; gap: 12px;">
                    <span style="cursor: pointer; user-select: none; font-size: 20px;" onclick="toggleGroupCollapse(${groupIndex})" title="Click to collapse/expand">
                        <span id="collapse-icon-${groupIndex}">▼</span>
                    </span>
                    ${categoryIcon ? `<img src="${categoryIcon}" alt="${categoryDisplayEn}" style="width:24px;height:24px;border-radius:4px;object-fit:contain;">` : ''}
                    <span>Category: ${categoryDisplayEn}${categoryDisplayZh ? ` / ${categoryDisplayZh}` : ''}</span>
                </h3>
                <div style="display:flex; gap:8px;">
                    <button onclick="addGroupingAction(${groupIndex})" 
                            style="background: #28a745; color: white; border: none; padding: 6px 15px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                        ➕ Add Action
                    </button>
                    <button onclick="deleteGroupingCategory(${groupIndex})" 
                            style="background: #dc3545; color: white; border: none; padding: 6px 15px; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;">
                        🗑️ Remove Category
                    </button>
                </div>
            </div>
            <div id="group-content-${groupIndex}" style="transition: all 0.3s ease;">
                ${actionsTableHTML}
            </div>
        `;
        
        container.appendChild(groupDiv);
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(jsonData.grouping.length, visibleCount, 'Total Groupings:');
}

function updateGroupingAction(groupIndex, actionIndex, field, value) {
    jsonData.grouping[groupIndex].actions[actionIndex][field] = value;
    // If the action code changes, re-resolve title/icon/tag for just this row (debounced)
    if (field === 'action') {
        if (!window.__groupingUpdateTimers) window.__groupingUpdateTimers = {};
        const key = `${groupIndex}:${actionIndex}`;
        if (window.__groupingUpdateTimers[key]) {
            clearTimeout(window.__groupingUpdateTimers[key]);
        }
        window.__groupingUpdateTimers[key] = setTimeout(() => {
            // Find the row
            const row = document.querySelector(`tr[draggable="true"][data-group-index="${groupIndex}"][data-action-index="${actionIndex}"]`);
            const resolve = (code) => {
                if (!Array.isArray(jsonData.actions)) return null;
                return jsonData.actions.find(a => a.code === code) || null;
            };
            const act = resolve(value);
            if (row) {
                const cells = row.querySelectorAll('td');
                // cells: [drag, code input, title cell, visible, pinned, delete]
                const titleCell = cells[2];
                const tagCell = cells[3] ? cells[3].nextElementSibling ? cells[2] : null : null; // safeguard
                if (titleCell) {
                    if (!act) {
                        titleCell.innerHTML = '<span style="color:#999">(unknown)</span>';
                    } else {
                        const icon = act.iconEn || act.iconZh || '';
                        const title = `${act.titleEn || ''}${act.titleZh ? ' / ' + act.titleZh : ''}`;
                        const imgHtml = icon ? `<img src="${icon}" alt="${act.code}" style="width:20px;height:20px;border-radius:4px;object-fit:contain;">` : '';
                        titleCell.innerHTML = `${imgHtml}<span>${title}</span>`;
                    }
                }
                // Update Tag cell (4th column now)
                const tagCellEl = cells[3];
                if (tagCellEl) {
                    if (!act || !act.tag || !act.tag.code) {
                        tagCellEl.innerHTML = '';
                    } else {
                        const tagCode = act.tag.code;
                        const t = (Array.isArray(jsonData.tags) ? jsonData.tags.find(x => x.code === tagCode) : null);
                        const textArgb = t && t.textColorArgb ? t.textColorArgb : '#FFFFFFFF';
                        const bgArgb = t && t.bgColorArgb ? t.bgColorArgb : '#FF7A1A';
                        const toRgba = (argb) => {
                            if (!argb) return 'rgba(255,255,255,1)';
                            const hex = argb.replace('#','');
                            let a = 255, r, g, b;
                            if (hex.length === 8) { a = parseInt(hex.substring(0,2),16); r = parseInt(hex.substring(2,4),16); g = parseInt(hex.substring(4,6),16); b = parseInt(hex.substring(6,8),16); }
                            else if (hex.length === 6) { r = parseInt(hex.substring(0,2),16); g = parseInt(hex.substring(2,4),16); b = parseInt(hex.substring(4,6),16); }
                            else { return 'rgba(255,255,255,1)'; }
                            const alpha = (a/255).toFixed(3);
                            return `rgba(${r}, ${g}, ${b}, ${alpha})`;
                        };
                        const textCss = toRgba(textArgb);
                        const bgCss = toRgba(bgArgb);
                        tagCellEl.innerHTML = `<span style="display:inline-block;padding:4px 10px;border-radius:12px;font-size:11px;font-weight:700;color:${textCss};background:${bgCss};">${tagCode}</span>`;
                    }
                }
            } else {
                // If row not found, fallback to full re-render
                renderGrouping();
            }
            delete window.__groupingUpdateTimers[key];
        }, 150);
    }
    showNotification(`Action ${field} updated!`);
}

function deleteGroupingAction(groupIndex, actionIndex) {
    if (confirm('Are you sure you want to delete this action?')) {
        jsonData.grouping[groupIndex].actions.splice(actionIndex, 1);
        renderGrouping();
        showNotification('Action deleted successfully!');
    }
}

function addGroupingAction(groupIndex) {
    const newAction = {
        action: '',
        visible: true,
        pinned: false
    };
    jsonData.grouping[groupIndex].actions.push(newAction);
    renderGrouping();
    showNotification('New action added!');
}

function cloneGroupingAction(groupIndex, actionIndex) {
    const group = jsonData.grouping[groupIndex];
    if (!group || !Array.isArray(group.actions)) return;
    const original = group.actions[actionIndex];
    if (!original) return;

    // Create a shallow clone of the row
    const cloned = {
        action: original.action,
        visible: !!original.visible,
        pinned: !!original.pinned
    };

    // Insert clone right after the original
    group.actions.splice(actionIndex + 1, 0, cloned);
    renderGrouping();
    showNotification('Row cloned!');
}

function addNewGroupingCategory() {
    const categoryName = prompt('Enter category name:');
    if (categoryName && categoryName.trim()) {
        const newGroup = {
            category: categoryName.trim(),
            actions: []
        };
        jsonData.grouping.push(newGroup);
        renderGrouping();
        showNotification('New category added!');
    }
}

function deleteGroupingCategory(groupIndex) {
    if (confirm('Are you sure you want to remove this category group?')) {
        jsonData.grouping.splice(groupIndex, 1);
        renderGrouping();
        showNotification('Category removed successfully!');
    }
}

// Category drag and drop handlers
let draggedCategoryElement = null;
let draggedCategoryIndex = null;

function handleCategoryDragStart(e) {
    draggedCategoryElement = e.currentTarget;
    draggedCategoryIndex = parseInt(draggedCategoryElement.dataset.groupIndex);
    e.currentTarget.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleCategoryDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    
    // Only show indicator if dragging over a different card
    if (targetElement !== draggedCategoryElement && targetElement.classList.contains('action-card') && draggedCategoryElement) {
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

function handleCategoryDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    targetElement.style.borderTop = '';
    targetElement.style.borderBottom = '';
    
    const targetIndex = parseInt(targetElement.dataset.groupIndex);
    
    if (draggedCategoryIndex !== null && targetElement !== draggedCategoryElement) {
        // Determine insert position based on drop location
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        let insertIndex = targetIndex;
        
        if (e.clientY >= midpoint) {
            insertIndex = targetIndex + 1;
        }
        
        // Remove from source
        const movedCategory = jsonData.grouping.splice(draggedCategoryIndex, 1)[0];
        
        // Adjust insert index if moving down
        if (draggedCategoryIndex < insertIndex) {
            insertIndex--;
        }
        
        // Insert at target
        jsonData.grouping.splice(insertIndex, 0, movedCategory);
        
        renderGrouping();
        showNotification('Category order updated!');
    }
    
    return false;
}

function handleCategoryDragEnd(e) {
    e.currentTarget.style.opacity = '';
    document.querySelectorAll('.action-card').forEach(card => {
        card.style.borderTop = '';
        card.style.borderBottom = '';
    });
    draggedCategoryElement = null;
    draggedCategoryIndex = null;
}

// Action drag and drop handlers
let draggedActionElement = null;
let draggedActionData = null;

function handleActionDragStart(e) {
    draggedActionElement = e.currentTarget;
    const groupIndex = parseInt(draggedActionElement.dataset.groupIndex);
    const actionIndex = parseInt(draggedActionElement.dataset.actionIndex);
    
    draggedActionData = {
        groupIndex: groupIndex,
        actionIndex: actionIndex,
        action: jsonData.grouping[groupIndex].actions[actionIndex]
    };
    
    e.currentTarget.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
    e.stopPropagation();
}

function handleActionDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    
    // Only show indicator if dragging over a different row
    if (targetElement !== draggedActionElement && targetElement.tagName === 'TR' && draggedActionElement) {
        e.dataTransfer.dropEffect = 'move';
        
        // Remove previous indicators
        document.querySelectorAll('tr[draggable="true"]').forEach(row => {
            row.style.borderTop = '';
            row.style.borderBottom = '';
        });
        
        // Determine if we should show indicator on top or bottom
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        
        if (e.clientY < midpoint) {
            targetElement.style.borderTop = '2px solid #667eea';
        } else {
            targetElement.style.borderBottom = '2px solid #667eea';
        }
    }
    
    e.stopPropagation();
    return false;
}

function handleActionDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    if (e.preventDefault) {
        e.preventDefault();
    }
    
    const targetElement = e.currentTarget;
    targetElement.style.borderTop = '';
    targetElement.style.borderBottom = '';
    
    const targetGroupIndex = parseInt(targetElement.dataset.groupIndex);
    const targetActionIndex = parseInt(targetElement.dataset.actionIndex);
    
    if (draggedActionData && targetElement !== draggedActionElement) {
        const sourceGroupIndex = draggedActionData.groupIndex;
        const sourceActionIndex = draggedActionData.actionIndex;
        
        // Determine insert position based on drop location
        const rect = targetElement.getBoundingClientRect();
        const midpoint = rect.top + rect.height / 2;
        let insertIndex = targetActionIndex;
        
        if (e.clientY >= midpoint) {
            insertIndex = targetActionIndex + 1;
        }
        
        // Remove from source
        const movedAction = jsonData.grouping[sourceGroupIndex].actions.splice(sourceActionIndex, 1)[0];
        
        // Adjust insert index if moving within same group
        if (sourceGroupIndex === targetGroupIndex && sourceActionIndex < insertIndex) {
            insertIndex--;
        }
        
        // Insert at target
        jsonData.grouping[targetGroupIndex].actions.splice(insertIndex, 0, movedAction);
        
        renderGrouping();
        showNotification('Action order updated!');
    }
    
    return false;
}

function handleActionDragEnd(e) {
    e.currentTarget.style.opacity = '';
    document.querySelectorAll('tr[draggable="true"]').forEach(row => {
        row.style.borderTop = '';
        row.style.borderBottom = '';
    });
    draggedActionElement = null;
    draggedActionData = null;
}

// Collapse/Expand functionality
function toggleGroupCollapse(groupIndex) {
    const content = document.getElementById(`group-content-${groupIndex}`);
    const icon = document.getElementById(`collapse-icon-${groupIndex}`);
    
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▼';
    } else {
        content.style.display = 'none';
        icon.textContent = '▶';
    }
}

function collapseAllGroups() {
    jsonData.grouping.forEach((_, index) => {
        const content = document.getElementById(`group-content-${index}`);
        const icon = document.getElementById(`collapse-icon-${index}`);
        if (content && icon) {
            content.style.display = 'none';
            icon.textContent = '▶';
        }
    });
}

function expandAllGroups() {
    jsonData.grouping.forEach((_, index) => {
        const content = document.getElementById(`group-content-${index}`);
        const icon = document.getElementById(`collapse-icon-${index}`);
        if (content && icon) {
            content.style.display = 'block';
            icon.textContent = '▼';
        }
    });
}
