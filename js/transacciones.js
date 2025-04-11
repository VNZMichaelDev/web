import supabase from "./supabase-config.js"

// Función para guardar una transacción en la base de datos
export async function guardarTransaccion(transaccion) {
  try {
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

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al guardar la transacción:", error)
    throw error
  }
}

// Función para obtener todas las transacciones
export async function obtenerTransacciones() {
  try {
    const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false })

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener las transacciones:", error)
    return []
  }
}

// Función para obtener una transacción específica
export async function obtenerTransaccion(id) {
  try {
    const { data, error } = await supabase.from("transacciones").select("*").eq("id", id).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error al obtener la transacción:", error)
    return null
  }
}
