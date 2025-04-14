import { obtenerTransacciones } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el contenedor de transacciones
  const transactionsContainer = document.getElementById("transactions-container")

  if (transactionsContainer) {
    try {
      console.log("Intentando obtener transacciones para la página de movimientos...")
      
      // Obtener las transacciones de la base de datos o localStorage
      const transacciones = await obtenerTransacciones()
      console.log("Transacciones obtenidas:", transacciones)

      if (transacciones && transacciones.length > 0) {
        // Agrupar transacciones por fecha
        const transaccionesPorFecha = agruparPorFecha(transacciones)
        console.log("Transacciones agrupadas:", transaccionesPorFecha)

        // Generar el HTML de las transacciones
        let html = ""

        transaccionesPorFecha.forEach((grupo) => {
          html += `
            <div class="date-group">${grupo.fecha}</div>
            ${grupo.transacciones
              .map(
                (transaccion) => {
                  // Cambiar la descripción para mostrar "PagomóvilBDV" si es un pagomóvil
                  let descripcion = transaccion.descripcion || "";
                  if (descripcion.toLowerCase().includes("pagomovil") || transaccion.metodo_pago === "Pagomóvil") {
                    descripcion = "PagomóvilBDV";
                  }
                  
                  return `
                    <div class="transaction" data-id="${transaccion.id}">
                      <div class="transaction-icon">${transaccion.monto < 0 ? "◀" : "▶"}</div>
                      <div class="transaction-details">
                        <div class="transaction-description">${descripcion}</div>
                      </div>
                      <div class="transaction-right">
                        <div class="transaction-amount">
                          ${formatAmount(Math.abs(transaccion.monto))}
                        </div>
                        <div class="transaction-time">${formatTime(new Date(transaccion.fecha || Date.now()))}</div>
                      </div>
                    </div>
                  `;
                }
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
        console.log("No se encontraron transacciones, mostrando datos de ejemplo")
        // Si no hay transacciones, mostrar un mensaje
        transactionsContainer.innerHTML = `
          <div class="date-group">HOY</div>
          <div class="transaction">
            <div class="transaction-icon">▶</div>
            <div class="transaction-details">
              <div class="transaction-description">PagomóvilBDV</div>
            </div>
            <div class="transaction-right">
              <div class="transaction-amount">500,00 Bs</div>
              <div class="transaction-time">12:45 PM</div>
            </div>
          </div>
          <div class="date-group">AYER</div>
          <div class="transaction">
            <div class="transaction-icon">◀</div>
            <div class="transaction-details">
              <div class="transaction-description">Compra con tarjeta de debito</div>
            </div>
            <div class="transaction-right">
              <div class="transaction-amount">150,00 Bs</div>
              <div class="transaction-time">8:11 AM</div>
            </div>
          </div>
        `;
      }
    } catch (error) {
      console.error("Error al cargar las transacciones:", error)
      // Si hay un error, mostrar un mensaje
      transactionsContainer.innerHTML = `
        <div class="date-group">ERROR</div>
        <div class="transaction">
          <div class="transaction-icon">⚠️</div>
          <div class="transaction-details">
            <div class="transaction-description">Error al cargar transacciones</div>
          </div>
          <div class="transaction-right">
            <div class="transaction-amount">--,-- Bs</div>
            <div class="transaction-time">--:--</div>
          </div>
        </div>
      `;
    }
  }
})

// Helper functions for formatting
function formatAmount(amount) {
  return amount.toFixed(2).replace(".", ",") + " Bs"
}

// Función para formatear la hora en formato 12 horas con AM/PM
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
    // Asegurarse de que la fecha existe
    const fecha = transaccion.fecha ? new Date(transaccion.fecha) : new Date()
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
