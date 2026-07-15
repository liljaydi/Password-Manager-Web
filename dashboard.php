<?php

session_start();
require_once "config.php";

if (!isset($_SESSION['userId'])) {
    header("Location: index.php");
    exit();
}

$userId = $_SESSION['userId'];
$getCredentials = "SELECT * FROM credentials WHERE user_id = $userId ORDER BY id DESC";
$result = mysqli_query($conn, $getCredentials);

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
                <!-- password button -->
                <a class="active">
                    <img class="lock-icon" src="assets/lock-white.svg" alt="Error">
                    <span>Accounts</span>
                </a>

                <!-- favorites button -->
                <a class="sidebar-link">
                    <!--<img class="star-icon" src="assets/folder-star.svg" alt="Error">-->
                    <svg class="star-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20 4h-8.59L10 2.59C9.62 2.21 9.12 2 8.59 2H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2m0 14H4V6h16z"/>
                        <path d="M10.72 10.59 8 10.82l2.12 2.12L9.18 16 12 14.12 14.82 16l-.94-3.06L16 10.82l-2.72-.23L12 8z"/>
                    </svg>
                    <span>Favorites</span>
                </a>
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
                <input name="password" class="password" type="password" placeholder="Enter password">
            
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