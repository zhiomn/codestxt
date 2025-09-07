// codes.cjs - v8.2 - Correção de ENOTDIR

const http = require('http');
const fs = require('fs');
const path = require('path');

// --- CONFIGURAÇÃO ---
const PORT = 3000;
const ROOT_DIR = process.cwd();
const IGNORE_DIRS_ALWAYS = ['node_modules', 'backups', '.git', 'dist', 'public', "docs_site","public_docs"]; 
const IGNORE_FILES = ['package-lock.json'];
const IGNORE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.ico', '.svg', '.pdf', '.env'];
const ROOT_GROUP_NAME = '(Raiz do Projeto)';

// --- LÓGICA DE SERVIÇO ---
function getDirectoryTree(dir = ROOT_DIR) {
    let results = [];
    const list = fs.readdirSync(dir, { withFileTypes: true });
    for (const dirent of list) {
        if (IGNORE_DIRS_ALWAYS.includes(dirent.name) || dirent.name.startsWith('.')) continue;
        const fullPath = path.join(dir, dirent.name);
        const relativePath = path.relative(ROOT_DIR, fullPath);
        if (dirent.isDirectory()) {
            results.push({ name: dirent.name, path: relativePath, type: 'directory', children: getDirectoryTree(fullPath) });
        } else {
            const ext = path.extname(dirent.name).toLowerCase();
            if (!IGNORE_FILES.includes(dirent.name) && !IGNORE_EXTENSIONS.includes(ext)) {
                results.push({ name: dirent.name, path: relativePath, type: 'file' });
            }
        }
    }
    return results;
}
function getSelectedFiles(selectedPaths) { const fileList = new Set(); const uniquePaths = [...new Set(selectedPaths)]; for (const itemPath of uniquePaths) { const fullPath = path.join(ROOT_DIR, itemPath); try { if (!fs.existsSync(fullPath)) continue; const stat = fs.statSync(fullPath); if (stat.isDirectory()) { findFilesRecursive(fullPath, fileList); } else if (stat.isFile()) { fileList.add(fullPath); } } catch (e) {} } return [...fileList]; }
function findFilesRecursive(dir, fileList) { try { const items = fs.readdirSync(dir); for (const item of items) { const fullPath = path.join(dir, item); if (IGNORE_DIRS_ALWAYS.includes(item) || item.startsWith('.')) continue; try { const stat = fs.statSync(fullPath); if (stat.isDirectory()) { findFilesRecursive(fullPath, fileList); } else { const ext = path.extname(item).toLowerCase(); if (!IGNORE_FILES.includes(item) && !IGNORE_EXTENSIONS.includes(ext)) { fileList.add(fullPath); } } } catch (e) {} } } catch (e) {} }
function getProjectStructure(dir, prefix = '') { let structure = ''; const items = fs.readdirSync(dir).filter(item => !['node_modules', '.git', 'dist', 'public'].includes(item) && !item.startsWith('.')); items.forEach((item, index) => { const fullPath = path.join(dir, item); const isLast = index === items.length - 1; const connector = isLast ? '└── ' : '├── '; try { const stats = fs.statSync(fullPath); if (stats.isDirectory()) { structure += prefix + connector + item + '\n'; structure += getProjectStructure(fullPath, prefix + (isLast ? '    ' : '│   ')); } else { const content = fs.readFileSync(fullPath, 'utf-8'); const lineCount = content.split('\n').length; structure += prefix + connector + item + ` (${lineCount} lines)\n`; } } catch (e) {} }); return structure; }

// --- LÓGICA DE UI (HTML) ---

function buildTreeHtml(tree) { let html = '<ul class="tree-view">'; for (const node of tree) { const isDirectory = node.type === 'directory'; const hasChildren = isDirectory && node.children && node.children.length > 0; const icon = isDirectory ? '📁' : '📄'; html += `<li class="${isDirectory ? 'directory-node' : 'file-node'}" data-name="${node.name.toLowerCase()}">`; html += `<span class="tree-node-toggle">${(isDirectory && hasChildren) ? '▶' : ''}</span>`; html += `<input type="checkbox" id="path-${node.path}" name="path" value="${node.path}">`; html += `<label for="path-${node.path}">${icon} ${node.name}</label>`; if (hasChildren) { html += buildTreeHtml(node.children); } html += `</li>`; } html += '</ul>'; return html; }
function buildHtmlPage(directoryTree) { const treeHtml = buildTreeHtml(directoryTree); return `
        <!DOCTYPE html><html lang="pt-br"><head><meta charset="UTF-8"><title>Agregador de Código Cirúrgico v8</title><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&display=swap" rel="stylesheet"><link rel="stylesheet" href="/css/style.css"></head>
        <body><div class="container">
            <header class="main-header"><h1>🔬 Agregador de Código Cirúrgico</h1><p>Selecione, filtre e exporte artefatos de código com precisão.</p></header>
            <section class="quick-actions"><button id="download-all" class="button button-quick">Baixar Tudo</button><button id="copy-structure" class="button button-quick button-secondary">Copiar Estrutura</button></section>
            <section class="options-box"><h3>1. Ferramentas de Seleção</h3><div class="tool-grid search-grid"><div class="search-wrapper tool-item-full"><span class="search-icon">🔎</span><input type="search" id="search-box" placeholder="Filtrar por nome..."></div><button id="select-all" class="button button-extra-small">Selecionar Tudo</button><button id="expand-all" class="button button-extra-small">Expandir Tudo</button><button id="collapse-all" class="button button-extra-small">Recolher Tudo</button><button id="clear-selection" class="button button-extra-small button-danger">Limpar Seleção</button></div></section>
            <section class="options-box"><h3>2. Artefatos do Projeto</h3><div class="folder-selection">${treeHtml}</div></section>
            <section class="options-box"><h3>3. Presets</h3><div class="tool-grid preset-grid"><select id="presets-dropdown" class="tool-item-full"><option value="">Carregar preset...</option></select><input type="text" id="preset-name" placeholder="Nome do novo preset"><button id="save-preset" class="button button-secondary">Salvar</button><button id="delete-preset" class="button button-danger">Deletar</button></div></section>
            <section class="options-box"><h3>4. Opções</h3><div id="feedback-area">Calculando...</div><div class="checkbox-item"><input type="checkbox" id="includeStructure" name="includeStructure" checked><label for="includeStructure">Incluir estrutura do projeto no início</label></div></section>
            <div class="main-actions"><a href="#" id="generateBtn" class="button" onclick="generateFile(event)">🚀 Gerar & Baixar Seleção</a><button id="copyBtn" class="button button-secondary" onclick="copyContent(event)">📋 Copiar Seleção</button></div>
        </div><script type="module" src="/js/main.js"></script></body></html>`;
}

// --- LÓGICA DE GERAÇÃO DE TXT APRIMORADA ---
function generateEnhancedTxt(selectedPaths) { const allFiles = getSelectedFiles(selectedPaths); let totalLineCount = 0; const folderStats = new Map(); for (const file of allFiles) { const relativePath = path.relative(ROOT_DIR, file); const topLevelDir = relativePath.includes(path.sep) ? relativePath.split(path.sep)[0] : ROOT_GROUP_NAME; if (!folderStats.has(topLevelDir)) { folderStats.set(topLevelDir, { files: [], lineCount: 0 }); } const content = fs.readFileSync(file, 'utf-8'); const lineCount = content.split('\n').length; folderStats.get(topLevelDir).files.push({ path: relativePath, content, lineCount }); folderStats.get(topLevelDir).lineCount += lineCount; totalLineCount += lineCount; } const now = new Date(); const sortedFolders = new Map([...folderStats.entries()].sort((a, b) => a[0].localeCompare(b[0]))); if (sortedFolders.has(ROOT_GROUP_NAME)) { const root = sortedFolders.get(ROOT_GROUP_NAME); sortedFolders.delete(ROOT_GROUP_NAME); sortedFolders.set(ROOT_GROUP_NAME, root); } let output = ''; const pad = (str, len) => str.padEnd(len); const padStart = (str, len) => String(str).padStart(len); output += `╔${'═'.repeat(78)}╗\n║ ${pad(`PROJETO: ${path.basename(ROOT_DIR)}`, 76)} ║\n║ ${pad(`DATA DE EXPORTAÇÃO: ${now.toISOString()}`, 76)} ║\n╠${'═'.repeat(78)}╣\n║ ${pad(`TOTAL DE ARQUIVOS: ${allFiles.length}`, 36)} ${pad(`TOTAL DE LINHAS: ${totalLineCount}`, 39)} ║\n╚${'═'.repeat(78)}╝\n\n`; output += `Tabela de Conteúdos\n${'─'.repeat(79)}\n`; for (const [folder, stats] of sortedFolders) { output += `  ● ${pad(folder, 40)} | ${padStart(stats.files.length, 3)} arquivos | ${padStart(stats.lineCount, 6)} linhas\n`; } output += `${'─'.repeat(79)}\n\n\n`; for (const [folder, stats] of sortedFolders) { output += `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  INÍCIO DA SEÇÃO: ${folder}  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n\n`; output += `  ┌─ Resumo da Seção ─${'─'.repeat(59)}┐\n  │ Path: ${pad(folder, 69)}│\n  │ Arquivos: ${pad(String(stats.files.length), 65)}│\n  │ Linhas de Código: ${pad(String(stats.lineCount), 59)}│\n  └─${'─'.repeat(75)}┘\n\n`; for (const file of stats.files) { output += `// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //\n`; output += `//  ARQUIVO: ${file.path} (${file.lineCount} linhas)\n`; output += `// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - //\n\n`; output += file.content.trim() + '\n\n'; } output += `▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓   FIM DA SEÇÃO: ${folder}    ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓\n\n\n`; } output += `\n${'='.repeat(80)}\nFIM DA EXPORTAÇÃO\n${'='.repeat(80)}\n`; return output; }

// --- SERVIDOR PRINCIPAL ---
const server = http.createServer((req, res) => { const requestUrl = new URL(req.url, `http://${req.headers.host}`); const pathname = requestUrl.pathname; if (pathname.startsWith('/css/') || pathname.startsWith('/js/')) { const assetPath = path.join(__dirname, 'codestxt', pathname); const contentType = pathname.endsWith('.css') ? 'text/css' : 'application/javascript'; fs.readFile(assetPath, (err, data) => { if (err) { res.writeHead(404); res.end("Asset Not Found"); return; } res.writeHead(200, { 'Content-Type': contentType }); res.end(data); }); return; } if (pathname === '/api/stats') { const paths = requestUrl.searchParams.get('paths')?.split(',') || []; const files = getSelectedFiles(paths); res.writeHead(200, { 'Content-Type': 'application/json' }); res.end(JSON.stringify({ fileCount: files.length })); return; }
    if (pathname === '/api/structure') {
        // ** A CORREÇÃO **
        const allPossiblePaths = getDirectoryTree().map(n => n.path);
        const selectedPaths = requestUrl.searchParams.get('paths')?.split(',') || allPossiblePaths;
        const topLevelItems = [...new Set(selectedPaths.map(p => p.split(path.sep)[0]))];
        
        let structure = `PROJECT PATH: ${ROOT_DIR}\n\nPROJECT STRUCTURE (Based on Selection):\n\n`;
        topLevelItems.forEach((item, index) => {
            const isLast = index === topLevelItems.length - 1;
            const connector = isLast ? '└── ' : '├── ';
            try {
                if (fs.existsSync(item)) {
                    const stats = fs.statSync(item);
                    if (stats.isDirectory()) {
                        structure += connector + item + '\n';
                        structure += getProjectStructure(item, (isLast ? '    ' : '│   '));
                    } else if (stats.isFile()) {
                         const content = fs.readFileSync(item, 'utf-8');
                         const lineCount = content.split('\n').length;
                         structure += connector + item + ` (${lineCount} lines)\n`;
                    }
                }
            } catch (e) { /* Ignora erros de stat */ }
        });
        res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(structure);
        return;
    }
    if (pathname === '/api/generate') { try { const selectedPaths = requestUrl.searchParams.get('paths')?.split(',') || []; if (selectedPaths.length === 0) { throw new Error("Nenhum caminho foi selecionado."); } const output = generateEnhancedTxt(selectedPaths); if(requestUrl.searchParams.get('output') === 'clipboard') { res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end(output); } else { const now = new Date(); const rootFolderName = path.basename(ROOT_DIR); const dateStamp = now.toISOString().split('T')[0]; const timeStamp = now.toTimeString().split(' ')[0].replace(/:/g, '-'); const dynamicFilename = `${rootFolderName}__${dateStamp}__${timeStamp}.txt`; res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8', 'Content-Disposition': `attachment; filename="${dynamicFilename}"` }); res.end(output); } } catch (error) { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end(`Erro ao gerar o arquivo: ${error.message}\n${error.stack}`); } return; } try { const directoryTree = getDirectoryTree(); const htmlPage = buildHtmlPage(directoryTree); res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(htmlPage); } catch (error) { res.writeHead(500, { 'Content-Type': 'text/plain' }); res.end(`Erro ao carregar a página: ${error.message}\n${error.stack}`); } });
server.listen(PORT, () => { console.log(`✅ Servidor do Agregador Cirúrgico v8.2 rodando!`); console.log(`   Acesse http://localhost:${PORT} no seu navegador.`); console.log(`   Pressione Ctrl+C para parar o servidor.`); });
