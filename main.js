const urlApi = "http://localhost:3000/api/products";
const contentApi = document.querySelector("#content-div");
const contentFunction = document.querySelector("#store-div");

fetch(urlApi)
  .then((response) => {
    if (response.ok) {
      return response.json();
    } else {
      throw new Error('Error en la conexión: ' + response.status);
    }
  })
  .then((products) => {
    console.log("Productos recibidos:", products); // Debug: ver qué productos se reciben
    const prd = products.map((product) => `
      <li id="product-li">
        <div id="product-div"> 
          <img src="${product.imagen}" alt="${product.nombre}" />
          ${product.nombre} - ${product.precio}$
          <button class="btn-shop">Agregar al carrito</button>
        </div>
      </li>`).join("");

    contentApi.innerHTML = `<ul id="product-ul">${prd}</ul>`;

    const btnPrd = document.querySelectorAll(".btn-shop");
    btnPrd.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const collectPrd = products[index];

        contentFunction.innerHTML = `
        <div id="buy-div">
          <ul id="content-ul">
            <li id="content-li">
              <img src="${collectPrd.imagen}" alt="${collectPrd.nombre}" />
              <p id="content-p">Nombre: ${collectPrd.nombre}</p>
              <p id="content-p">Precio: ${collectPrd.precio}$</p> 
            </li>
          </ul>
          <button id="btn-buy">Comprar</button>
          <button id="btn-clear">Borrar</button>
        </div>`;

        const confirmBtn = document.querySelector("#btn-buy");
        confirmBtn.addEventListener("click", () => {
          alert(`Has comprado ${collectPrd.nombre}`);
        });
      });
    });
  })
  .catch((error) => {
    console.error("Error al adquirir los productos:", error);
    contentApi.innerHTML = `Error al adquirir los productos: ${error.message}`;
  });
