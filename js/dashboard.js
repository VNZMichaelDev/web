import { obtenerTransacciones } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el contenedor de transacciones
  const transactionsContainer = document.getElementById("transactions")

  if (transactionsContainer) {
    try {
      // Obtener las transacciones de la base de datos (limitadas a 5)
      const transacciones = await obtenerTransacciones()
      const transaccionesRecientes = transacciones.slice(0, 5)

      // Limpiar el contenedor
      transactionsContainer.innerHTML = ""

      if (transaccionesRecientes.length > 0) {
        // Crear elementos para cada transacción
        transaccionesRecientes.forEach((transaccion) => {
          const fecha = new Date(transaccion.fecha)
          const element = createTransaction(
            fecha,
            transaccion.descripcion,
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
      }
    } catch (error) {
      console.error("Error al cargar las transacciones recientes:", error)
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
