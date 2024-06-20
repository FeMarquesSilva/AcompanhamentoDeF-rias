document.addEventListener('DOMContentLoaded', function () {
    const calendarioContainer = document.getElementById('calendarioContainer');
    const anoSelect = document.getElementById('ano');
    const mesSelect = document.getElementById('mes');
    const deptSelect = document.getElementById('dept');
    const setorSelect = document.getElementById('setor');
    const expandirDetalhesBtn = document.getElementById('expandirDetalhes');
    const resumirDetalhesBtn = document.getElementById('resumirDetalhes');

    let anoAtual = new Date().getFullYear();
    let mesAtual = new Date().getMonth(); // Mês atual (0 a 11)
    let tamanhoMes = 42.84;

    const mesesDoAno = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
    ];

    const feriados = [
        '01/01', '25/12', // Adicione outros feriados aqui no formato 'DD/MM'
    ];

    async function obterFuncionariosDoBancoDeDados() {
        const { data, error } = await supabaseClient
            .from('funcionarios')
            .select('*');

        if (error) {
            console.error('Erro ao buscar funcionários:', error);
            return [];
        }

        return data;
    }

    function popularAnos() {
        const rangeAnos = 20;
        for (let i = anoAtual - rangeAnos; i <= anoAtual + rangeAnos; i++) {
            anoSelect.appendChild(new Option(i, i));
        }
        anoSelect.value = anoAtual;
    }

    function popularMes() {
        mesesDoAno.forEach((mes, index) => {
            mesSelect.appendChild(new Option(mes, index));
        });
        mesSelect.value = mesAtual;
    }

    function popularOpcoesSelect(selectElement, data, defaultValue = '') {
        selectElement.innerHTML = `<option value="">${defaultValue}</option>`;
        data.forEach(item => {
            selectElement.appendChild(new Option(item, item));
        });
    }

    function filtrarFuncionarios(funcionarios, departamentoFiltro, setorFiltro) {
        return funcionarios.filter(funcionario => {
            const filtroDepartamento = !departamentoFiltro || funcionario.departamento === departamentoFiltro;
            const filtroSetor = !setorFiltro || funcionario.setor === setorFiltro;
            return filtroDepartamento && filtroSetor;
        });
    }

    function isFeriado(dia, mes) {
        const dataString = `${dia.toString().padStart(2, '0')}/${(mes + 1).toString().padStart(2, '0')}`;
        return feriados.includes(dataString);
    }

    async function gerarCalendario(ano, mes, departamentoFiltro, setorFiltro) {
        calendarioContainer.innerHTML = '';

        const tabela = document.createElement('div');
        tabela.className = 'tabela';

        const cabecalhoMes = document.createElement('div');
        cabecalhoMes.className = 'cabecalho-mes';
        const cabecalhoDia = document.createElement('div');
        cabecalhoDia.className = 'cabecalho-dia';

        const nomeHeader = document.createElement('div');
        nomeHeader.className = 'funcionario-header';
        nomeHeader.textContent = 'Meses';
        cabecalhoMes.appendChild(nomeHeader.cloneNode(true));
        nomeHeader.textContent = 'Funcionário';
        cabecalhoDia.appendChild(nomeHeader);

        const diasNoAno = [];

        mesesDoAno.slice(mes).forEach((mesNome, index) => {
            const mesCorrente = (mes + index) % 12;
            const anoCorrente = ano + Math.floor((mes + index) / 12);
            const diasNoMes = new Date(anoCorrente, mesCorrente + 1, 0).getDate();
            const mesHeader = document.createElement('div');
            mesHeader.className = 'mes-header';
            mesHeader.textContent = mesNome;
            mesHeader.style.width = `${diasNoMes * tamanhoMes}px`;
            cabecalhoMes.appendChild(mesHeader);

            for (let dia = 1; dia <= diasNoMes; dia++) {
                diasNoAno.push({ dia, mes: mesCorrente });
                const diaHeader = document.createElement('div');
                diaHeader.className = 'dia-header';
                diaHeader.textContent = dia;

                // Determina o dia da semana
                const dataAtual = new Date(anoCorrente, mesCorrente, dia);
                const diaSemana = dataAtual.getDay();

                // Adiciona classes para feriados, sábados e domingos
                if (isFeriado(dia, mesCorrente)) {
                    diaHeader.classList.add('feriado');
                } else if (diaSemana === 0) { // Domingo
                    diaHeader.classList.add('domingo');
                } else if (diaSemana === 6) { // Sábado
                    diaHeader.classList.add('sabado');
                }

                cabecalhoDia.appendChild(diaHeader);
            }
        });

        tabela.appendChild(cabecalhoMes);
        tabela.appendChild(cabecalhoDia);

        const funcionarios = filtrarFuncionarios(await obterFuncionariosDoBancoDeDados(), departamentoFiltro, setorFiltro);

        const funcionariosAgrupados = new Map();

        funcionarios.forEach(funcionario => {
            const chaveFuncionario = funcionario.nomePrimeiro || funcionario.nomeCompleto;
            if (!funcionariosAgrupados.has(chaveFuncionario)) {
                funcionariosAgrupados.set(chaveFuncionario, { nome: chaveFuncionario, datas: [] });
            }
            const funcionarioAgrupado = funcionariosAgrupados.get(chaveFuncionario);
            
            funcionarioAgrupado.datas.push({ inicio: funcionario.dataIniFerias, retorno: funcionario.dataFimFerias });
        });

        funcionariosAgrupados.forEach(funcionario => {
            const funcionarioRow = document.createElement('div');
            funcionarioRow.className = 'funcionario';

            const nomeContainer = document.createElement('div');
            nomeContainer.className = 'funcionario-header';
            nomeContainer.textContent = funcionario.nome;
            funcionarioRow.appendChild(nomeContainer);

            diasNoAno.forEach(({ dia, mes }) => {
                const diaDiv = document.createElement('div');
                diaDiv.className = 'dia';

                const dataAtual = new Date(ano, mes, dia);
                const estaDeFerias = funcionario.datas.some(({ inicio, retorno }) => {
                    const dataInicioFerias = new Date(Date.parse(inicio));
                    const dataRetornoFerias = new Date(Date.parse(retorno));
                    return dataAtual >= dataInicioFerias && dataAtual <= dataRetornoFerias;
                });

                if (estaDeFerias) {
                    diaDiv.classList.add('ferias');
                }

                // Determina o dia da semana
                const diaSemana = dataAtual.getDay();

                // Adiciona classes para feriados, sábados e domingos
                if (isFeriado(dia, mes)) {
                    diaDiv.classList.add('feriado');
                } else if (diaSemana === 0) { // Domingo
                    diaDiv.classList.add('domingo');
                } else if (diaSemana === 6) { // Sábado
                    diaDiv.classList.add('sabado');
                }

                funcionarioRow.appendChild(diaDiv);
            });
            tabela.appendChild(funcionarioRow);
        });

        calendarioContainer.appendChild(tabela);
    }

    function expandirDetalhes() {
        tamanhoMes = 42.84;
        gerarCalendario(anoAtual, mesAtual, deptSelect.value, setorSelect.value);
        calendarioContainer.classList.remove('resumido');
    }

    function resumirDetalhes() {
        tamanhoMes = 11.84;
        gerarCalendario(anoAtual, mesAtual, deptSelect.value, setorSelect.value);
        calendarioContainer.classList.add('resumido');
    }

    function onChangeAnoMes() {
        anoAtual = parseInt(anoSelect.value, 10);
        mesAtual = parseInt(mesSelect.value, 10);
        gerarCalendario(anoAtual, mesAtual, deptSelect.value, setorSelect.value);
    }

    function onChangeDeptSetor() {
        gerarCalendario(anoAtual, mesAtual, deptSelect.value, setorSelect.value);
    }

    async function inicializarPagina() {
        popularAnos();
        popularMes();
        const funcionarios = await obterFuncionariosDoBancoDeDados();
        popularOpcoesSelect(deptSelect, Array.from(new Set(funcionarios.map(funcionario => funcionario.departamento))).sort(), 'Todos os departamentos');
        popularOpcoesSelect(setorSelect, Array.from(new Set(funcionarios.map(funcionario => funcionario.setor))).sort(), 'Todos os setores');
        gerarCalendario(anoAtual, mesAtual, '', '');
    }

    expandirDetalhesBtn.addEventListener('click', expandirDetalhes);
    resumirDetalhesBtn.addEventListener('click', resumirDetalhes);
    anoSelect.addEventListener('change', onChangeAnoMes);
    mesSelect.addEventListener('change', onChangeAnoMes);
    deptSelect.addEventListener('change', onChangeDeptSetor);
    setorSelect.addEventListener('change', onChangeDeptSetor);

    inicializarPagina();
});