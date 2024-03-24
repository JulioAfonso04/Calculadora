// Importando a função createApp do Vue
const { createApp } = Vue;
// Criando a aplicação Vue
createApp({
    // Dados da aplicação (estado)
    data() {
        return {
            display: '0', // Valor exibido no display da calculadora
            historico: '', // Histórico das operações
            numeroAnterior: null, // Número anterior usado nas operações
            operador: null, // Operador matemático atual
            aguardandoOperacao: false, // Flag para indicar se a calculadora está aguardando uma operação
            tamanhoMaximoDisplay: 10, // Tamanho máximo do display da calculadora
        }
    },
    // Métodos para lidar com os botões da calculadora
    methods: {
        // Função para lidar com os cliques nos botões da calculadora
        lidarBotao(botao) {
            // Verifica qual botão foi clicado e chama a função correspondente
            if (botao >= '0' && botao <= '9') {
                this.lidarNumero(botao); // Números de 0 a 9
            } else if (botao === '.') {
                this.lidarDecimal(); // Ponto decimal
            } else if (botao === '=') {
                this.lidarIgual(); // Botão de igual
            } else if (['+', '-', 'x', '/', '%'].includes(botao)) {
                this.lidarOperador(botao); // Operadores matemáticos
            } else if (botao === 'CE') {
                this.lidarLimparDisplay(); // Limpar display
            } else if (botao === 'C') {
                this.lidarLimparTudo(); // Limpar tudo
            } else if (botao === '#') {
                this.lidarApagar(); // Apagar último caractere
            }
        },
        // Função para lidar com os números
        lidarNumero(numero) {
            // Atualiza o display de acordo com o número pressionado
            if (this.aguardandoOperacao || this.display === '0') {
                this.display = numero;
                this.aguardandoOperacao = false;
            } else if (this.display.length < this.tamanhoMaximoDisplay) {
                this.display += numero;
            }
        },
        // Função para lidar com o ponto decimal
        lidarDecimal() {
            // Adiciona o ponto decimal se ainda não estiver presente no número
            if (!this.display.includes('.') && this.display.length < this.tamanhoMaximoDisplay) {
                this.display += '.';
            }
        },
        // Função para lidar com os operadores matemáticos
        lidarOperador(operador) {
            // Se já houver um operador, calcula o resultado antes de continuar
            if (this.operador !== null) {
                this.lidarIgual();
            }
            // Armazena o número anterior, o operador atual e atualiza o histórico
            this.numeroAnterior = parseFloat(this.display);
            this.operador = operador;
            this.aguardandoOperacao = true;
            this.atualizarHistorico();
        },
        // Função para calcular o resultado
        lidarIgual() {
            // Converte o número atual para float
            const numeroAtual = parseFloat(this.display);
            let resultado; // Variável para armazenar o resultado
            // Calcula o resultado com base no operador atual
            switch (this.operador) {
                case '+':
                    resultado = this.numeroAnterior + numeroAtual;
                    break;
                case '-':
                    resultado = this.numeroAnterior - numeroAtual;
                    break;
                case 'x':
                    resultado = this.numeroAnterior * numeroAtual;
                    break;
                case '/':
                    if (this.numeroAnterior === 0 && numeroAtual === 0) { // Verificar se for 0/0
                        resultado = 'Indeterminado';
                    } else if (numeroAtual === 0) { // Verificar se for 0/por qualquer número
                        resultado = 'Indefinido';
                    } else {
                        resultado = this.numeroAnterior / numeroAtual;
                    }
                    break;
                case '%':
                    resultado = this.numeroAnterior * (numeroAtual / 100);
                    break;
                default:
                    return;
            }
            // Atualiza o display, o histórico e reseta as variáveis
            this.display = resultado.toString();
            this.atualizarHistorico(true, numeroAtual, resultado);
            this.operador = null;
            this.aguardandoOperacao = false;
        },
        // Função para limpar o display
        lidarLimparDisplay() {
            this.display = '0';
            this.aguardandoOperacao = false;
        },
        // Função para limpar tudo (display, histórico e variáveis)
        lidarLimparTudo() {
            this.display = '0';
            this.historico = '';
            this.numeroAnterior = null;
            this.operador = null;
            this.aguardandoOperacao = false;
        },
        // Função para apagar o último caractere do display
        lidarApagar() {
            // Verifica se o display tem apenas um caractere ou dois caracteres (caso seja negativo)
            if (this.display.length === 1 || (this.display.length === 2 && this.display.startsWith('-'))) {
                this.display = '0';
            } else {
                this.display = this.display.slice(0, -1);
            }
        },
        // Função para atualizar o histórico
        atualizarHistorico(resultado = false, numeroAtual = null, resultadoOperacao = null) {
            // Se não for um resultado, atualiza o histórico com o número e o operador
            if (!resultado) {
                this.historico = `${this.display} ${this.operador}`;
            } else {
                // Se for um resultado, adiciona a operação completa ao histórico
                this.historico += ` ${numeroAtual} = ${resultadoOperacao}`;
            }
        },
    }
}).mount("#app"); // Monta a aplicação Vue no elemento com o id "app"
