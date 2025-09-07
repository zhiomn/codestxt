import { getPresets, savePreset, deletePreset, loadPreset, getSelectedPaths } from './storage.js';

const dropdown = document.getElementById('presets-dropdown');
const nameInput = document.getElementById('preset-name');
const saveButton = document.getElementById('save-preset');
const deleteButton = document.getElementById('delete-preset');

function populateDropdown() {
    const presets = getPresets();
    dropdown.innerHTML = '<option value="">Carregar preset...</option>';
    for (const name in presets) {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        dropdown.add(option);
    }
}

function handleSave() {
    const name = nameInput.value.trim();
    if (!name) { alert('Por favor, insira um nome para o preset.'); return; }
    const selectedPaths = getSelectedPaths();
    if (selectedPaths.length === 0) { alert('Selecione ao menos um arquivo ou pasta para salvar.'); return; }
    savePreset(name, selectedPaths);
    populateDropdown();
    nameInput.value = '';
    dropdown.value = name;
    alert(`Preset "${name}" salvo com sucesso!`);
}

function handleLoad() {
    const name = dropdown.value;
    if (name) {
        loadPreset(name);
    }
}

function handleDelete() {
    const name = dropdown.value;
    if (!name) { alert('Selecione um preset para deletar.'); return; }
    if (confirm(`Tem certeza que deseja deletar o preset "${name}"?`)) {
        deletePreset(name);
        populateDropdown();
        alert(`Preset "${name}" deletado.`);
    }
}

export function initPresets() {
    saveButton.addEventListener('click', handleSave);
    deleteButton.addEventListener('click', handleDelete);
    dropdown.addEventListener('change', handleLoad);
    populateDropdown();
}
