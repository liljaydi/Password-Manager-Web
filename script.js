const checkboxes = document.querySelectorAll('.checkbox')
const rows = document.querySelectorAll('.account-row')

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        checkbox.parentElement.classList.toggle('checked-selected')
    })
})

rows.forEach(row => {
    row.addEventListener('click', () => {
        rows.forEach(row => {
            row.classList.remove('selected')
        })
        row.classList.toggle('selected')
    })
})