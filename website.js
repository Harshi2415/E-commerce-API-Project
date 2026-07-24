const apiUrl = "https://dummyjson.com/products"; //This is our API URL
const productContainer = document.getElementById("productContainer"); //imp for dynamic product adding in html using js
const searchInput = document.getElementById("searchInput"); //getting the search button work 
let allProducts = []; //array which consists of all products on our website
let displayedProducts = [];
let currentPage = 1; //current page in pagination
const productsPerPage = 9; //as fo rour website we want to display only 9 products per page 
const nextBtn = document.getElementById("nextBtn");
const prevBtn = document.getElementById("prevBtn");
const pageNum = document.getElementById("pageNum");

function displayProducts(products){ 
    productContainer.innerHTML = ""; //to make our screen empty before displaying products according to our need 
    products.forEach(function(product){ //loop for creating cards for each product
       productContainer.innerHTML += //if we dont use += it will only show one product at a time 
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
       </div>` //we've used template literals for displaying info on card
    });
} //function used to display products according to the need like allProducts/filteredproducts/searchedProducts

function displayCurrentPage(){
    const startIndex = (currentPage - 1) * productsPerPage; //calculating startIndex for our products
    const endIndex = startIndex + productsPerPage; //calculating endIndex for our products 
    const pageProducts = displayedProducts.slice(startIndex, endIndex); 
    displayProducts(pageProducts); //display only 9 products per page as default 
    
    const totalPages = Math.ceil(displayedProducts.length / productsPerPage);
    pageNum.textContent = `Page ${currentPage} of ${totalPages}`; 
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

async function getProducts() {  //function to display products page
    const response = await fetch(apiUrl); //using apiUrl to fetch the products and their info for our website in the form of response
    const data = await response.json();  //converting response into javascript objects
    allProducts = data.products;
    displayedProducts = allProducts;
    displayCurrentPage(); //calling function to display current page of products
}

getProducts(); //calling our function getProducts()

function viewProduct(id){ //function for viewing a single product using id after clicking on a specific product
    window.location.href = `product.html?id=${id}`; //opens in a new location on the same tab
}

searchInput.addEventListener("input",function(){ //event listener used for search bar working
    const searchText = searchInput.value.trim(); //getting trigger by the user input value 
    const filteredProducts = allProducts.filter(function(product){ //function for displaying filtered products only 
       return (
        product.title.toLowerCase().includes(searchText.toLowerCase())||
        product.category.toLowerCase().includes(searchText.toLowerCase())
     ); //returns result by converting user text into lowercase as js is case-insensitive and using include() to check weather the products containg same spelling as of searchText
    });

    displayedProducts = filteredProducts;
    currentPage = 1;
    displayCurrentPage();
});

nextBtn.addEventListener("click", function() {
    const totalPages = Math.ceil(displayedProducts.length/ productsPerPage);
    if(currentPage < totalPages){
        currentPage++;
        displayCurrentPage();
    }
});

prevBtn.addEventListener("click", function () {
    if(currentPage > 1){
        currentPage--;
        displayCurrentPage();
    }
});