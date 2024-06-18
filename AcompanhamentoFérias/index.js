// Adiciona um ouvinte de evento para quando o conteúdo da página for carregado completamente
document.addEventListener('DOMContentLoaded', function () {
    // Obtém referências aos elementos do DOM
    const calendarioContainer = document.getElementById('calendarioContainer');
    const anoSelect = document.getElementById('ano');
    const expandirDetalhesBtn = document.getElementById('expandirDetalhes');
    const resumirDetalhesBtn = document.getElementById('resumirDetalhes');

    // Define o ano atual
    let anoAtual = new Date().getFullYear();

    // Função para obter dados dos funcionários armazenados no localStorage
    function obterFuncionariosDoBancoDeDados() {
        return JSON.parse(localStorage.getItem('funcionarios')) || [];
    }

    // Função para popular o seletor de anos com um intervalo de anos
    function popularAnos() {
        for (let i = anoAtual - 10; i <= anoAtual + 10; i++) {
            const option = document.createElement('option');
            option.value = i;
            option.textContent = i;
            anoSelect.appendChild(option);
        }
        anoSelect.value = anoAtual; // Define o ano atual como o selecionado por padrão
    }

    //Difino o width do meu mês
    let tamanhoMes = 42.84

    // Função para gerar o calendário baseado no ano selecionado
    function gerarCalendario(ano) {
        calendarioContainer.innerHTML = ''; // Limpa o conteúdo anterior do calendário

        const tabela = document.createElement('div');
        tabela.className = 'tabela';

        // Cria cabeçalhos para os meses e dias
        const cabecalhoMes = document.createElement('div');
        cabecalhoMes.className = 'cabecalho-mes';
        const cabecalhoDia = document.createElement('div');
        cabecalhoDia.className = 'cabecalho-dia';

        // Cria e adiciona o cabeçalho de "Meses"
        const nomeHeader = document.createElement('div');
        nomeHeader.className = 'funcionario-header';
        nomeHeader.textContent = 'Meses';
        cabecalhoMes.appendChild(nomeHeader.cloneNode(true));

        // Cria e adiciona o cabeçalho de "Funcionário"
        nomeHeader.textContent = 'Funcionário';
        cabecalhoDia.appendChild(nomeHeader);

        // Array para armazenar os dias do ano
        const diasNoAno = [];
        // Nomes dos meses
        const meses = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];

        // Adiciona cabeçalhos de meses e dias
        meses.forEach((mes, index) => {
            const diasNoMes = new Date(ano, index + 1, 0).getDate();

            const mesHeader = document.createElement('div');
            mesHeader.className = 'mes-header';
            mesHeader.textContent = mes;
            //Crio o cabeçalho de dias com a largura configurada de acordo com os dias;
            mesHeader.style.width = `${diasNoMes * tamanhoMes}px`;
            cabecalhoMes.appendChild(mesHeader);

            for (let dia = 1; dia <= diasNoMes; dia++) {
                diasNoAno.push({ dia, mes: index });
                const diaHeader = document.createElement('div');
                diaHeader.className = 'dia-header';
                diaHeader.textContent = dia;
                cabecalhoDia.appendChild(diaHeader);
            }
        });

        // Adiciona cabeçalhos de meses e dias à tabela
        tabela.appendChild(cabecalhoMes);
        tabela.appendChild(cabecalhoDia);

        // Obtém os dados dos funcionários do localStorage
        const funcionarios = obterFuncionariosDoBancoDeDados();

        // Adiciona uma linha para cada funcionário com suas férias
        funcionarios.forEach(funcionario => {
            const funcionarioRow = document.createElement('div');
            funcionarioRow.className = 'funcionario';

            const nomeContainer = document.createElement('div');
            nomeContainer.className = 'funcionario-header';
            nomeContainer.textContent = funcionario.apelido || funcionario.nomeCompleto;
            funcionarioRow.appendChild(nomeContainer);

            diasNoAno.forEach(({ dia, mes }) => {
                const diaDiv = document.createElement('div');
                diaDiv.className = 'dia';

                const dataAtual = new Date(ano, mes, dia);
                const dataInicioFerias = new Date(funcionario.dataInicioFerias);
                const dataRetornoFerias = new Date(funcionario.dataRetornoFerias);

                // Adiciona a classe 'ferias' se o dia atual estiver no período de férias do funcionário
                if (dataAtual >= dataInicioFerias && dataAtual <= dataRetornoFerias) {
                    diaDiv.classList.add('ferias');
                }

                funcionarioRow.appendChild(diaDiv);
            });

            tabela.appendChild(funcionarioRow);
        });

        // Adiciona a tabela ao container do calendário
        calendarioContainer.appendChild(tabela);
    }

    // Função para expandir os detalhes do calendário
    function expandirDetalhes() {
        tamanhoMes = 42.84
        gerarCalendario(anoAtual);
        calendarioContainer.classList.remove('resumido');
    }

    // Função para resumir os detalhes do calendário
    function resumirDetalhes() {
        tamanhoMes = 11.84
        gerarCalendario(anoAtual);
        calendarioContainer.classList.add('resumido');
    }

    // Função para atualizar o calendário quando o ano é alterado
    function onChangeAno() {
        anoAtual = parseInt(anoSelect.value, 10);
        gerarCalendario(anoAtual);
    }

    // Função para inicializar a página com anos populados e calendário gerado
    function inicializarPagina() {
        popularAnos();
        gerarCalendario(anoAtual);
    }

    // Adiciona ouvintes de eventos aos botões e ao seletor de ano
    expandirDetalhesBtn.addEventListener('click', expandirDetalhes);
    resumirDetalhesBtn.addEventListener('click', resumirDetalhes);
    anoSelect.addEventListener('change', onChangeAno);

    // Inicializa a página
    inicializarPagina();
});