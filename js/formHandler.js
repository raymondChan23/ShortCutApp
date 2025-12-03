// Form handler for edit modal submissions

function handleFormSubmit(event) {
    event.preventDefault();
    
    const code = document.getElementById('editCode').value;
    const titleEn = document.getElementById('editTitleEn').value;
    const titleZh = document.getElementById('editTitleZh').value;
    const iconEn = document.getElementById('editIconEn').value;
    const iconZh = document.getElementById('editIconZh').value;
    const urlEn = document.getElementById('editUrlEn').value;
    const urlZh = document.getElementById('editUrlZh').value;
    
    const searchLabelsInput = document.getElementById('editSearchLabels').value;
    const searchLabels = searchLabelsInput ? searchLabelsInput.split(',').map(s => s.trim()).filter(s => s) : [];
    
    const platforms = [];
    if (document.getElementById('platformARD').checked) platforms.push('ARD');
    if (document.getElementById('platformIOS').checked) platforms.push('IOS');
    if (document.getElementById('platformHWI').checked) platforms.push('HWI');
    
    const showOnAllPlatforms = document.getElementById('editShowOnAllPlatforms').checked;
    
    if (currentTab === 'actions') {
        const tagCode = document.getElementById('editTagCode').value.trim();
        const maybeTag = tagCode ? { tag: { code: tagCode } } : {};
        if (currentEditIndex === -1) {
            jsonData.actions.push(Object.assign({
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                urlEn,
                urlZh,
                platforms,
                showOnAllPlatforms,
                searchLabels
            }, maybeTag));
            showNotification('Action added successfully!');
        } else {
            const updated = {
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                urlEn,
                urlZh,
                platforms,
                showOnAllPlatforms,
                searchLabels
            };
            if (tagCode) {
                updated.tag = { code: tagCode };
            } else {
                delete updated.tag; // ensure no tag when field empty
            }
            jsonData.actions[currentEditIndex] = updated;
            showNotification('Action updated successfully!');
        }
        renderActions();
    } else if (currentTab === 'categories') {
        if (currentEditIndex === -1) {
            jsonData.categories.push({
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                searchLabels
            });
            showNotification('Category added successfully!');
        } else {
            jsonData.categories[currentEditIndex] = {
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                searchLabels
            };
            showNotification('Category updated successfully!');
        }
        renderCategories();
    } else if (currentTab === 'discovers') {
        if (currentEditIndex === -1) {
            jsonData.discovers.push({
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                urlEn,
                urlZh
            });
            showNotification('Discover item added successfully!');
        } else {
            jsonData.discovers[currentEditIndex] = {
                code,
                titleEn,
                titleZh,
                iconEn,
                iconZh,
                urlEn,
                urlZh
            };
            showNotification('Discover item updated successfully!');
        }
        renderDiscovers();
    } else if (currentTab === 'recommends') {
        const startDate = document.getElementById('editStartDate').value;
        const endDate = document.getElementById('editEndDate').value;
        const urlEnAndroid = document.getElementById('editUrlEnAndroid').value;
        const urlZhAndroid = document.getElementById('editUrlZhAndroid').value;
        const urlEnHuawei = document.getElementById('editUrlEnHuawei').value;
        const urlZhHuawei = document.getElementById('editUrlZhHuawei').value;
        const urlEnIos = document.getElementById('editUrlEnIos').value;
        const urlZhIos = document.getElementById('editUrlZhIos').value;
        
        const recommendData = {
            code,
            titleEn,
            titleZh,
            platforms,
            urlEn: urlEn || null,
            urlZh: urlZh || null
        };
        
        // Add platform-specific URLs if provided
        if (urlEnAndroid) recommendData.urlEnAndroid = urlEnAndroid;
        if (urlZhAndroid) recommendData.urlZhAndroid = urlZhAndroid;
        if (urlEnHuawei) recommendData.urlEnHuawei = urlEnHuawei;
        if (urlZhHuawei) recommendData.urlZhHuawei = urlZhHuawei;
        if (urlEnIos) recommendData.urlEnIos = urlEnIos;
        if (urlZhIos) recommendData.urlZhIos = urlZhIos;
        
        // Add dates only if provided
        if (startDate) {
            recommendData.startDate = formatDateToISO(startDate);
        }
        if (endDate) {
            recommendData.endDate = formatDateToISO(endDate);
        }
        
        if (currentEditIndex === -1) {
            jsonData.recommends.push(recommendData);
            showNotification('Recommend item added successfully!');
        } else {
            jsonData.recommends[currentEditIndex] = recommendData;
            showNotification('Recommend item updated successfully!');
        }
        renderRecommends();
    } else if (currentTab === 'searchHints') {
        if (currentEditIndex === -1) {
            jsonData.searchHints.push({
                code,
                titleEn,
                titleZh,
                platforms
            });
            showNotification('Search hint added successfully!');
        } else {
            jsonData.searchHints[currentEditIndex] = {
                code,
                titleEn,
                titleZh,
                platforms
            };
            showNotification('Search hint updated successfully!');
        }
        renderSearchHints();
    } else if (currentTab === 'defaultActions') {
        const isRemovable = document.getElementById('editIsRemovable').checked;
        if (currentEditIndex === -1) {
            jsonData.defaultActions.push({
                code,
                isRemovable
            });
            showNotification('Default action added successfully!');
        } else {
            jsonData.defaultActions[currentEditIndex] = {
                code,
                isRemovable
            };
            showNotification('Default action updated successfully!');
        }
        renderDefaultActions();
    } else if (currentTab === 'updateInstructions') {
        const version = parseInt(document.getElementById('editVersion').value);
        const type = document.getElementById('editType').value;
        
        // Find or create version object
        let versionObj = jsonData.updateInstructions.find(v => v.version === version);
        
        if (currentEditIndex === -1) {
            // Adding new instruction
            if (!versionObj) {
                versionObj = { version, instruction: [] };
                jsonData.updateInstructions.push(versionObj);
            }
            versionObj.instruction.push({ type, code });
            showNotification('Update instruction added successfully!');
        } else {
            // Editing existing instruction
            const instruction = jsonData.updateInstructions[currentEditIndex].instruction[currentInstructionIndex];
            instruction.type = type;
            instruction.code = code;
            
            // If version changed, move instruction to different version
            if (jsonData.updateInstructions[currentEditIndex].version !== version) {
                // Remove from old version
                jsonData.updateInstructions[currentEditIndex].instruction.splice(currentInstructionIndex, 1);
                if (jsonData.updateInstructions[currentEditIndex].instruction.length === 0) {
                    jsonData.updateInstructions.splice(currentEditIndex, 1);
                }
                
                // Add to new version
                if (!versionObj) {
                    versionObj = { version, instruction: [] };
                    jsonData.updateInstructions.push(versionObj);
                }
                versionObj.instruction.push({ type, code });
            }
            showNotification('Update instruction updated successfully!');
        }
        renderUpdateInstructions();
    } else if (currentTab === 'tags') {
        const textColorArgb = document.getElementById('editTextColorArgb').value;
        const bgColorArgb = document.getElementById('editBgColorArgb').value;
        
        if (currentEditIndex === -1) {
            jsonData.tags.push({
                code,
                textEn: titleEn,
                textZh: titleZh,
                textColorArgb,
                bgColorArgb
            });
            showNotification('Tag added successfully!');
        } else {
            jsonData.tags[currentEditIndex] = {
                code,
                textEn: titleEn,
                textZh: titleZh,
                textColorArgb,
                bgColorArgb
            };
            showNotification('Tag updated successfully!');
        }
        renderTags();
    } else if (currentTab === 'walletActions') {
        if (currentEditIndex === -1) {
            jsonData.walletActions.push({
                code
            });
            showNotification('Wallet action added successfully!');
        } else {
            jsonData.walletActions[currentEditIndex] = {
                code
            };
            showNotification('Wallet action updated successfully!');
        }
        renderWalletActions();
    }
    
    closeModal();
}
