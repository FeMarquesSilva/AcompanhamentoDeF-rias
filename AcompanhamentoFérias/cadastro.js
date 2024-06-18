document.getElementById('cadastroForm').addEventListener('submit', function(event) {
    event.preventDefault();

    // Obter os valores dos campos do formulário
    const matricula = document.getElementById('matricula').value;
    const nomeCompleto = document.getElementById('nomeCompleto').value;
    const primeiroNome = document.getElementById('primeiroNome').value;
    const departamento = document.getElementById('dept').value;
    const setor = document.getElementById('setor').value;
    const dataAquisicaoFerias = document.getElementById('dataAquisicaoFerias').value;
    const dataInicioFerias = document.getElementById('dataInicioFerias').value;
    const dataRetornoFerias = document.getElementById('dataRetornoFerias').value;

    // Criar um objeto com os dados do funcionário
    const funcionario = {
        matricula,
        nomeCompleto,
        primeiroNome,
        dataAquisicaoFerias,
        dataInicioFerias,
        dataRetornoFerias,
        departamento,
        setor
    };

    // Armazenar os dados do funcionário no armazenamento local
    let funcionarios = JSON.parse(localStorage.getItem('funcionarios')) || [];
    funcionarios.push(funcionario);
    localStorage.setItem('funcionarios', JSON.stringify(funcionarios));

    document.getElementById('cadastroForm').reset();
});