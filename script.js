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

let currentItem = null;

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
                <button class="edit-btn" aria-label="Edit ${item}" onclick="editItem('${item}')">Edit</button>
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
    resetAll();
}

// Reset all item quantities to zero
function resetAll() {
    for (const item in quantities) {
        quantities[item] = 0;
        document.getElementById(`quantity-${item}`).textContent = quantities[item];
    }
    document.getElementById('modalTotalAmount').textContent = 'Total: ₹0';
    saveToLocalStorage();
    displayMessage('Quantities have been reset', 'success');
}

// Show the form to add a new item or edit an existing item
function showAddItemForm() {
    currentItem = null;
    document.getElementById('itemModalTitle').textContent = 'Add New Item';
    document.getElementById('itemName').value = '';
    document.getElementById('itemPrice').value = '';
    document.getElementById('itemSubmitBtn').textContent = 'Add Item';
    document.getElementById('itemModal').classList.remove('hidden');
}

// Close the add/edit item modal
function closeItemModal() {
    document.getElementById('itemModal').classList.add('hidden');
}

// Prepare the form to edit an existing item
function editItem(item) {
    currentItem = item;
    document.getElementById('itemModalTitle').textContent = 'Edit Item';
    document.getElementById('itemName').value = capitalize(item);
    document.getElementById('itemPrice').value = prices[item];
    document.getElementById('itemSubmitBtn').textContent = 'Update Item';
    document.getElementById('itemModal').classList.remove('hidden');
}

// Save prices and quantities to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('prices', JSON.stringify(prices));
        localStorage.setItem('quantities', JSON.stringify(quantities));
    } catch (e) {
        console.error("Failed to save data to localStorage:", e);
    }
}

// Load prices and quantities from localStorage
function loadFromLocalStorage() {
    try {
        const savedPrices = localStorage.getItem('prices');
        const savedQuantities = localStorage.getItem('quantities');

        if (savedPrices) {
            Object.assign(prices, JSON.parse(savedPrices));
        }
        if (savedQuantities) {
            Object.assign(quantities, JSON.parse(savedQuantities));
        }
    } catch (e) {
        console.error("Failed to load data from localStorage:", e);
    }
}

// Display a message to the user
function displayMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    document.body.appendChild(messageDiv);
    setTimeout(() => messageDiv.remove(), 3000);
}

// Handle form submission to add or update an item
document.getElementById('itemForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const itemName = document.getElementById('itemName').value.trim().toLowerCase();
    const itemPrice = parseFloat(document.getElementById('itemPrice').value);

    if (!itemName) {
        displayMessage('Item name cannot be empty', 'error');
        return;
    }

    if (currentItem && itemName !== currentItem && prices[itemName]) {
        displayMessage('An item with this name already exists', 'error');
        return;
    }

    if (currentItem) {
        delete prices[currentItem];
        delete quantities[currentItem];
        prices[itemName] = itemPrice;
        quantities[itemName] = 0;
        displayMessage('Item updated successfully', 'success');
    } else {
        prices[itemName] = itemPrice;
        quantities[itemName] = 0;
        displayMessage('Item added successfully', 'success');
    }

    updateItemsContainer();
    closeItemModal();
    saveToLocalStorage();
});

// Load data and update UI when the page is loaded
window.onload = function() {
    loadFromLocalStorage();
    updateItemsContainer();
};
