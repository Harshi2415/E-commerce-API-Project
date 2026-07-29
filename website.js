const apiUrl = "https://dummyjson.com/products"; //API URL to be used 
const productContainer = document.getElementById("productContainer"); //used for displaying products 
const searchInput = document.getElementById("searchInput"); //used for search bar
const categoryFilter = document.getElementById("categoryFilter"); //used for category filter
let selectedCategory = ""; //default value of category
const overlay = document.getElementById("overlay"); //overlay when sidebar is open
const sidebar = document.getElementById("productSidebar"); //sidebar when a product is clicked 
const closeSidebar = document.getElementById("closeSidebar"); //closing sidebar button
const sidebarImage = document.getElementById("sidebarImage"); //image of the product in sidebar
const sidebarTitle = document.getElementById("sidebarTitle"); //title of the product in sidebar
const sidebarPrice = document.getElementById("sidebarPrice"); //price of the product in sidebar
const sidebarCategory = document.getElementById("sidebarCategory"); //category of the product in sidebar
const sidebarBrand = document.getElementById("sidebarBrand"); //brand of the product in sidebar
const sidebarStock = document.getElementById("sidebarStock"); //stock of the product in sidebar
const sidebarRating = document.getElementById("sidebarRating"); //rating of the product in sidebar
const sidebarDescription = document.getElementById("sidebarDescription"); //description of the product in sidebar
let currentPage = 1; //default value of current page
const productsPerPage = 9; //number of products per page  
let totalProducts = 0; //total number of products
let searchText = ""; //default value of search text 
const nextBtn = document.getElementById("nextBtn"); //next button for pagination
const prevBtn = document.getElementById("prevBtn"); //back button for pagination
const pageNum = document.getElementById("pageNum"); //page number

async function loadCategories(){
    const response = await fetch (`${apiUrl}/categories`);
    const categories = await response.json();
    categories.forEach(function(category){
        categoryFilter.innerHTML +=
        `<option value="${category.slug}">
            ${category.name}
        </option>`;
    });
} //function for displaying different categories in dropdown

function displayProducts(products){ 
    productContainer.innerHTML = "";
    if (products.length === 0) {
        productContainer.innerHTML = "<h2>No products found.</h2>";
        return;
    } //statement if no products match the search 
    products.forEach(function(product){ 
       productContainer.innerHTML += 
       `<div class="card"> 
        <img src = "${product.thumbnail}" alt="${product.title}"></img>
        <div class="card-content">
            <h2>${product.title}</h2>
            <p class="price">$${product.price}</p>
            <p class="category">${product.category}</p>
            <button onclick="viewProduct(${product.id})">
               View details
            </button>
        </div>
       </div>` 
    });
} //function for displaying products on page

function updatePagination(){
    const totalPages = Math.ceil(totalProducts/productsPerPage);
    pageNum.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
} //function for updating page numbers and disabling back and next buttons according to conditions

function checkURL(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if(id){
        viewProduct(id);
    }
} //function to check if the URL contains a product ID

async function getProducts(page = 1){
    const skip = (page-1)*productsPerPage;
    let url;
    if (selectedCategory !== "") {
        url =`${apiUrl}/category/${selectedCategory}?limit=${productsPerPage}&skip=${skip}`;
    }else if (searchText !== "") {
        url =`${apiUrl}/search?q=${searchText}&limit=${productsPerPage}&skip=${skip}`;
    }else {
        url =`${apiUrl}?limit=${productsPerPage}&skip=${skip}`;
    }
    const response = await fetch(url);
    const data = await response.json();
    totalProducts = data.total;
    displayProducts(data.products);
    updatePagination();
} //function for displaying products according to the conditions of search, pagination and category filters

getProducts(); 
loadCategories();
checkURL();

async function viewProduct(id){
    const response = await fetch(`${apiUrl}/${id}`);
    const product = await response.json();
    sidebarImage.src = product.thumbnail;
    sidebarTitle.textContent = product.title;
    sidebarPrice.innerHTML = `<strong>Price:</strong> $${product.price}`;
    sidebarCategory.innerHTML = `<strong>Category:</strong> ${product.category}`;
    sidebarBrand.innerHTML = `<strong>Brand:</strong> ${product.brand}`;
    sidebarStock.innerHTML = `<strong>Stock:</strong> ${product.stock}`;
    sidebarRating.innerHTML = `⭐ <strong>Rating:</strong> ${product.rating}`;
    sidebarDescription.innerHTML = `<strong>Description:</strong><br>${product.description}`;
    sidebar.classList.add("active");
    overlay.classList.add("active");
    history.pushState({}, "", `?id=${id}`);
} //function to display sidebar when a product is clicked using id

closeSidebar.addEventListener("click", function(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    history.pushState({}, "", "index.html");
}); //function for working of close button 

overlay.addEventListener("click", function(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    history.pushState({}, "", "index.html");
}); //function for overlay to close the sidebar when clicking outside the sidebar 

categoryFilter.addEventListener("change", function(){
    selectedCategory = categoryFilter.value;
    currentPage = 1;
    getProducts(currentPage);
}); //displaying products according to category

searchInput.addEventListener("input",function(){
    searchText = searchInput.value.trim();
    currentPage = 1;
    getProducts(currentPage);
}); //function for working of search bar

nextBtn.addEventListener("click",function(){
    const totalPages = Math.ceil(totalProducts/productsPerPage);
    if(currentPage < totalPages){
        currentPage++;
        getProducts(currentPage);
    }
}); //function for next button

prevBtn.addEventListener("click", function () {
    if(currentPage > 1){
        currentPage--;
        getProducts(currentPage);
    }
}); //function for back button