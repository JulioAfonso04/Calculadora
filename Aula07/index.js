const { createApp } = Vue;

createApp({
    data() {
        return {
            display: '0',
            historico: '',
            numeroAnterior: null,
            operador: null,
            aguardandoOperacao: false,
            tamanhoMaximoDisplay: 10,
            tamanhoMaximoHistorico: 20,
        }
    },
    methods: {
        lidarBotao(botao) {
            if (botao >= '0' && botao <= '9') {
                this.lidarNumero(botao)
            } else if (botao === '.') {
                this.lidarDecimal()
            } else if (botao === '=') {
                this.lidarIgual()
            } else if (['+', '-', 'x', '/', '%'].includes(botao)) {
                this.lidarOperador(botao)
            } else if (botao === 'CE') {
                this.lidarLimparDisplay()
            } else if (botao === 'C') {
                this.lidarLimparTudo()
            } else if (botao === '#') {
                this.lidarApagar()
            }
        },
        lidarNumero(numero) {
            if (this.aguardandoOperacao || this.display === '0') {
                this.display = numero
                this.aguardandoOperacao = false
            } else if (this.display.length < this.tamanhoMaximoDisplay) {
                this.display += numero
            }
        },
        lidarDecimal() {
            if (!this.display.includes('.') && this.display.length < this.tamanhoMaximoDisplay) {
                this.display += '.'
            }
        },
        lidarOperador(operador) {
            if (this.operador !== null) {
                this.lidarIgual()
            }
            this.numeroAnterior = parseFloat(this.display)
            this.operador = operador
            this.aguardandoOperacao = true
            this.atualizarHistorico()
        },
        lidarIgual() {
            const numeroAtual = parseFloat(this.display)
            let resultado
            switch (this.operador) {
                case '+':
                    resultado = this.numeroAnterior + numeroAtual
                    break
                case '-':
                    resultado = this.numeroAnterior - numeroAtual
                    break
                case 'x':
                    resultado = this.numeroAnterior * numeroAtual
                    break
                case '/':
                    if (this.numeroAnterior === 0 && numeroAtual === 0) {
                        resultado = 'Indeterminado'
                    } else if (numeroAtual === 0) {
                        resultado = 'Indefinido'
                    } else {
                        resultado = this.numeroAnterior / numeroAtual
                    }
                    break
                case '%':
                    resultado = this.numeroAnterior * (numeroAtual / 100)
                    break
                default:
                    return
            }
            this.display = resultado.toString()
            this.atualizarHistorico(true, numeroAtual, resultado)
            this.operador = null
            this.aguardandoOperacao = false
        },
        lidarLimparDisplay() {
            this.display = '0'
            this.aguardandoOperacao = false
        },
        lidarLimparTudo() {
            this.display = '0'
            this.historico = ''
            this.numeroAnterior = null
            this.operador = null
            this.aguardandoOperacao = false
        },
        lidarApagar() {
            if (this.display.length === 1 || (this.display.length === 2 && this.display.startsWith('-'))) {
                this.display = '0'
            } else {
                this.display = this.display.slice(0, -1)
            }
        },
        atualizarHistorico(resultado = false, numeroAtual = null, resultadoOperacao = null) {
            if (!resultado) {
                this.historico = `${this.display} ${this.operador}`
            } else {
                this.historico += ` ${numeroAtual} = ${resultadoOperacao}`
            }
        },
    }
}).mount("#app");