// Check if the document has finished loading
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
  } else {
    ready();
    addItemToCart();
    cartItemsCount();
    displayPopup(title, price, imageSrc);
    totalResult();
    saveCartItemsToLocalStorage(cartItems);
  }
  
  function ready() {
    var removeCartItemButtons = document.getElementsByClassName("removeBtn");
    for (var i = 0; i < removeCartItemButtons.length; i++) {
      var button = removeCartItemButtons[i];
      button.addEventListener('click', removeCartItem);
    }
  
    let menu = document.querySelector('#menu-icon');
          let navbar = document.querySelector('.navbar');
  
           menu.onclick = () => {
           menu.classList.toggle('bx-x');
           navbar.classList.toggle('open');
           navbar.style.visibility = navbar.classList.contains('open')? 'visible':'hidden';
           navbar.style.opacity = navbar.classList.contains('open')? '1':'0';
    };
  }
  
  // Function to get the total count of cart items
  function cartItemsCount() {
    var cartItems = getCartItemsFromLocalStorage();
    return cartItems ? cartItems.length : 0;
  }
  
  // Function to update the cart counter in the navbar
  function updateCartCounter() {
    var cartCounter = document.getElementById("cartCounter");
    var itemCount = cartItemsCount();
    cartCounter.innerText = itemCount;
  
    localStorage.setItem('cartCount', itemCount); // Store the cart count in local storage
  }
  // Retrieve cart count from local storage and update the cart counter on page load
  var storedCartCount = localStorage.getItem('cartCount');
  if (storedCartCount) {
    var cartCounter = document.getElementById("cartCounter");
    cartCounter.innerText = storedCartCount;
  }
  function removeCartItem(event) {
    var buttonClicked = event.target;
    var row = buttonClicked.parentElement.parentElement;
  
    // Get the index of the row in the table
    var rowIndex = Array.from(document.getElementById('cartBody').rows).indexOf(row);
  
    // Get the saved cart items from local storage
    var cartItems = getCartItemsFromLocalStorage() || [];
  
    // Update the removed property of the item
    cartItems[rowIndex].removed = true;
  
    // Save the updated cart items to local storage
    saveCartItemsToLocalStorage(cartItems);
  
    // Remove the row from the DOM
    row.remove();
  
    // Update the total price
    totalResult();
    updateCartCounter();
  }
  
  function addItemToCart() {
      var addToCartButtons = document.getElementsByClassName("products");
    for (var P = 0; P < addToCartButtons.length; P++) {
      var button = addToCartButtons[P];
      button.addEventListener('click', addToCartClicked);
    }
    updateCartCounter();
    displayPopup(title, price, imageSrc);
    totalResult();
  }
  function showCartAlert() {
    var cartAlert = document.getElementById("cartAlert");
    cartAlert.classList.add("show");
  
      setTimeout(function() {
        cartAlert.classList.remove("show");
      }, 3000);
    }
  
  function insertItemToCart(title, price, imageSrc) {
    var cartItems = getCartItemsFromLocalStorage() || [];
  
    var existingItem = cartItems.find(function (item) {
      return item.title === title;
    });
  
    if (existingItem) {
      // Item already exists, increase the quantity and show alert
      existingItem.quantity++;
      //alert('The product already exist in the cart!');
      showCartAlert()
    } else {
      // Item does not exist, add as a new item
      var newItem = {
        title: title,
        price: price,
        imageSrc: imageSrc,
        quantity: 1
      };
  
      cartItems.push(newItem);
    }
  
    saveCartItemsToLocalStorage(cartItems);
  
    // Update the cart display
    updateCartCounter();
    renderCartItems(cartItems);
  }
  
    function renderCartItems(cartItems) {
        var cartTable = document.getElementById("cartBody");
        cartTable.innerHTML = " "; // Clear existing items
      
        cartItems.forEach(function(item) {
          if (!item.removed) {
            var newRow = cartTable.insertRow();
      
            var removeButton = newRow.insertCell(0);
            var productImage = newRow.insertCell(1);
            var productName = newRow.insertCell(2);
            var productPrice = newRow.insertCell(3);
            var productQuantity = newRow.insertCell(4);
            var productSubtotal = newRow.insertCell(5);
      
            removeButton.innerHTML = '<button class="removeBtn">Remove</button>';
            productImage.innerHTML = '<img src="' + item.imageSrc + '" alt="Product Image" width="50">';
            productName.innerHTML = item.title;
            productPrice.innerHTML = item.price;
            productQuantity.innerHTML =
            '<input type="number" min="1" value="' + item.quantity + '" onchange="updateQuantity(this, ' + item.price + ')">';
            productSubtotal.innerHTML = (item.price * item.quantity).toFixed(2);
          }
        });
      
        totalResult();
      }
  
  function getCartItemsFromLocalStorage() {
    var cartItemsString = localStorage.getItem('cartItems');
    var cartItems = JSON.parse(cartItemsString);
  
    // Filter out the removed items
    if (cartItems && Array.isArray(cartItems)) {
      cartItems = cartItems.filter(function(item) {
        return !item.removed;
      });
    }
  
    return cartItems;
  }
  
  
  function saveCartItemsToLocalStorage(cartItems) {
    var cartItemsString = JSON.stringify(cartItems);
    localStorage.setItem('cartItems', cartItemsString);
  }
  // Initial rendering of cart items on page load
  var cartItems = getCartItemsFromLocalStorage();
  if (cartItems) {
    renderCartItems(cartItems);
    updateCartCounter();
  }
  
  // Calculating quantity
  function updateQuantity(input, price) {
    var newQuantity = parseInt(input.value);
    var row = input.parentElement.parentElement;
    var rowIndex = Array.from(document.getElementById('cartBody').rows).indexOf(row);
  
    var cartItems = getCartItemsFromLocalStorage() || [];
    cartItems[rowIndex].quantity = newQuantity;
    saveCartItemsToLocalStorage(cartItems);
  
    var productSubtotal = row.cells[5];
    productSubtotal.innerHTML = (price * newQuantity).toFixed(2);
  
    totalResult();
  }
  
  function totalResult() {
    var cartItems = getCartItemsFromLocalStorage();
    var total = 0;
  
    if (cartItems) {
      cartItems.forEach(function (item) {
        total += item.price * item.quantity; // Multiply price by quantity
      });
    }
  
    var totalElement = document.getElementById("total");
    totalElement.innerHTML = total.toFixed(2);
  
    updateCartCounter();
  }
  
  //pop up functionality
  // Function to display the pop-up
  function displayPopup(title, price, imageSrc) {
    var popupOverlay = document.querySelector('.popup-overlay');
    var popupImage = document.getElementById('popup-image');
    var popupTitle = document.getElementById('popup-title');
    var popupPrice = document.getElementById('popup-price');
  
    // Set the content of the pop-up
    popupImage.innerHTML = '<img src="' + imageSrc + '" alt="Product Image">';
    popupTitle.innerText = title;
    popupPrice.innerText ='KES:' + price;
  
    // Show the pop-up
    popupOverlay.classList.add('active');
    cartItemsCount();
  }
  function proceedToCartClicked() {
    // For example, you can redirect the user to the cart page
    window.location.href = 'buy.html';
  }
  function continueShoppingClicked() {
    hidePopup();
  }
  // Function to hide the pop-up
  function hidePopup() {
    var popupOverlay = document.querySelector('.popup-overlay');
    popupOverlay.classList.remove('active');
  }
  
  //Event listener for the "Buy Now" button
      function addToCartClicked(event) {
        var button = event.target;
        var shopItem = button.closest('.pro');
        var title = shopItem.querySelector('.des span').innerText;
        var priceString = shopItem.querySelector('.des h4').innerText;
        var price = parseFloat(priceString.replace("KES:", ""));
        var imageSrc = shopItem.querySelector('.pro-image').src;
  
        displayPopup(title, price, imageSrc);
        localStorage.setItem('popupVisible', 'true');
        insertItemToCart(title, price, imageSrc);
        updateCartCounter();
        totalResult();  
      }
  