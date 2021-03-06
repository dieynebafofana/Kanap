//paramètre transition index à la page produit
let params = new URLSearchParams(document.location.search);
let product_id = params.get("id");

//récupérer les informations d'un produit

fetch(`http://localhost:3000/api/products/${product_id}`)
  .then(function (response) {
    return response.json();
  })
  .then(function (product) {
    //créer les élèments du produit à intégrer dans le DOM

    let imgElt = document.querySelector(".item__img img");
    imgElt.setAttribute("src", `${product.imageUrl}`);
    imgElt.setAttribute("alt", `${product.name}`);

    let titleElt = document.getElementById("title");
    titleElt.textContent = product.name;

    let priceElt = document.getElementById("price");
    priceElt.textContent = product.price;

    let descriptionElt = document.getElementById("description");
    descriptionElt.textContent = product.description;

    let colorsElt = document.getElementById("colors");

    product.colors.forEach((color) => {
      let optionElt = document.createElement("option");
      optionElt.setAttribute(`value`, color);
      optionElt.textContent = color;
      colorsElt.appendChild(optionElt);
    });

    //bouton panier

    let buttonPanier = document.getElementById("addToCart");

    buttonPanier.addEventListener(
      "click",
      function () {
        //Récupérer les informations pour choisir les colors et la quantité
        let quantity = document.querySelector("input");

        //Créer mon produits a ajouter au panier
        let produit = {
          id: product_id,
          name: product.name,
          altTxt: product.altTxt,
          quantity: parseInt(quantity.value),
          color: colors.value,
          imgUrl: product.imageUrl,
        };

        //ajouter un produit au panier
        let panier = JSON.parse(localStorage.getItem("panier"));
        //si mon panier est vide, créer un tableau vide
        if (!panier) {
          panier = [];
        }

        //Vérifier la Colors et quantity is not empty
        if (
          produit.color !== "" &&
          produit.color !== null &&
          produit.quantity !== 0
        ) {
          //ajouter une quantité et une couleur au panier
          let findproduit = panier.find(
            (p) => p.id == produit.id && p.color == produit.color
          );

          if (findproduit) {
            findproduit.quantity =
              parseInt(findproduit.quantity) + parseInt(produit.quantity);
          } else {
            panier.push(produit);
          }

          //Préparer la variable panier avec un JSON.strynify
          panier = JSON.stringify(panier);

          //les Ajouter panier au localStorage
          localStorage.setItem("panier", panier);

          alert("Produit ajouté au panier");
        } else {
          alert("veuillez selectionner une couleur et une quantité");
        }
      },
      false
    );
  });
