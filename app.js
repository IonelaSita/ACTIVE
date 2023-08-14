class Product {
  constructor(image, title, price, id, categorie) {
    this.image = image;
    this.title = title;
    this.price = price;
    this.id = id;
    this.categorie = categorie;
  }
}

class ProductItem {
  constructor(product) {
    this.product = product;
  }

  addToCart() {
    App.addProductToCart(this.product);
  }

  addToFavourites() {
    App.addProductToFavourites(this.product);
    this.switchFavouritesIconRed();
  }

  switchFavouritesIconRed() {
    const prodEl = this.render();
    const favouritesBtn = prodEl.querySelector(".add-to-favourites-btn img");
    favouritesBtn.src = "images/favourites-red.svg";
  }

  render() {
    const prodEl = document.createElement("li");
    (prodEl.className = "item-card"), this.categorie;
    prodEl.id = this.product.id;
    prodEl.innerHTML = `
        <img class="item-image" src="${this.product.image}" alt="${this.product.title}">
        <div>
            <div>
                <p class="item-name">${this.product.title}</p>
                <p class="item-price">\$${this.product.price}</p>
            </div>
            <button class="add-to-cart-btn"><img src="images/cart.svg"></button>
            <button class="add-to-favourites-btn"><img src="images/favourites.svg"></button>
        </div>
        `;
    const addToCartBtn = prodEl.querySelector("button");
    addToCartBtn.addEventListener("click", this.addToCart.bind(this));
    const addToFavouritesBtn = prodEl.querySelector("button:last-of-type");
    addToFavouritesBtn.addEventListener(
      "click",
      this.addToFavourites.bind(this)
    );
    return prodEl;
  }
}

class ProductList {
  productsNewCollection = [
    new Product(
      "images/new-collection-item-1.png",
      "Women’s Fleece",
      160,
      1,
      "women"
    ),
    new Product(
      "images/new-collection-item-2.png",
      "Women Gentle-Support Leggins",
      130,
      2,
      "women"
    ),
    new Product(
      "images/new-collection-item-3.png",
      "Men’s T-shirt",
      80,
      3,
      "men"
    ),
  ];

  productsNewArrivals = [
    new Product(
      "images/new-arrivals-item-1.png",
      "Men’s Training Top",
      120,
      4,
      "men"
    ),
    new Product(
      "images/new-arrivals-item-2.png",
      "Women Tank Top",
      60,
      5,
      "women"
    ),
    new Product(
      "images/new-arrivals-item-3.png",
      "Women’s Trousers",
      150,
      6,
      "women"
    ),
  ];

  renderNewCollection() {
    const prodList = document.createElement("ul");
    prodList.className = "item-cards";
    for (const prod of this.productsNewCollection) {
      const productItem = new ProductItem(prod);
      const prodEl = productItem.render();
      prodList.append(prodEl);
    }
    return prodList;
  }

  renderNewArrivals() {
    const prodList = document.createElement("ul");
    prodList.className = "item-cards";
    for (const prod of this.productsNewArrivals) {
      const productItem = new ProductItem(prod);
      const prodEl = productItem.render();
      prodList.append(prodEl);
    }
    return prodList;
  }
}

class Search {
  constructor() {
    this.renderSearhcBar();
    this.searchBarVisibility();
  }

  searchBarVisibility() {
    const searchBtn = document.getElementById("search-btn");
    searchBtn.addEventListener("click", this.toggleClassVisibility);
  }

  toggleClassVisibility() {
    const searchBar = document.querySelector(".search-bar");
    searchBar.classList.remove("hidden");
  }

  renderSearhcBar() {
    let template = document.getElementById("search-template");
    let clone = template.content.cloneNode(true);
    const searchDiv = document.getElementById("search-div");
    searchDiv.appendChild(clone);
  }
}

const search = new Search();

class Favourites {
  items = [];

  constructor(cart) {
    this.cart = cart;
  }

  addProductToFavourites(product) {
    if (this.items.includes(product)) {
      Modal.displayAddedToModal("Item deleted from Favourites");
      const productIdx = this.items.findIndex((p) => p.id == product.id);
      let singleItem = this.items.splice(productIdx, 1);
      [singleItem] = [...singleItem];
      const singleProduct = document.getElementById(`${singleItem.id}`);
      singleProduct.remove();
      this.hideEmptyFavourites();
    } else {
      this.items.push(product);
      this.renderFavouriteItems();
      Modal.displayAddedToModal("Item added to ❤️");
    }
    this.toggleHeartColour(product);
  }

  hideEmptyFavourites() {
    const emptyFavouritesDiv = document.getElementById("empty-favourites-div");
    if (this.items.length > 0) {
      emptyFavouritesDiv.style.display = "none";
    } else {
      emptyFavouritesDiv.style.display = "block";
    }
  }

  //Deleting items from favourites
  deleteProductFromFavourites(product) {
    const deleteButton = product.querySelector(".delete-button");
    deleteButton.addEventListener(
      "click",
      this.deleteProduct.bind(this, product)
    );
  }

  deleteProduct(product) {
    const productIdx = this.items.findIndex((p) => p.id == product.id);
    let singleProduct = this.items.splice(productIdx, 1);
    [singleProduct] = [...singleProduct];
    product.remove();
    this.hideEmptyFavourites();
    this.toggleHeartColour(singleProduct);
    return singleProduct;
  }

  //Move item from favourites to cart
  moveItemToCartHandler(product) {
    const cartButton = product.querySelector("button:last-of-type");
    cartButton.addEventListener(
      "click",
      this.moveItemToCart.bind(this, product)
    );
  }

  moveItemToCart(productDiv) {
    const singleItem = this.deleteProduct(productDiv);
    this.cart.addProduct(singleItem);
  }

  //Change heart colour when you add/remove items from Favourites
  toggleHeartColour(product) {
    const allProductsList = Array.from(document.querySelectorAll(".item-card"));
    const prod = allProductsList.find((p) => p.id == product.id);
    const whiteHeart = prod.querySelector(".add-to-favourites-btn img");

    if (whiteHeart.src === "http://127.0.0.1:5500/images/favourites.svg") {
      whiteHeart.src = "images/favourites-red.svg";
    } else {
      whiteHeart.src = "images/favourites.svg";
    }
  }

  renderFavouriteItems() {
    const itemsList = document.getElementById("favourites-prod-list");
    let singleItem = document.createElement("div");
    itemsList.append(singleItem);
    this.items.forEach((item) => {
      singleItem.id = item.id;
      singleItem.innerHTML = `
            <div class="single-item-in-favourites">
            <div class="image-title-price">
            <img class="item-image-in-favourites" src="${item.image}" alt="${item.title}">
            <div class="title-price-in-favourites">
            <p class="item-name-in-favourites">${item.title}</p>
            <p class="item-price-in-favourites">\$${item.price}</p>
            </div>
            </div>
            <div id="buttons">
            <button><img class="delete-button" src="images/delete.svg"></button>
            <button><img class="add-to-cart" src="images/cart.svg"></button>
            </div>
            </div>
            `;
    });
    this.hideEmptyFavourites();
    this.deleteProductFromFavourites(singleItem);
    this.moveItemToCartHandler(singleItem);
  }
}

class ShoppingCart extends ProductList {
  // Cart array
  items = [];
  sum = 0;

  addProduct(product) {
    this.items.push(product);
    this.renderCartItems();
    Modal.displayAddedToModal("Item added to cart");

    this.sum = this.items.reduce((initialValue, currentItem) => {
      return initialValue + currentItem.price;
    }, 0);
    this.totalOutput.innerHTML = `Total: \$${this.sum}`;
    console.log(this.totalOutput);
  }

  //Deleting items from cart
  deleteProductFromCart(product) {
    const deleteButton = product.querySelector(".delete-button");
    deleteButton.addEventListener(
      "click",
      this.deleteProduct.bind(this, product)
    );
  }

  deleteProduct(product) {
    const productIdx = this.items.findIndex((p) => p.id == product.id);
    let singleProduct = this.items.splice(productIdx, 1);
    [singleProduct] = [...singleProduct];
    product.remove();
    let sum = this.sum;
    sum = sum - singleProduct.price;
    this.sum = sum;
    this.totalOutput.innerHTML = `Total: \$${sum}`;
    console.log(this.totalOutput);
    this.hideEmptyShoppingCart();
  }

  //Render Total in Cart
  render() {
    const cart = document.createElement("section");
    cart.innerHTML = `
        <h2>Total: \$${0}</h2>
        <button>Order Now!</button>
        `;
    cart.className = "cart";
    this.totalOutput = cart.querySelector("h2");
    const totalOrderSection = document.getElementById("total-order");
    totalOrderSection.append(cart);
  }

  // Hide empty shopping cart animation
  hideEmptyShoppingCart() {
    const emptyShoppingCartDiv = document.getElementById(
      "empty-shopping-cart-div"
    );
    if (this.items.length > 0) {
      emptyShoppingCartDiv.style.display = "none";
    } else {
      emptyShoppingCartDiv.style.display = "block";
    }
  }

  //Render Items added to Cart
  renderCartItems() {
    const itemsList = document.getElementById("cart-prod-list");
    let singleItem = document.createElement("div");
    itemsList.append(singleItem);
    this.items.forEach((item) => {
      singleItem.id = item.id;
      singleItem.innerHTML = `
            <div class="single-item-in-cart">
            <div class="image-title-price">
            <img class="item-image-in-cart" src="${item.image}" alt="${item.title}">
            <div class="title-price-in-cart">
            <p class="item-name-in-cart">${item.title}</p>
            <p class="item-price-in-cart">\$${item.price}</p>
            </div>
            </div>
            <button><img class="delete-button" src="images/delete.svg"></button>
            </div>
            `;
    });

    this.hideEmptyShoppingCart();
    this.deleteProductFromCart(singleItem);
  }
}

class Women extends ProductList {
  render() {
    const prodListCollection = document.querySelector(
      "#women-new-collection ul"
    );
    prodListCollection.className = "item-cards";
    for (const prod of this.productsNewCollection) {
      if (prod.categorie === "women") {
        const productItem = new ProductItem(prod);
        const prodEl = productItem.render();
        prodListCollection.append(prodEl);
      }
    }

    const prodListArrivals = document.querySelector("#women-new-arrivals ul");
    prodListArrivals.className = "item-cards";
    for (const prod of this.productsNewArrivals) {
      if (prod.categorie === "women") {
        const productItem = new ProductItem(prod);
        const prodEl = productItem.render();
        prodListArrivals.append(prodEl);
      }
    }
  }
}

class Men extends ProductList {
  render() {
    const prodListCollection = document.querySelector("#men-new-collection ul");
    prodListCollection.className = "item-cards";
    for (const prod of this.productsNewCollection) {
      if (prod.categorie === "men") {
        const productItem = new ProductItem(prod);
        const prodEl = productItem.render();
        prodListCollection.append(prodEl);
      }
    }

    const prodListArrivals = document.querySelector("#men-new-arrivals ul");
    prodListArrivals.className = "item-cards";
    for (const prod of this.productsNewArrivals) {
      if (prod.categorie === "men") {
        const productItem = new ProductItem(prod);
        const prodEl = productItem.render();
        prodListArrivals.append(prodEl);
      }
    }
  }
}

class Profile {
  render() {
    let logInTemplate = document.getElementById("log-in-template");
    let signUpTemplate = document.getElementById("sign-up-template");
    let cloneLogIn = logInTemplate.content.cloneNode(true);
    let cloneSignUp = signUpTemplate.content.cloneNode(true);
    const wrappingDiv = document.getElementById("page-wrapping-div");
    wrappingDiv.appendChild(cloneLogIn);
    wrappingDiv.appendChild(cloneSignUp);

    const logInButton = document.getElementById("log-in-button");
    const signUpButton = document.getElementById("sign-up-button");
    logInButton.addEventListener("click", this.toggleLogIn);
    signUpButton.addEventListener("click", this.toggleSignUp);

    const logInDiv = document.getElementById("log-in-div");
    logInDiv.classList.remove("hidden");
    const signUpDiv = document.getElementById("sign-up-div");
    signUpDiv.classList = "hidden account";
  }

  renderSignUp() {
    let template = document.getElementById("sign-up-template");
    let clone = template.content.cloneNode(true);
    const wrappingDiv = document.getElementById("page-wrapping-div");
    wrappingDiv.appendChild(clone);
  }

  toggleLogIn() {
    const logInButton = document.getElementById("log-in-button");
    const signUpButton = document.getElementById("sign-up-button");
    logInButton.classList = "selected";
    signUpButton.classList.remove("selected");

    const logInDiv = document.getElementById("log-in-div");
    logInDiv.classList.remove("hidden");
    const signUpDiv = document.getElementById("sign-up-div");
    signUpDiv.classList = "hidden account";
  }

  toggleSignUp() {
    const signUpButton = document.getElementById("sign-up-button");
    const logInButton = document.getElementById("log-in-button");
    signUpButton.classList = "selected";
    logInButton.classList.remove("selected");

    const signUpDiv = document.getElementById("sign-up-div");
    signUpDiv.classList.remove("hidden");
    const logInDiv = document.getElementById("log-in-div");
    logInDiv.classList = "hidden account";
  }

  preventSubmit() {
    const submitButtons = document.querySelector(".submit-button");
    submitButtons.forEach((button) =>
      button.addEventListener("click", (event) => event.preventDefault())
    );
  }
}

class Shop {
  render() {
    const renderHookNewCollection = document.getElementById("new-collection");
    const renderHookNewArrivals = document.getElementById("new-arrivals");

    this.cart = new ShoppingCart();
    this.cart.render();
    this.favourites = new Favourites(this.cart);
    const productList = new ProductList();
    const prodListElNewCollection = productList.renderNewCollection();
    const prodListElNewArrivals = productList.renderNewArrivals();

    renderHookNewCollection.append(prodListElNewCollection);
    renderHookNewArrivals.append(prodListElNewArrivals);
  }
}

class FetchPages {
  constructor() {
    this.renderPage("discover-more", "http://127.0.0.1:5500/about.html");
    this.renderPage("women", "http://127.0.0.1:5500/women.html", new Women());
    this.renderPage("men", "http://127.0.0.1:5500/men.html", new Men());
    this.renderPage("accessories", "http://127.0.0.1:5500/accessories.html");
    this.renderPage(
      "profile",
      "http://127.0.0.1:5500/profile.html",
      new Profile()
    );
  }

  renderPage(categorie, api, categorieClass) {
    const categorieButton = document.getElementById(`${categorie}-button`);
    categorieButton.addEventListener(
      "click",
      this.fetchPage.bind(this, api, categorieClass)
    );
  }

  fetchPage(api, categorie) {
    const wrappingDiv = document.getElementById("page-wrapping-div");
    const apiURL = api;

    fetch(apiURL)
      .then((response) => {
        return response.text();
      })
      .then((data) => {
        wrappingDiv.innerHTML = data;
      })
      .then(() => {
        const categorieClass = categorie;
        categorieClass.render();
      });
  }
}

class App {
  static init() {
    const shop = new Shop();
    shop.render();
    this.cart = shop.cart;
    this.favourites = shop.favourites;
    new FetchPages();
  }

  static addProductToCart(product) {
    this.cart.addProduct(product);
  }

  static addProductToFavourites(product) {
    this.favourites.addProductToFavourites(product);
  }
}

App.init();

//Shopping Cart & Favourites Modal Handling
class Modal {
  static modalHandler(section, sectionId) {
    const modal = document.getElementById(`${section}-modal`);
    const modalOverlay = document.getElementById(`${sectionId}`);

    modal.classList.toggle("hidden");
    modalOverlay.classList.toggle("hidden");
  }

  static closeModal(section, sectionId) {
    const modal = document.getElementById(`${section}-modal`);
    const modalOverlay = document.getElementById(`${sectionId}`);

    modal.className = "hidden";
    modalOverlay.className = "hidden";
  }

  static modalHandlerApp() {
    const cartModal = document.getElementById("cart-modal");
    const cartBtn = document.getElementById("cart-btn");
    const favouritesModal = document.getElementById("favourites-modal");
    const favouritesBtn = document.getElementById("favourites-btn");

    // Open cart modal
    cartBtn.addEventListener(
      "click",
      this.modalHandler.bind(this, "cart", "shopping-cart-container")
    );
    cartModal.addEventListener(
      "click",
      this.modalHandler.bind(this, "cart", "shopping-cart-container")
    );

    // Close the favourites modal
    cartBtn.addEventListener(
      "click",
      this.closeModal.bind(this, "favourites", "favourites-container")
    );
    cartModal.addEventListener(
      "click",
      this.closeModal.bind(this, "favourites", "favourites-container")
    );

    // Open favourites modal
    favouritesBtn.addEventListener(
      "click",
      this.modalHandler.bind(this, "favourites", "favourites-container")
    );
    favouritesModal.addEventListener(
      "click",
      this.modalHandler.bind(this, "favourites", "favourites-container")
    );

    // Close cart modal
    favouritesBtn.addEventListener(
      "click",
      this.closeModal.bind(this, "cart", "shopping-cart-container")
    );
    favouritesModal.addEventListener(
      "click",
      this.closeModal.bind(this, "cart", "shopping-cart-container")
    );
  }

  static displayAddedToModal(text) {
    const addedToModal = document.getElementById("modal-added-to");
    const modalText = addedToModal.querySelector("h3");
    modalText.innerHTML = text;
    addedToModal.classList.remove("hidden");
    $("#modal-added-to").delay(1000).fadeOut("slow");
    addedToModal.style.display = "block";
  }
}

Modal.modalHandlerApp();
