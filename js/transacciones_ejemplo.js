export function generateTransactionsHTML() {
  const transactionsContainer = document.getElementById("transactions-container")

  if (transactionsContainer) {
    transactionsContainer.innerHTML = `
      <div class="date-group">EJEMPLO</div>
      <div class="transaction">
        <div class="transaction-icon">▶</div>
        <div class="transaction-details">
          <div class="transaction-description">Ejemplo de transacción</div>
        </div>
        <div class="transaction-right">
          <div class="transaction-amount amount-green">0,00 Bs</div>
          <div class="transaction-time">12:00 AM</div>
        </div>
      </div>
    `
  }
}
