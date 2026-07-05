const mongoose = require("mongoose");
const orderModel = require("./order.model");

class OrderController {
  createOrder = async (req, res) => {
   try {
    
   } catch (exception) {
    throw exception;
   }
  };

 getAllOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const [orders, totalOrders] = await Promise.all([
      OrderModel.find()
        .sort({ createdAt: -1 }) 
        .skip(skip)
        .limit(limit),
      OrderModel.countDocuments(),
    ]);

    // 3. Calculate total pages
    const totalPages = Math.ceil(totalOrders / limit);

    res.status(200).json({
      status: "SUCCESS",
      data: orders,
      pagination: {
        totalOrders,
        totalPages,
        currentPage: page,
        limit,
      },
      message: "Orders retrieved successfully",
    });
  } catch (err) {
    res.status(500).json({
      status: "ERROR",
      message: err.message,
    });
  }
};
}
const orderCltr = new OrderController();
module.exports = orderCltr;