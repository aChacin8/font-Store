const urlApi = "http://localhost:3000/api/products";
const contentApi = document.querySelector("#content-div");
const contentFunction = document.querySelector("#store-div");
const btnCart = document.querySelector("#container-icon");
const containerPrd = document.querySelector('.container-cart-products');

let productList = JSON.parse(localStorage.getItem("apiData")) || [];

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

    const btnPrd = document.querySelectorAll(".btn-shop");
    btnPrd.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const collectPrd = products[index];
        if (collectPrd.cantidadDisponible > 0) {
          addToCart(collectPrd);
          collectPrd.cantidadDisponible -= 1; 
          localStorage.setItem ("apiData", JSON.stringify(productList));
          console.log(`Has agregado al carrito ${collectPrd.nombre}`);
        } else {
          alert (`Producto no disponible, cantidad = ${collectPrd.cantidadDisponible}`)
        }
      });
    });
  })
  .catch((error) => {
    console.error("Error al adquirir los productos:", error);
    contentApi.innerHTML = `Error al adquirir los productos: ${error.message}`;
  });

btnCart.addEventListener('click', () => { 
  containerPrd.classList.toggle('hidden-cart'); 
  infoProducts(); 
});

const addToCart = (product) => {
  const existingPrd = productList.find(item => item.id === product.id);
  if (existingPrd) {
    existingPrd.cantidad += 1;
  } else {
    product.cantidad = 1;
    productList.push(product);
  }
};

const infoProducts = () => {
  contentFunction.innerHTML = '';
  productList.forEach((product, index) => {
    const cardPrd = document.createElement('div');
    cardPrd.classList.add('card-item');
    cardPrd.innerHTML = `
      <div id="buy-div">
          <ul id="content-ul">
            <li id="content-li">
              <img src="${product.imagen}" alt="${product.nombre}" />
              <p id="content-p">Nombre: ${product.nombre}</p>
              <p id="content-p">Precio: ${product.precio}$</p>
              <p id="content-p">Cantidad: ${product.cantidad}</p>
              <p id="content-p">Disponibilidad: ${product.cantidadDisponible}</p>
            </li>
          </ul>
          <button class="btn-remove" data-index="${index}">Borrar</button>
      </div>`;
      
    contentFunction.appendChild(cardPrd);
  });

  const btnRemove = document.querySelectorAll(".btn-remove");
  btnRemove.forEach(btn => {
    btn.addEventListener("click", (e) => {
      const index = e.target.dataset.index; 
      productList.splice(index, 1);
      localStorage.setItem('apiData', JSON.stringify(productList));
      infoProducts();
    });
  });

  addBtns(); 
};

const addBtns = () => {
  let existingBtns = document.querySelector(".b-div");

  if (!existingBtns){
  const btns = document.createElement ('div');
  btns.classList.add ('b-div');
  
  btns.innerHTML = `
    <button id="btn-buy">Comprar</button>
    <button id="btn-clean">Vaciar Carrito</button>
  `;

  containerPrd.appendChild (btns);

  const btnBuy = document.querySelector("#btn-buy");
  btnBuy.addEventListener("click", (e) => {
      alert(`Has comprado ${productList.length} productos`);
    });

  const btnClean = document.querySelector("#btn-clean");
    btnClean.addEventListener("click", () => {
      productList = [];
      localStorage.setItem('apiData', JSON.stringify(productList));
      infoProducts();
    });
  }
};

const collectInfo = () => {
  const collectContainer = document.querySelectorAll(".product-li");
  collectContainer.forEach(container => {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-shop")) {
        const product = e.target.parentElement; 
        const infoProduct = {
          cantidad: 1,
          name: product.querySelector('h2').textContent,
          precio: product.querySelector('h3').textContent
        }
        productList = [...productList, infoProduct];
        console.log(productList);
      }
    });
  });
};

document.addEventListener('keyup', e => {
  if (e.target.matches('#search-prd')) {  
    let searchValue = e.target.value.toLowerCase().trim(); 
    document.querySelectorAll('#product-li').forEach(prd => {
      if (prd.textContent.toLowerCase().includes(searchValue)) {
        prd.style.display = "block";
      } else {
        prd.style.display = "none";
      }
    });
  }
});