const listItem = document.getElementById('item');
const buttonAddItem = document.querySelector('.form-add input[type=submit]')
const shoppingList = document.querySelector('.shopping-list')
const submitOrder = document.querySelector('.shopping-list .submit-order')
let listRemoveItem, currentIndex

buttonAddItem.addEventListener('click', () => {
    currentIndex = listItem.selectedIndex
    submitOrder.style.display = 'block'
    // avoid same item in the shopping list
    if (listItem.options[currentIndex].getAttributeNode('disabled')) return

    const itemName = listItem.options[currentIndex].textContent;
    listItem.options[currentIndex].removeAttribute("selected")
    listItem.options[currentIndex].setAttribute("disabled", "")
    if (currentIndex + 1 > listItem.length - 1) currentIndex = -1
    listItem.options[currentIndex + 1].setAttribute("selected", "")

    // add dynamically the divs
    const itemHtml = `   <input type="text" readonly value="${itemName}" name="item[]">\n` +
            `            <div class="quantity">\n` +
            `                <input type="number" name="quantity[]" class="input-quantity" value="1" min="0" step="1">\n` +
            `                <svg class="remove" xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M170.5 51.6L151.5 80h145l-19-28.4c-1.5-2.2-4-3.6-6.7-3.6H177.1c-2.7 0-5.2 1.3-6.7 3.6zm147-26.6L354.2 80H368h48 8c13.3 0 24 10.7 24 24s-10.7 24-24 24h-8V432c0 44.2-35.8 80-80 80H112c-44.2 0-80-35.8-80-80V128H24c-13.3 0-24-10.7-24-24S10.7 80 24 80h8H80 93.8l36.7-55.1C140.9 9.4 158.4 0 177.1 0h93.7c18.7 0 36.2 9.4 46.6 24.9zM80 128V432c0 17.7 14.3 32 32 32H336c17.7 0 32-14.3 32-32V128H80zm80 64V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16zm80 0V400c0 8.8-7.2 16-16 16s-16-7.2-16-16V192c0-8.8 7.2-16 16-16s16 7.2 16 16z"/></svg>\n` +
            `            </div>\n`
    const divItem = document.createElement('div');
    divItem.className = 'form-group'
    divItem.innerHTML = itemHtml;
    shoppingList.insertBefore(divItem, submitOrder)


    listRemoveItem = document.querySelectorAll('.shopping-list .form-group .quantity .remove')
    removeItem()
    styleButton()
})

const removeItem = () => {
    listRemoveItem.forEach((e, i) => {
        e.addEventListener('click', (e) => {
            // remove the item
            const shoppingItem = (e.target.parentElement).parentNode
            const itemName = shoppingItem.querySelector('input[type=text]').value

            for (let j = 0; j < listItem.length; j++) {
                if (listItem.options[j].textContent === itemName) {
                    listItem.options[j].removeAttribute("disabled")
                    shoppingItem.remove()
                }
            }

            styleButton()
        })
    })
}

const styleButton = () => {
    if (document.querySelectorAll('.shopping-list .form-group').length === listItem.length) {
        buttonAddItem.style.background = 'rgba(5, 100, 255, .7)'
    } else {
        buttonAddItem.style.background = 'rgba(5, 100, 255, 1)'
    }
    if (document.querySelectorAll('.shopping-list .form-group').length === 0) {
        submitOrder.style.display = 'none'
    } else {
        submitOrder.style.display = 'block'
    }
}

styleButton()
