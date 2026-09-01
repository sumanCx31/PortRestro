const OrderModel = require("./order.model");
const MenuModel = require("../owner/menu/menu.model");
const orderModel = require("./order.model");

class OrderController {
  createOrder = async (req, res, next) => {
    try {
      const {
        customerName = "Guest",
        customerPhone = null,
        table,
        cafeUserName,
        items,
        orderBy,
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
        orderBy,
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
      const { filter, startDate, endDate } = req.query;

      // Base query matching the cafe username
      const query = { cafeUserName: _cafeUserName };

      // Default to 'today' if no filter is explicitly provided
      const activeFilter = filter || 'today';

      if (activeFilter !== 'all') {
        const start = new Date();
        const end = new Date();

        start.setHours(0, 0, 0, 0);
        end.setHours(23, 59, 59, 999);

        if (activeFilter === 'yesterday') {
          start.setDate(start.getDate() - 1);
          end.setDate(end.getDate() - 1);
        } else if (activeFilter === 'thisWeek') {
          const firstDayOfWeek = start.getDate() - start.getDay();
          start.setDate(firstDayOfWeek);
        } else if (activeFilter === 'thisMonth') {
          start.setDate(1);
        } else if (activeFilter === 'custom' && startDate && endDate) {
          start.setTime(new Date(startDate).getTime());
          end.setTime(new Date(endDate).setHours(23, 59, 59, 999));
        }

        query.createdAt = {
          $gte: start,
          $lte: end
        };
      }

      const orders = await OrderModel.find(query)
        .populate("items.menu")
        .sort({ createdAt: -1 }); // Sorted newest first

      return res.status(200).json({
        success: true,
        message: "Orders retrieved successfully",
        total: orders.length,
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

deleteOrderItemsById = async (req, res, next) => {
  try {
    const { orderId, menuId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if item exists
    const itemExists = order.items.find(
      (item) => item.menu.toString() === menuId
    );

    if (!itemExists) {
      return res.status(404).json({
        success: false,
        message: "Item not found in this order",
      });
    }

    // Remove item
    order.items = order.items.filter(
      (item) => item.menu.toString() !== menuId
    );

    // Recalculate total price
    order.totalPrice = order.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Item removed successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

decreaseOrderItemQuantity = async (req, res, next) => {
  try {
    const { orderId, menuId } = req.params;

    const order = await OrderModel.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const itemIndex = order.items.findIndex(
      (item) => item.menu.toString() === menuId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Item not found in order",
      });
    }

    // Decrease quantity
    order.items[itemIndex].quantity -= 1;

    if (order.items[itemIndex].quantity <= 0) {
      // Remove item completely
      order.items.splice(itemIndex, 1);
    } else {
      // Update subtotal
      order.items[itemIndex].subtotal =
        order.items[itemIndex].quantity *
        order.items[itemIndex].price;
    }

    // Recalculate total price
    order.totalPrice = order.items.reduce(
      (sum, item) => sum + item.subtotal,
      0
    );

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Item quantity updated successfully",
      data: order,
    });
  } catch (error) {
    next(error);
  }
};

deleteOrderById = async (req, res, next) => {
  try {
    const { _orderId } = req.params;

    const order = await OrderModel.findByIdAndDelete(_orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    } 
  }
  catch (error) {
    next(error);
  }
}

deleteAllOrders = async (req, res, next) => {
  try {

    const result = await orderModel.deleteMany({});

    return res.status(200).json({
      success: true,
      message: `Successfully deleted all orders.`,
      deletedCount: result.deletedCount, // Number of documents removed
    });
  } catch (error) {
    next(error);
  }
};

}

module.exports = new OrderController();
