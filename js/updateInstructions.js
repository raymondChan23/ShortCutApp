// UpdateInstructions tab functions

function renderUpdateInstructions() {
    const container = document.getElementById('actionsContainer');
    const emptyState = document.getElementById('emptyState');
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    
    container.innerHTML = '';
    
    if (!jsonData.updateInstructions) jsonData.updateInstructions = [];
    
    if (jsonData.updateInstructions.length === 0) {
        emptyState.style.display = 'block';
        updateStats(0, 0, 'Total Update Instructions:');
        return;
    }

    let totalInstructions = 0;
    let visibleCount = 0;
    
    jsonData.updateInstructions.forEach((versionObj, versionIndex) => {
        const version = versionObj.version;
        const instructions = versionObj.instruction || [];
        
        // Add version header
        const versionHeader = document.createElement('div');
        versionHeader.style.cssText = 'grid-column: 1 / -1; padding: 15px 0 10px; font-size: 18px; font-weight: 600; color: #667eea; border-bottom: 2px solid #e0e0e0; margin-bottom: 10px;';
        versionHeader.textContent = `Version ${version}`;
        
        let hasVisibleInstructions = false;
        
        // Check if any instructions match search
        instructions.forEach((inst) => {
            totalInstructions++;
            const matchesSearch = !searchTerm || 
                version.toString().includes(searchTerm) ||
                inst.type.toLowerCase().includes(searchTerm) ||
                inst.code.toLowerCase().includes(searchTerm);
            if (matchesSearch) hasVisibleInstructions = true;
        });
        
        // Only show version header if it has visible instructions
        if (hasVisibleInstructions) {
            container.appendChild(versionHeader);
        }
        
        instructions.forEach((inst, instIndex) => {
            const matchesSearch = !searchTerm || 
                version.toString().includes(searchTerm) ||
                inst.type.toLowerCase().includes(searchTerm) ||
                inst.code.toLowerCase().includes(searchTerm);

            const card = document.createElement('div');
            card.className = `action-card ${matchesSearch ? '' : 'hidden'}`;
            
            if (matchesSearch) visibleCount++;

            card.innerHTML = `
                <div class="action-header">
                    <span class="action-code">${inst.code}</span>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" onclick="editUpdateInstruction(${versionIndex}, ${instIndex})" title="Edit">✏️</button>
                        <button class="btn-icon btn-delete" onclick="deleteUpdateInstruction(${versionIndex}, ${instIndex})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="action-info">
                    <div class="action-detail"><strong>Type:</strong> ${inst.type}</div>
                </div>
            `;
            
            container.appendChild(card);
        });
    });

    emptyState.style.display = visibleCount === 0 ? 'block' : 'none';
    updateStats(totalInstructions, visibleCount, 'Total Update Instructions:');
}

function editUpdateInstruction(versionIndex, instIndex) {
    currentEditIndex = versionIndex;
    currentInstructionIndex = instIndex;
    
    const versionObj = jsonData.updateInstructions[versionIndex];
    const instruction = versionObj.instruction[instIndex];
    
    document.getElementById('modalTitle').textContent = 'Edit Update Instruction';
    document.getElementById('editCode').value = instruction.code;
    document.getElementById('editVersion').value = versionObj.version;
    document.getElementById('editType').value = instruction.type;
    
    // Remove required attribute from hidden fields
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    
    // Hide all unnecessary fields
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
    document.getElementById('isRemovableGroup').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    // Show version and type fields
    document.getElementById('versionGroup').style.display = 'block';
    document.getElementById('typeGroup').style.display = 'block';
    
    document.getElementById('editModal').classList.add('active');
}

function addNewUpdateInstruction() {
    currentEditIndex = -1;
    currentInstructionIndex = -1;
    
    document.getElementById('modalTitle').textContent = 'Add New Update Instruction';
    document.getElementById('editForm').reset();
    document.getElementById('editType').value = 'ADD';
    document.getElementById('editVersion').value = '1';
    
    // Remove required attribute from hidden fields
    document.getElementById('editTitleEn').removeAttribute('required');
    document.getElementById('editTitleZh').removeAttribute('required');
    
    // Hide all unnecessary fields
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
    document.getElementById('isRemovableGroup').style.display = 'none';
    
    // Hide date fields
    const startDateGroup = document.getElementById('editStartDate')?.closest('.form-group');
    const endDateGroup = document.getElementById('editEndDate')?.closest('.form-group');
    if (startDateGroup) startDateGroup.style.display = 'none';
    if (endDateGroup) endDateGroup.style.display = 'none';
    
    // Show version and type fields
    document.getElementById('versionGroup').style.display = 'block';
    document.getElementById('typeGroup').style.display = 'block';
    
    document.getElementById('editModal').classList.add('active');
}

function deleteUpdateInstruction(versionIndex, instIndex) {
    if (confirm('Are you sure you want to delete this update instruction?')) {
        jsonData.updateInstructions[versionIndex].instruction.splice(instIndex, 1);
        
        // If no more instructions for this version, remove the version entry
        if (jsonData.updateInstructions[versionIndex].instruction.length === 0) {
            jsonData.updateInstructions.splice(versionIndex, 1);
        }
        
        renderUpdateInstructions();
        showNotification('Update instruction deleted successfully!');
    }
}
