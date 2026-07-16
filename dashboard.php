<?php

session_start();
require_once "config.php";

if (!isset($_SESSION['userId'])) {
    header("Location: index.php");
    exit();
}

$userId = $_SESSION['userId'];
$loginName = $_SESSION['loginName'];
$loginUsername = $_SESSION['loginUsername'];
$getCredentials = "SELECT * FROM credentials WHERE user_id = $userId ORDER BY id DESC";
$result = mysqli_query($conn, $getCredentials);

$loginNameInitial = strtoupper(mb_substr($loginName, 0, 2));

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Mona+Sans:ital,wght@0,200..900;1,200..900&display=swap" rel="stylesheet">

    <link rel="stylesheet" href="dashboard.css">

    <title>Password Manager</title>
</head>

<body>
    <div class="dashboard">
        <!-- sidebar -->
        <nav>
            <!-- logo myAccess -->
             <div class="nav-heading">
                <div class="logo-img">
                    <img class="logo" src="assets/car-key-blue.svg" alt="Error">
                </div>
                <p>myAccess</p>
                <img class="toggle-left" src="assets/chevron-left-square.svg" alt="Error">
                <img class="toggle-right" src="assets/chevron-right-square.svg" alt="Error">
            </div>

            <div class="sidebar-content">
                <!-- favorites button -->
                <a class="sidebar-link">
                    <svg class="dashboard-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24" transform="" id="injected-svg">
                        <path d="M20 11h-6c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-8c0-.55-.45-1-1-1m-1 8h-4v-6h4zm-9-4H4c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-4c0-.55-.45-1-1-1m-1 4H5v-2h4zM20 3h-6c-.55 0-1 .45-1 1v4c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1m-1 4h-4V5h4zm-9-4H4c-.55 0-1 .45-1 1v8c0 .55.45 1 1 1h6c.55 0 1-.45 1-1V4c0-.55-.45-1-1-1m-1 8H5V5h4z"/>
                    </svg>
                    <span>Dashboard</span>
                </a>
                
                <!-- password button -->
                <a class="active">
                    <img class="lock-icon" src="assets/lock-white.svg" alt="Error">
                    <span>Accounts</span>
                </a>
            </div>

            <div class="profile-container">
                <div class="login-details">
                    <div class="login-img"><?= $loginNameInitial ?? '' ?></div>
                    <div class="name-username-container">
                        <p class="login-name"><?= $loginName ?? '' ?></p>
                        <p class="login-username"><?= $loginUsername ?? '' ?></p>
                    </div>
                </div>
                <div class="logout">
                    <img class="logout-icon" src="assets/arrow-out-right-square-half.svg" alt="Error">
                    <p>Log out</p>
                </div>
            </div>

            <div class="logout-modal">
                <p class="logout-message">Are you sure you want to log out?</p>
                <div class="login-details logout-details">
                    <div class="login-img"><?= $loginNameInitial ?? '' ?></div>
                    <div class="name-username-container">
                        <p class="login-name"><?= $loginName ?? '' ?></p>
                        <p class="login-username"><?= $loginUsername ?? '' ?></p>
                    </div>
                </div>
                <div class="confirm-logout">
                    <button class="confirm-cancel">cancel</button>
                    <button class="confirm-logout-user">Log out</button>
                </div>
            </div>
        </nav>

        <!-- main content -->
        <main>
            <div id="main-heading">
                <!-- main title -->
                <h3 class="content-title">All Accounts</h3>

                <!-- search input -->
                <input type="search" class="search-bar" placeholder="Search">

                <!-- add button -->
                <button class="add-button">+ Add</button>
            </div>
            
            <div id="credentials-container">
                
                <div class="empty-state <?= mysqli_num_rows($result) > 0 ? 'hide' : '' ?>">
                    <img src="assets/password.svg" alt="Error">
                    <h3>No passwords saved yet</h3>
                    <p>Add your first account to keep your credentials safe</p>

                    <button class='add-button'>Add New Password</button>
                </div>

                <!-- displays account added -->
                <div class="account-list <?= mysqli_num_rows($result) > 0 ? '' : 'hide' ?>">

                    <?php
                    while ($credential = mysqli_fetch_assoc($result)) {
                        
                        $initial = strtoupper(mb_substr($credential['title'], 0, 2));

                        echo "
                            <div class='account-row' data-id='{$credential['id']}'>
                                <div class='account-img'>$initial</div>

                                <div>
                                    <p class='row-title'>{$credential['title']}</p>
                                    <p class='row-username'>{$credential['username']}</p>
                                </div>

                                <img class='action-menu-btn' src='assets/dots-vertical-rounded.svg' alt='Error'>
                                <div class='action-menu'>
                                    <div class='edit-btn'>
                                        <img src='assets/pencil.svg' alt='Error'>
                                        <p>Edit</p>
                                    </div>
                                    <div class='delete-btn'>
                                        <img src='assets/trash-light-red.svg' alt='Error'>
                                        <p>Delete</p>
                                    </div>
                                </div>
                            </div>
                        ";
                    }
                    ?>
                    
                </div>

                <div class="credential-panel">
                    <img class="close-credential-btn" src="assets/x-muted.svg" alt="Error">

                    <div class="credential-content"></div>
                </div>

                <div class="delete-modal">
                    <div class="alert-icon-container">
                        <img class="alert-icon" src="assets/alert-triangle.svg" alt="Error">
                    </div>

                    <h2>Delete account?</h2>
                    <div class="account-details-container"></div>
                    <div class="confirm-delete">
                        <button class="cancel">cancel</button>
                        <button class="delete">Delete</button>
                    </div>
                </div>

            </div>
        </main>

        <div class="unfocus"></div>

        <!-- add panel -->
        <aside id="add-panel">
            <img class="close-add-panel-btn" src="assets/x-muted.svg" alt="Error">
            <h3>Add New Account</h3>
            <p class="sub-txt">Fill in the details for your new account</p>

            <form class="add-form">
                <!-- title -->
                <label>
                    TITLE<span class="required-dot">*</span>
                    <span class="title-error-msg">Please enter an account title</span>
                </label>
                <input name="title" class="title" type="text" placeholder="e.g. Facebook">
            
                <!-- username -->
                <label>USERNAME</label>
                <input name="username" class="username" type="text" placeholder="Enter username">
            
                <!-- password -->
                <label>PASSWORD</label>
                <div class="password-field">
                    <input name="password" class="password" type="password" placeholder="Enter password">
                    <img class="add-password-icon" src="assets/eye-gray.svg" alt="Error">
                </div>

                <!-- url -->
                <label>URL</label>
                <input name="url" class="url" type="text" placeholder="e.g. facebook.com">
            
                <!-- notes -->
                <label>NOTES</label>
                <textarea name="notes" class="notes" placeholder="any additional notes..."></textarea>

                <div class="confirm-add">
                    <button type="button" class="cancel">Cancel</button>
                    <button type="submit" class="save">Save Account</button>
                </div>
            </form>
        </aside>  
    </div>
    <script src="dashboard.js"></script>
</body>