import { updateFileCount } from './feedback.js';
const SELECTION_KEY = 'codeAggregatorSelection';
const PRESETS_KEY = 'codeAggregatorPresets';

export function getSelectedPaths() { return Array.from(document.querySelectorAll('input[name="path"]:checked')).map(cb => cb.value); }
export function saveCurrentSelection() { localStorage.setItem(SELECTION_KEY, JSON.stringify(getSelectedPaths())); }

export function applySelection(paths) {
    document.querySelectorAll('input[name="path"]').forEach(cb => cb.checked = false);
    if (paths && paths.length > 0) {
        paths.forEach(path => {
            const checkbox = document.querySelector(`input[value="${path}"]`);
            if (checkbox) checkbox.checked = true;
        });
    }
}

export function applyLastSelection() {
    const savedPaths = JSON.parse(localStorage.getItem(SELECTION_KEY) || '[]');
    applySelection(savedPaths);
}

export function selectAll() {
    document.querySelectorAll('input[name="path"]').forEach(cb => cb.checked = true);
    saveCurrentSelection();
}

export function clearSelectionAndStorage() {
    applySelection([]);
    saveCurrentSelection();
}

// Presets
export function getPresets() { return JSON.parse(localStorage.getItem(PRESETS_KEY) || '{}'); }
export function savePreset(name, paths) { const presets = getPresets(); presets[name] = paths; localStorage.setItem(PRESETS_KEY, JSON.stringify(presets)); }
export function deletePreset(name) { const presets = getPresets(); delete presets[name]; localStorage.setItem(PRESETS_KEY, JSON.stringify(presets)); }
export function loadPreset(name) { const presets = getPresets(); if (presets[name]) { applySelection(presets[name]); saveCurrentSelection(); updateFileCount(); } }
