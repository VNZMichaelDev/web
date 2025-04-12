import supabase from "./supabase-config.js"

// Función para guardar una transacción en la base de datos
export async function guardarTransaccion(transaccion) {
  try {
    console.log("Intentando guardar transacción:", transaccion);
    
    // Intentar guardar en Supabase
    const { data, error } = await supabase.from("transacciones").insert([
      {
        monto: transaccion.monto,
        descripcion: transaccion.descripcion,
        metodo_pago: transaccion.metodo_pago,
        estado: "completado",
        id_usuario: transaccion.id_usuario || "usuario_default",
        banco_destino: transaccion.banco_destino,
        telefono_destino: transaccion.telefono_destino,
        documento: transaccion.documento,
        concepto: transaccion.concepto,
      },
    ])

    if (error) {
      console.error("Error de Supabase:", error)
      
      // Guardar localmente si hay un error con Supabase
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
      const nuevaTransaccion = {
        id: Date.now().toString(),
        fecha: new Date().toISOString(),
        ...transaccion,
        estado: "completado"
      }
      localTransacciones.push(nuevaTransaccion)
      localStorage.setItem('transacciones', JSON.stringify(localTransacciones))
      console.log("Transacción guardada localmente:", nuevaTransaccion)
      
      return nuevaTransaccion
    }
    
    return data
  } catch (error) {
    console.error("Error general al guardar la transacción:", error)
    
    // Guardar localmente en caso de error
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
    const nuevaTransaccion = {
      id: Date.now().toString(),
      fecha: new Date().toISOString(),
      ...transaccion,
      estado: "completado"
    }
    localTransacciones.push(nuevaTransaccion)
    localStorage.setItem('transacciones', JSON.stringify(localTransacciones))
    console.log("Transacción guardada localmente:", nuevaTransaccion)
    
    return nuevaTransaccion
  }
}

// Función para obtener todas las transacciones
export async function obtenerTransacciones() {
  try {
    const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false })

    if (error) {
      console.error("Error de Supabase al obtener transacciones:", error)
      // Si hay error, intentar obtener de localStorage
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
      return localTransacciones
    }
    
    return data
  } catch (error) {
    console.error("Error general al obtener las transacciones:", error)
    // Si hay error, intentar obtener de localStorage
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
    return localTransacciones
  }
}

// Función para obtener una transacción específica
export async function obtenerTransaccion(id) {
  try {
    const { data, error } = await supabase.from("transacciones").select("*").eq("id", id).single()

    if (error) {
      console.error("Error de Supabase al obtener la transacción:", error)
      // Si hay error, intentar obtener de localStorage
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
      return localTransacciones.find(t => t.id === id)
    }
    
    return data
  } catch (error) {
    console.error("Error general al obtener la transacción:", error)
    // Si hay error, intentar obtener de localStorage
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]')
    return localTransacciones.find(t => t.id === id)
  }
}
