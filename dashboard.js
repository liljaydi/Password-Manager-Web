/*=======================

    add panel display

=======================*/

const addButton = document.querySelectorAll('.add-button');
const closeAddPanelBtn = document.querySelector('.close-add-panel-btn');
const addPanel = document.getElementById('add-panel');
const unfocus = document.querySelector('.unfocus');

// open add panel
addButton.forEach((button) => {
    button.addEventListener('click', showAddPanel);
})

// close add panel
unfocus.addEventListener('click', closeAddPanel);
closeAddPanelBtn.addEventListener('click', closeAddPanel);

function showAddPanel() {
    addPanel.classList.add('show');
    unfocus.classList.add('show');
}

function closeAddPanel() {
    addPanel.classList.remove('show');
    unfocus.classList.remove('show');
    clearBlankInputState();
}

/*============================

    credentials input data    

============================*/

const titleInput = document.querySelector('.title');
const usernameInput = document.querySelector('.username');
const passwordInput = document.querySelector('.password');
const urlInput = document.querySelector('.url');
const notesInput = document.querySelector('.notes');

const saveButton = document.querySelector('.add-form');
const cancelButton = document.querySelector('.confirm-add .cancel');
const titleErrorMsg = document.querySelector('.title-error-msg');

// removes red outline when user types inside input
titleInput.addEventListener('input', () => {
    titleInput.classList.remove('red-outline');
});

/*======================================

    send credentials data to backend    

======================================*/

saveButton.addEventListener('submit', (e) => {
    e.preventDefault();
    clearBlankInputState();

    const titleEmpty = !titleInput.value;
    if (titleEmpty) {
        titleInput.classList.add('red-outline');
        titleErrorMsg.classList.add('show');
        return;
    }

    const formdata = new FormData();
    formdata.append("action", "addCredential");
    formdata.append("title", titleInput.value);
    formdata.append("username", usernameInput.value);
    formdata.append("password", passwordInput.value);
    formdata.append("url", urlInput.value);
    formdata.append("notes", notesInput.value);

    sendRequest(formdata).then(data => {
        if (!data.success) {
            console.log("failed to add account");
            return;
        }

        const row = createAccountRow(data);
        handleRowClick(row);

        const menuBtn = row.querySelector('.action-menu-btn');
        const actionMenu = row.querySelector('.action-menu');

        // stops clicking the row when action menu is click
        actionMenu.addEventListener('click', e => e.stopPropagation());

        // functions the action menu button
        menuBtn.addEventListener('click', e => handleActionMenuClick(e, menuBtn));

        row.querySelector('.delete-btn').addEventListener('click', () => handleDeleteBtn(row));

        clearInputData();
        closeAddPanel();
        hideEmptyState();
    });
});

function createAccountRow(data) {
    const row = document.createElement('div');
        
    row.dataset.id = data.id;
    row.classList.add('account-row');
    row.innerHTML = `
        <p class="account-img">${data.initial.toUpperCase()}</p>
        <div>
            <p class='row-title'>${titleInput.value}</p>
            <p class='row-username'>${usernameInput.value}</p>
        </div>
        <img class="action-menu-btn" src="assets/dots-vertical-rounded.svg" alt="Error">
        <div class="action-menu">
            <div class="edit-btn">
                <img src="assets/pencil.svg" alt="Error">
                <p>Edit</p>
            </div>
            <div class="delete-btn">
                <img src='assets/trash-light-red.svg' alt='Error'>
                <p>Delete</p>
            </div>
        </div>
    `

    document.querySelector('.account-list').prepend(row);

    row.addEventListener('click', () => {
        handleRowClick(row);
    });

    return row;
}

function handleRowClick(row) {
    resetClick();

    if (previousId === row.dataset.id) {
        closeCredential();
        previousId = null;
        return;
    }
    
    previousId = row.dataset.id;
    openCredential(row.dataset.id, row);
}

function handleActionMenuClick(e, menuBtn) {
    e.stopPropagation();

    const actionMenu = menuBtn.nextElementSibling;
    const row = actionMenu.parentElement;
    let actionMenuOpened = actionMenu.classList.contains('show');
    
    closeActionMenu();

    if (actionMenuOpened) {
        actionMenu.classList.remove('show');
    } else {
        console.log("\naccount id clicked: " + row.dataset.id);
        actionMenu.classList.add('show');
    }
}

function handleDeleteBtn(row) {
    accountDetailsContainer.innerHTML = "";

    showDeleteModal();
    closeActionMenu();
    loadCredentialForDelete(row);
}

/*============================================

 cancels add account and clears all inputs

============================================*/

const emptyState = document.querySelector('.empty-state');

// cancel add new account
cancelButton.addEventListener('click', () => {
    clearInputData();
    closeAddPanel();
});

// clear error message
function clearBlankInputState() {
    titleErrorMsg.classList.remove('show');
    titleInput.classList.remove('red-outline');
}

// clear input data
function clearInputData() {
    titleInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    urlInput.value = '';
    notesInput.value = '';
}

// handles empty state display
function hideEmptyState() {
    emptyState.classList.add('hide');
    accountList.classList.remove('hide');
}

/*======================================

    show and hide sidebar navigation

======================================*/

const sidebar = document.querySelector('nav');

const toggleLeft = document.querySelector('.toggle-left');
const toggleRight = document.querySelector('.toggle-right');

toggleLeft.classList.add('show');
toggleRight.classList.remove('show');

const logoImg = document.querySelector('.nav-heading .logo-img');
const logoName = document.querySelector('.nav-heading p');
const navigationLabel = document.querySelectorAll('.sidebar-content a span');
const mainHeading = document.getElementById('main-heading');

// credential container
const accountList = document.querySelector('.account-list');

toggleLeft.addEventListener('click', navClose);
toggleRight.addEventListener('click', navOpen);

function navClose() {
    sidebar.classList.add('hide');
    logoImg.classList.add('hide');
    logoName.classList.add('hide');
    
    navigationLabel.forEach((label) => {
        label.classList.add('hide');
    })

    mainHeading.classList.add('expanded');
    toggleLeft.classList.remove('show');
    toggleRight.classList.add('show');
    emptyState.classList.add('expanded');

    // credential container
    accountList.classList.add('expanded');

    if (credentialOpen) {
        accountList.classList.remove('close');
        accountList.classList.add('open');
    } else {
        accountList.classList.remove('open');
        accountList.classList.add('close');
    }
}

function navOpen() {
    sidebar.classList.remove('hide');
    logoImg.classList.remove('hide');
    logoName.classList.remove('hide');
    
    navigationLabel.forEach((label) => {
        label.classList.remove('hide');
    })

    mainHeading.classList.remove('expanded');
    toggleLeft.classList.add('show');
    toggleRight.classList.remove('show');
    emptyState.classList.remove('expanded');

    // credential container
    accountList.classList.remove('expanded');

    if (credentialOpen) {
        accountList.classList.remove('close');
        accountList.classList.add('open');
    } else {
        accountList.classList.remove('open');
        accountList.classList.add('close');
    }
}

/*==============================

    open credentials details

==============================*/

const accountRow = document.querySelectorAll('.account-row');
const credentialsContainer = document.querySelector('#credentials-container');

let credentialOpen = false;
let previousId = null;

// listens for click for each row stored in data base
accountRow.forEach((row) => {
    row.addEventListener('click', () => {
        handleRowClick(row);
    })
})

function openCredential(id, row) {
    const formdata = new FormData();

    formdata.append("action", "getCredential"); 
    formdata.append("id", id);

    sendRequest(formdata).then(data => {
        if (!data.success) {
            console.log("failed");
            return;
        }
        renderCredential(data);
    });

    credentialsContainer.classList.add('flex');
    accountList.classList.add('open');
    accountList.classList.remove('close');
    credentialOpen = true;

    row.classList.add('highlight');
    const btn = row.querySelector('.action-menu-btn');
    btn.classList.add('show');
}

function renderCredential(data) {
    const credentialContent = document.querySelector('.credential-content');

    let html = `
        <div class="credential-img">${data.initial}</div>
        <h2 class="credential-title">${data.title}</h2>
    `;

    if (data.username) {
        html += `
            <div class="data-display">
                <img class="credential-icon" src="assets/user-gray.svg" alt="Error">
                <div>
                    <p class="label">Username</p>
                    <p>${data.username}</p>
                </div>
            </div>
        `
    }

    if (data.password) {
        html += `
            <div class="data-display">
                <img class="credential-icon" src="assets/car-key-gray.svg" alt="Error">
                <div>
                    <p class="label">Password</p>
                    <p class="password-hidden">••••••••</p>
                    <p class="password-showed">${data.password}</p>
                </div>
                <div class="show-box">
                    <img class="show-password-icon" src="assets/eye-gray.svg" alt="Error">
                </div>
                <div class="hide-box">
                    <img class="hide-password-icon" src="assets/eye-slash-gray.svg" alt="Error">
                </div>
            </div>
        `
    }

    if (data.url) {
        html += `
            <div class="data-display">
                <img class="credential-icon" src="assets/globe-alt-gray.svg" alt="Error">
                <div>
                    <p class="label">URL</p>
                    <p>${data.url}</p>
                </div>
            </div>
        `;
    }

    if (data.notes) {
        html += `
            <div class="data-display">
                <img class="credential-icon" src="assets/note-gray.svg" alt="Error">
                <div>
                    <p class="label">Notes</p>
                    <p>${data.notes}</p>
                </div>
            </div>
        `;
    }

    credentialContent.innerHTML = html;

    if (data.password) showHidePassword();
}

/*============================

    close credential panel

============================*/

const closeCredentialBtn = document.querySelector('.close-credential-btn');

closeCredentialBtn.addEventListener('click', () => {
    previousId = null;
    resetClick();
    closeCredential();
});

function closeCredential() {
    credentialsContainer.classList.remove('flex');
    accountList.classList.remove('open'); // don't mind why i did not add 'close' "just dont change anything"

    credentialOpen = false;

    const credentialContent = document.querySelector('.credential-content');
    credentialContent.innerHTML = '';
}

function resetClick() {
    document.querySelectorAll('.account-row').forEach((row) => {
        row.classList.remove('highlight');
        const credentialContent = document.querySelector('.credential-content');
        credentialContent.innerHTML = '';

        const btn = row.querySelector('.action-menu-btn');
        btn.classList.remove('show');
    });
}

/*===============================

    show/hide password inside

===============================*/

function showHidePassword() {
    const showPasswordIcon = document.querySelector('.show-password-icon');
    const passwordHidden = document.querySelector('.password-hidden');
    const showBox = document.querySelector('.show-box');

    const passwordShowed = document.querySelector('.password-showed');
    const hidePasswordIcon = document.querySelector('.hide-password-icon');
    const hideBox = document.querySelector('.hide-box');

    showPasswordIcon.classList.add('display');
    passwordHidden.classList.add('hide');
    showBox.classList.add('display');

    showBox.addEventListener('click', () => {
        passwordHidden.classList.remove('hide');
        passwordShowed.classList.add('expose');

        showPasswordIcon.classList.remove('display');
        hidePasswordIcon.classList.add('display');

        showBox.classList.remove('display');
        hideBox.classList.add('display');
    });

    hideBox.addEventListener('click', () => {
        passwordHidden.classList.add('hide');
        passwordShowed.classList.remove('expose');

        showPasswordIcon.classList.add('display');
        hidePasswordIcon.classList.remove('display');

        showBox.classList.add('display');
        hideBox.classList.remove('display');
    });
}

/*===============================

    action menu functionality

===============================*/

document.addEventListener('click', closeActionMenu);

function closeActionMenu() {
    const actionMenuShowed = document.querySelectorAll('.action-menu.show');
    actionMenuShowed.forEach((menu) => {
        menu.classList.remove('show');
    });
}

const actionMenu = document.querySelectorAll('.action-menu');

// stops clicking the row when action menu is clicked
actionMenu.forEach((menu) => {
    menu.addEventListener('click', e => e.stopPropagation());
});

// action menu click
document.querySelectorAll('.action-menu-btn').forEach((menuBtn) => {
    menuBtn.addEventListener('click', e => handleActionMenuClick(e, menuBtn));
});

/*====================

    delete account

====================*/

const deleteBtn = document.querySelectorAll('.delete-btn');
const deleteModal = document.querySelector('.delete-modal');
const accountDetailsContainer = document.querySelector(".account-details-container");

// press delete button
deleteBtn.forEach((btn) => {
    const row = btn.parentElement.parentElement;
    btn.addEventListener('click', () => handleDeleteBtn(row));
});

// show delete modal
function showDeleteModal() {
    unfocus.classList.add('show');
    deleteModal.classList.add('show');
}

// access account to delete data
function loadCredentialForDelete(row) {
    const formdata = new FormData();
    deleteId = row.dataset.id;

    formdata.append("action", "getCredential"); 
    formdata.append("id", row.dataset.id);

    sendRequest(formdata).then(data => {
        if (!data.success) {
            console.log("failed");
            return;
        }

        displayAccountInfo(data);
        deleteModal.classList.add('visible');
        console.log("\naccount to delete");
        console.log("title: " + data.title);
        console.log("id   : " + deleteId);
    });
}

let deleteId = null;

// display account data in delete modal
function displayAccountInfo(data) {
    accountDetailsContainer.innerHTML = `
        <p class="sub-heading">This will permanently remove <span>${data.title}</span> from your saved accounts.</p>

        <div class="account-details">
            <div class="main-info">
                <p class="account-img">${data.initial.toUpperCase()}</p>
                <div>
                    <p class="row-title">${data.title}</p>
                    <p class="row-username">${data.username}</p>
                </div>
            </div>
        </div>
    `
}

const cancelDelete = document.querySelector('.confirm-delete .cancel');
const continueDelete = document.querySelector('.confirm-delete .delete');

// cancel delete account
cancelDelete.addEventListener('click', closeDeleteModal);

// proceed deleting account
continueDelete.addEventListener('click', () => {
    const formdata = new FormData();

    formdata.append("action", "deleteCredential");
    formdata.append("id", deleteId);

    sendRequest(formdata).then(data => {
        if (!data.success) {
            console.log("delete failed");
            return;
        }

        console.log("delete successful");

        const row = document.querySelector(`.account-row[data-id="${deleteId}"]`);
        if (row) row.remove();

        if (previousId === deleteId) {
            closeCredential();
            previousId = null;
        }

        closeDeleteModal();

        if (document.querySelectorAll('.account-row').length === 0) {
            emptyState.classList.remove('hide');
            accountList.classList.add('hide');
        }
    })
});

// close delete modal
function closeDeleteModal() {
    unfocus.classList.remove('show');
    deleteModal.classList.remove('show');
    deleteModal.classList.remove('visible');
    deleteId = null;
}

/*===============

    utilities

===============*/

function sendRequest(formdata) {
    return fetch("action.php", {
        method: "POST",
        body: formdata
    })
    .then(res => res.json())
}