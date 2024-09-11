// Initialize prices and quantities from localStorage or set default values
const prices = JSON.parse(localStorage.getItem('prices')) || {
    tea: 20,
    coffee: 50,
    samosa: 30,
    biscuit: 10
};

const quantities = JSON.parse(localStorage.getItem('quantities')) || {
    tea: 0,
    coffee: 0,
    samosa: 0,
    biscuit: 0
};

let currentEditItem = null;

// Update the items container with the current prices and quantities
function updateItemsContainer() {
    const container = document.getElementById('items-container');
    container.innerHTML = '';
    for (const item in prices) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <span>${capitalize(item)} - ₹<span id="price-${item}">${prices[item]}</span></span>
            <div class="quantity-controls">
                <button aria-label="Increase ${item} quantity" onclick="changeQuantity('${item}', 1)">+</button>
                <span id="quantity-${item}">${quantities[item]}</span>
                <button aria-label="Decrease ${item} quantity" onclick="changeQuantity('${item}', -1)">-</button>
                <button class="edit-btn" aria-label="Edit ${item}" onclick="showEditItemModal('${item}')">Edit</button>
            </div>
        `;
        container.appendChild(itemDiv);
    }
}

// Capitalize the first letter of a string
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Change the quantity of an item
function changeQuantity(item, change) {
    if (quantities[item] + change >= 0) {
        quantities[item] += change;
        document.getElementById(`quantity-${item}`).textContent = quantities[item];
        saveToLocalStorage();
    }
}

// Show the total amount in a modal
function showTotal() {
    let total = 0;
    for (const item in quantities) {
        total += quantities[item] * prices[item];
    }
    document.getElementById('modalTotalAmount').textContent = `Total: ₹${total}`;
    document.getElementById('totalModal').classList.remove('hidden');
}

// Close the total amount modal and reset quantities
function closeModal() {
    document.getElementById('totalModal').classList.add('hidden');
    resetQuantities();
    displayMessage('Quantities have been reset', 'success');
}

// Reset the quantities of all items
function resetQuantities() {
    for (const item in quantities) {
        quantities[item] = 0;
        document.getElementById(`quantity-${item}`).textContent = quantities[item];
    }
    saveToLocalStorage();
}

// Save the prices and quantities to localStorage
function saveToLocalStorage() {
    localStorage.setItem('prices', JSON.stringify(prices));
    localStorage.setItem('quantities', JSON.stringify(quantities));
}

// Add a new item
function addItem(event) {
    event.preventDefault();
    const item = document.getElementById('itemName').value.toLowerCase();
    const price = parseFloat(document.getElementById('itemPrice').value);

    if (item && !prices[item] && !isNaN(price)) {
        prices[item] = price;
        quantities[item] = 0;
        updateItemsContainer();
        saveToLocalStorage();
        displayMessage(`${capitalize(item)} added successfully`, 'success');
        document.getElementById('itemForm').reset();
        closeItemModal();
    } else {
        displayMessage('Invalid item or price', 'error');
    }
}

// Remove an item
function removeItem(event) {
    event.preventDefault();
    const item = document.getElementById('removeItemName').value.toLowerCase();

    if (item && prices[item]) {
        delete prices[item];
        delete quantities[item];
        updateItemsContainer();
        saveToLocalStorage();
        displayMessage(`${capitalize(item)} removed successfully`, 'success');
        document.getElementById('removeItemForm').reset();
        closeRemoveItemModal();
    } else {
        displayMessage('Item not found', 'error');
    }
}

// Show the edit item modal
function showEditItemModal(item) {
    currentEditItem = item;
    document.getElementById('editItemOldName').value = capitalize(item);
    document.getElementById('editItemNewName').value = item;
    document.getElementById('editItemPrice').value = prices[item];
    document.getElementById('editItemModal').classList.remove('hidden');
}

// Edit item
function editItem(event) {
    event.preventDefault();
    const oldName = currentEditItem;
    const newName = document.getElementById('editItemNewName').value.toLowerCase();
    const newPrice = parseFloat(document.getElementById('editItemPrice').value);

    if (oldName && newName && !isNaN(newPrice)) {
        if (newName !== oldName) {
            if (prices[newName]) {
                displayMessage('An item with this name already exists', 'error');
                return;
            }
            prices[newName] = prices[oldName];
            quantities[newName] = quantities[oldName];
            delete prices[oldName];
            delete quantities[oldName];
        } else {
            prices[newName] = newPrice;
        }

        prices[newName] = newPrice;
        updateItemsContainer();
        saveToLocalStorage();
        displayMessage(`${capitalize(newName)} updated successfully`, 'success');
        closeEditItemModal();
    } else {
        displayMessage('Invalid name or price', 'error');
    }
}

// Close the edit item modal
function closeEditItemModal() {
    document.getElementById('editItemModal').classList.add('hidden');
}

// Display a message to the user
function displayMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type} show`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => messageDiv.remove(), 300);
    }, 3000);
}

// Show add item form modal
function showAddItemForm() {
    document.getElementById('itemModal').classList.remove('hidden');
}

// Close add item form modal
function closeItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
}

// Show remove item form modal
function showRemoveItemForm() {
    document.getElementById('removeItemModal').classList.remove('hidden');
}

// Close remove item form modal
function closeRemoveItemModal() {
    document.getElementById('removeItemModal').classList.add('hidden');
}

// Add event listeners
document.getElementById('itemForm').addEventListener('submit', addItem);
document.getElementById('removeItemForm').addEventListener('submit', removeItem);
document.getElementById('calculateBtn').addEventListener('click', showTotal);
document.getElementById('resetBtn').addEventListener('click', closeModal);
document.getElementById('addItemBtn').addEventListener('click', showAddItemForm);
document.getElementById('removeItemBtn').addEventListener('click', showRemoveItemForm);
document.getElementById('editItemForm').addEventListener('submit', editItem);

// Initialize the app
updateItemsContainer();
