const GAS_URL = 'https://script.google.com/macros/s/AKfycbwqiHsn01MBMhjC-xgmkDqkckin4SvOEP03mYP5WdQtzj6ln3AbH0YHwi_fsCkuZxwC/exec';
let tentativas = 0;
let tentativasRestantes = 0;
let paymentId = null;
let board = [];
const valoresPremios = [50, 70, 100, 150, 200];

document.getElementById('generate-payment').addEventListener('click', gerarPix);
document.getElementById('modal-ok').addEventListener('click', () => {
    document.getElementById('modal').classList.add('hidden');
    revelarTabuleiro();
});

function gerarPix() {
    tentativas = parseInt(document.getElementById('tentativas-select').value);
    tentativasRestantes = tentativas;

    fetch(GAS_URL, {
        method: 'POST',
        body: JSON.stringify({ action: 'create_payment', tentativas })
    })
        .then(res => res.json())
        .then(data => {
            paymentId = data.id;
            const qrCode = data.point_of_interaction.transaction_data.qr_code_base64;
            document.getElementById('payment-info').innerHTML = `
                Pague com PIX:<br>
                <img src="data:image/png;base64,${qrCode}" alt="QR Code PIX">
            `;
            checkPaymentStatus();
        });
}

function checkPaymentStatus() {
    const interval = setInterval(() => {
        fetch(GAS_URL, {
            method: 'POST',
            body: JSON.stringify({ action: 'check_payment', payment_id: paymentId })
        })
            .then(res => res.json())
            .then(data => {
                if (data.status === 'approved') {
                    clearInterval(interval);
                    iniciarJogo();
                }
            });
    }, 3000);
}

function iniciarJogo() {
    document.getElementById('payment-info').innerText = 'Pagamento aprovado!';
    document.getElementById('game-board').classList.remove('hidden');
    document.getElementById('tentativas-restantes').innerText = tentativasRestantes;
    gerarBoard();
}

function gerarBoard() {
    const gameBoard = document.getElementById('game-board');
    gameBoard.innerHTML = '';
    board = Array(12).fill('mina');

    for (let i = 0; i < 4; i++) {
        let pos;
        do {
            pos = Math.floor(Math.random() * 12);
        } while (board[pos] === 'premio');
        board[pos] = 'premio';
    }

    board.forEach((item, index) => {
        const button = document.createElement('button');
        button.dataset.index = index;
        button.addEventListener('click', () => revelarQuadrado(index, button));
        gameBoard.appendChild(button);
    });
}

function revelarQuadrado(index, button) {
    if (tentativasRestantes <= 0 || button.disabled) return;

    button.classList.add('mina');
    button.innerHTML = '💣';
    tentativasRestantes--;
    document.getElementById('tentativas-restantes').innerText = tentativasRestantes;

    button.disabled = true;

    if (tentativasRestantes === 0) {
        encerrarJogo();
    }
}

function encerrarJogo() {
    document.getElementById('modal-message').innerText = 'Fim das tentativas, valor do prêmio: R$ 0,00.';
    document.getElementById('modal').classList.remove('hidden');
}

function revelarTabuleiro() {
    const gameBoard = document.getElementById('game-board');
    board.forEach((item, index) => {
        const button = gameBoard.children[index];
        if (!button.disabled) {
            button.classList.add(item === 'mina' ? 'mina' : 'premio');
            button.innerHTML = item === 'mina' ? '💣' : `R$ ${valoresPremios[Math.floor(Math.random() * valoresPremios.length)]}`;
        }
    });
}
