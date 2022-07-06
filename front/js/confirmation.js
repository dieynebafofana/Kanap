function urlParamsOrderId() {
  let params = new URLSearchParams(document.location.search);
  let OrderId = params.get("OrderId");
  return OrderId;
}

let confirmOrder = document.getElementById("orderId");
confirmOrder.textContent = urlParamsOrderId();
window.localStorage.clear();
