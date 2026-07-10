const OrderModel = require("./order.model");
const MenuModel = require("../owner/menu/menu.model");

class OrderController {
  createOrder = async (req, res, next) => {
    try {
      const {
        customerName = "Guest",
        customerPhone = null,
        table,
        cafeUserName,
        items,
        paymentMethod = "CASH",
      } = req.body;
      let totalPrice = 0;
      const orderItems = [];
      for (const item of items) {
        const menu = await MenuModel.findById(item.menu);
        if (!menu) {
          return res.status(404).json({
            message: "Menu item not found",
          });
        }
        const subtotal = menu.price * item.quantity;
        totalPrice += subtotal;
        orderItems.push({
          menu: menu._id,
          quantity: item.quantity,
          price: menu.price,
          subtotal,
        });
      }

      const order = new OrderModel({
        customerName,
        customerPhone,
        table,
        items: orderItems,
        totalPrice,
        paymentMethod,
        cafeUserName,
      });

      await order.save();

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

  getActiveOrderByTable = async (req, res, next) => {
  try {
    const { tableId } = req.params;

    const order = await OrderModel.findOne({
      table: tableId,
      orderStatus: {
        $in: ["PENDING", "PREPARING", "READY", "SERVED"],
      },
    })
      .populate("items.menu")
      .populate("table");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "No active order found",
      });
    }

    return res.status(200).json({
      success: true,
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

  getAllOrdersByCafeUserName = async (req, res, next) => {
    try {
      const { _cafeUserName } = req.params;
      const orders = await OrderModel.find({ cafeUserName: _cafeUserName }).populate("items.menu").populate("orderStatus");
      return res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  };

updateOrderItems = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No items provided",
      });
    }

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    for (const item of items) {
      const menu = await MenuModel.findById(item.menu);

      if (!menu) {
        return res.status(404).json({
          success: false,
          message: "Menu item not found",
        });
      }

      // Find existing item
      const existingItem = order.items.find(
        (i) => i.menu.toString() === menu._id.toString()
      );

      if (existingItem) {
        existingItem.quantity += item.quantity;
        existingItem.subtotal =
          existingItem.quantity * existingItem.price;
      } else {
        order.items.push({
          menu: menu._id,
          quantity: item.quantity,
          price: menu.price,
          subtotal: menu.price * item.quantity,
        });
      }
    }

    // Recalculate total price
    order.totalPrice = order.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

getOrderItemsById = async (req, res, next) => {
  try {
    const { orderId } = req.params;

    const order = await OrderModel.findById(orderId)
      .populate("items.menu");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Order items retrieved successfully",
      data: order.items,
    });
  } catch (error) {
    next(error);
  }
};
    

  updateOrderStatusById = async (req, res, next) => {
    try {
      const { _cafeUserName } = req.params;
      const { orderStatus,orderId } = req.body;
      const order = await OrderModel.findOne({ cafeUserName: _cafeUserName, _id: orderId });
      if (!order) {
        return res.status(404).json({
          message: "Order not found",
        });
      }
      order.orderStatus = orderStatus;
      await order.save();
      return res.status(200).json({
        success: true,
        message: "Order status updated successfully",
        data: order,
      });
    } catch (error) {
      next(error);
    }
  };

}

module.exports = new OrderController();
