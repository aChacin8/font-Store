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

    const btnPrd = document.querySelectorAll(".btn-shop");
    btnPrd.forEach((btn, index) => {
      btn.addEventListener("click", () => {
        const collectPrd = products[index];
        if (collectPrd.cantidadDisponible > 0) {
          addToCart(collectPrd);
          collectPrd.cantidadDisponible -= 1;
          localStorage.setItem("apiData", JSON.stringify(productList));
          console.log(`Has agregado al carrito ${collectPrd.nombre}`);
        } else {
          alert(`Producto no disponible, cantidad = ${collectPrd.cantidadDisponible}`)
        }
      });
    });
    collectInfo();
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


const btnPlus = () => {
  const btnPlus = document.querySelectorAll(".btn-plus");
  btnPlus.forEach((plus) => {
    plus.addEventListener("click", (e) => {
      const prdId = parseInt(e.target.closest('.cont-Product').dataset.id);
      const existingPrd = productList.find(prd => prd.id === prdId);

      if (existingPrd) {
        if (existingPrd.cantidadDisponible > 0) {
          existingPrd.cantidad += 1;
          existingPrd.cantidadDisponible -= 1;
          localStorage.setItem("apiData", JSON.stringify(productList));
          console.log(`Producto modificado = ${existingPrd.nombre}, cantidad = ${existingPrd.cantidad}`);
        } else {
          alert(`Producto no disponible, cantidad = ${existingPrd.cantidadDisponible}`);
        }
      } else {
        console.error('Producto no encontrado:', prdId);
      }

    });
  })
}

const btnMinus = () => {

  const btnMinus = document.querySelectorAll(".btn-minus");
  btnMinus.forEach((minus) => {
    minus.addEventListener("click", (e) => {
      const prdId = parseInt(e.target.closest('.cont-Product').dataset.id);
      const existingPrd = productList.find(prd => prd.id === prdId);

      if (existingPrd) {
        if (existingPrd.cantidadDisponible > 0) {
          existingPrd.cantidad -= 1;
          existingPrd.cantidadDisponible += 1;
          localStorage.setItem("apiData", JSON.stringify(productList));
          console.log(`Producto modificado = ${existingPrd.nombre}, cantidad = ${existingPrd.cantidad}`);

        }
      } else {
        console.error('Producto no encontrado:', prdId);
      }
    })
  })
}

const infoProducts = () => {
  contentFunction.innerHTML = '';
  productList.forEach((product, index) => {

    const cardPrd = document.createElement('div');
    cardPrd.classList.add('cont-Product');
    cardPrd.dataset.id = product.id
    cardPrd.innerHTML = `
      <div id="buy-div">
          <ul id="content-ul">
            <li id="content-li">
              <div id= "div-divisor2"><img src="${product.imagen}" alt="${product.nombre}" /></div>
              <div id= "div-divisor">
              <p id="content-p">Nombre: ${product.nombre}</p>
              <p id="content-p">Precio: ${product.precio}$</p>
                <div id="counter">
                  <p id="content-p">Cantidad:</p>
                  <button class="btn-minus">-</button>
                  <p>${product.cantidad}</p>
                  <button class="btn-plus">+</button>
                </div>
              </div>
            </li>
            <button class="btn-remove" data-index="${index}">Eliminar de Carrito</button>

          </ul>
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
  btnPlus();
  btnMinus();
};

const addBtns = () => {
  let existingBtns = document.querySelector(".b-div");

  if (!existingBtns) {
    const btns = document.createElement('div');
    btns.classList.add('b-div');

    btns.innerHTML = `
    <button id="btn-buy">Comprar</button>
    <button id="btn-clean">Vaciar Carrito</button>
  `;

    containerPrd.appendChild(btns);

    const buy = document.querySelector("#btn-buy");
    buy.addEventListener("click", (e) => {
      productList.forEach(product => {
        btnBuy(product.id);
      })
    });

    const btnClean = document.querySelector("#btn-clean");
    btnClean.addEventListener("click", () => {
      productList = [];
      localStorage.setItem('apiData', JSON.stringify(productList));
      infoProducts();
    });
  }
};

const btnBuy = () => {
  productList.forEach(product => {
    const productId = product.id;
    const updatedProduct = {
      id: productId,
      cantidad: product.cantidad,
      cantidadDisponible: product.cantidadDisponible - product.cantidad
    };

    fetch(`https://api-server-store-git-main-achacin8s-projects.vercel.app/api/products/${productId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedProduct)
    })
      .then((response) => response.json())
      .then((buyPrd) => {
        const productIndex = productList.findIndex(prd => prd.id === productId);
        if (productIndex !== -1) {
          productList[productIndex].cantidadDisponible = buyPrd.product.cantidadDisponible;
          localStorage.setItem('apiData', JSON.stringify(productList));
        }
        console.log(`Compra realizada: ${buyPrd.product.nombre}, cantidad comprada: ${product.cantidad}`);
      })
      .catch((error) => {
        console.error(`Error al comprar el producto: ${error}`);
      });
  });

  alert('Compra realizada con éxito');
  productList = [];
  localStorage.setItem('apiData', JSON.stringify(productList));
  infoProducts();
};

const collectInfo = () => {
  const collectContainer = document.querySelectorAll(".product-li");
  collectContainer.forEach(container => {
    container.addEventListener("click", (e) => {
      if (e.target.classList.contains("btn-shop")) {
        const product = e.target.parentElement;
        const infoProduct = {
          id: parseInt(product.dataset.id),
          cantidad: 1,
          name: product.querySelector('h2').textContent,
          precio: parseFloat(product.querySelector('h3').textContent),
          cantidadDisponible: parseInt(product.querySelector('#product-info'))
        };
        productList = [...productList, infoProduct];
        localStorage.setItem('apiData', JSON.stringify(productList));
        console.log("Localstorage actualizado", productList);
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

