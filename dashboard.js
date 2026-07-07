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
const saveButton = document.querySelector('.add-form');
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
    .then (res => res.json())
    .then (data => {
        if (data.success) {

            const row = document.createElement('div');
            
            row.dataset.id = data.id;
            row.classList.add('account-row');
            row.innerHTML = `
                <p class="account-img">${data.initial.toUpperCase()}</p>
                <div>
                    <p class='row-title'>${titleInput.value}</p>
                    <p class='row-username'>${usernameInput.value}</p>
                </div>
            `
            document.querySelector('.account-list').appendChild(row);

            row.addEventListener('click', () => {
                if (previousId === row.dataset.id) {
                    closeCredential(row.dataset.id);
                    previousId = null;
                    return;
                }

                previousId = row.dataset.id;
                openCredential(row.dataset.id, row);
            });
            
            clearInputData();
            closeAddPanel();
            hideEmptyState();
        } else {
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

accountRow.forEach((row) => {
    row.addEventListener('click', () => {

        accountRow.forEach((row) => {
            row.classList.remove('highlight');
        });

        if (previousId === row.dataset.id) {
            closeCredential(row.dataset.id);
            previousId = null;
            return;
        }

        previousId = row.dataset.id;
        openCredential(row.dataset.id, row);
    })
})

function openCredential(id, row) {
    console.log(id);
    credentialsContainer.classList.add('flex');
    accountList.classList.add('open');
    accountList.classList.remove('close');
    credentialOpen = true;

    row.classList.add('highlight');

    const info = document.createElement('div');
    info.classList.add('credential-content');

    info.innerHTML = `
        
    `
}

function closeCredential(id) {
    console.log(id);
    credentialsContainer.classList.remove('flex');
    accountList.classList.remove('open'); // don't mind why i did not add 'close' "just dont change anything"

    credentialOpen = false;
}