<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="styles.css">

    <title>Password Manager</title>
</head>

<body>
    <div class="container">
        <div class="container-left">
            <div>
                <div class="logo">
                    <div class="logo-img">
                        <img src="assets/car-key.svg" alt="myAccess Logo">
                    </div>
                    <p>myAccess</p>
                </div>

                <h1>Every password.<br>One secure home.</h1>
                <p class="header-description">myAccess keeps your logins organized encrypted and a
                single tap away - across every device you own.</p>

                <div class="feature-info">
                    <div class="icon-box">
                        <img class="icon" src="assets/lock.svg" alt="error">
                    </div>
                    <div>
                        <h3>End-to-end encrypted</h3>
                        <p class="info">Your vault is sealed with zero knowledge encryption.</p>
                    </div>
                </div>

                <div class="feature-info">
                    <div class="icon-box">
                        <img class="icon" src="assets/fingerprint.svg" alt="error">
                    </div>
                    <div>
                        <h3>One key to rule them</h3>
                        <p class="info">A single master password unlocks every login.</p>
                    </div>
                </div>

                <div class="feature-info">
                    <div class="icon-box">
                        <img class="icon" src="assets/check-shield.svg" alt="error">
                    </div>
                    <div>
                        <h3>Breach monitoring</h3>
                        <p class="info">Get alerted the moment a password is exposed</p>
                    </div>
                </div>
            </div>  
        </div>

        <div class="container-right">
            <div class="auth-panel">
                <div class="auth-btns-container">
                    <div class="auth-btns">
                        <button class="login-btn">Log in</button>
                        <button class="signup-btn">Sign up</button>
                    </div>
                </div>

                <form class="login-form">
                    <h1>Welcome back</h1>
                    <p class="auth-description">Enter your details to unlock your vault.</p>

                    <label>Email</label>
                    <input class="login-email" name="email" type="text" placeholder="you@example.com">
                    <p class="login-email-empty">Please enter your email</p>
                    <p class="login-email-invalid">Account does not exist</p>
                    
                    <label>Password</label>
                    <input class="login-password" name="password" type="password" placeholder="Your password">
                    <p class="login-password-empty">Please enter your password</p>
                    <p class="login-password-incorrect">Incorrect password</p>

                    <input class="login-submit" type="submit" value="Unlock vault">

                    <p class="link">New to myAccess?<span class="signup-link">Create one</span></p>
                </form>
                
                <form class="signup-form">
                    <h1>Create your account</h1>
                    <p class="auth-description">Set up your vault in under a minute.</p>

                    <label>Full name</label>
                    <input class="signup-name" name="name" type="text" placeholder="Your full name">
                    <p class="signup-name-empty">Please enter your full name</p>

                    <label>Email</label>
                    <input class="signup-email" name="email" type="text" placeholder="you@example.com">
                    <p class="signup-email-empty">Please enter your email</p>
                    <p class="signup-duplicate-account">Account already exists</p>

                    <label>Password</label>
                    <input class="signup-password" name="password" type="password" placeholder="Your password">
                    <p class="signup-password-empty">Please enter your password</p>

                    <label>Confirm password</label>
                    <input class="signup-confirm-password" name="confirm-password" type="password" placeholder="Confirm your password">
                    <p class="signup-confirm-password-empty">Please confirm your password</p>
                    <p class="signup-confirm-password-mismatch">Password do not match</p>

                    <input class="signup-submit" type="submit" value="Create account">

                    <p class="link">Already have an account?<span class="login-link">Log in</span></p>
                </form>
            </div>
        </div>
    </div>

    <script src="script.js"></script>
</body>

</html>