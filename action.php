<?php

session_start();
require_once "config.php";

// get action from POST request
$action = $_POST['action'] ?? '';

// check what action is requested
// login?
// signup?

if ($action == "login") {
    login();
} else if ($action == "signup") {
    signup();
} else if ($action == "addAccount") {
    addAccount();
}

// validate login
function login() {
    global $conn;
    $email = $_POST['email'];
    $password = $_POST['password'];

    $findEmail = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $findEmail);

    $user = mysqli_fetch_assoc($result);

    if (!$user) {
        echo "account does not exist";
    } else {
        if ($user['password'] == $password) {
            $_SESSION['userId'] = $user['id'];
            echo "login successful";
        } else {
            echo "incorrect password";
        }
    }
}

// add new account
function signup() {
    global $conn;
    $name = $_POST['name'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // check for duplicates
    $findEmail = "SELECT * FROM users WHERE email = '$email'";
    $duplicate = mysqli_query($conn, $findEmail);
    $user = mysqli_fetch_assoc($duplicate);

    if ($user) {
        echo "account already exists";
        return;
    }

    $addUser = "INSERT INTO users (name, email, password)
    VALUES ('$name', '$email', '$password')";

    $result = mysqli_query($conn, $addUser);

    if ($result) {
        $_SESSION['userId'] = mysqli_insert_id($conn);
        echo "signup successful";
    } else {
        echo "signup unsuccessful";
    }
}

function addAccount() {
    global $conn;

    if (!isset($_SESSION['userId'])) {
        echo "not logged in";
        return;
    }
    
    $userId = $_SESSION['userId'];
    $title = $_POST['title'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $url = $_POST['url'];
    $notes = $_POST['notes'];

    $addAccount = "INSERT INTO credentials (user_id, title, username, password, url, notes)
    VALUES ('$userId', '$title', '$username', '$password', '$url', '$notes')";

    $result = mysqli_query($conn, $addAccount);

    if ($result) {
        $newId = mysqli_insert_id($conn);

        $initial = mb_substr($title, 0, 2);

        echo json_encode([
            "success" => true,
            "id" => $newId,
            "initial" => $initial
        ]);
    } 
}

?>