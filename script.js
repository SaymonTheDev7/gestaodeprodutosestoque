document.addEventListener('DOMContentLoaded', () => {
    carregarProdutos();

    document.getElementById('add-product-btn').addEventListener('click', () => {
        document.getElementById('add-modal').classList.remove('hidden');
        document.getElementById('add-modal').classList.add('animate-fade-in');
    });
});

let produtoParaRemover = null;

function adicionarProduto(curso, material, quantidade, produto, salvar = true) {
    const tabela = document.getElementById('tabela-produtos');

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

    tabela.appendChild(novaLinha);

    novaLinha.querySelector('.repor-btn').addEventListener('click', function () {
        const quantidadeReposicao = novaLinha.querySelector('.quant-reposicao').value;
        exibirNotificacao(`🔄 Reposição de ${quantidadeReposicao} itens para o produto "${produto}" solicitada.`, "info");
    });

    novaLinha.querySelector('.remover-btn').addEventListener('click', function () {
        produtoParaRemover = { linha: novaLinha, nome: produto };
        document.getElementById('confirm-text').innerText = `Deseja realmente remover o produto "${produto}"?`;
        document.getElementById('confirm-modal').classList.remove('hidden');
    });

    if (salvar) {
        salvarProdutoLocalStorage({ curso, material, quantidade, produto });
    }
}

document.getElementById('confirm-remove-btn').addEventListener('click', function () {
    if (produtoParaRemover) {
        produtoParaRemover.linha.classList.add('animate-fade-out');
        setTimeout(() => {
            produtoParaRemover.linha.remove();
            removerProdutoLocalStorage(produtoParaRemover.nome);
            exibirNotificacao(`❌ Produto "${produtoParaRemover.nome}" removido com sucesso.`, "error");
            produtoParaRemover = null;
        }, 400);
        fecharConfirmModal();
    }
});

function salvarProduto() {
    const curso = document.getElementById('curso').value;
    const material = document.getElementById('material').value;
    const quantidade = document.getElementById('quantidade').value;
    const produto = document.getElementById('produto').value;

    if (curso && material && quantidade && produto) {
        adicionarProduto(curso, material, quantidade, produto);
        fecharAddModal();
        exibirNotificacao(`✅ Produto "${produto}" adicionado com sucesso!`, "success");
        limparCampos();
    } else {
        exibirNotificacao("⚠️ Por favor, preencha todos os campos.", "error");
    }
}

function limparCampos() {
    document.getElementById('curso').value = '';
    document.getElementById('material').value = '';
    document.getElementById('quantidade').value = '';
    document.getElementById('produto').value = '';
}

function fecharAddModal() {
    document.getElementById('add-modal').classList.add('hidden');
}

function fecharConfirmModal() {
    document.getElementById('confirm-modal').classList.add('hidden');
}

function exibirNotificacao(mensagem, tipo) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');

    const cores = {
        success: "bg-green-600",
        error: "bg-red-600",
        info: "bg-teal-600"
    };

    toast.className = `${cores[tipo] || "bg-gray-600"} text-white px-4 py-3 rounded-lg shadow-xl flex items-center gap-2 animate-fade-in`;
    toast.innerHTML = `<span>${mensagem}</span>`;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.add('opacity-0');
        setTimeout(() => toast.remove(), 500);
    }, 6000);
}

// LocalStorage
function salvarProdutoLocalStorage(produto) {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.push(produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function removerProdutoLocalStorage(produto) {
    let produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos = produtos.filter(p => p.produto !== produto);
    localStorage.setItem('produtos', JSON.stringify(produtos));
}

function carregarProdutos() {
    const produtos = JSON.parse(localStorage.getItem('produtos')) || [];
    produtos.forEach(produto => {
        adicionarProduto(produto.curso, produto.material, produto.quantidade, produto.produto, false);
    });
}
