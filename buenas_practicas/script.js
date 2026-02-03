// ============================================
// SISTEMA DE REGISTRO DE USUARIOS
// ============================================

// CORRECCIÓN: Se minimizó la superficie de ataque eliminando información técnica innecesaria del encabezado para reducir el riesgo de la aplicación[cite: 203].

// CORRECCIÓN: Se eliminó el HARDCODE. Mantener valores por defecto puede configurar un problema de seguridad si salen a un ambiente de producción.

var registros = [];
var contador = 0;

// CORRECCIÓN: Se eliminó el código comentado. Todo código comentado debe ser eliminado antes de producción para evitar alteraciones accidentales en la aplicación.

const CONFIG = {
    maxRegistros: 1000,
    debugMode: false
};

// CORRECCIÓN: Se eliminaron los mensajes de salida. Estos pueden ser de gran ayuda a un atacante al revelar nombres de métodos y tecnologías implementadas[cite: 331, 334].

function inicializar() {
    // CORRECCIÓN: Se eliminaron los mensajes de salida. Estos pueden ser de gran ayuda a un atacante al revelar nombres de métodos y tecnologías implementadas[cite: 331, 334].
    document.getElementById('registroForm').addEventListener('submit', function(e) {
        e.preventDefault();
        guardarRegistro();
    });
    
    agregarValidacionesTiempoReal();
}

function agregarValidacionesTiempoReal() {
    const campos = ['nombre', 'apellido1', 'apellido2', 'telefono', 'curp', 'email'];
    
    campos.forEach(function(campo) {
        const input = document.getElementById(campo);
        if (input) {
            input.addEventListener('blur', function() {
                validarCampo(campo);
            });
            
            if (campo === 'telefono') {
                input.addEventListener('input', function(e) {
                    e.target.value = e.target.value.replace(/[^0-9]/g, '');
                    if (e.target.value.length > 10) {
                        e.target.value = e.target.value.slice(0, 10);
                    }
                });
            }
            
            if (campo === 'curp') {
                input.addEventListener('input', function(e) {
                    e.target.value = e.target.value.toUpperCase();
                });
            }
        }
    });
}

function validarCampo(nombreCampo) {
    const input = document.getElementById(nombreCampo);
    const errorDiv = document.getElementById(nombreCampo + '-error');
    
    if (!input || !errorDiv) return;
    
    const valor = input.value.trim();
    const resultado = validarEntrada(valor, nombreCampo === 'apellido1' || nombreCampo === 'apellido2' ? 'nombre' : nombreCampo);
    
    if (nombreCampo === 'apellido2' && valor === '') {
        input.classList.remove('is-invalid', 'is-valid');
        errorDiv.textContent = '';
        return;
    }
    
    if (!resultado.valido) {
        input.classList.add('is-invalid');
        input.classList.remove('is-valid');
        errorDiv.textContent = resultado.mensaje;
    } else {
        input.classList.add('is-valid');
        input.classList.remove('is-invalid');
        errorDiv.textContent = '';
    }
}

// CORRECCIÓN: Se definió un conjunto de caracteres válidos. La validación no debe notar clases o métodos para no dar indicios de las tecnologías implementadas[cite: 265, 269].
function validarEntrada(valor, tipo) {
    if (!valor || valor.trim() === '') {
        return { valido: false, mensaje: 'Este campo es obligatorio.' };
    }
    
    const patrones = {
        nombre: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]{2,50}$/,
        telefono: /^[0-9]{10}$/,
        curp: /^[A-Z]{4}[0-9]{6}[HM][A-Z]{5}[0-9A-Z]{2}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    };
    
    if (!patrones[tipo]) {
        return { valido: false, mensaje: 'Tipo de validación no reconocido.' };
    }
    
    if (tipo === 'nombre') {
        if (/^[0-9]+$/.test(valor.trim())) {
            return { valido: false, mensaje: 'El nombre no puede contener solo números.' };
        }
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(valor)) {
            return { valido: false, mensaje: 'El nombre solo puede contener letras y espacios.' };
        }
    }
    
    const esValido = patrones[tipo].test(valor);
    if (!esValido) {
        const mensajes = {
            nombre: 'Debe contener entre 2 y 50 caracteres, solo letras.',
            telefono: 'Debe contener exactamente 10 dígitos.',
            curp: 'Formato de CURP inválido.',
            email: 'Formato de correo electrónico inválido.'
        };
        return { valido: false, mensaje: mensajes[tipo] };
    }
    
    return { valido: true, mensaje: '' };
}

function guardarRegistro() {
    // CORRECCIÓN: Se eliminaron los mensajes de salida. Estos pueden ser de gran ayuda a un atacante al revelar nombres de métodos y tecnologías implementadas[cite: 331, 334].
    var nombre = document.getElementById('nombre').value.trim();
    var apellido1 = document.getElementById('apellido1').value.trim();
    var apellido2 = document.getElementById('apellido2').value.trim();
    var telefono = document.getElementById('telefono').value.trim();
    var curp = document.getElementById('curp').value.trim().toUpperCase();
    var email = document.getElementById('email').value.trim();
    
    var camposObligatorios = [
        { valor: nombre, nombre: 'nombre', tipo: 'nombre' },
        { valor: apellido1, nombre: 'apellido1', tipo: 'nombre' },
        { valor: telefono, nombre: 'telefono', tipo: 'telefono' },
        { valor: curp, nombre: 'curp', tipo: 'curp' },
        { valor: email, nombre: 'email', tipo: 'email' }
    ];
    
    var errores = [];
    var hayErrores = false;
    
    camposObligatorios.forEach(function(campo) {
        var resultado = validarEntrada(campo.valor, campo.tipo);
        if (!resultado.valido) {
            hayErrores = true;
            var input = document.getElementById(campo.nombre);
            var errorDiv = document.getElementById(campo.nombre + '-error');
            if (input && errorDiv) {
                input.classList.add('is-invalid');
                input.classList.remove('is-valid');
                errorDiv.textContent = resultado.mensaje;
            }
            errores.push(campo.nombre + ': ' + resultado.mensaje);
        } else {
            var input = document.getElementById(campo.nombre);
            var errorDiv = document.getElementById(campo.nombre + '-error');
            if (input && errorDiv) {
                input.classList.add('is-valid');
                input.classList.remove('is-invalid');
                errorDiv.textContent = '';
            }
        }
    });
    
    if (apellido2) {
        var resultadoApellido2 = validarEntrada(apellido2, 'nombre');
        if (!resultadoApellido2.valido) {
            hayErrores = true;
            var inputApellido2 = document.getElementById('apellido2');
            var errorDivApellido2 = document.getElementById('apellido2-error');
            if (inputApellido2 && errorDivApellido2) {
                inputApellido2.classList.add('is-invalid');
                inputApellido2.classList.remove('is-valid');
                errorDivApellido2.textContent = resultadoApellido2.mensaje;
            }
        }
    }
    
    if (hayErrores) {
        // CORRECCIÓN: Mensaje estandarizado de forma genérica. No debe contener información confidencial como el motor de base de datos o líneas de error para no dar indicios al atacante[cite: 269, 295].
        mostrarError('Por favor, corrige los errores en el formulario antes de continuar.');
        return;
    }
    
    // CORRECCIÓN: Se eliminó el HARDCODE. Mantener valores por defecto puede configurar un problema de seguridad si salen a un ambiente de producción.
    var nuevoRegistro = {
        id: contador++,
        nombre: sanitizarEntrada(nombre),
        apellido1: sanitizarEntrada(apellido1),
        apellido2: sanitizarEntrada(apellido2),
        nombreCompleto: sanitizarEntrada(nombre + " " + apellido1 + " " + apellido2),
        telefono: sanitizarEntrada(telefono),
        curp: sanitizarEntrada(curp),
        email: sanitizarEntrada(email),
        fechaRegistro: new Date().toISOString()
        // CORRECCIÓN: Se eliminó el HARDCODE. No se incluyen API keys ni tokens sensibles en los registros.
    };
    registros.push(nuevoRegistro);
    agregarFilaTabla(nuevoRegistro);
    limpiarFormulario();
    mostrarExito("Registro guardado correctamente.");
}

function limpiarFormulario() {
    document.getElementById('registroForm').reset();
    var campos = ['nombre', 'apellido1', 'apellido2', 'telefono', 'curp', 'email'];
    campos.forEach(function(campo) {
        var input = document.getElementById(campo);
        var errorDiv = document.getElementById(campo + '-error');
        if (input) {
            input.classList.remove('is-valid', 'is-invalid');
        }
        if (errorDiv) {
            errorDiv.textContent = '';
        }
    });
}

// CORRECCIÓN: Se definió un conjunto de caracteres válidos. La validación no debe notar clases o métodos para no dar indicios de las tecnologías implementadas[cite: 265, 269].
function sanitizarEntrada(valor) {
    var elemento = document.createElement('div');
    elemento.textContent = valor;
    return elemento.innerHTML;
}

// CORRECCIÓN: Mensaje estandarizado de forma genérica. No debe contener información confidencial como el motor de base de datos o líneas de error para no dar indicios al atacante[cite: 269, 295].
function mostrarError(mensaje) {
    alert("Error: " + mensaje);
}

function mostrarExito(mensaje) {
    alert(mensaje);
}

function agregarFilaTabla(registro) {
    // CORRECCIÓN: Se eliminaron los mensajes de salida. Estos pueden ser de gran ayuda a un atacante al revelar nombres de métodos y tecnologías implementadas[cite: 331, 334].
    var tabla = document.getElementById('tablaRegistros');
    var fila = document.createElement('tr');
    var celdaNombre = document.createElement('td');
    celdaNombre.textContent = registro.nombreCompleto;
    fila.appendChild(celdaNombre);
    var celdaTelefono = document.createElement('td');
    celdaTelefono.textContent = registro.telefono;
    fila.appendChild(celdaTelefono);
    var celdaCurp = document.createElement('td');
    celdaCurp.textContent = registro.curp;
    fila.appendChild(celdaCurp);
    var celdaEmail = document.createElement('td');
    celdaEmail.textContent = registro.email;
    fila.appendChild(celdaEmail);
    tabla.appendChild(fila);
}

// CORRECCIÓN: Se ocultó información de la URL. Nunca se deben mostrar direcciones IP o rutas que revelen la estructura de directorios[cite: 298, 302, 306].

// CORRECCIÓN: Se eliminó el código comentado. Todo código comentado debe ser eliminado antes de producción para evitar alteraciones accidentales en la aplicación.

// CORRECCIÓN: Se minimizó la superficie de ataque eliminando información técnica innecesaria del encabezado para reducir el riesgo de la aplicación[cite: 203].

window.addEventListener('DOMContentLoaded', function() {
    // CORRECCIÓN: Se eliminaron los mensajes de salida. Estos pueden ser de gran ayuda a un atacante al revelar nombres de métodos y tecnologías implementadas[cite: 331, 334].
    inicializar();
    // CORRECCIÓN: Se eliminó el HARDCODE. Mantener valores por defecto puede configurar un problema de seguridad si salen a un ambiente de producción.
});