import { menuArray } from "/data.js";
const itemsEl = document.getElementById('items')
const summaryEl = document.getElementById('summary')
const checkoutModal = document.getElementById('checkoutModal')
const checkoutForm = document.getElementById('checkoutForm')
const overlay = document.getElementById('overlay')
let shoppingCart = []

itemsEl.addEventListener('click', (e) => {
    if (e.target.dataset.increase) {
        handleIncreaseClick(e.target.dataset.increase)
    }
    else if (e.target.dataset.decrease) {
        handleDecreaseClick(e.target.dataset.decrease)
    }
})

summaryEl.addEventListener('click', (e) => {
    if (e.target.id === 'completeBtn') {
        checkoutModal.style.display = 'flex'
        document.getElementById('overlay').style.display = 'block'
    }
})

function handleIncreaseClick(id) {
    addItem(id)
    document.querySelector(`#item${id} .decreaseBtn`).style.visibility = 'visible';
    renderSummary()
}

function handleDecreaseClick(id) {
    removeItem(id)
    renderSummary()
}

function addItem(id) {
    let selectedItem = menuArray.filter(item => item.id === Number(id))[0];
    shoppingCart.push(selectedItem);
}

function removeItem(id) {
    let selectedItem = menuArray.filter(item => item.id === Number(id))[0]
    shoppingCart.splice(shoppingCart.indexOf(selectedItem), 1)

    if (shoppingCart.indexOf(selectedItem) === -1) {
        document.querySelector(`#item${id} .decreaseBtn`).style.visibility = 'hidden';
    }
}

function renderSummary() {
    let summaryHtml = ''
    if (shoppingCart.length > 0) {
        summaryHtml = `
        <h3 class="summaryHeader">Your order</h3>
        <div class="orderedItems">`

        shoppingCart.forEach(item => {
            summaryHtml += `
                <div class="orderedItem">
                    <h3 class="orderedItemName">${item.name}</h3>
                    <h3 class="orderedItemPrice">€${item.price}</h3>
                </div>
            `
        })
        summaryHtml += ` </div>
    <div class="totalPrice">
        <h3>Total price:</h3>
        <h3>€${shoppingCart.map(item => item.price).reduce((a, b) => (a + b))}</h3>
    </div>
    <button class="completeBtn" id="completeBtn">Complete order</button>`;
    }
    else {
        summaryHtml = ''
    }
    document.getElementById('summary').innerHTML = summaryHtml
}


function getData(arr) {
    return arr
}

function render() {
    const menuItems = getData(menuArray);
    let itemsHtml = '';

    menuItems.forEach(element => {
        itemsHtml += `
        <div class="item" id=item${element.id}>
                        <div class="pic">
                            <span>${element.emoji}</span>
                        </div>
                        <span class="description">
                            <h5 class="itemName">${element.name}</h5>
                            <p class="details">${element.ingredients}</p>
                            <h5 class="price">€${element.price}</h5>
                        </span>
                        <span class="quantityControls">
                            <button class="decreaseBtn" data-decrease=${element.id}>-</button>
                            <button class="increaseBtn" data-increase=${element.id}>+</button>
                        </span>
                    </div>
        `
    });
    itemsEl.innerHTML = itemsHtml
}

checkoutForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let newPaymentObj = {
        set name(name) { this.cardName = name },
        set number(number) { this.cardNumber = number },
        set cvv(cvv) { this.cardCvv = cvv }
    };
    const newFormData = new FormData(checkoutForm)

    newPaymentObj.cardName = newFormData.get('cardName')
    newPaymentObj.cardNumber = newFormData.get('cardNumber')
    newPaymentObj.cvv = newFormData.get('cvv')

    document.getElementById('cardName').value = ''
    document.getElementById('cardNumber').value = ''
    document.getElementById('cvv').value = ''

    summaryEl.innerHTML = `<div class="thankyou">Thank you ${newPaymentObj.cardName.split(' ')[0]}, your order is on it's way!</div>`
    checkoutModal.style.display = 'none'
    overlay.style.display = 'none'
    shoppingCart = []
    Array.from(document.getElementsByClassName('decreaseBtn')).forEach(item => 
        item.style.visibility = 'hidden'
        )


})

overlay.addEventListener('click', () => {
    checkoutModal.style.display = 'none'
    overlay.style.display = 'none'
})

render()