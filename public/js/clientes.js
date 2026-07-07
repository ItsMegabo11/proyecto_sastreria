// ====================== clientes.js ======================

let modoEditar = false;

// Inicialización
document.addEventListener("DOMContentLoaded", () => {
    cargarEmpleados();
    cargarClientes();
});

const formulario = document.getElementById("formCliente");

formulario.addEventListener("submit", guardarCliente);

document.getElementById("btnCancelar").addEventListener("click", limpiarFormulario);

// ====================== CARGAR COMBOS ======================

async function cargarEmpleados() {
    try {
        const response = await fetch(API_URL + "/employees", {
            headers: obtenerHeaders()
        });

        if (!response.ok) throw new Error("Error al cargar empleados");

        const data = await response.json();
        const empleados = data.datos || data.data || [];

        let opciones = "<option value=''>Seleccione Empleado</option>";

        empleados.forEach(emp => {
            opciones += `
                <option value="${emp.id}">
                    ${emp.first_name} ${emp.last_name}
                </option>
            `;
        });

        document.getElementById("employee_id").innerHTML = opciones;
    } catch (error) {
        console.error("Error cargando empleados:", error);
    }
}

// ====================== CARGAR CLIENTES ======================

async function cargarClientes() {
    try {
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="6" class="text-center">Cargando clientes...</td></tr>`;

        const response = await fetch(API_URL + "/customers", {
            headers: obtenerHeaders()
        });

        if (!response.ok) throw new Error(`Error HTTP: ${response.status}`);

        const data = await response.json();
        console.log("Datos de clientes recibidos:", data);

        const clientes = data.datos || data.data || data || [];

        let filas = "";

        if (clientes.length === 0) {
            filas = `<tr><td colspan="6" class="text-center">No hay clientes registrados</td></tr>`;
        } else {
            clientes.forEach(cliente => {
                filas += `
                <tr>
                    <td>${cliente.id || ''}</td>
                    <td>${cliente.first_name || ''}</td>
                    <td>${cliente.last_name || ''}</td>
                    <td>${cliente.phone || ''}</td>
                    <td>${cliente.address || ''}</td>
                    <td>
                        <button class="btn btn-warning btn-sm" onclick="editarCliente(${cliente.id})">
                            Editar
                        </button>
                        <button class="btn btn-danger btn-sm" onclick="eliminarCliente(${cliente.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>`;
            });
        }

        document.getElementById("tabla").innerHTML = filas;

    } catch (error) {
        console.error("Error al cargar clientes:", error);
        document.getElementById("tabla").innerHTML = `
            <tr><td colspan="6" class="text-center text-danger">Error al cargar los clientes</td></tr>`;
    }
}

// ====================== VALIDACIONES ======================

function validarTelefono(phone) {
    const regex = /^[67]\d{7}$/;
    return regex.test(phone);
}

function validarNombre(nombre) {
    const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
    return regex.test(nombre.trim());
}

// ====================== GUARDAR / EDITAR ======================

async function guardarCliente(e) {
    e.preventDefault();

    const first_name = document.getElementById("first_name").value.trim();
    const last_name = document.getElementById("last_name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const address = document.getElementById("address").value.trim();
    const employee_id = document.getElementById("employee_id").value;

    // Validaciones
    if (!validarNombre(first_name)) {
        alert("El nombre solo puede contener letras y espacios");
        document.getElementById("first_name").focus();
        return;
    }

    if (!validarNombre(last_name)) {
        alert("El apellido solo puede contener letras y espacios");
        document.getElementById("last_name").focus();
        return;
    }

    if (!validarTelefono(phone)) {
        alert("El teléfono debe tener 8 dígitos, comenzar con 6 o 7 y solo contener números");
        document.getElementById("phone").focus();
        return;
    }

    if (!address) {
        alert("La dirección es obligatoria");
        document.getElementById("address").focus();
        return;
    }

    if (!employee_id) {
        alert("Debe seleccionar un empleado");
        document.getElementById("employee_id").focus();
        return;
    }

    const datos = {
        first_name: first_name,
        last_name: last_name,
        phone: phone,
        address: address,
        employee_id: employee_id
    };

    let url = API_URL + "/customers";
    let metodo = "POST";

    const id = document.getElementById("cliente_id").value;

    if (modoEditar && id) {
        url = API_URL + "/customers/" + id;
        metodo = "PUT";
    }

    try {
        const response = await fetch(url, {
            method: metodo,
            headers: obtenerHeaders(),
            body: JSON.stringify(datos)
        });

        if (response.ok) {
            alert("Cliente guardado correctamente");
            limpiarFormulario();
            cargarClientes();
        } else {
            alert("Error al guardar cliente");
        }
    } catch (error) {
        console.error(error);
        alert("Error de conexión");
    }
}

// ====================== EDITAR ======================

async function editarCliente(id) {
    try {
        const response = await fetch(API_URL + "/customers/" + id, {
            headers: obtenerHeaders()
        });

        const data = await response.json();
        const cliente = data.datos || data.data || data;

        document.getElementById("cliente_id").value = cliente.id;
        document.getElementById("first_name").value = cliente.first_name || "";
        document.getElementById("last_name").value = cliente.last_name || "";
        document.getElementById("phone").value = cliente.phone || "";
        document.getElementById("address").value = cliente.address || "";
        document.getElementById("employee_id").value = cliente.employee_id || "";

        modoEditar = true;
        window.scrollTo(0, 0);
    } catch (error) {
        console.error("Error al editar cliente:", error);
        alert("No se pudo cargar el cliente");
    }
}

// ====================== ELIMINAR ======================

async function eliminarCliente(id) {
    if (!confirm("Estas seguro de eliminar este cliente?")) return;

    try {
        await fetch(API_URL + "/customers/" + id, {
            method: "DELETE",
            headers: obtenerHeaders()
        });
        cargarClientes();
    } catch (error) {
        alert("Error al eliminar el cliente");
    }
}

// ====================== LIMPIAR FORMULARIO ======================

function limpiarFormulario() {
    formulario.reset();
    document.getElementById("cliente_id").value = "";
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