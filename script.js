const checkboxes = document.querySelectorAll('.checkbox')

checkboxes.forEach(checkbox => {
    checkbox.addEventListener('click', () => {
        checkbox.parentElement.classList.toggle('selected')
    })
})