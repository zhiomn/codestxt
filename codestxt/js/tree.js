import { updateFileCount } from './feedback.js';
import { saveCurrentSelection } from './storage.js';

function handleCheckboxChange(checkbox) {
    const isChecked = checkbox.checked;
    const listItem = checkbox.closest('li');
    const childCheckboxes = listItem.querySelectorAll('ul input[type="checkbox"]');
    childCheckboxes.forEach(child => child.checked = isChecked);
    updateFileCount();
    saveCurrentSelection();
}

function handleToggleClick(toggle) {
    const listItem = toggle.closest('li');
    if (listItem) {
        listItem.classList.toggle('is-expanded');
    }
}

export function initTreeView() {
    const treeContainer = document.querySelector('.folder-selection');
    treeContainer.addEventListener('change', (e) => e.target.type === 'checkbox' && handleCheckboxChange(e.target));
    treeContainer.addEventListener('click', (e) => {
        const toggle = e.target.closest('.tree-node-toggle');
        if (toggle) handleToggleClick(toggle);
    });
}

export function expandAll() {
    document.querySelectorAll('.directory-node').forEach(node => node.classList.add('is-expanded'));
}

export function collapseAll() {
    document.querySelectorAll('.directory-node').forEach(node => node.classList.remove('is-expanded'));
}
