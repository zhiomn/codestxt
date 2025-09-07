import { buildApiUrl } from './helpers.js';

export function generateFile(event) {
    event.preventDefault();
    const apiUrl = buildApiUrl('download');
    if (apiUrl) {
        window.open(apiUrl, '_blank');
    }
}
