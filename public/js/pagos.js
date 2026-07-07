// ====================== pagos.js ======================

let modoEditar = false;

const METODOS_PAGO = [
    { id: 1, nombre: "Cash" },
    { id: 2, nombre: "Transfer" },
    { id: 3, nombre: "QR" },
    { id: 4, nombre: "Card" }
];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarPagos();
});

const formulario = document.getElementById("formPago");

formulario.addEventListener("submit", guardarPago);

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

// ====================== CARGAR COMBOS ======================

async function cargarCombos() {
    await cargarPedidos();

    let opciones = "<option value=''>Seleccione Método</option>";

    METODOS_PAGO.forEach(metodo => {
        opciones += `
            <option value="${metodo.id}">${metodo.nombre}</option>
        `;
    });

    document.getElementById("payment_method_id").innerHTML = opciones;
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

// ====================== CARGAR PAGOS ======================

async function cargarPagos() {
    try {
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="6" class="text-center">Cargando pagos...</td></tr>`;

        const response = await fetch(API_URL + "/payments", {
            headers: obtenerHeaders()
        });

        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos de pagos recibidos:", data); // Debug

        const pagos = data.datos || data.data || data || [];

        let filas = "";

        if (pagos.length === 0) {
            filas = `<tr><td colspan="6" class="text-center">No hay pagos registrados</td></tr>`;
        } else {
            pagos.forEach(pago => {
                const fecha = pago.payment_date 
                    ? pago.payment_date.split("T")[0] 
                    : "Sin fecha";

                filas += `
                <tr>
                    <td>${pago.id || ''}</td>
                    <td>Bs. ${parseFloat(pago.amount || 0).toFixed(2)}</td>
                    <td>${fecha}</td>
                    <td>${pago.order?.id || pago.order_id || 'N/A'}</td>
                    <td>${pago.payment_method?.name || pago.payment_method || 'Sin método'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarPago(${pago.id})">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPago(${pago.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
            });
        }

        document.getElementById("tabla").innerHTML = filas;

    } catch (error) {
        console.error("Error al cargar pagos:", error);
        document.getElementById("tabla").innerHTML = `
            <tr>
                <td colspan="6" class="text-center text-danger">
                    Error al cargar los pagos<br>
                    <small>${error.message}</small>
                </td>
            </tr>`;
    }
}

// ====================== GUARDAR / EDITAR ======================

async function guardarPago(e) {
    e.preventDefault();

    const datos = {
        amount: document.getElementById("amount").value,
        payment_date: document.getElementById("payment_date").value,
        order_id: document.getElementById("order_id").value,
        payment_method_id: document.getElementById("payment_method_id").value
    };

    let url = API_URL + "/payments";
    let metodo = "POST";

    const id = document.getElementById("pago_id").value;

    if (modoEditar && id) {
        url = API_URL + "/payments/" + id;
        metodo = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: obtenerHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Pago guardado correctamente");
            limpiarFormulario();
            cargarPagos();
        } else {
            alert("Error al guardar el pago");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

// ====================== EDITAR ======================

async function editarPago(id) {
    try {
        const response = await fetch(API_URL + "/payments/" + id, {
            headers: obtenerHeaders()
        });

        const data = await response.json();
        const pago = data.datos || data.data || data;

        document.getElementById("pago_id").value = pago.id;
        document.getElementById("amount").value = pago.amount;
        document.getElementById("payment_date").value = pago.payment_date?.split("T")[0] || "";
        document.getElementById("order_id").value = pago.order_id || pago.order?.id || "";
        document.getElementById("payment_method_id").value = pago.payment_method_id || "";

        modoEditar = true;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error al editar pago:", error);
        alert("No se pudo cargar el pago para editar");
    }
}

// ====================== ELIMINAR ======================

async function eliminarPago(id) {
    if (!confirm("¿Estás seguro de eliminar este pago?")) return;

    try {
        await fetch(API_URL + "/payments/" + id, {
            method: "DELETE",
            headers: obtenerHeaders()
        });
        cargarPagos();
    } catch (error) {
        console.error(error);
        alert("Error al eliminar el pago");
    }
}

// ====================== LIMPIAR FORMULARIO ======================

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("pago_id").value = "";
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