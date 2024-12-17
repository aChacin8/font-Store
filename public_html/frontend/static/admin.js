const urlApi = "https://api-server-store-git-main-achacin8s-projects.vercel.app/?vercelToolbarCode=f2pcgXLUeMVuQI-";
const infoProduct = document.querySelector ('#div-info')

fetch (urlApi)
.then ((response) => response.json())
.then((products) => {
    const prd = products.map ((product)=> 
        `<li id="li-admin">
            <div id= "div-admin">
                <h1 id="h1-admin">${product.nombre}</h1>
                <img src="${product.imagen}" alt="${product.nombre} id= "img-admin">
            </div>           
            <div id= "div-admin2">
                <p id="p-admin">Descripcion: <br></br>${product.descripcion}</p>
                <p id="p-admin">Cantidad Disponible: ${product.cantidadDisponible}</p>
            </div>
        </li>`).join ("");


    infoProduct.innerHTML = `<ul id="ul-admin">${prd}</ul>`;
})
.catch ((error) => {
    console.error(`Error ${error}`);
    infoProduct.innerHTML = `Error al adquirir los productos: ${error.message}`;

});

document.addEventListener('keyup', e => {
    if (e.target.matches('#search-admin')) {
        let searchValue = e.target.value.toLowerCase().trim();
        document.querySelectorAll('#li-admin').forEach(prd => {
            if (prd.textContent.toLowerCase().includes(searchValue)) {
                prd.style.display = "block";
            } else {
                prd.style.display = "none";
            }
    });
    }
});