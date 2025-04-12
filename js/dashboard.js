import { obtenerTransacciones } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el contenedor de transacciones
  const transactionsContainer = document.getElementById("transactions")

  if (transactionsContainer) {
    try {
      console.log("Intentando obtener transacciones para el dashboard...")
      
      // Obtener las transacciones de la base de datos o localStorage
      const transacciones = await obtenerTransacciones()
      console.log("Transacciones obtenidas para dashboard:", transacciones)
      
      // Limpiar el contenedor
      transactionsContainer.innerHTML = ""

      if (transacciones && transacciones.length > 0) {
        // Ordenar transacciones por fecha (más recientes primero)
        const transaccionesOrdenadas = [...transacciones].sort((a, b) => {
          const fechaA = a.fecha ? new Date(a.fecha) : new Date(0);
          const fechaB = b.fecha ? new Date(b.fecha) : new Date(0);
          return fechaB - fechaA;
        });
        
        // Limitar a las 5 más recientes
        const transaccionesRecientes = transaccionesOrdenadas.slice(0, 5);
        
        // Crear elementos para cada transacción
        transaccionesRecientes.forEach((transaccion) => {
          const fecha = transaccion.fecha ? new Date(transaccion.fecha) : new Date();
          const element = createTransaction(
            fecha,
            transaccion.descripcion || "Transacción",
            transaccion.monto,
            transaccion.monto > 0 ? "in" : "out",
            transaccion.id,
          )

          transactionsContainer.appendChild(element)
        })

        // Agregar evento de clic a las transacciones para ver el comprobante
        document.querySelectorAll(".transaction").forEach((transaccion) => {
          transaccion.addEventListener("click", function () {
            const id = this.getAttribute("data-id")
            window.location.href = `comprobante.html?id=${id}`
          })
        })
      } else {
        console.log("No se encontraron transacciones para el dashboard, mostrando datos predeterminados");
        // Agregar transacciones existentes de ejemplo
        const existingTransactions = [
          { date: new Date(2023, 0, 13), type: 'Transferencias a terceros BDV', amount: 2061.60, direction: 'out' },
          { date: new Date(2022, 11, 17), type: 'Transferencias a terceros BDV', amount: 1850.00, direction: 'in' }
        ];

        existingTransactions.forEach(transaction => {
          transactionsContainer.appendChild(createTransaction(
            transaction.date,
            transaction.type,
            transaction.amount,
            transaction.direction,
            'ejemplo-' + Math.random().toString(36).substring(7)
          ));
        });

        // Agregar nueva transacción con fecha y hora actuales
        const now = new Date();
        const newTransaction = createTransaction(
          now, 
          'Transferencias a terceros BDV', 
          755.00, 
          'out',
          'ejemplo-' + Math.random().toString(36).substring(7)
        );
        transactionsContainer.insertBefore(newTransaction, transactionsContainer.firstChild);
      }
    } catch (error) {
      console.error("Error al cargar las transacciones recientes:", error)
      
      // En caso de error, mostrar datos de ejemplo
      const existingTransactions = [
        { date: new Date(2023, 0, 13), type: 'Transferencias a terceros BDV', amount: 2061.60, direction: 'out' },
        { date: new Date(2022, 11, 17), type: 'Transferencias a terceros BDV', amount: 1850.00, direction: 'in' }
      ];

      existingTransactions.forEach(transaction => {
        transactionsContainer.appendChild(createTransaction(
          transaction.date,
          transaction.type,
          transaction.amount,
          transaction.direction,
          'ejemplo-' + Math.random().toString(36).substring(7)
        ));
      });

      // Agregar nueva transacción con fecha y hora actuales
      const now = new Date();
      const newTransaction = createTransaction(
        now, 
        'Transferencias a terceros BDV', 
        755.00, 
        'out',
        'ejemplo-' + Math.random().toString(36).substring(7)
      );
      transactionsContainer.insertBefore(newTransaction, transactionsContainer.firstChild);
    }
  }
})

// Función para formatear la fecha
function formatDate(date) {
  const day = date.getDate().toString().padStart(2, "0")
  const month = (date.getMonth() + 1).toString().padStart(2, "0")
  const year = date.getFullYear()
  return `${day}/${month}/${year}`
}

// Función para formatear la hora
function formatTime(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()

  hours = hours < 10 ? "0" + hours : hours
  minutes = minutes < 10 ? "0" + minutes : minutes

  return `${hours}:${minutes}`
}

// Función para crear una nueva transacción
function createTransaction(date, type, amount, direction, id) {
  const transaction = document.createElement("div")
  transaction.className = "transaction"
  transaction.setAttribute("data-id", id)
  transaction.innerHTML = `
    <div class="transaction-date">${formatDate(date)}</div>
    <div class="transaction-details">
      <div class="transaction-info">
        <span class="transaction-arrow">${direction === "in" ? "←" : "→"}</span>
        <span class="transaction-type">${type}</span>
      </div>
      <div class="transaction-amount">
        <div class="amount">${Math.abs(amount).toFixed(2)} Bs</div>
        <div class="time">${formatTime(date)}</div>
      </div>
    </div>
  `
  return transaction
}
