import { obtenerTransacciones } from "./transacciones.js"
import { generateTransactionsHTML } from "./transacciones_ejemplo.js"

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el contenedor de transacciones
  const transactionsContainer = document.getElementById("transactions-container")

  if (transactionsContainer) {
    try {
      // Obtener las transacciones de la base de datos
      const transacciones = await obtenerTransacciones()

      if (transacciones && transacciones.length > 0) {
        // Agrupar transacciones por fecha
        const transaccionesPorFecha = agruparPorFecha(transacciones)

        // Generar el HTML de las transacciones
        let html = ""

        transaccionesPorFecha.forEach((grupo) => {
          html += `
            <div class="date-group">${grupo.fecha}</div>
            ${grupo.transacciones
              .map(
                (transaccion) => `
              <div class="transaction" data-id="${transaccion.id}">
                <div class="transaction-icon">${transaccion.monto < 0 ? "◀" : "▶"}</div>
                <div class="transaction-details">
                  <div class="transaction-description">${transaccion.descripcion}</div>
                </div>
                <div class="transaction-right">
                  <div class="transaction-amount ${transaccion.monto > 0 ? "amount-green" : ""}">
                    ${formatAmount(Math.abs(transaccion.monto))}
                  </div>
                  <div class="transaction-time">${formatTime(new Date(transaccion.fecha))}</div>
                </div>
              </div>
            `,
              )
              .join("")}
          `
        })

        transactionsContainer.innerHTML = html

        // Agregar evento de clic a las transacciones para ver el comprobante
        document.querySelectorAll(".transaction").forEach((transaccion) => {
          transaccion.addEventListener("click", function () {
            const id = this.getAttribute("data-id")
            window.location.href = `comprobante.html?id=${id}`
          })
        })
      } else {
        // Si no hay transacciones, mostrar las transacciones de ejemplo
        generateTransactionsHTML()
      }
    } catch (error) {
      console.error("Error al cargar las transacciones:", error)
      // Si hay un error, mostrar las transacciones de ejemplo
      generateTransactionsHTML()
    }
  }
})

// Helper functions for formatting
function formatAmount(amount) {
  return amount.toFixed(2).replace(".", ",") + " Bs"
}

function formatTime(date) {
  let hours = date.getHours()
  let minutes = date.getMinutes()
  const ampm = hours >= 12 ? "PM" : "AM"

  hours = hours % 12
  hours = hours ? hours : 12 // La hora '0' debe ser '12'

  minutes = minutes < 10 ? "0" + minutes : minutes

  return `${hours}:${minutes} ${ampm}`
}

function formatDateSpanish(date) {
  const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"]
  const months = [
    "ENERO",
    "FEBRERO",
    "MARZO",
    "ABRIL",
    "MAYO",
    "JUNIO",
    "JULIO",
    "AGOSTO",
    "SEPTIEMBRE",
    "OCTUBRE",
    "NOVIEMBRE",
    "DICIEMBRE",
  ]

  const dayName = days[date.getDay()]
  const day = date.getDate()
  const month = months[date.getMonth()]

  return `${dayName}, ${day} DE ${month}`
}

// Función para agrupar transacciones por fecha
function agruparPorFecha(transacciones) {
  const grupos = {}

  transacciones.forEach((transaccion) => {
    const fecha = new Date(transaccion.fecha)
    const fechaFormateada = formatDateSpanish(fecha)

    if (!grupos[fechaFormateada]) {
      grupos[fechaFormateada] = []
    }

    grupos[fechaFormateada].push(transaccion)
  })

  return Object.keys(grupos).map((fecha) => ({
    fecha,
    transacciones: grupos[fecha],
  }))
}
