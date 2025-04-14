import { obtenerTransacciones } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", async () => {
  // Obtener el contenedor de transacciones
  const transactionsContainer = document.getElementById("transactions")
  const updateButton = document.querySelector(".update-button")

  // Agregar evento al botón de actualizar
  if (updateButton) {
    updateButton.addEventListener("click", async function() {
      await cargarTransacciones();
      window.showToast("Histórico de operaciones actualizado");
    });
  }

  // Función para cargar las transacciones
  async function cargarTransacciones() {
    if (transactionsContainer) {
      try {
        console.log("Intentando obtener transacciones para el dashboard...")
        
        // Obtener las transacciones de la base de datos o localStorage
        const transacciones = await obtenerTransacciones()
        console.log("Transacciones obtenidas para dashboard:", transacciones)
        
        // Limpiar el contenedor
        transactionsContainer.innerHTML = ""

        if (transacciones && transacciones.length > 0) {
          // Agrupar transacciones por fecha
          const transaccionesPorFecha = agruparPorFecha(transacciones);
          
          // Generar HTML para cada grupo de fecha
          Object.keys(transaccionesPorFecha).forEach(fecha => {
            // Crear el encabezado de fecha
            const fechaHeader = document.createElement('div');
            fechaHeader.className = 'date-header';
            fechaHeader.textContent = fecha;
            transactionsContainer.appendChild(fechaHeader);
            
            // Crear las transacciones para esta fecha
            transaccionesPorFecha[fecha].forEach(transaccion => {
              const fecha = transaccion.fecha ? new Date(transaccion.fecha) : new Date();
              
              // Determinar el tipo de transacción y el icono
              let tipo = transaccion.descripcion || "Transacción";
              let iconoHTML = '';
              
              if (tipo.toLowerCase().includes("pagomovil") || transaccion.metodo_pago === "Pagomóvil") {
                tipo = "Transferencias a terceros BDV";
                iconoHTML = '<span class="transaction-icon mobile">◀</span>';
              } else if (tipo.toLowerCase().includes("transferencia")) {
                tipo = "Transferencias a terceros BDV";
                iconoHTML = '<span class="transaction-icon arrow-left">◀</span>';
              } else {
                iconoHTML = transaccion.monto < 0 ? 
                  '<span class="transaction-icon arrow-left">◀</span>' : 
                  '<span class="transaction-icon arrow-right">▶</span>';
              }
              
              const transactionElement = document.createElement('div');
              transactionElement.className = 'transaction';
              transactionElement.setAttribute('data-id', transaccion.id);
              transactionElement.innerHTML = `
                ${iconoHTML}
                <div class="transaction-details">
                  <div class="transaction-type">${tipo}</div>
                </div>
                <div class="transaction-right">
                  <div class="transaction-amount">${Math.abs(transaccion.monto).toFixed(2).replace('.', ',')} Bs</div>
                  <div class="transaction-time">${formatTime(fecha)}</div>
                </div>
              `;
              
              transactionsContainer.appendChild(transactionElement);
            });
          });

          // Agregar evento de clic a las transacciones para ver el comprobante
          document.querySelectorAll(".transaction").forEach((transaccion) => {
            transaccion.addEventListener("click", function () {
              const id = this.getAttribute("data-id")
              window.location.href = `comprobante.html?id=${id}`
            })
          })
        } else {
          console.log("No se encontraron transacciones para el dashboard, mostrando datos predeterminados");
          
          // Crear datos de ejemplo con el formato correcto
          const fechasEjemplo = {
            "DOMINGO, 22 DE DICIEMBRE": [
              { tipo: "Transferencias a terceros BDV", monto: 25.00, hora: "08:45 PM", icono: "◀" }
            ],
            "SÁBADO, 30 DE NOVIEMBRE": [
              { tipo: "PagomóvilBDV", monto: 500.00, hora: "12:41 PM", icono: "📱" }
            ],
            "JUEVES, 28 DE NOVIEMBRE": [
              { tipo: "PagomóvilBDV", monto: 235.00, hora: "05:28 PM", icono: "📱" }
            ]
          };
          
          // Generar HTML para los datos de ejemplo
          Object.keys(fechasEjemplo).forEach(fecha => {
            // Crear el encabezado de fecha
            const fechaHeader = document.createElement('div');
            fechaHeader.className = 'date-header';
            fechaHeader.textContent = fecha;
            transactionsContainer.appendChild(fechaHeader);
            
            // Crear las transacciones para esta fecha
            fechasEjemplo[fecha].forEach(trans => {
              const transactionElement = document.createElement('div');
              transactionElement.className = 'transaction';
              transactionElement.setAttribute('data-id', 'ejemplo-' + Math.random().toString(36).substring(7));
              transactionElement.innerHTML = `
                <span class="transaction-icon">${trans.icono}</span>
                <div class="transaction-details">
                  <div class="transaction-type">${trans.tipo}</div>
                </div>
                <div class="transaction-right">
                  <div class="transaction-amount">${trans.monto.toFixed(2).replace('.', ',')} Bs</div>
                  <div class="transaction-time">${trans.hora}</div>
                </div>
              `;
              
              transactionsContainer.appendChild(transactionElement);
            });
          });
        }
      } catch (error) {
        console.error("Error al cargar las transacciones recientes:", error)
        
        // En caso de error, mostrar datos de ejemplo
        transactionsContainer.innerHTML = `
          <div class="date-header">DOMINGO, 22 DE DICIEMBRE</div>
          <div class="transaction" data-id="ejemplo-1">
            <span class="transaction-icon">◀</span>
            <div class="transaction-details">
              <div class="transaction-type">Transferencias a terceros BDV</div>
            </div>
            <div class="transaction-right">
              <div class="transaction-amount">25,00 Bs</div>
              <div class="transaction-time">08:45 PM</div>
            </div>
          </div>
          <div class="date-header">SÁBADO, 30 DE NOVIEMBRE</div>
          <div class="transaction" data-id="ejemplo-2">
            <span class="transaction-icon">📱</span>
            <div class="transaction-details">
              <div class="transaction-type">PagomóvilBDV</div>
            </div>
            <div class="transaction-right">
              <div class="transaction-amount">500,00 Bs</div>
              <div class="transaction-time">12:41 PM</div>
            </div>
          </div>
        `;
      }
    }
  }
  
  // Cargar transacciones al iniciar
  cargarTransacciones();
})

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

// Función para agrupar transacciones por fecha
function agruparPorFecha(transacciones) {
  const grupos = {};

  transacciones.forEach((transaccion) => {
    // Asegurarse de que la fecha existe
    const fecha = transaccion.fecha ? new Date(transaccion.fecha) : new Date();
    const fechaFormateada = formatDateSpanish(fecha);

    if (!grupos[fechaFormateada]) {
      grupos[fechaFormateada] = [];
    }

    grupos[fechaFormateada].push(transaccion);
  });

  return grupos;
}

// Función para formatear la fecha en español
function formatDateSpanish(date) {
  const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
  const months = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", 
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];

  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];

  return `${dayName}, ${day} DE ${month}`;
}
