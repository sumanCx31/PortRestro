const orderCltr = require("./order.controller");
const OrderRouter = require("express").Router();

OrderRouter.post("/", orderCltr.createOrder);
OrderRouter.get("/:_cafeUserName", orderCltr.getAllOrdersByCafeUserName);
OrderRouter.get("/active/:tableId", orderCltr.getActiveOrderByTable);
OrderRouter.put("/:_cafeUserName", orderCltr.updateOrderStatusById);
OrderRouter.get("/getItems/:orderId", orderCltr.getOrderItemsById);
OrderRouter.patch("/update-items/:orderId", orderCltr.updateOrderItems);
OrderRouter.delete("/all-orders", orderCltr.deleteAllOrders);
OrderRouter.delete(
  "/delete-item/:orderId/:menuId",
  orderCltr.deleteOrderItemsById,
);

OrderRouter.patch(
  "/decrease-item/:orderId/:menuId",
  orderCltr.decreaseOrderItemQuantity
);
module.exports = OrderRouter;
