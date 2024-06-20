// Função para buscar e atualizar a tabela com os dados do Supabase
async function atualizarTabela() {
    const { data, error } = await supabaseClient
        .from('funcionarios')
        .select('*');

    if (error) {
        console.error('Erro ao buscar funcionários:', error.message);
        return;
    }

    const tbody = document.querySelector('#tabelaFuncionarios tbody');
    tbody.innerHTML = '';

    // Iterar sobre os funcionários retornados e adicionar linhas na tabela
    data.forEach(funcionario => {
        const tr = document.createElement('tr');

        tr.innerHTML = `
            <td>${funcionario.matricula}</td>
            <td>${funcionario.nomeCompleto}</td>
            <td>${funcionario.nomePrimeiro}</td>
            <td>${funcionario.departamento}</td>
            <td>${funcionario.setor}</td>
            <td>${funcionario.dataAquisicao}</td>
            <td>${funcionario.dataIniFerias}</td>
            <td>${funcionario.dataFimFerias}</td>
            <td>
                <button class="edit" onclick="editarFuncionario('${funcionario.id}')">Editar</button>
                <button class="delete" onclick="excluirFuncionario('${funcionario.id}')">Excluir</button>
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Chamar a função para atualizar a tabela quando a página carregar
window.onload = async function () {
    await atualizarTabela();
};

// Função para excluir um funcionário do Supabase
async function excluirFuncionario(id) {
    const { error } = await supabaseClient
        .from('funcionarios')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Erro ao excluir funcionário:', error.message);
        return;
    }

    // Atualizar a tabela após a exclusão
    await atualizarTabela();
}

// Função para editar um funcionário
async function editarFuncionario(id) {
    // Buscar o funcionário pelo ID
    const { data, error } = await supabaseClient
        .from('funcionarios')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error('Erro ao buscar funcionário para edição:', error.message);
        return;
    }

    // Preencher o formulário de edição com os dados do funcionário
    const funcionario = data;
    document.getElementById('editIndex').value = id;
    document.getElementById('editMatricula').value = funcionario.matricula;
    document.getElementById('editNomeCompleto').value = funcionario.nomeCompleto;
    document.getElementById('editPrimeiroNome').value = funcionario.nomePrimeiro;
    document.getElementById('editDepartamento').value = funcionario.departamento;
    document.getElementById('editSetor').value = funcionario.setor;
    document.getElementById('editDataAquisicaoFerias').value = funcionario.dataAquisicao;
    document.getElementById('editDataInicioFerias').value = funcionario.dataIniFerias;
    document.getElementById('editDataRetornoFerias').value = funcionario.dataFimFerias;

    // Exibir o formulário de edição
    document.getElementById('formEdicao').style.display = 'block';
}

// Função para salvar as edições feitas no funcionário
async function salvarEdicao() {
    const id = document.getElementById('editIndex').value;
    const matricula = document.getElementById('editMatricula').value;
    const nomeCompleto = document.getElementById('editNomeCompleto').value;
    const nomePrimeiro = document.getElementById('editPrimeiroNome').value;
    const departamento = document.getElementById('editDepartamento').value;
    const setor = document.getElementById('editSetor').value;
    const dataAquisicao = document.getElementById('editDataAquisicaoFerias').value;
    const dataIniFerias = document.getElementById('editDataInicioFerias').value;
    const dataFimFerias = document.getElementById('editDataRetornoFerias').value;

    const { error } = await supabaseClient
        .from('funcionarios')
        .update({
            matricula,
            nomeCompleto,
            nomePrimeiro,
            departamento,
            setor,
            dataAquisicao,
            dataIniFerias,
            dataFimFerias
        })
        .eq('id', id);

    if (error) {
        console.error('Erro ao atualizar funcionário:', error.message);
        return;
    }

    // Ocultar o formulário de edição
    document.getElementById('formEdicao').style.display = 'none';

    // Atualizar a tabela após a edição
    await atualizarTabela();
}

// Função para cancelar a edição
function cancelarEdicao() {
    document.getElementById('formEdicao').style.display = 'none';
}