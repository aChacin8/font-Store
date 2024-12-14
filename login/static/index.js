const urlApi = "https://api-server-store-git-main-achacin8s-projects.vercel.app/?vercelToolbarCode=f2pcgXLUeMVuQI-";
const infoProduct = document.querySelector ('#div-info')

fetch (urlApi)
.then ((response) => response.json())
.then((products) => {
    const prd = products.map ((product)=> 
        `<li id="li-info">
            <h1 id="h1-info">${product.nombre}</h1>
            <p id="p-info">${product.descripcion}</p>
            <img src="${product.imagen}" alt="${product.nombre} id= "img-info">            
        </li>`).join ("");


    infoProduct.innerHTML = `<ul id="ul-info">${prd}</ul>`;
})
.catch ((error) => {
    console.error(`Error ${error}`);
    infoProduct.innerHTML = `Error al adquirir los productos: ${error.message}`;

});