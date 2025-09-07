// Mantido da v3.0, mas agora usa getSelectedPaths de storage.js implicitamente.
// A função em si é chamada por outros módulos.

import { getSelectedPaths } from './storage.js';

export function buildApiUrl(outputType) {
    const includeStructure = document.getElementById('includeStructure').checked;
    const selectedPaths = getSelectedPaths();
    if (selectedPaths.length === 0) {
        alert('Por favor, selecione pelo menos um arquivo ou pasta.');
        return null;
    }
    const params = new URLSearchParams({
        structure: includeStructure,
        paths: selectedPaths.join(','),
        output: outputType
    });
    return `/api/generate?${params.toString()}`;
}
