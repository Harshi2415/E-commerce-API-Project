const apiUrl = "https://dummyjson.com/products"; //This is our API URL
const productContainer = document.getElementById("productContainer"); //imp for dynamic product adding in html using js
const searchInput = document.getElementById("searchInput"); //getting the search button work 
let allProducts = []; //array which consists of all products on our website
let displayedProducts = []; //array which consist only the products displaying on screen
let currentPage = 1; // setting default value of current page in pagination
const productsPerPage = 9; //as fo rour website we want to display only 9 products per page 
const nextBtn = document.getElementById("nextBtn"); //next btn in pagination
const prevBtn = document.getElementById("prevBtn"); //back btn in pagination
const pageNum = document.getElementById("pageNum"); //Page numbers in pagination

function displayProducts(products){ 
    productContainer.innerHTML = ""; //to make our screen empty before displaying products according to our need 
    products.forEach(function(product){ //loop for creating cards for each product
       productContainer.innerHTML += //+= creates and adds product cards to the page 
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
} //function used to display products according to the need like allProducts/filteredproducts/etc

function displayCurrentPage(){
    const startIndex = (currentPage - 1) * productsPerPage; //calculating startIndex for our products
    const endIndex = startIndex + productsPerPage; //calculating endIndex for our products on one page 
    const pageProducts = displayedProducts.slice(startIndex, endIndex); //assigning 9 products according to index to display on page
    displayProducts(pageProducts); //display only 9 products per page as default 
    
    const totalPages = Math.ceil(displayedProducts.length / productsPerPage);//calculating total no. of pages for products
    pageNum.textContent = `Page ${currentPage} of ${totalPages}`; //displaying page number using template literals 
    prevBtn.disabled = currentPage === 1; //disabling back button if current page no. is 1
    nextBtn.disabled = currentPage === totalPages; //disabling next button if we are on last page
} //function used to display current page 

async function getProducts() {  //function to display products on page
    const response = await fetch(apiUrl); //using apiUrl to fetch the products and their info for our website in the form of response
    const data = await response.json();  //converting response into javascript objects
    allProducts = data.products; //it stores all the products fetched by API not total,skip or limit just products array
    displayedProducts = allProducts; //allProducts are displayed
    displayCurrentPage(); //calling function to display current page of products
}

getProducts(); //calling our function getProducts()

function viewProduct(id){ //function for connecting home page to products details page 
    window.location.href = `product.html?id=${id}`; //opens in a new location on the same tab with the url consisting id
}

searchInput.addEventListener("input",function(){ //event listener used for search bar working
    const searchText = searchInput.value.trim(); //getting trigger by the user input value and also trimming the blank space
    const filteredProducts = allProducts.filter(function(product){ //function for displaying filtered products only 
       return (
        product.title.toLowerCase().includes(searchText.toLowerCase())||
        product.category.toLowerCase().includes(searchText.toLowerCase())
     ); //returns result by converting user text into lowercase as js is case-insensitive and using include() to check weather the products containg same spelling as of searchText
    });

    displayedProducts = filteredProducts; //array displayed products contains only filtered products
    currentPage = 1; //setting default value for the current page of the filtered products after search
    displayCurrentPage(); //displaying the pages for the products which are result of search 
});

nextBtn.addEventListener("click", function() {
    const totalPages = Math.ceil(displayedProducts.length/ productsPerPage);
    if(currentPage < totalPages){
        currentPage++;
        displayCurrentPage();
    }
}); //function for the next button 

prevBtn.addEventListener("click", function () {
    if(currentPage > 1){
        currentPage--;
        displayCurrentPage();
    }
});//function for the back button