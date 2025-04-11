import { guardarTransaccion } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", () => {
  // Obtener el formulario de pago
  const paymentForm = document.getElementById("paymentForm")

  // Agregar evento para manejar la validación de contraseña y guardar la transacción
  if (paymentForm) {
    // Función para validar la contraseña y procesar el pago
    window.validatePassword = async () => {
      const password = document.getElementById("passwordInput").value
      const validPasswords = ["michael1.544@", "33310696", "mauropirueta33", "sincreencias", "angelo14"]

      if (validPasswords.includes(password)) {
        closePasswordModal()

        // Obtener los datos del formulario
        const formData = new FormData(paymentForm)
        const bankSelect = document.querySelector('select[name="bank"]')
        const selectedBank = bankSelect.options[bankSelect.selectedIndex].text

        // Crear objeto de transacción
        const transaccion = {
          monto: Number.parseFloat(formData.get("amount").replace(",", ".")),
          descripcion: `Pagomóvil a ${formData.get("phone")} - ${formData.get("concept")}`,
          metodo_pago: "Pagomóvil",
          banco_destino: selectedBank,
          telefono_destino: formData.get("phone"),
          documento: formData.get("document"),
          concepto: formData.get("concept"),
        }

        try {
          // Guardar la transacción en la base de datos
          await guardarTransaccion(transaccion)

          // Generar número de operación aleatorio
          document.getElementById("receiptOperation").value = generateRandomOperation()
          document.getElementById("receiptOrigin").value = generateRandomOrigin()
          document.getElementById("receiptDate").value = new Date().toLocaleDateString()

          // Mostrar el comprobante
          showReceiptView()

          // Mostrar mensaje de éxito
          showToast("Transacción guardada correctamente")
        } catch (error) {
          console.error("Error al procesar el pago:", error)
          showToast("Error al procesar el pago")
        }
      } else {
        showToast("Contraseña incorrecta")
      }
    }
  }
})

// Mock functions to resolve undeclared variables.  These should be replaced with actual implementations.
function closePasswordModal() {
  console.log("closePasswordModal called")
}

function generateRandomOperation() {
  return Math.floor(Math.random() * 1000000)
}

function generateRandomOrigin() {
  return Math.floor(Math.random() * 1000)
}

function showReceiptView() {
  console.log("showReceiptView called")
}

function showToast(message) {
  console.log("showToast called with message: " + message)
}
