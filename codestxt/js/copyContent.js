import { buildApiUrl } from './helpers.js';

export async function copyContent(event) {
    const button = event.target;
    const originalText = button.textContent;
    const apiUrl = buildApiUrl('clipboard');

    if (!apiUrl) return;

    button.classList.remove('is-success', 'is-error');
    button.classList.add('is-copying');
    button.textContent = 'Copiando...';
    button.disabled = true;

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`Erro do servidor: ${response.statusText}`);
        }
        const textContent = await response.text();
        await navigator.clipboard.writeText(textContent);

        button.classList.add('is-success');
        button.textContent = '✅ Copiado!';
    } catch (error) {
        console.error('Falha ao copiar:', error);
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
