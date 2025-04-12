import { guardarTransaccion } from "./transacciones.js"

document.addEventListener("DOMContentLoaded", () => {
  // Obtener el formulario de pago
  const paymentForm = document.getElementById("paymentForm")
  
  // Definir las funciones globalmente para que estén disponibles desde el HTML
  window.closePasswordModal = function() {
    document.getElementById('passwordModal').style.display = 'none';
    document.getElementById('passwordInput').value = '';
  }
  
  window.showFormView = function() {
    document.getElementById('formView').classList.add('active');
    document.getElementById('confirmView').classList.remove('active');
    document.getElementById('receiptView').classList.remove('active');
  }
  
  window.showConfirmView = function() {
    document.getElementById('formView').classList.remove('active');
    document.getElementById('confirmView').classList.add('active');
    document.getElementById('receiptView').classList.remove('active');
  }
  
  window.showReceiptView = function() {
    document.getElementById('formView').classList.remove('active');
    document.getElementById('confirmView').classList.remove('active');
    document.getElementById('receiptView').classList.add('active');
  }
  
  window.showToast = function(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.style.display = 'block';
    setTimeout(() => {
      toast.style.display = 'none';
    }, 3000);
  }
  
  window.generateRandomOperation = function() {
    return Math.floor(100000000000 + Math.random() * 900000000000).toString();
  }
  
  window.generateRandomOrigin = function() {
    const prefix = "0102";
    const randomSuffix = Math.floor(1000 + Math.random() * 9000).toString();
    return `${prefix}****${randomSuffix}`;
  }

  window.confirmPayment = function() {
    document.getElementById('passwordModal').style.display = 'flex';
  }

  // Agregar evento para manejar la validación de contraseña y guardar la transacción
  if (paymentForm) {
    // Función para validar la contraseña y procesar el pago
    window.validatePassword = async () => {
      try {
        const password = document.getElementById("passwordInput").value
        const validPasswords = ["michael1.544@", "33310696", "mauropirueta33", "sincreencias", "angelo14"]

        if (validPasswords.includes(password)) {
          window.closePasswordModal();

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
            console.log("Transacción guardada:", transaccion);

            // Generar número de operación aleatorio
            document.getElementById("receiptOperation").value = window.generateRandomOperation();
            document.getElementById("receiptOrigin").value = window.generateRandomOrigin();
            document.getElementById("receiptDate").value = new Date().toLocaleDateString();

            // Mostrar el comprobante
            window.showReceiptView();

            // Mostrar mensaje de éxito
            window.showToast("Transacción guardada correctamente");
          } catch (error) {
            console.error("Error al guardar la transacción:", error)
            window.showToast("Error al guardar la transacción, pero se procederá a mostrar el recibo");
            
            // Aun si hay error con la base de datos, mostrar el recibo
            document.getElementById("receiptOperation").value = window.generateRandomOperation();
            document.getElementById("receiptOrigin").value = window.generateRandomOrigin();
            document.getElementById("receiptDate").value = new Date().toLocaleDateString();
            window.showReceiptView();
          }
        } else {
          window.showToast("Contraseña incorrecta");
        }
      } catch (error) {
        console.error("Error en validatePassword:", error);
        window.showToast("Error en el proceso de validación");
      }
    }

    // Agregar la función clearForm al objeto window
    window.clearForm = function() {
      document.getElementById('paymentForm').reset();
    }
  }
})
