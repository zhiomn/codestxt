import { selectAll, getSelectedPaths } from './storage.js';
import { generateFile } from './generateFile.js';

/**
 * Atalho: Seleciona todos os arquivos e inicia o download.
 */
export function downloadAll() {
    selectAll();
    // Força um clique no botão de gerar para reutilizar a lógica
    document.getElementById('generateBtn')?.click();
}

/**
 * Atalho: Busca apenas a estrutura de diretórios e a copia para o clipboard.
 * @param {HTMLElement} button - O botão que acionou o evento.
 */
export async function copyStructure(button) {
    const originalText = button.textContent;
    let selectedPaths = getSelectedPaths();

    // Se nada estiver selecionado, assume que o usuário quer a estrutura completa
    if (selectedPaths.length === 0) {
        selectedPaths = Array.from(document.querySelectorAll('input[name="path"]')).map(cb => cb.value);
    }
    
    const params = new URLSearchParams({ paths: selectedPaths.join(',') });
    const apiUrl = `/api/structure?${params.toString()}`;

    button.classList.remove('is-success', 'is-error');
    button.classList.add('is-copying');
    button.textContent = 'Copiando Estrutura...';
    button.disabled = true;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Erro do servidor: ${response.statusText}`);
        
        const textContent = await response.text();
        await navigator.clipboard.writeText(textContent);
        
        button.classList.add('is-success');
        button.textContent = '✅ Estrutura Copiada!';
    } catch (error) {
        console.error('Falha ao copiar estrutura:', error);
        button.classList.add('is-error');
        button.textContent = '❌ Falhou!';
    } finally {
        button.classList.remove('is-copying');
        setTimeout(() => {
            button.classList.remove('is-success', 'is-error');
            button.textContent = originalText;
            button.disabled = false;
        }, 2500);
    }
}
