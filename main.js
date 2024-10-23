const urlApi = "http://localhost:3000/products";
const contentApi = document.querySelector ("#content-div");
const contentFunction = document.querySelector("#sell-div");

fetch (urlApi) 
  .then((response) => {
    if (response.ok) {
      return response.json()
    }else {
      throw new Error('Error en la conexion'); 
    }
  }) 
  .then((products)=> {
    const prd = products.map ((product)=> `
    <li id="product-li">
      <div id="product-div"> 
        <img src="${product.imagen}" alt="${product.nombre}" />
        ${product.nombre} - ${product.precio}$
      <div>
      <button id="btn-shop">Comprar</button>
    </li>
    `).join ("");
    contentApi.innerHTML = `<ul id="product-ul">${prd}</ul>`;
    
    const productBtn = document.querySelector("#btn-shop");
    productBtn.forEach((item) => {
      item.addEvenListener ("click", () => {
        
      })
    });
})
.catch((error)=> { 
  console.error("Error al adquirir los porductos", error);
  contentApi.innerHTML = `Error al adquirir los porductos`
})

// fetch (urlApi) 
//   .then((response) => {
//     if (response.ok) {
//       return response.json()
//     }else {
//       throw new Error('Error en la conexion'); 
//     }
//   })
  
// .catch((error)=> { 
//   console.error("Error al adquirir los porductos", error);
//   contentFunction.innerHTML = `Error al adquirir los porductos`
// })


