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
} else if ($action == "addCredential") {
    addCredential();
} else if ($action == "getCredential") {
    getCredential();
} else if ($action == "deleteCredential") {
    deleteCredential();
} else if ($action == "logout") {
    logout();
}

// validate login
function login() {
    global $conn;
    $email = $_POST['email'];
    $userPassword = $_POST['password'];

    $_SESSION['key'] = hash('sha256', $userPassword, true);

    $findEmail = "SELECT * FROM users WHERE email = '$email'";
    $result = mysqli_query($conn, $findEmail);

    $user = mysqli_fetch_assoc($result);

    if (!$user) {
        echo "account does not exist";
    } else {
        if (password_verify($userPassword, $user['password'])) {
            $_SESSION['userId'] = $user['id'];
            $_SESSION['loginName'] = $user['name'];
            $_SESSION['loginUsername'] = $user['email'];
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
    $userPassword = $_POST['password'];
    $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);

    $_SESSION['key'] = hash('sha256', $userPassword, true);

    // check for duplicates
    $findEmail = "SELECT * FROM users WHERE email = '$email'";
    $duplicate = mysqli_query($conn, $findEmail);
    $user = mysqli_fetch_assoc($duplicate);

    if ($user) {
        echo "account already exists";
        return;
    }

    $addUser = "INSERT INTO users (name, email, password)
    VALUES ('$name', '$email', '$hashedPassword')";

    $result = mysqli_query($conn, $addUser);

    if ($result) {
        $_SESSION['userId'] = mysqli_insert_id($conn);
        $_SESSION['loginName'] = $name;
        $_SESSION['loginUsername'] = $email;
        echo "signup successful";
    } else {
        echo "signup unsuccessful";
    }
}


function addCredential() {
    global $conn;
    
    $userId = $_SESSION['userId'];
    $title = $_POST['title'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $url = $_POST['url'];
    $notes = $_POST['notes'];

    $iv = random_bytes(16);

    /*
    $encryptedPassword = openssl_encrypt(
        $password,
        'AES-256-CBC',
        $_SESSION['key'],
        OPENSSL_RAW_DATA,
        $iv
    );

    $addAccount = "INSERT INTO credentials (user_id, title, username, password, iv, url, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($addAccount);

    $stmt->bind_param(
        "issssss",
        $userId,
        $title,
        $username,
        $encryptedPassword,
        $iv,
        $url,
        $notes
    );
    */

    $encryptedPassword = openssl_encrypt(
        $password,
        'AES-256-CBC',
        $_SESSION['key'],
        OPENSSL_RAW_DATA,
        $iv
    );

    $addAccount = "INSERT INTO credentials (user_id, title, username, password, iv, url, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?)";

    $stmt = $conn->prepare($addAccount);

    // convert to hex string before storing
    $encryptedHex = bin2hex($encryptedPassword);
    $ivHex = bin2hex($iv);

    $stmt->bind_param(
        "issssss",
        $userId,
        $title,
        $username,
        $encryptedHex,  // now a safe hex string
        $ivHex,         // now a safe hex string
        $url,
        $notes
    );

    $result = $stmt->execute();

    if ($result) {
        $newId = mysqli_insert_id($conn);

        $initial = mb_substr($title, 0, 2);

        echo json_encode([
            "success" => true,
            "id" => $newId,
            "initial" => $initial
        ]);
    } else {
        echo json_encode([
            "success" => false
        ]);
    }
} 

/*
function getCredential() {
    global $conn;
    $id = $_POST['id'];
    $userId = $_SESSION['userId'];

    $getCredential = "SELECT * FROM credentials WHERE id = '$id' AND user_id = '$userId'";

    $result = mysqli_query($conn, $getCredential);
    $credential = mysqli_fetch_assoc($result);

    if ($credential) {
        echo json_encode([
            "success" => true,
            "initial" => strtoupper(mb_substr($credential['title'], 0, 2)),
            "title" => $credential['title'],
            "username" => $credential['username'],
            "password" => $credential['password'],
            "url" => $credential['url'],
            "notes" => $credential['notes']
        ]);
    } else {
        echo json_encode([
            "success" => false
        ]);
    }
}
*/

function getCredential() {
    global $conn;
    $id = $_POST['id'];
    $userId = $_SESSION['userId'];

    // use prepared statement here too - your current way is unsafe
    $stmt = $conn->prepare("SELECT * FROM credentials WHERE id = ? AND user_id = ?");
    $stmt->bind_param("ii", $id, $userId);
    $stmt->execute();
    $result = $stmt->get_result();
    $credential = $result->fetch_assoc();

    if ($credential) {
        // convert hex back to binary
        $encryptedPassword = hex2bin($credential['password']);
        $iv = hex2bin($credential['iv']);

        // decrypt
        $decryptedPassword = openssl_decrypt(
            $encryptedPassword,
            'AES-256-CBC',
            $_SESSION['key'],
            OPENSSL_RAW_DATA,
            $iv
        );

        echo json_encode([
            "success" => true,
            "initial" => strtoupper(mb_substr($credential['title'], 0, 2)),
            "title" => $credential['title'],
            "username" => $credential['username'],
            "password" => $decryptedPassword, // decrypted plain text
            "url" => $credential['url'],
            "notes" => $credential['notes']
        ]);
    } else {
        echo json_encode([
            "success" => false
        ]);
    }
}

function deleteCredential() {
    global $conn;

    $id = $_POST['id'];
    $userId = $_SESSION['userId'];

    $deleteCredential = "DELETE FROM credentials WHERE id = '$id' AND user_id = '$userId'";

    $result = mysqli_query($conn, $deleteCredential);

    if ($result) {
        echo json_encode([
            "success" => true
        ]);
    } else {
        echo json_encode([
            "success" => false
        ]);
    }
}

function logout() {
    if (session_destroy()) {
        echo json_encode([
            "success" => true
        ]);
    } else {
        echo json_encode([
            "success" => false
        ]);
    }
}

?>