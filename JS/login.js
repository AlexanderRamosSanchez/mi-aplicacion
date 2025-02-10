document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const loginContainer = document.getElementById('loginContainer');
    const mainContent = document.getElementById('mainContent');
    const btnLogout = document.getElementById('btnLogout');
    const confirmLogout = document.getElementById('confirmLogout');

    // Validación del formulario de login
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        if (!loginForm.checkValidity()) {
            loginForm.classList.add('was-validated');
            return;
        }

        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            if (response.ok) {
                sessionStorage.setItem('isLoggedIn', 'true');
                loginContainer.style.display = 'none';
                mainContent.style.display = 'block';
                initializeProductsTable();
            } else {
                alert('Usuario o contraseña incorrectos');
            }
        } catch (error) {
            alert('Error al conectar con el servidor');
        }
    });

    // Verificar si el usuario ya está logueado
    if (sessionStorage.getItem('isLoggedIn') === 'true') {
        loginContainer.style.display = 'none';
        mainContent.style.display = 'block';
        initializeProductsTable();
    }

    // Cerrar sesión
    confirmLogout.addEventListener('click', function() {
        sessionStorage.removeItem('isLoggedIn');
        loginContainer.style.display = 'block';
        mainContent.style.display = 'none';
        $('#logoutModal').modal('hide');
    });
});