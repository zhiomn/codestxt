import { initTreeView, expandAll, collapseAll } from './tree.js';
import { updateFileCount } from './feedback.js';
import { generateFile } from './generateFile.js';
import { copyContent } from './copyContent.js';
import { applyLastSelection, clearSelectionAndStorage, selectAll } from './storage.js';
import { initSearch } from './search.js';
import { initPresets } from './presets.js';
import { downloadAll, copyStructure } from './shortcuts.js';

function initControls() {
    // Atalhos
    document.getElementById('download-all')?.addEventListener('click', downloadAll);
    document.getElementById('copy-structure')?.addEventListener('click', (e) => copyStructure(e.target));
    
    // Ferramentas de Seleção
    document.getElementById('expand-all')?.addEventListener('click', expandAll);
    document.getElementById('collapse-all')?.addEventListener('click', collapseAll);
    document.getElementById('select-all')?.addEventListener('click', () => {
        selectAll();
        updateFileCount();
    });
    document.getElementById('clear-selection')?.addEventListener('click', () => {
        clearSelectionAndStorage();
        updateFileCount();
    });
}

document.addEventListener('DOMContentLoaded', () => {
    initTreeView();
    initControls();
    initSearch();
    initPresets();
    applyLastSelection();
    updateFileCount();
});

window.generateFile = generateFile;
window.copyContent = copyContent;

console.log('Módulos de UI do Agregador Cirúrgico v8 carregados.');
