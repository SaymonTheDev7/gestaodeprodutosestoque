// Espera o carregamento completo do DOM para executar as ações
document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos(); // Carrega os produtos do localStorage ao inicializar

    // Adiciona um evento de clique no botão de adicionar produto
    document.getElementById('add-product-btn').addEventListener('click', () => {
        // Exibe o modal de adição de produto com animação
        document.getElementById('add-modal').classList.remove('hidden');
        document.getElementById('add-modal').classList.add('animate-fade-in');
    });
});

// Variável para armazenar o produto que será removido
let produtoParaRemover = null;

// Função para adicionar um novo produto na tabela
function adicionarProduto(curso, material, quantidade, produto, salvar = true) {
    const tabela = document.getElementById('tabela-produtos');

    // Cria uma nova linha na tabela com as informações do produto
    const novaLinha = document.createElement('tr');
    novaLinha.classList.add('transition-all', 'duration-500', 'hover:bg-blue-200', 'transform', 'scale-100', 'animate-fade-in');

    novaLinha.innerHTML = `
        <td class="px-4 py-3 text-center">${curso}</td>
        <td class="px-4 py-3 text-center">${material}</td>
        <td class="px-4 py-3 text-center">${quantidade}</td>
        <td class="px-4 py-3 text-center">
            <input type="checkbox" class="conferido w-5 h-5 cursor-pointer">
        </td>
        <td class="px-4 py-3 text-center">${produto}</td>
        <td class="px-4 py-3 text-center">
            <button class="repor-btn bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 transition">Repor</button>
        </td>
        <td class="px-4 py-3 text-center">
            <input type="number" class="quant-reposicao border rounded-md p-1 bg-gray-100" value="1" min="1">
        </td>
        <td class="px-4 py-3 text-center">
            <button class="remover-btn bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700 transition">Remover</button>
        </td>
    `;

    // Adiciona a nova linha à tabela
    tabela.appendChild(novaLinha);

    // Evento para repor a quantidade do produto
    novaLinha.querySelector('.repor-btn').addEventListener('click', function () {
        const quantidadeReposicao = novaLinha.querySelector('.quant-reposicao').value;
        exibirNotificacao(`🔄 Reposição de ${quantidadeReposicao} itens para o produto "${produto}" solicitada.`, "info");
    });

    // Evento para remover o produto da tabela
    novaLinha.querySelector('.remover-btn').addEventListener('click', function () {
        // Armazena o produto a ser removido
        produtoParaRemover = { linha: novaLinha, nome: produto };
        document.getElementById('confirm-text').innerText = `Deseja realmente remover o produto "${produto}"?`;
        // Exibe o modal de confirmação
        document.getElementById('confirm-modal').classList.remove('hidden');
    });

    // Se a variável 'salvar' for true, salva o produto no localStorage
    if (salvar) {
        salvarProdutoLocalStorage({ curso, material, quantidade, produto });
    }
}

// Evento de confirmação para remover o produto
document.getElementById('confirm-remove-btn').addEventListener('click', function () {
    if (produtoParaRemover) {
        // Adiciona animação de saída antes de remover o produto da tabela
        produtoParaRemover.linha.classList.add('animate-fade-out');
        setTimeout(() => {
            // Remove o produto da tabela e do localStorage
            produtoParaRemover.linha.remove();
            removerProdutoLocalStorage(produtoParaRemover.nome);
            exibirNotificacao(`❌ Produto "${produtoParaRemover.nome}" removido com sucesso.`, "error");
            produtoParaRemover = null;
        }, 400);
        // Fecha o modal de confirmação
        fecharConfirmModal();
    }
});

// Função que salva o novo produto após ser adicionado
function salvarProduto() {
    const curso = document.getElementById('curso').value;
    const material = document.getElementById('material').value;
    const quantidade = document.getElementById('quantidade').value;
    const produto = document.getElementById('produto').value;

    // Verifica se todos os campos foram preenchidos antes de salvar o produto
    if (curso && material && quantidade && produto) {
        adicionarProduto(curso, material, quantidade, produto);
        fecharAddModal();
        exibirNotificacao(`✅ Produto "${produto}" adicionado com sucesso!`, "success");
        limparCampos();
    } else {
        exibirNotificacao("⚠️ Por favor, preencha todos os campos.", "error");
    }
}

// Função para limpar os campos do modal após adicionar um produto
function limparCampos() {
    document.getElementById('curso').value = '';
    document.getElementById('material').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('produto').value = '';
}

// Função para fechar o modal de adição de produto
function fecharAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
}

// Função para fechar o modal de confirmação de remoção
function fecharConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
}

// Função para exibir uma notificação (toast) no topo direito da tela
function exibirNotificacao(mensagem, tipo) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    // Definição das cores para os diferentes tipos de notificação
    const cores = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-teal-600"
    };

    // Cria e estiliza o toast
    toast.className = `${cores[tipo] || "bg-gray-600"} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in`;
    toast.innerHTML = `<span>${mensagem}</span>`;

    container.appendChild(toast);

    // Remove o toast após 6 segundos
    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 6000);
}

// Função para salvar um produto no localStorage
function salvarProdutoLocalStorage(produto) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para remover um produto do localStorage
function removerProdutoLocalStorage(produto) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(p => p.produto !== produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

// Função para carregar os produtos salvos no localStorage ao iniciar a página
function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.forEach(produto => {
        // Adiciona cada produto salvo na tabela
        adicionarProduto(produto.curso, produto.material, produto.quantidade, produto.produto, false);
    });
}
