// In this file, you must perform all client-side validation for every single form input (and the role dropdown) on your pages. The constraints for those fields are the same as they are for the data functions and routes. Using client-side JS, you will intercept the form's submit event when the form is submitted and If there is an error in the user's input or they are missing fields, you will not allow the form to submit to the server and will display an error on the page to the user informing them of what was incorrect or missing.  You must do this for ALL fields for the register form as well as the login form. If the form being submitted has all valid data, then you will allow it to submit to the server for processing. Don't forget to check that password and confirm password match on the registration form!

document.addEventListener('DOMContentLoaded', function () {
    const registerForm = document.getElementById('registration-form');
    const loginForm = document.getElementById('login-form');

    if (registerForm) {
        registerForm.addEventListener('submit', function (event) {
            const errorElement = document.getElementById('error');
            errorElement.style.display = 'none';
            try {
                const username = document.getElementById('usernameInput').value;
                const emailAddress = document.getElementById('emailAddressInput').value;
                const password = document.getElementById('passwordInput').value;
                const confirmPassword = document.getElementById('confirmPasswordInput').value;
                const role = document.getElementById('roleInput').value;
                if (!isValidUsername(username)) {
                    throw 'Invalid firstName.';
                } else if (!isValidEmailAddress(emailAddress)) {
                    throw 'Invalid email address.';
                } else if (!isValidPassword(password)) {
                    throw 'Invalid password. There needs to be at least one uppercase character, there has to be at least one number and there has to be at least one special character, and should be a minimum of 8 characters long';
                } else if (password !== confirmPassword) {
                    throw 'Passwords do not match.';
                } else if (!isValidRole(role)) {
                    throw 'Invalid role.';
                }
            } catch (error) {
                event.preventDefault();
                errorElement.style.display = 'block';
                errorElement.textContent = error;
            }
        });
    }
    if (loginForm) {
        loginForm.addEventListener('submit', function (event) {
            const errorElement = document.getElementById('error');
            errorElement.style.display = 'none';
            try {
                const emailAddress = document.getElementById('emailAddressInput').value;
                const password = document.getElementById('passwordInput').value;
                if (!isValidEmailAddress(emailAddress)) {
                    throw 'Invalid emailAddress.';
                }
                if (!isValidPassword(password)) {
                    throw 'Invalid password.';
                }
            } catch (error) {
                event.preventDefault();
                errorElement.style.display = 'block';
                errorElement.textContent = error;
            }

        });
    }

    function isValidUsername(username) {
        if (typeof username !== 'string' || username.trim() === '' || /\d/.test(username) || username.length < 2 || username.length > 25) {
            return false
        }

        return true
    }

    function isValidEmailAddress(emailAddress) {
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        return emailRegex.test(emailAddress)
    }

    function isValidPassword(password) {
        if (typeof password !== 'string' || password.trim() === '' || /\s/.test(password)) {
            return false
        }
        var pattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])[0-9a-zA-Z!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]{8,}$/;

        return pattern.test(password)
    }

    function isValidRole(role) {
        role = role.toLowerCase()
        if (role !== 'admin' && role !== 'user') {
            return false
        }

        return true
    }

});


