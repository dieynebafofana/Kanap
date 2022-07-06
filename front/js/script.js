//requete API pour demander l'ensemble des produits

let url = "http://localhost:3000/api/products";

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (products) {
    let item = document.getElementById("items");

    //boucle for...of
    for (let product of products) {
      let aElt = document.createElement("a");
      aElt.setAttribute("href", `./product.html?id=${product._id}`);

      let articleElt = document.createElement("article");

      let imgElt = document.createElement("img");
      imgElt.setAttribute("src", `${product.imageUrl}`);
      imgElt.setAttribute("alt", `${product.name}`);

      let h3Elt = document.createElement("h3");
      h3Elt.textContent = product.name;

      let pElt = document.createElement("p");
      pElt.className = "productDescription";
      pElt.textContent = product.description;

      articleElt.appendChild(imgElt);
      articleElt.appendChild(h3Elt);
      articleElt.appendChild(pElt);
      aElt.appendChild(articleElt);
      item.appendChild(aElt);
    }
  });
