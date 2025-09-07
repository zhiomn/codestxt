import { getSelectedPaths } from './storage.js';
let debounceTimer;
export function updateFileCount() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
        const selectedPaths = getSelectedPaths();
        const feedbackArea = document.getElementById('feedback-area');
        if (selectedPaths.length === 0) {
            feedbackArea.textContent = 'Nenhum artefato selecionado.';
            return;
        }
        try {
            const params = new URLSearchParams({ paths: selectedPaths.join(',') });
            const response = await fetch(`/api/stats?${params.toString()}`);
            if (!response.ok) throw new Error('Falha na resposta do servidor.');
            const data = await response.json();
            feedbackArea.textContent = `Seleção resultará em ${data.fileCount} arquivo(s).`;
        } catch (error) {
            feedbackArea.textContent = 'Erro ao calcular arquivos.';
            console.error('Feedback Error:', error);
        }
    }, 250);
}
