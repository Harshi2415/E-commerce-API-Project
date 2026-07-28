const apiUrl = "https://dummyjson.com/products"; 
const productContainer = document.getElementById("productContainer"); 
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
let selectedCategory = "";
const overlay = document.getElementById("overlay");
const sidebar = document.getElementById("productSidebar");
const closeSidebar = document.getElementById("closeSidebar");
const sidebarImage = document.getElementById("sidebarImage");
const sidebarTitle = document.getElementById("sidebarTitle");
const sidebarPrice = document.getElementById("sidebarPrice");
const sidebarCategory = document.getElementById("sidebarCategory");
const sidebarBrand = document.getElementById("sidebarBrand");
const sidebarStock = document.getElementById("sidebarStock");
const sidebarRating = document.getElementById("sidebarRating");
const sidebarDescription = document.getElementById("sidebarDescription");
let currentPage = 1; 
const productsPerPage = 9; 
let totalProducts = 0;
let searchText = "";
const nextBtn = document.getElementById("nextBtn"); 
const prevBtn = document.getElementById("prevBtn"); 
const pageNum = document.getElementById("pageNum"); 

async function loadCategories(){
    const response = await fetch (`${apiUrl}/categories`);
    const categories = await response.json();
    categories.forEach(function(category){
        categoryFilter.innerHTML +=
        `<option value="${category.slug}">
            ${category.name}
        </option>`;
    });
}

function displayProducts(products){ 
    productContainer.innerHTML = "";
    if (products.length === 0) {
        productContainer.innerHTML = "<h2>No products found.</h2>";
        return;
    }
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
}

function updatePagination(){
    const totalPages = Math.ceil(totalProducts/productsPerPage);
    pageNum.textContent = `Page ${currentPage} of ${totalPages}`;
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
} 

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
}
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
}

closeSidebar.addEventListener("click", function(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    history.pushState({}, "", "index.html");
});

overlay.addEventListener("click", function(){
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
    history.pushState({}, "", "index.html");
});

function checkURL(){
    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if(id){
        viewProduct(id);
    }
}

categoryFilter.addEventListener("change", function(){
    selectedCategory = categoryFilter.value;
    currentPage = 1;
    getProducts(currentPage);
});

searchInput.addEventListener("input",function(){
    searchText = searchInput.value.trim();
    currentPage = 1;
    getProducts(currentPage);
});

nextBtn.addEventListener("click",function(){
    const totalPages = Math.ceil(totalProducts/productsPerPage);
    if(currentPage < totalPages){
        currentPage++;
        getProducts(currentPage);
    }
}); 

prevBtn.addEventListener("click", function () {
    if(currentPage > 1){
        currentPage--;
        getProducts(currentPage);
    }
});