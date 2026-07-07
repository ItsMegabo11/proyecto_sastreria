// ====================== entregas.js ======================

let modoEditar = false;

const ESTADOS_ENTREGA = [
    { id: 1, nombre: "Pending" },
    { id: 2, nombre: "On The Way" },
    { id: 3, nombre: "Delivered" }
];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarEntregas();
});

const formulario = document.getElementById("formEntrega");

formulario.addEventListener("submit", guardarEntrega);

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

// ====================== CARGAR COMBOS ======================

async function cargarCombos() {
    await cargarPedidos();

    let opciones = "<option value=''>Seleccione Estado</option>";

    ESTADOS_ENTREGA.forEach(estado => {
        opciones += `
            <option value="${estado.id}">${estado.nombre}</option>
        `;
    });

    document.getElementById("delivery_status_id").innerHTML = opciones;
}

async function cargarPedidos() {
    try {
        const response = await fetch(API_URL + "/orders", {
            headers: obtenerHeaders()
        });

        if (!response.ok) throw new Error("Error al cargar pedidos");

        const data = await response.json();
        const pedidos = data.datos || data.data || [];

        let opciones = "<option value=''>Seleccione Pedido</option>";

        pedidos.forEach(pedido => {
            opciones += `
                <option value="${pedido.id}">
                    Pedido #${pedido.id} - Bs. ${pedido.price || pedido.total || '0'}
                </option>
            `;
        });

        document.getElementById("order_id").innerHTML = opciones;
    } catch (error) {
        console.error("Error cargando pedidos:", error);
    }
}

// ====================== CARGAR ENTREGAS (CORREGIDO) ======================

async function cargarEntregas() {
    try {
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="7" class="text-center">Cargando entregas...</td></tr>`;

        const response = await fetch(API_URL + "/deliveries", {
            headers: obtenerHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos de entregas recibidos:", data); // Debug
        const entregas = data.datos || data.data || data || [];

        let filas = "";

        if (entregas.length === 0) {
            filas = `<tr><td colspan="7" class="text-center">No hay entregas registradas</td></tr>`;
        } else {
            entregas.forEach(entrega => {
                const fecha = entrega.final_delivery_date 
                    ? entrega.final_delivery_date.split("T")[0] 
                    : "Sin fecha";

                filas += `
                <tr>
                    <td>${entrega.id || ''}</td>
                    <td>${fecha}</td>
                    <td>${entrega.delivery_address || ''}</td>
                    <td>${entrega.phone || ''}</td>
                    <td>${entrega.order?.id || entrega.order_id || 'N/A'}</td>
                    <td>${entrega.delivery_status?.name || entrega.delivery_status || 'Sin estado'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarEntrega(${entrega.id})">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarEntrega(${entrega.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
            });
        }

        document.getElementById("tabla").innerHTML = filas;

    } catch (error) {
        console.error("Error al cargar entregas:", error);
        document.getElementById("tabla").innerHTML = `
            <tr>
                <td colspan="7" class="text-center text-danger">
                    Error al cargar las entregas<br>
                    <small>${error.message}</small>
                </td>
            </tr>`;
    }
}

// ====================== GUARDAR / EDITAR ======================

async function guardarEntrega(e) {
    e.preventDefault();

    const fechaInput = document.getElementById("final_delivery_date").value;
    if (fechaInput && new Date(fechaInput) < new Date().setHours(0,0,0,0)) {
        alert("La fecha de entrega no puede estar en el pasado");
        return;
    }

    const datos = {
        final_delivery_date: document.getElementById("final_delivery_date").value,
        delivery_address: document.getElementById("delivery_address").value,
        phone: document.getElementById("phone").value,
        order_id: document.getElementById("order_id").value,
        delivery_status_id: document.getElementById("delivery_status_id").value
    };

    let url = API_URL + "/deliveries";
    let metodo = "POST";

    const id = document.getElementById("entrega_id").value;

    if (modoEditar && id) {
        url = API_URL + "/deliveries/" + id;
        metodo = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: obtenerHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Entrega guardada correctamente");
            limpiarFormulario();
            cargarEntregas();
        } else {
            alert("Error al guardar la entrega");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

// ====================== EDITAR ======================

async function editarEntrega(id) {
    try {
        const response = await fetch(API_URL + "/deliveries/" + id, {
            headers: obtenerHeaders()
        });

        const data = await response.json();
        const entrega = data.datos || data.data || data;

        document.getElementById("entrega_id").value = entrega.id;
        document.getElementById("final_delivery_date").value = entrega.final_delivery_date?.split("T")[0] || "";
        document.getElementById("delivery_address").value = entrega.delivery_address || "";
        document.getElementById("phone").value = entrega.phone || "";
        document.getElementById("order_id").value = entrega.order_id || entrega.order?.id || "";
        document.getElementById("delivery_status_id").value = entrega.delivery_status_id || "";

        modoEditar = true;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error al editar:", error);
        alert("No se pudo cargar la entrega para editar");
    }
}

// ====================== ELIMINAR ======================

async function eliminarEntrega(id) {
    if (!confirm("¿Estás seguro de eliminar esta entrega?")) return;

    try {
        await fetch(API_URL + "/deliveries/" + id, {
            method: "DELETE",
            headers: obtenerHeaders()
        });
        cargarEntregas();
    } catch (error) {
        console.error(error);
        alert("Error al eliminar la entrega");
    }
}

// ====================== LIMPIAR FORMULARIO ======================

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("entrega_id").value = "";
    modoEditar = false;
}

// ====================== BUSCADOR ======================

document.getElementById("buscador").addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tabla tr");

    filas.forEach(fila => {
        const contenido = fila.textContent.toLowerCase();
        fila.style.display = contenido.includes(texto) ? "" : "none";
    });
});