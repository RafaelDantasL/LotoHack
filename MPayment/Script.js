    document.addEventListener('DOMContentLoaded', () => {
      const body = document.body;
      body.classList.add('modal-body'); // Adiciona classe exclusiva ao body

      const modalHTML = `
        <div id="paymentModal">
          <div id="modalContent">
            <div id="modalInnerContent">
              <p id="status">Gerando pagamento, aguarde...</p>
              <div id="loadingSpinner"></div>
              <img id="qrCode" alt="QR Code do PIX" width="200" height="200" style="display: none;">
              <div id="pixKeySection" style="display: none;">
              <h2>Chave PIX</h2><br><br>Valor da transação: R$ 18,00<br><br>Após o pagamento, o sistema de palpites será desbloqueado.<br><br>
                <div id="pixKey" contenteditable="true"></div>
                <button id="copyButton">Copiar Chave PIX</button>
              </div>
              <p id="statusMessage"></p>
              <button class="closeModal">Fechar</button>
            </div>
          </div>
        </div>
        <div id="copyNotification">Chave PIX copiada!</div>
      `;
      body.innerHTML += modalHTML;

      const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbyZg4KGtxyuU7_Go20wVKG2J-K2_pbMsMlxpD9RtOmRgi4w3ykpVQcwYbo5WNALLtI8Qw/exec';
      const PAYMENT_STORAGE_KEY = 'pixPayment';
      const EXPIRATION_TIME = 15 * 60 * 1000; // 15 minutos em milissegundos

      let paymentId;

      window.openPaymentModal = function() {
        const savedPayment = getSavedPayment();
        if (savedPayment && Date.now() - savedPayment.timestamp < EXPIRATION_TIME) {
          loadSavedPayment(savedPayment);
          checkPaymentStatus(savedPayment.paymentId); // Verifica o status do pagamento salvo
        } else {
          openModal();
          createPayment();
        }
      };

      function openModal() {
        document.getElementById('paymentModal').style.display = 'flex';
        bindModalEvents();
      }

      function closeModal() {
        document.getElementById('paymentModal').style.display = 'none';
        resetModalContent();
      }

      function resetModalContent() {
        const modalInnerContent = document.getElementById('modalInnerContent');
        modalInnerContent.innerHTML = `
          <p id="status">Gerando pagamento, aguarde...</p>
          <div id="loadingSpinner"></div>
          <img id="qrCode" alt="QR Code do PIX" width="200" height="200" style="display: none;">
          <div id="pixKeySection" style="display: none;">
              <h2>Chave PIX</h2><br><br>Valor da transação: R$ 18,00<br><br>Após o pagamento, o sistema de palpites será desbloqueado.<br><br>
            <div id="pixKey" contenteditable="true"></div>
            <button id="copyButton">Copiar Chave PIX</button>
          </div>
          <p id="statusMessage"></p>
          <button class="closeModal">Fechar</button>
        `;
        bindModalEvents();
      }

      function bindModalEvents() {
        const closeModalButton = document.querySelector('.closeModal');
        if (closeModalButton) {
          closeModalButton.onclick = closeModal;
        }

        const copyButton = document.getElementById('copyButton');
        if (copyButton) {
          copyButton.onclick = copyToClipboard;
        }
      }

      function getSavedPayment() {
        const paymentData = localStorage.getItem(PAYMENT_STORAGE_KEY);
        return paymentData ? JSON.parse(paymentData) : null;
      }

      function savePayment(data) {
        const paymentData = {
          paymentId: data.paymentId,
          qrCodeBase64: data.qrCodeBase64,
          qrCodePix: data.qrCodePix,
          timestamp: Date.now(),
        };
        localStorage.setItem(PAYMENT_STORAGE_KEY, JSON.stringify(paymentData));
      }

      function loadSavedPayment(data) {
        const qrCodeImage = document.getElementById('qrCode');
        const pixKey = document.getElementById('pixKey');
        const pixKeySection = document.getElementById('pixKeySection');

        qrCodeImage.src = `data:image/png;base64,${data.qrCodeBase64}`;
        qrCodeImage.style.display = 'block';
        pixKey.textContent = data.qrCodePix;
        pixKeySection.style.display = 'block';

        openModal();
        document.getElementById('status').textContent = 'Pagamento pendente!';
      }

      async function createPayment() {
        const statusElement = document.getElementById('status');
        const spinner = document.getElementById('loadingSpinner');

        spinner.style.display = 'block';
        statusElement.textContent = 'Gerando pagamento, aguarde...';

        try {
          const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=createPayment`, {
            method: 'GET',
          });
          const data = await response.json();

          if (data.success) {
            savePayment(data);
            const qrCodeImage = document.getElementById('qrCode');
            const pixKey = document.getElementById('pixKey');
            const pixKeySection = document.getElementById('pixKeySection');

            qrCodeImage.src = `data:image/png;base64,${data.qrCodeBase64}`;
            qrCodeImage.style.display = 'block';
            pixKey.textContent = data.qrCodePix;
            pixKeySection.style.display = 'block';
            spinner.style.display = 'none';
            statusElement.textContent = 'Pagamento gerado com sucesso!';
            paymentId = data.paymentId; // Salva o ID do pagamento.

            checkPaymentStatus(paymentId); // Inicia a verificação do pagamento.
          } else {
            spinner.style.display = 'none';
            statusElement.textContent = `Erro: ${data.message}`;
          }
        } catch (error) {
          spinner.style.display = 'none';
          statusElement.textContent = `Erro na conexão: ${error.message}`;
        }
      }

      async function checkPaymentStatus(paymentId) {
        try {
          const response = await fetch(`${GOOGLE_SCRIPT_URL}?action=getPaymentStatus&paymentId=${paymentId}`, {
            method: 'GET',
          });
          const data = await response.json();

          if (data.success) {
            if (data.status === 'approved') {
              showSuccessMessage();
              localStorage.setItem('privilegeAccess', 'true'); // DESBLOQUEIA OS PALPITES
              localStorage.removeItem(PAYMENT_STORAGE_KEY); // Remove o pagamento armazenado
            } else if (data.status === 'pending') {
              setTimeout(() => checkPaymentStatus(paymentId), 5000); // Verifica novamente após 5 segundos.
            } else {
              document.getElementById('statusMessage').textContent = `Status do pagamento: ${data.statusDetail}`;
            }
          } else {
            document.getElementById('statusMessage').textContent = `Erro: ${data.message}`;
          }
        } catch (error) {
          document.getElementById('statusMessage').textContent = `Erro na conexão: ${error.message}`;
        }
      }

      function showSuccessMessage() {
        const modalContent = document.getElementById('modalInnerContent');
        modalContent.innerHTML = `
          <img id="successIcon" src="MPayment/buyOK.png" alt="Pagamento realizado com sucesso">
          <h2>Pagamento realizado com sucesso!</h2><br><br>
          <a class="closeModal">Fechar</a>
        `;
        bindModalEvents();
      }

      function copyToClipboard() {
        const pixKey = document.getElementById('pixKey').textContent;
        navigator.clipboard.writeText(pixKey).then(() => {
          const notification = document.getElementById('copyNotification');
          notification.style.display = 'block';
          setTimeout(() => {
            notification.style.display = 'none';
          }, 2000); // A mensagem dura 2 segundos.
        });
      }
    });
