// Função para formatar a data no formato DD/MM/AAAA - não utilizar
function formatarData(data) {
    const partes = data.split('-'); // Supondo que as datas vêm no formato "AAAA-MM-DD"
    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

// Função para formatar a matrícula no formato 00.000-0
function formatarMatricula(matricula) {
    const cleaned = matricula.replace(/\D/g, ''); // Remove todos os caracteres não numéricos
    return `${cleaned.slice(0, 2)}.${cleaned.slice(2, 5)}-${cleaned.slice(5, 6)}`;
}

// Evento de submissão do formulário de cadastro
document.getElementById('cadastroForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    // Obter os valores dos campos do formulário
    const matricula = formatarMatricula(document.getElementById('matricula').value);
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const nomePrimeiro = document.getElementById('primeiroNome').value;
    const departamento = document.getElementById('dept').value;
    const setor = document.getElementById('setor').value;
    const dataAquisicao = document.getElementById('dataAquisicaoFerias').value; // Formato original para o banco de dados
    const dataIniFerias = document.getElementById('dataInicioFerias').value; // Formato original para o banco de dados
    const dataFimFerias = document.getElementById('dataRetornoFerias').value; // Formato original para o banco de dados

    // Criar um objeto com os dados do funcionário
    const funcionario = {
        matricula,
        nomeCompleto,
        nomePrimeiro,
        departamento,
        setor,
        dataAquisicao,
        dataIniFerias,
        dataFimFerias
    };

    try {
        // Salvar os dados do funcionário no Supabase
        const { data, error } = await supabaseClient
            .from('funcionarios')
            .insert([
                {
                    matricula: matricula,
                    nomeCompleto: nomeCompleto,
                    nomePrimeiro: nomePrimeiro, // Corrigido para nomePrimeiro
                    departamento: departamento,
                    setor: setor,
                    dataAquisicao: dataAquisicao, // Corrigido para dataAquisicao
                    dataIniFerias: dataIniFerias, // Corrigido para dataIniFerias
                    dataFimFerias: dataFimFerias // Corrigido para dataFimFerias
                }
            ]);

        // Limpar o formulário após a submissão
        document.getElementById('cadastroForm').reset();

        if (error) {
            console.error(error);
            alert(`Erro ao salvar os dados do funcionário: ${error.message}`);
        } else {
            alert('Funcionário salvo com sucesso!');
        }
    } catch (err) {
        console.error(err);
        alert('Erro ao conectar com o Supabase.');
    }

});