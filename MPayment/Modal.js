// Função para criar o modal
function createModal() {
    // Container do modal
    const modalContainer = document.createElement('div');
    modalContainer.id = 'modal-container';
    modalContainer.style.position = 'fixed';
    modalContainer.style.top = '0';
    modalContainer.style.left = '0';
    modalContainer.style.width = '100%';
    modalContainer.style.height = '100%';
    modalContainer.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    modalContainer.style.display = 'flex';
    modalContainer.style.justifyContent = 'center';
    modalContainer.style.alignItems = 'center';
    modalContainer.style.zIndex = '1000';

    // Conteúdo do modal
    const modalContent = document.createElement('div');
    modalContent.style.width = '400px';
    modalContent.style.padding = '20px';
    modalContent.style.backgroundColor = '#fff';
    modalContent.style.borderRadius = '10px';
    modalContent.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.3)';
    modalContent.style.textAlign = 'center';
    modalContent.style.fontFamily = 'Arial, sans-serif';
    modalContent.style.color = '#333';

    // Mensagem no modal
    const message = document.createElement('div');
    message.innerHTML = `
        <h2 style="color: #191970; font-size: 24px; margin-bottom: 10px;">🎯 Loto Hack: O Melhor Palpite para o Jogo do Bicho!</h2>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">Aposte com inteligência e aumente suas chances de ganhar!<br>Nosso sistema avançado analisa os resultados para descobrir números com as maiores probabilidades de serem sorteados!</p>
        <h3 style="color: #1d3557; font-size: 20px; margin-bottom: 10px;">🛒 Por apenas R$ 18,00</h3>
        <p style="font-size: 16px; line-height: 1.6; margin-bottom: 15px;">🤏🏼 Pagamento único!<br>✔️ Acesso vitalício!</p>
        <p style="font-weight: bold; font-size: 16px; margin-top: 15px;">👉 Transforme sua sorte em estratégia. Seja Loto Hack! 🍀</p><br><br>
    `;
    modalContent.appendChild(message);

    // Botão para desbloquear acesso
    const unlockButton = document.createElement('button');
    unlockButton.textContent = 'Desbloquear acesso';
    unlockButton.style.padding = '10px 20px';
    unlockButton.style.backgroundColor = '#28a745';
    unlockButton.style.color = '#fff';
    unlockButton.style.border = 'none';
    unlockButton.style.borderRadius = '25px';
    unlockButton.style.cursor = 'pointer';
    unlockButton.style.marginBottom = '15px';
    unlockButton.style.fontSize = '16px';
    unlockButton.style.fontWeight = 'bold';
    unlockButton.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    unlockButton.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
	openPaymentModal()
    });
    modalContent.appendChild(unlockButton);

    // Link para fechar o modal
    const closeLink = document.createElement('a');
    closeLink.textContent = 'Fechar';
    closeLink.style.display = 'block';
    closeLink.style.marginTop = '20px';
    closeLink.style.color = '#6200ea';
    closeLink.style.textDecoration = 'none';
    closeLink.style.cursor = 'pointer';
    closeLink.style.fontSize = '16px';
    closeLink.addEventListener('click', () => {
        document.body.removeChild(modalContainer);
    });
    modalContent.appendChild(closeLink);

    // Adiciona o conteúdo ao container e o container ao body
    modalContainer.appendChild(modalContent);
    document.body.appendChild(modalContainer);
}