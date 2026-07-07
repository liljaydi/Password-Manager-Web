<?php

session_start();
require_once "config.php";

if (!isset($_SESSION['userId'])) {
    header("Location: index.php");
    exit();
}

$userId = $_SESSION['userId'];
$getCredentials = "SELECT * FROM credentials WHERE user_id = $userId";
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
                <a href="#" class="active">
                    <img class="lock-icon" src="assets/lock-white.svg" alt="Error">
                    <span>Passwords</span>
                </a>

                <!-- folder button -->
                <a href="#" class="sidebar-link">
                    <img class="folder-icon" src="assets/folder.svg" alt="Error">
                    <span>Folder</span>
                </a>

                <!-- favorites button -->
                <a href="#" class="sidebar-link">
                    <img class="star-icon" src="assets/folder-star.svg" alt="Error">
                    <span>Favorites</span>
                </a>
            </div>
        </nav>

        <!-- main content -->
        <main>
            <div id="main-heading">
                <!-- main title -->
                <h3 class="content-title">All Passwords</h3>

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
                <div class="account-list">

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
                            </div>
                        ";
                    }
                    ?>
                    
                </div>

                <div class="credential-panel"></div>

            </div>
        </main>

        <div class="unfocus"></div>

        <!-- add panel -->
        <aside id="add-panel">
            <h3>Add New Password</h3>
            <p class="sub-txt">Fill in the details for your new password</p>

            <form class="add-form">
                <!-- title -->
                <label>
                    TITLE<span class="required-dot">*</span>
                    <span class="title-error-msg">Please enter a password title</span>
                </label>
                <input name="title" class="title" type="text" placeholder="e.g. Facebook">
            
                <!-- username -->
                <label>
                    USERNAME<span class="required-dot">*</span>
                    <span class="username-error-msg">Please enter your username</span>
                </label>
                <input name="username" class="username" type="text" placeholder="Enter username">
            
                <!-- password -->
                <label>
                    PASSWORD<span class="required-dot">*</span>
                    <span class="password-error-msg">Please enter your password</span>
                </label>
                <input name="password" class="password" type="password" placeholder="Enter password">
            
                <!-- url -->
                <label>
                    URL<span class="optional">(optional)</span>
                </label>
                <input name="url" class="url" type="text" placeholder="e.g. facebook.com">
            
                <!-- notes -->
                <label>
                    NOTES<span class="optional">(optional)</span>
                </label>
                <textarea name="notes" class="notes" placeholder="any additional notes..."></textarea>

                <div class="confirm-add">
                    <button type="button" class="cancel">Cancel</button>
                    <button type="submit" class="save">Save Password</button>
                </div>
            </form>
        </aside>  
    </div>
    <script src="dashboard.js"></script>
</body>