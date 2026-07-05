/*=======================

    add panel display

=======================*/

const addButton = document.querySelectorAll('.add-button');
const addPanel = document.getElementById('add-panel');
const unfocus = document.querySelector('.unfocus');

// open add panel
addButton.forEach((button) => {
    button.addEventListener('click', showAddPanel);
})

// close add panel by clicking outside
unfocus.addEventListener('click', closeAddPanel);

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

// confirm add account
const saveButton = document.querySelector('.input-container');
const cancelButton = document.querySelector('.confirm-add .cancel');

// blank required input
const titleErrorMsg = document.querySelector('.title-error-msg');
const usernameErrorMsg = document.querySelector('.username-error-msg');
const passwordErrorMsg = document.querySelector('.password-error-msg');

// removes red outline when user types inside input
titleInput.addEventListener('input', () => {
    titleInput.classList.remove('red-outline');
});

usernameInput.addEventListener('input', () => {
    usernameInput.classList.remove('red-outline');
});

passwordInput.addEventListener('input', () => {
    passwordInput.classList.remove('red-outline');
});

/*======================================

    send credentials data to backend    

======================================*/

saveButton.addEventListener('submit', (e) => {
    e.preventDefault();
    clearBlankInputState();

    const titleEmpty = !titleInput.value;
    const usernameEmpty = !usernameInput.value;
    const passwordEmpty = !passwordInput.value;

    if (titleEmpty || usernameEmpty || passwordEmpty) {
        if (titleEmpty) {
            titleInput.classList.add('red-outline');
            titleErrorMsg.classList.add('show');
        }
        if (usernameEmpty) {
            usernameInput.classList.add('red-outline');
            usernameErrorMsg.classList.add('show');
        }
        if (passwordEmpty) {
            passwordInput.classList.add('red-outline');
            passwordErrorMsg.classList.add('show');
        }
        return;
    }

    const formdata = new FormData();
    formdata.append("action", "addAccount");
    formdata.append("title", titleInput.value);
    formdata.append("username", usernameInput.value);
    formdata.append("password", passwordInput.value);
    formdata.append("url", urlInput.value);
    formdata.append("notes", notesInput.value);

    fetch("action.php", {
        method: "POST",
        body: formdata
    })
    .then (res => res.text())
    .then (data => {
        if (data === "account added successfully") {

            const row = document.createElement('div');
            
            row.classList.add('account-row');
            row.innerHTML = `
                <div class="account-img"></div>
                <div>
                    <p class='row-title'>${titleInput.value}</p>
                    <p class='row-username'>${usernameInput.value}</p>
                </div>
            `
            document.querySelector('.account-list').appendChild(row);
            
            clearInputData();
            closeAddPanel();
            hideEmptyState();
        }
        else {
            console.log("failed to add account");
        };
    });
});

// cancels add account and clears all inputs
cancelButton.addEventListener('click', () => {
    clearInputData();
    closeAddPanel();
});

function clearBlankInputState() {
    titleErrorMsg.classList.remove('show');
    usernameErrorMsg.classList.remove('show');
    passwordErrorMsg.classList.remove('show');

    titleInput.classList.remove('red-outline');
    usernameInput.classList.remove('red-outline');
    passwordInput.classList.remove('red-outline');
}

function clearInputData() {
    titleInput.value = '';
    usernameInput.value = '';
    passwordInput.value = '';
    urlInput.value = '';
    notesInput.value = '';
}

// handles empty state display
const emptyState = document.querySelector('.empty-state');
function hideEmptyState() {
    emptyState.classList.add('hide');
}

/*======================================

    show and hide sidebar navigation

======================================*/
const sidebar = document.querySelector('nav');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const logoImg = document.querySelector('.nav-heading .logo-img');
const logoName = document.querySelector('.nav-heading p');
const navigationLabel = document.querySelectorAll('.sidebar-content a span');
const mainHeading = document.getElementById('main-heading');
const accountList = document.querySelector('.account-list');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('hide');
    logoImg.classList.toggle('hide');
    logoName.classList.toggle('hide');
    
    navigationLabel.forEach((label) => {
        label.classList.toggle('hide');
    })

    mainHeading.classList.toggle('expanded');
    accountList.classList.toggle('expanded');
    emptyState.classList.toggle('expanded');
})