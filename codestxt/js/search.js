export function initSearch() {
    const searchBox = document.getElementById('search-box');
    searchBox.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const allNodes = document.querySelectorAll('.tree-view li');

        allNodes.forEach(node => {
            const nodeName = node.dataset.name || '';
            const isMatch = nodeName.includes(searchTerm);
            node.classList.toggle('is-hidden', !isMatch);
        });

        // Reveal parents of matched nodes
        if (searchTerm) {
            allNodes.forEach(node => {
                if (!node.classList.contains('is-hidden')) {
                    let parent = node.parentElement.closest('li.directory-node');
                    while (parent) {
                        parent.classList.remove('is-hidden');
                        parent = parent.parentElement.closest('li.directory-node');
                    }
                }
            });
        }
    });
}
