const urlApi = "https://api-server-store-git-main-achacin8s-projects.vercel.app/?vercelToolbarCode=f2pcgXLUeMVuQI-";
const contentApi = document.querySelector("#content-div");
const contentFunction = document.querySelector("#store-div");
const btnCart = document.querySelector("#container-icon");
const containerPrd = document.querySelector('.container-cart-products');

let productList = JSON.parse(localStorage.getItem('apiData')) || [];

fetch(urlApi)
    .then((response) => {
        if (response.ok) {
            return response.json();
        } else {
            throw new Error('Error en la conexión: ' + response.status);
        }
    })
    .then((products) => {
        console.log("Productos recibidos:", products);
        const prd = products.map((product) => `
        <li id="product-li"> 
            <img src="${product.imagen}" alt="${product.nombre}" />
            <h2 id="product-name">${product.nombre}</h2>
            <h3 id="product-price">$${product.precio}</h3>
            <p id="product-info">${product.descripcion}</p>
            <button class="btn-shop" id="reload">Agregar al carrito</button>
        </li>`).join("");

        contentApi.innerHTML = `<ul id="product-ul">${prd}</ul>`;
    })
    .catch((error) => {
        console.error("Error al adquirir los productos:", error);
        contentApi.innerHTML = `Error al adquirir los productos: ${error.message}`;
    });
