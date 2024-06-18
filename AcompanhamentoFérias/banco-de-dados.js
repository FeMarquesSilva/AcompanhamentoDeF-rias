// Atualizar a tabela com os dados armazenados localmente
function atualizarTabela() {
    const tbody = document.querySelector('#tabelaFuncionarios tbody');
    tbody.innerHTML = '';

    // Recuperar os dados dos funcionários armazenados localmente
    let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];

    // Iterar sobre os funcionários e adicionar linhas na tabela
    funcionarios.forEach((funcionario, index) => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${funcionario.matricula}</td>
            <td>${funcionario.nomeCompleto}</td>
            <td>${funcionario.primeiroNome}</td>
            <td>${funcionario.dataAquisicaoFerias}</td>
            <td>${funcionario.dataInicioFerias}</td>
            <td>${funcionario.dataRetornoFerias}</td>
            <td>
                <button class="edit" onclick="editarFuncionario(${index})">Editar</button>
                <button class="delete" onclick="excluirFuncionario(${index})">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Função para excluir um funcionário da tabela e dos dados armazenados
function excluirFuncionario(index) {
    // Recuperar os funcionários armazenados localmente
    let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    
    // Remover o funcionário da lista
    funcionarios.splice(index, 1);

    // Atualizar os dados armazenados localmente
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

    // Atualizar a tabela
    atualizarTabela();
}

// Verificar se estamos na página de banco de dados para atualizar a tabela
if (document.querySelector('#tabelaFuncionarios')) {
    atualizarTabela();
}
