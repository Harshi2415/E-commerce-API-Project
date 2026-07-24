const productDetails = document.getElementById("productDetails"); //used to add details to products detail page in html using js
const params = new URLSearchParams(window.location.search); //URL search parameters used to search a product with specific id to open that specific product in a new location on the same tab
const productId = params.get("id"); //fetching the product id for the use in URL 
const apiUrl = `https://dummyjson.com/products/${productId}`; //changing our URL according to the product id only otherwise it will be messy consisting all information about product
async function getProduct(){ 
    const response = await fetch(apiUrl); //fetching the specific product details using apiUrl
    const product = await response.json(); //converting recieved response into js objects
    productDetails.innerHTML = 
    `<div class="product-card">
        <img src= "${product.thumbnail}" alt="${product.title}"></img>
        <div class="product-info">
            <h2>${product.title}</h2>
            <p><strong>Price :</strong>$${product.price}</p>
            <p><strong>Rating :</strong>${product.rating}</p>
            <p><strong>Category :</strong>${product.category}</p>
            <p><strong>Brand :</strong>${product.brand}</p>
            <p><strong>Stock :</strong>${product.stock}</p>
            <p><strong>Description:</strong></p>
            <p>${product.description}</p>
            <button onClick="goBack()">
                Back to Products
            </button>
        </div>
    </div>` 
} //async function to display the specific clicked product-details on a page

getProduct(); //calling the function to get product details dispalyed on a sepearte page

function goBack(){ 
    window.location.href = "website.html"
} //function used to go back to the home page of our website
