const API_URL = "https://login-be-n80f.onrender.com";

// Helper function to check if an email is valid using a Regular Expression (Regex)
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

// Function to show/hide the password when the eye icon is clicked
function togglePassword() {
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // Check if the current type is password
    if (passwordInput.type === 'password') {
        // Change to text so the value is visible
        passwordInput.type = 'text';
        // Change icon to 'eye-off' (crossed out eye)
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        // Change back to password to hide the value
        passwordInput.type = 'password';
        // Change icon back to 'eye'
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    // Refresh icons to apply the change
    lucide.createIcons();
}

// === REGISTRATION PAGE LOGIC ===
// We check if the register form exists on the current page
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    // Listen for the 'submit' event (when the user clicks Register)
    registerForm.addEventListener('submit', async (e) => {
        // Prevent the default browser action (which reloads the page)
        e.preventDefault();
        
        // Reset previous error messages
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.getElementById('globalError').classList.add('hidden');
        
        // Disable the button to prevent double-clicking
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').textContent = 'Creating account...';

        // Collect data from the input fields
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value
        };

        // --- VALIDATION STEP ---
        // Check if the data entered by the user is valid
        let hasError = false;
        
        if (formData.name.length < 2) {
            document.getElementById('nameError').textContent = "Name must be at least 2 characters";
            hasError = true;
        }
        if (!validateEmail(formData.email)) {
            document.getElementById('emailError').textContent = "Invalid email address";
            hasError = true;
        }
        if (formData.password.length < 6) {
            document.getElementById('passwordError').textContent = "Password must be at least 6 characters";
            hasError = true;
        }
        if (!formData.dob) {
            document.getElementById('dobError').textContent = "Invalid date";
            hasError = true;
        }

        // If there are errors, stop here and re-enable the button
        if (hasError) {
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').textContent = 'Register';
            return;
        }

        // --- API CALL STEP ---
        // Send the data to the server
        try {
            console.log("Sending data to:", API_URL);
            // axios.post sends a POST request to the backend URL
            const response = await axios.post(`${API_URL}/register`, formData);
            
            // If successful, redirect the user to the Login page with a success flag
            window.location.href = 'login.html?registered=true';
        } catch (error) {
            console.error(error);
            // If there is an error (e.g., email already taken), show it to the user
            const message = error.response?.data?.message || "Registration failed. Check console/network.";
            document.getElementById('globalError').textContent = message;
            document.getElementById('globalError').classList.remove('hidden');
        } finally {
            // Always re-enable the button after the request finishes (success or fail)
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').textContent = 'Register';
        }
    });
}

// === LOGIN PAGE LOGIC ===
// Check if the login form exists on the current page
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop page reload
        
        // detailed cleanup of errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.getElementById('globalError').classList.add('hidden');
        
        // Show loading state
        document.getElementById('submitBtn').disabled = true;
        document.getElementById('submitBtn').textContent = 'Signing in...';

        // Get login credentials
        const formData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // Simple validation
        let hasError = false;
        if (!validateEmail(formData.email)) {
             document.getElementById('emailError').textContent = "Invalid email address";
             hasError = true;
        }
        if (!formData.password) {
            document.getElementById('passwordError').textContent = "Password is required";
            hasError = true;
        }

        if (hasError) {
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').textContent = 'Sign In';
            return;
        }

        // Send login request
        try {
            const response = await axios.post(`${API_URL}/login`, formData);
            
            // If successful, the server sends back user data
            // We store this data in the browser's LocalStorage so we can use it on the Dashboard
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Redirect to the Dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            console.error(error);
            const message = error.response?.data?.message || "Login failed";
            document.getElementById('globalError').textContent = message;
            document.getElementById('globalError').classList.remove('hidden');
        } finally {
            document.getElementById('submitBtn').disabled = false;
            document.getElementById('submitBtn').textContent = 'Sign In';
        }
    });
}
