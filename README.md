# 🔬 Agregador de Código Cirúrgico

O Agregador de Código Cirúrgico é uma ferramenta de linha de comando baseada em Node.js, projetada para escanear a estrutura de um projeto, permitir a seleção granular de arquivos e pastas através de uma interface web, e exportar o conteúdo concatenado em um único arquivo de texto (`.txt`) de alta legibilidade.

Ele foi criado para acelerar o processo de criação de "contexto" para interações com modelos de linguagem de grande porte (LLMs), mantendo a filosofia de eficiência, precisão e um fluxo de trabalho refinado.

---

## Como Usar

A ferramenta é um script único e não possui dependências externas, necessitando apenas do Node.js para ser executada.

1.  **Salvar o Script:** Salve o arquivo `codes.cjs` na pasta raiz do projeto que você deseja analisar.
2.  **Executar o Servidor:** Abra um terminal na pasta raiz do seu projeto e execute o comando:
    ```sh
    node codes.cjs
    ```
3.  **Acessar a Interface:** Abra seu navegador de internet e acesse o seguinte endereço:
    ```
    http://localhost:3000
    ```
4.  **Utilizar e Exportar:** Use a interface web para selecionar os arquivos e exportar o conteúdo. Para parar o servidor, volte ao terminal e pressione `Ctrl+C`.

---

## Funcionalidades Principais

A ferramenta evoluiu através de um processo iterativo para incluir um conjunto robusto de funcionalidades focadas na produtividade:

### Interface Web Intuitiva
-   **Visualização em Árvore:** Apresenta a estrutura do projeto em uma árvore de diretórios expansível, permitindo a seleção granular de pastas inteiras ou arquivos individuais.
-   **Tema Adaptativo:** A interface se adapta automaticamente ao tema claro ou escuro do seu sistema operacional.

### Ferramentas de Produtividade
-   **Busca e Filtragem:** Um campo de busca filtra a árvore de arquivos em tempo real, facilitando a localização de artefatos específicos em projetos grandes.
-   **Controles em Massa:** Botões para "Selecionar Tudo", "Expandir Tudo", "Recolher Tudo" e "Limpar Seleção" agilizam a manipulação da árvore de arquivos.
-   **Feedback em Tempo Real:** Um contador atualiza dinamicamente para mostrar quantos arquivos serão incluídos na exportação com base na sua seleção atual.

### Persistência e Fluxo de Trabalho
-   **Memória de Seleção:** A seleção de arquivos é salva automaticamente no `localStorage` do navegador, persistindo entre as sessões.
-   **Presets:** Permite salvar uma seleção complexa como um "preset" nomeado, que pode ser rapidamente carregado ou deletado, otimizando fluxos de trabalho recorrentes.
-   **Atalhos Rápidos:** Um menu de acesso rápido permite "Baixar Tudo" ou "Copiar Estrutura do Projeto" com um único clique.

### Exportação de Alta Qualidade
-   **Dois Modos de Exportação:** Gere um arquivo `.txt` para download ou copie o conteúdo diretamente para a área de transferência.
-   **Formato Legível:** O arquivo `.txt` gerado não é um simples "dump" de texto. Ele é um relatório estruturado que inclui:
    -   Um **cabeçalho** com metadados do projeto e estatísticas gerais.
    -   Uma **tabela de conteúdos** para navegação rápida.
    -   **Divisórias visuais** claras entre cada pasta, com seus próprios resumos de contagem de arquivos e linhas.
