function urlParamsOrderId() {
  let params = new URLSearchParams(document.location.search);
  let OrderId = params.get("OrderId");
  let confirmOrder = document.getElementById("orderId");
  confirmOrder.textContent = OrderId;
  window.localStorage.clear();
}

urlParamsOrderId();
