const API_URL = "http://localhost:3000";

// 1. Función para iniciar sesión y GUARDAR el token
async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('pass').value;

    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (data.token) {
        // Guardamos el token en el navegador (Local Storage)
        localStorage.setItem('mi_token_jwt', data.token);
        document.getElementById('resultado').innerText = "✅ Token recibido y guardado.";
    } else {
        alert("Error en login");
    }
}

// 2. Función para usar el token y pedir datos protegidos
async function obtenerDatos() {
    // Recuperamos el token guardado
    const token = localStorage.getItem('mi_token_jwt');

    const response = await fetch(`${API_URL}/protected`, {
        method: 'GET',
        headers: {
            // ENVIAMOS EL PASAPORTE EN EL HEADER
            'Authorization': `Bearer ${token}`
        }
    });

    const data = await response.json();
    document.getElementById('resultado').innerText = JSON.stringify(data, null, 2);
}