/**
 * BACKEND API URL
 * This is the address where our server is running.
 * We send our registration and login data to this address.
 */
const API_URL = "https://login-be-n80f.onrender.com";

/**
 * HELPER: Email Validator
 */
const validateEmail = (email) => {
    return String(email)
        .toLowerCase()
        .match(
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
};

/**
 * This function handles showing and hiding the password text when 
 * you click the eye icon in the login or register forms.
 */
function togglePassword() {
    // 1. Find the password input field and the eye icon in the HTML
    const passwordInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eyeIcon');
    
    // 2. Check the current type of the input (is it hidden "password" or visible "text"?)
    if (passwordInput.type === 'password') {
        // Change it to "text" so the user can see what they typed
        passwordInput.type = 'text';
        // Change the icon to the "eye-off" version
        eyeIcon.setAttribute('data-lucide', 'eye-off');
    } else {
        // Change it back to "password" to hide the dots/stars
        passwordInput.type = 'password';
        // Change the icon back to the normal "eye"
        eyeIcon.setAttribute('data-lucide', 'eye');
    }
    
    // 3. Lucide needs to be told to re-draw the icons after we change them
    lucide.createIcons();
}

/**

 * This section only runs if the 'registerForm' exists on the page.
 */
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    // Listen for when the user clicks the "Register" button
    registerForm.addEventListener('submit', async (e) => {
        // Prevent the page from refreshing (the default behavior of forms)
        e.preventDefault();
        
        // Clear any old error messages from previous attempts
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.getElementById('globalError').classList.add('hidden');
        
        // Show a "Loading" state on the button so the user knows something is happening
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Creating account...';

        // 1. Collect everything the user typed into the form
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            dob: document.getElementById('dob').value,
            gender: document.getElementById('gender').value
        };

        // 2. Validation Check: Make sure the inputs make sense before sending to server
        let hasError = false;
        
        if (formData.name.length < 2) {
            document.getElementById('nameError').textContent = "Please enter your name";
            hasError = true;
        }
        if (!validateEmail(formData.email)) {
            document.getElementById('emailError').textContent = "Please enter a valid email";
            hasError = true;
        }
        if (formData.password.length < 6) {
            document.getElementById('passwordError').textContent = "Password must be 6+ characters";
            hasError = true;
        }
        if (!formData.dob) {
            document.getElementById('dobError').textContent = "Date of birth is required";
            hasError = true;
        }
        if (!formData.gender) {
            document.getElementById('genderError').textContent = "Please select a gender";
            hasError = true;
        }

        // 3. Stop if there are errors: Turn the button back on so they can try again
        if (hasError) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
            return;
        }

        // 4. API Request: Actually send the data to our Backend Server
        try {
            await axios.post(`${API_URL}/register`, formData);
            window.location.href = 'login.html?registered=true';
        } catch (error) {
            const message = error.response?.data?.message || "Something went wrong. Try again.";
            const globalError = document.getElementById('globalError');
            globalError.textContent = message;
            globalError.classList.remove('hidden');
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });

    // REAL-TIME ERROR CLEARING: 
    // This removes the red error message immediately as the user starts typing
    registerForm.querySelectorAll('input, select').forEach(element => {
        element.addEventListener('input', (e) => {
            const errorElement = document.getElementById(`${e.target.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}

/**

 * This section handles checking credentials and logging the user in.
 */
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault(); // Stop the page from reloading
        
        // Clear old errors
        document.querySelectorAll('.error').forEach(el => el.textContent = '');
        document.getElementById('globalError').classList.add('hidden');
        
        // Show loading state
        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Signing in...';

        const loginData = {
            email: document.getElementById('email').value,
            password: document.getElementById('password').value
        };

        // 1. Basic check before sending
        let hasError = false;
        if (!validateEmail(loginData.email)) {
            document.getElementById('emailError').textContent = "Please enter a valid email";
            hasError = true;
        }
        if (!loginData.password) {
            document.getElementById('passwordError').textContent = "Password is required";
            hasError = true;
        }

        if (hasError) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
            return;
        }

        // 2. Send login credentials to Server
        try {
            const response = await axios.post(`${API_URL}/login`, loginData);
            
            /**
             * LOCAL STORAGE: 
             * This is a small database inside your browser. 
             * We save the user data here so the Dashboard knows WHO is logged in.
             */
            localStorage.setItem('user', JSON.stringify(response.data.user));
            
            // Success! Go to the dashboard
            window.location.href = 'dashboard.html';
        } catch (error) {
            // Error! usually "Invalid credentials"
            const message = error.response?.data?.message || "Login failed";
            document.getElementById('globalError').textContent = message;
            document.getElementById('globalError').classList.remove('hidden');
        } finally {
            // Reset button
            submitBtn.disabled = false;
            submitBtn.textContent = 'Sign In';
        }
    });

    // REAL-TIME ERROR CLEARING: 
    // This removes the red error message immediately as the user starts typing
    loginForm.querySelectorAll('input').forEach(element => {
        element.addEventListener('input', (e) => {
            const errorElement = document.getElementById(`${e.target.id}Error`);
            if (errorElement) {
                errorElement.textContent = '';
            }
        });
    });
}
