//function urlParamsId() {
let params = new URLSearchParams(document.location.search);
let OrderId = params.get("OrderId");
console.log(OrderId);
//}

//function confirmOrderId() {
let confirmOrder = document.getElementById("orderId");
confirmOrder.textContent = OrderId;

//}
