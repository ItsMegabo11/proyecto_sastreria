// ====================== pedidos.js ======================

let modoEditar = false;

const TALLAS = [
    { id: 1, nombre: "S" }, 
    { id: 2, nombre: "M" }, 
    { id: 3, nombre: "L" },
    { id: 4, nombre: "XL" }, 
    { id: 5, nombre: "XXL" }
];

const COLORES = [
    { id: 1, nombre: "Black" }, 
    { id: 2, nombre: "White" }, 
    { id: 3, nombre: "Blue" },
    { id: 4, nombre: "Red" }, 
    { id: 5, nombre: "Green" }, 
    { id: 6, nombre: "Brown" },
    { id: 7, nombre: "Gray" }, 
    { id: 8, nombre: "Yellow" }, 
    { id: 9, nombre: "Purple" },
    { id: 10, nombre: "Pink" }
];

const ESTADOS = [
    { id: 1, nombre: "Pending" },
    { id: 2, nombre: "In Progress" },
    { id: 3, nombre: "Finished" },
    { id: 4, nombre: "Delivered" }
];

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarCombos();
    cargarPedidos();
});

const formulario = document.getElementById("formPedido");

formulario.addEventListener("submit", guardarPedido);

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

// ====================== CARGAR COMBOS ======================

async function cargarCombos() {
    await cargarClientes();
    cargarTallas();
    cargarColores();
    cargarEstados();
}

async function cargarClientes() {
    try {
        const response = await fetch(API_URL + "/customers", {
            headers: obtenerHeaders()
        });

        if (!response.ok) throw new Error("Error al cargar clientes");

        const data = await response.json();
        const clientes = data.datos || data.data || [];

        let opciones = "<option value=''>Seleccione Cliente</option>";

        clientes.forEach(cliente => {
            opciones += `
                <option value="${cliente.id}">
                    ${cliente.first_name} ${cliente.last_name}
                </option>
            `;
        });

        document.getElementById("customer_id").innerHTML = opciones;
    } catch (error) {
        console.error("Error cargando clientes:", error);
    }
}

function cargarTallas() {
    let opciones = "<option value=''>Seleccione Talla</option>";
    TALLAS.forEach(talla => {
        opciones += `<option value="${talla.id}">${talla.nombre}</option>`;
    });
    document.getElementById("size_id").innerHTML = opciones;
}

function cargarColores() {
    let opciones = "<option value=''>Seleccione Color</option>";
    COLORES.forEach(color => {
        opciones += `<option value="${color.id}">${color.nombre}</option>`;
    });
    document.getElementById("color_id").innerHTML = opciones;
}

function cargarEstados() {
    let opciones = "<option value=''>Seleccione Estado</option>";
    ESTADOS.forEach(estado => {
        opciones += `<option value="${estado.id}">${estado.nombre}</option>`;
    });
    document.getElementById("order_status_id").innerHTML = opciones;
}

// ====================== CARGAR PEDIDOS ======================

async function cargarPedidos() {
    try {
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="7" class="text-center">Cargando pedidos...</td></tr>`;

        const response = await fetch(API_URL + "/orders", {
            headers: obtenerHeaders()
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Datos de pedidos recibidos:", data);

        const pedidos = data.datos || data.data || data || [];

        let filas = "";

        if (pedidos.length === 0) {
            filas = `<tr><td colspan="7" class="text-center">No hay pedidos registrados</td></tr>`;
        } else {
            pedidos.forEach(pedido => {
                const fechaPedido = pedido.order_date ? pedido.order_date.split("T")[0] : "";
                const fechaEntrega = pedido.delivery_date ? pedido.delivery_date.split("T")[0] : "";

                filas += `
                <tr>
                    <td>${pedido.id || ''}</td>
                    <td>${pedido.customer?.first_name || ''} ${pedido.customer?.last_name || ''}</td>
                    <td>${fechaPedido}</td>
                    <td>${fechaEntrega}</td>
                    <td>Bs. ${parseFloat(pedido.price || 0).toFixed(2)}</td>
                    <td>${pedido.order_status?.name || pedido.order_status || 'Sin estado'}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarPedido(${pedido.id})">Editar</button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarPedido(${pedido.id})">Eliminar</button>
                    </td>
                </tr>`;
            });
        }

        document.getElementById("tabla").innerHTML = filas;

    } catch (error) {
        console.error("Error al cargar pedidos:", error);
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="7" class="text-center text-danger">Error al cargar los pedidos</td></tr>`;
    }
}

// ====================== VALIDACIÓN DE FECHAS ======================

function validarFechasPedido(orderDate, deliveryDate) {
    if (!orderDate || !deliveryDate) return true;
    
    const fechaPedido = new Date(orderDate);
    const fechaEntrega = new Date(deliveryDate);
    
    return fechaEntrega >= fechaPedido;
}

// ====================== GUARDAR / EDITAR ======================

async function guardarPedido(e) {
    e.preventDefault();

    const order_date = document.getElementById("order_date").value;
    const delivery_date = document.getElementById("delivery_date").value;

    if (!validarFechasPedido(order_date, delivery_date)) {
        alert("La fecha de entrega no puede ser anterior a la fecha del pedido");
        document.getElementById("delivery_date").focus();
        return;
    }

    const datos = {
        order_date: order_date,
        delivery_date: delivery_date,
        price: document.getElementById("price").value,
        customer_id: document.getElementById("customer_id").value,
        size_id: document.getElementById("size_id").value,
        color_id: document.getElementById("color_id").value,
        order_status_id: document.getElementById("order_status_id").value
    };

    let url = API_URL + "/orders";
    let metodo = "POST";
    const id = document.getElementById("pedido_id").value;

    if (modoEditar && id) {
        url = API_URL + "/orders/" + id;
        metodo = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: obtenerHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Pedido guardado correctamente");
            limpiarFormulario();
            cargarPedidos();
        } else {
            alert("Error al guardar el pedido");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

// ====================== EDITAR ======================

async function editarPedido(id) {
    try {
        const response = await fetch(API_URL + "/orders/" + id, {
            headers: obtenerHeaders()
        });

        const data = await response.json();
        const pedido = data.datos || data.data || data;

        document.getElementById("pedido_id").value = pedido.id;
        document.getElementById("order_date").value = pedido.order_date?.split("T")[0] || "";
        document.getElementById("delivery_date").value = pedido.delivery_date?.split("T")[0] || "";
        document.getElementById("price").value = pedido.price || "";
        document.getElementById("customer_id").value = pedido.customer_id || pedido.customer?.id || "";
        document.getElementById("size_id").value = pedido.size_id || "";
        document.getElementById("color_id").value = pedido.color_id || "";
        document.getElementById("order_status_id").value = pedido.order_status_id || "";

        modoEditar = true;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error al editar:", error);
        alert("No se pudo cargar el pedido");
    }
}

// ====================== ELIMINAR ======================

async function eliminarPedido(id) {
    if (!confirm("¿Estás seguro de eliminar este pedido?")) return;

    try {
        await fetch(API_URL + "/orders/" + id, {
            method: "DELETE",
            headers: obtenerHeaders()
        });
        cargarPedidos();
    } catch (error) {
        alert("Error al eliminar el pedido");
    }
}

// ====================== LIMPIAR ======================

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("pedido_id").value = "";
    modoEditar = false;
}

// ====================== BUSCADOR ======================

document.getElementById("buscador").addEventListener("keyup", function () {
    const texto = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tabla tr");
    filas.forEach(fila => {
        fila.style.display = fila.textContent.toLowerCase().includes(texto) ? "" : "none";
    });
});