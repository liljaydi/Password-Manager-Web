// set login as default authentication 
const authPanel = document.querySelector('.auth-panel');
const loginBtn = document.querySelector('.login-btn');
const signupBtn = document.querySelector('.signup-btn');

loginBtn.classList.add('active');
authPanel.classList.add('login-mode');

// switching login and signup
const loginButton = document.querySelector('.login-btn');
const signupButton = document.querySelector('.signup-btn');
const loginLink = document.querySelector('.login-link');
const signupLink = document.querySelector('.signup-link');

loginLink.addEventListener('click', loginMode);
signupLink.addEventListener('click', signupMode);
loginButton.addEventListener('click', loginMode);
signupButton.addEventListener('click', signupMode);

function loginMode() {
    clearErrorMessage();
    
    authPanel.classList.add('login-mode');
    authPanel.classList.remove('signup-mode');

    loginBtn.classList.add('active');
    signupBtn.classList.remove('active');
}

function signupMode() {
    clearErrorMessage();

    authPanel.classList.add('signup-mode');
    authPanel.classList.remove('login-mode');

    signupBtn.classList.add('active');
    loginBtn.classList.remove('active');
}

// clear login error message
function clearErrorMessage() {
    loginEmailEmpty.classList.remove('show');
    loginPasswordEmpty.classList.remove('show');
    loginEmailInvalid.classList.remove('show');
    loginPasswordIncorrect.classList.remove('show');

    signupNameEmpty.classList.remove('show');
    signupEmailEmpty.classList.remove('show');
    signupPasswordEmpty.classList.remove('show');
    signupConfirmPasswordEmpty.classList.remove('show');
    signupConfirmPasswordMismatch.classList.remove('show');
    signupDuplicateAccount.classList.remove('show');
}

// clear input
function clearInput() {
    loginEmail.value = "";
    loginPassword.value = "";

    signupName.value = "";
    signupEmail.value = "";
    signupPassword.value = "";
    signupConfirmPassword.value = "";
}

/*====================

    log in account    

====================*/

const loginForm = document.querySelector('.login-form');

const loginEmailEmpty = document.querySelector('.login-email-empty');
const loginEmailInvalid = document.querySelector('.login-email-invalid');
const loginPasswordEmpty = document.querySelector('.login-password-empty');
const loginPasswordIncorrect = document.querySelector('.login-password-incorrect');

const loginEmail = document.querySelector('.login-email');
const loginPassword = document.querySelector('.login-password');

loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrorMessage();

    const email = loginEmail.value;
    const password = loginPassword.value;

    if (!email || !password) {
        if (!email) loginEmailEmpty.classList.add('show');
        if (!password) loginPasswordEmpty.classList.add('show');
        return;
    }

    const formData = new FormData();
    formData.append("action", "login");
    formData.append("email", email);
    formData.append("password", password);

    fetch("action.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);

        if (data === "account does not exist") {
            loginEmailInvalid.classList.add('show');
            return;
        } else if (data === "incorrect password") {
            loginPasswordIncorrect.classList.add('show');
            return;
        } else if (data === "login successful") {
            window.location = "dashboard.php";
            clearInput();
        } else return;
    });

});

/*=====================

    sign up account    

=====================*/

const signupForm = document.querySelector('.signup-form');

const signupNameEmpty = document.querySelector('.signup-name-empty');
const signupEmailEmpty = document.querySelector('.signup-email-empty');
const signupPasswordEmpty = document.querySelector('.signup-password-empty');
const signupConfirmPasswordEmpty = document.querySelector('.signup-confirm-password-empty');
const signupConfirmPasswordMismatch = document.querySelector('.signup-confirm-password-mismatch');
const signupDuplicateAccount = document.querySelector('.signup-duplicate-account');

const signupName = document.querySelector('.signup-name');
const signupEmail = document.querySelector('.signup-email');
const signupPassword = document.querySelector('.signup-password');
const signupConfirmPassword = document.querySelector('.signup-confirm-password');

signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    clearErrorMessage();

    const name = signupName.value;
    const email = signupEmail.value;
    const password = signupPassword.value;
    const confirmPassword = signupConfirmPassword.value;

    if (!name || 
        !email || 
        !password || 
        !confirmPassword || 
        (password !== confirmPassword)) {

        if (!name) signupNameEmpty.classList.add('show');
        if (!email) signupEmailEmpty.classList.add('show');
        if (!password) signupPasswordEmpty.classList.add('show');
        if (!confirmPassword) signupConfirmPasswordEmpty.classList.add('show');
        if ((password !== confirmPassword) && (password && confirmPassword)) {
            signupConfirmPasswordMismatch.classList.add('show');
        }
        return;
    }

    const formData = new FormData();
    formData.append("action", "signup");
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);

    fetch("action.php", {
        method: "POST",
        body: formData
    })
    .then(res => res.text())
    .then(data => {
        console.log(data);

        if (data === "account already exists") {
            signupDuplicateAccount.classList.add('show');
            return;
        } else if (data === "signup successful") {
            window.location = "dashboard.php";
            clearInput();
        } else if (data === "signup unsuccessful") return;
        else return;
    });

});