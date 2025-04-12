import supabase from "./supabase-config.js"

// Función para guardar una transacción en la base de datos
export async function guardarTransaccion(transaccion) {
  try {
    console.log("Intentando guardar transacción en Supabase:", transaccion);
    
    // Asegurarse de que la transacción tiene un ID como cadena de texto
    const id = String(transaccion.id || Date.now());
    
    // Crear el objeto a insertar en Supabase
    const transaccionParaSupabase = {
      id: id, // Asegurarse de que sea una cadena de texto
      fecha: transaccion.fecha || new Date().toISOString(),
      monto: Number(transaccion.monto),
      descripcion: transaccion.descripcion || "",
      metodo_pago: transaccion.metodo_pago || "Pagomóvil",
      estado: transaccion.estado || "completado",
      id_usuario: String(transaccion.id_usuario || "usuario_default"),
      banco_destino: String(transaccion.banco_destino || ""),
      telefono_destino: String(transaccion.telefono_destino || ""),
      documento: String(transaccion.documento || ""),
      concepto: String(transaccion.concepto || "")
    };
    
    console.log("Objeto a insertar en Supabase:", transaccionParaSupabase);
    
    // Guardar en Supabase
    const { data, error } = await supabase
      .from("transacciones")
      .insert([transaccionParaSupabase]);
    
    if (error) {
      console.error("Error detallado al guardar en Supabase:", error);
      
      // Guardar en localStorage como respaldo
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      localTransacciones.push({...transaccion, id: id});
      localStorage.setItem('transacciones', JSON.stringify(localTransacciones));
      
      throw error;
    }
    
    console.log("Transacción guardada exitosamente en Supabase:", data);
    
    // También guardar en localStorage como respaldo
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    localTransacciones.push({...transaccion, id: id});
    localStorage.setItem('transacciones', JSON.stringify(localTransacciones));
    
    return data || {...transaccion, id: id};
  } catch (error) {
    console.error("Error al guardar la transacción:", error);
    
    // En caso de error, guardar solo en localStorage
    const id = String(transaccion.id || Date.now());
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    localTransacciones.push({...transaccion, id: id});
    localStorage.setItem('transacciones', JSON.stringify(localTransacciones));
    
    throw error;
  }
}

// Función para obtener todas las transacciones
export async function obtenerTransacciones() {
  try {
    console.log("Obteniendo transacciones de Supabase...");
    const { data, error } = await supabase.from("transacciones").select("*").order("fecha", { ascending: false });
    
    if (error) {
      console.error("Error al obtener transacciones de Supabase:", error);
      // Si hay error, usar localStorage como respaldo
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return localTransacciones;
    }
    
    console.log("Transacciones obtenidas de Supabase:", data);
    
    // Actualizar localStorage con los datos de Supabase
    localStorage.setItem('transacciones', JSON.stringify(data || []));
    
    return data || [];
  } catch (error) {
    console.error("Error al obtener transacciones:", error);
    // En caso de error, usar localStorage
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    return localTransacciones;
  }
}

// Función para obtener una transacción específica
export async function obtenerTransaccion(id) {
  try {
    console.log("Buscando transacción en Supabase con ID:", id);
    const { data, error } = await supabase.from("transacciones").select("*").eq("id", id).single();
    
    if (error) {
      console.error("Error al obtener transacción de Supabase:", error);
      // Si hay error, buscar en localStorage
      const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
      return localTransacciones.find(t => t.id === id);
    }
    
    console.log("Transacción encontrada en Supabase:", data);
    return data;
  } catch (error) {
    console.error("Error al obtener transacción:", error);
    // En caso de error, buscar en localStorage
    const localTransacciones = JSON.parse(localStorage.getItem('transacciones') || '[]');
    return localTransacciones.find(t => t.id === id);
  }
}
