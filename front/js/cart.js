let url = "http://localhost:3000/api/products";

fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (products) {
    let LocalPanier = JSON.parse(localStorage.getItem("panier"));

    if (LocalPanier && LocalPanier.length > 0) {
      LocalPanier.forEach((itemPanier) => {
        let findproduit = products.find((p) => p._id == itemPanier.id);
        itemPanier.price = findproduit.price;
      });

      renderHTML(LocalPanier);
      totalPrice(LocalPanier);
      deleteProduct(LocalPanier);
      formCommande(LocalPanier);
    } else {
      alert("Panier vide");
      console.log("Panier vide");
    }
  });
//création des éléments

function renderHTML(LocalPanier) {
  for (let product of LocalPanier) {
    let cartId = document.getElementById("cart__items");

    let articleCart = document.createElement("article");
    articleCart.className = "cart__item";
    articleCart.dataset.id = product.id;
    articleCart.dataset.color = product.color;

    let divCartImg = document.createElement("div");
    divCartImg.className = "cart__item__img";

    let imgUrl = document.createElement("img");
    imgUrl.src = product.imgUrl;
    imgUrl.alt = product.altTxt;

    let divCartContent = document.createElement("div");
    divCartContent.className = "cart__item__content";

    let divCartDescription = document.createElement("div");
    divCartDescription.className = "cart__item__content__description";

    let h2Cart = document.createElement("h2");
    h2Cart.textContent = product.name;

    let pCartDescriptioncolor = document.createElement("p");
    pCartDescriptioncolor.textContent = product.color;

    let pCartDescriptionPrice = document.createElement("p");
    pCartDescriptionPrice.textContent = product.price + `€`;

    let divCartSetting = document.createElement("div");
    divCartSetting.className = "cart__item__content__settings";

    let divCartSettingsQuantity = document.createElement("div");
    divCartSettingsQuantity.className =
      "cart__item__content__settings__quantity";

    let pCartQuantity = document.createElement("p");
    pCartQuantity.textContent = "Qté :";

    let inputSettingsQuantity = document.createElement("input");
    inputSettingsQuantity.type = "Number";
    inputSettingsQuantity.className = "itemQuantity";
    inputSettingsQuantity.name = "itemQuantity";
    inputSettingsQuantity.min = 1;
    inputSettingsQuantity.max = 100;
    inputSettingsQuantity.value = product.quantity;

    let divSettingsDelete = document.createElement("div");
    divSettingsDelete.className = "cart__item__content__settings__delete";

    let pDelete = document.createElement("p");
    pDelete.className = "deleteItem";
    pDelete.textContent = "supprimer";

    cartId.appendChild(articleCart);
    articleCart.appendChild(divCartImg);
    articleCart.appendChild(divCartContent);
    divCartContent.appendChild(divCartDescription);
    divCartContent.appendChild(divCartSetting);
    divCartSetting.appendChild(divCartSettingsQuantity);
    divCartSetting.appendChild(divSettingsDelete);
    divSettingsDelete.appendChild(pDelete);
    divCartSettingsQuantity.appendChild(pCartQuantity);

    divCartSettingsQuantity.appendChild(inputSettingsQuantity);
    divCartDescription.appendChild(h2Cart);
    divCartDescription.appendChild(pCartDescriptioncolor);
    divCartDescription.appendChild(pCartDescriptionPrice);
    divCartImg.appendChild(imgUrl);

    modifyQuantity(inputSettingsQuantity, product, LocalPanier);
  }
}

function totalPrice(LocalPanier) {
  let TotalQuantity = document.getElementById("totalQuantity");
  let TotalPrice = document.getElementById("totalPrice");
  let numberOfProduct = 0;
  let TotalProductPrice = 0;

  for (let productItem of LocalPanier) {
    //calcul total Quantité article
    numberOfProduct += Number(productItem.quantity);

    //calcul total Quantité * prix
    TotalProductPrice +=
      Number(productItem.quantity) * Number(productItem.price);
  }

  TotalPrice.textContent = TotalProductPrice;
  TotalQuantity.textContent = numberOfProduct;
}

function modifyQuantity(inputSettingsQuantity, product, LocalPanier) {
  //Modifier le produit selectionnné
  inputSettingsQuantity.addEventListener("change", function (e) {
    e.path[4].dataset.id;
    e.path[4].dataset.color;
    //rajouter une quantité au panier
    let findProduct = LocalPanier.find(
      (p) => p.id == product.id && p.color == product.color
    );

    if (findProduct) {
      let newValue = inputSettingsQuantity.value;
      findProduct.quantity = newValue;
      savePanier(LocalPanier);
      totalPrice(LocalPanier);
    }
  });
}

function savePanier(Panier) {
  //Préparer la varaiblea LocalPanier avec un JSON.strynify
  Panier = JSON.stringify(Panier);

  //Ajouter les panier au localStorage
  localStorage.setItem("panier", Panier);
}

//supprimer un article du panier
function deleteProduct(LocalPanier) {
  let btnsDelete = document.querySelectorAll(".deleteItem");

  btnsDelete.forEach((btnDelete) => {
    btnDelete.addEventListener("click", (e) => {
      let ArticleElm = e.target.closest("article");
      let ArticleElmId = ArticleElm.dataset.id;
      let ArticleElmColor = ArticleElm.dataset.color;
      ArticleElm.remove();
      alert("produit supprimé");

      let findArticle = LocalPanier.find(
        (a) => a.id == ArticleElmId && a.color == ArticleElmColor
      );

      if (findArticle) {
        LocalPanier.splice(
          LocalPanier.findIndex(
            (a) => a.id == ArticleElmId && a.color == ArticleElmColor
          ),
          1
        );
        savePanier(LocalPanier);
        totalPrice(LocalPanier);
      }
    });
  });
}

//formulaire
function formCommande(LocalPanier) {
  let btnOrder = document.querySelector("#order");
  if (LocalPanier.length == 0) {
    alert("veuillez sélectionner un article");
  } else {
    btnOrder.addEventListener("click", (event) => form(event, LocalPanier));
  }
}

// fetch method POST
function form(event, LocalPanier) {
  event.preventDefault();
  let bodyContact = requestContact();

  if (
    ValidFirstName(OrderForm.firstName) &&
    ValidLastName(OrderForm.lastName) &&
    ValidAddress(OrderForm.address) &&
    ValidCity(OrderForm.city) &&
    ValidEmail(OrderForm.email) &&
    LocalPanier &&
    LocalPanier.length > 0
  ) {
    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(bodyContact),
    })
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        let OrderId = data.orderId;
        window.location.href = "confirmation.html?OrderId=" + OrderId;
      });
  } else {
    ValidForm();
  }
}

function requestContact() {
  let FormFirstName = document.getElementById("firstName").value;
  let FormLastName = document.getElementById("lastName").value;
  let FormAddress = document.getElementById("address").value;
  let FormCity = document.getElementById("city").value;
  let FormEmail = document.getElementById("email").value;

  let bodyContact = {
    contact: {
      firstName: FormFirstName,
      lastName: FormLastName,
      address: FormAddress,
      city: FormCity,
      email: FormEmail,
    },
    products: idsForm(),
  };
  return bodyContact;
}

//lorsque tout les champs du formulaire sont rempli
function idsForm() {
  let LocalPanier = JSON.parse(localStorage.getItem("panier"));
  let myIDProducts = [];
  for (let product of LocalPanier) {
    myIDProducts.push(product.id);
  }
  return myIDProducts;
}

//lorsque tout les champs du formulaire ne sont pas rempli
let OrderForm = document.querySelector(".cart__order__form");

function ValidForm() {
  let inputsForm = OrderForm.querySelectorAll("input");
  inputsForm.forEach((input) => {
    if (input.value == "")
      alert("Veuilez saisir tout les champs correspondants");
    return true;
  });
  return false;
}

//RegEx  formulaire

OrderForm.firstName.addEventListener("change", function () {
  ValidFirstName(this);
});

function ValidFirstName(input) {
  let ErrorFirstName = document.getElementById("firstNameErrorMsg");
  let FirstNameRegExp = new RegExp("^[a-zA-Z]{3,25}$");
  let TestFirstname = FirstNameRegExp.test(input.value);

  if (TestFirstname) {
    ErrorFirstName.innerHTML = `prenom valide`;
    return true;
  } else {
    ErrorFirstName.innerHTML = `veuillez saisir un prénom`;
    return false;
  }
}

OrderForm.lastName.addEventListener("change", function () {
  ValidLastName(this);
});

function ValidLastName(inputlastName) {
  let ErrorLastName = document.getElementById("lastNameErrorMsg");
  let LastNameRegExp = new RegExp("^[a-zA-Z]+$");
  let TestLastNameRegExp = LastNameRegExp.test(inputlastName.value);

  if (TestLastNameRegExp) {
    ErrorLastName.innerHTML = `Nom valide`;
    return true;
  } else {
    ErrorLastName.innerHTML = `veuillez saisir un nom`;
    return false;
  }
}

OrderForm.address.addEventListener("change", function () {
  ValidAddress(this);
});

function ValidAddress(inputaddress) {
  let ErrorAddress = document.getElementById("addressErrorMsg");
  let AddressRegExp = new RegExp("^[A-Za-z0-9s ,']{5,80}$");
  let TestAddressRegExp = AddressRegExp.test(inputaddress.value);

  if (TestAddressRegExp) {
    ErrorAddress.innerHTML = `adresse valide`;
    return true;
  } else {
    ErrorAddress.innerHTML = `veuillez saisir une adresse valide`;
    return false;
  }
}

OrderForm.city.addEventListener("change", function () {
  ValidCity(this);
});

function ValidCity(inputcity) {
  let ErrorCity = document.getElementById("cityErrorMsg");
  let CityRegExp = new RegExp("^[a-z A-Z]{3,20}$");
  let TestCityRegExp = CityRegExp.test(inputcity.value);

  if (TestCityRegExp) {
    ErrorCity.innerHTML = `adresse valide`;
    return true;
  } else {
    ErrorCity.innerHTML = `veuillez saisir une ville valide`;
    return false;
  }
}

OrderForm.email.addEventListener("change", function () {
  ValidEmail(this);
});

function ValidEmail(inputemail) {
  let ErrorEmail = document.getElementById("emailErrorMsg");
  let EmailRegExp = new RegExp(
    "^[a-zA-Z0-9.-_]+[@]{1}[a-zA-Z0-9.-_]+[.]{1}[a-z]{2,10}$",
    "g"
  );
  let TestEmailRegExp = EmailRegExp.test(inputemail.value);

  if (TestEmailRegExp) {
    ErrorEmail.innerHTML = `adresse email valide`;
    return true;
  } else {
    ErrorEmail.innerHTML = `veuillez saisir une adresse email valide`;
    return false;
  }
}
