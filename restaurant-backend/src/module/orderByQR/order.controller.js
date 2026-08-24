const Order = require('./order.model'); 

// 1. [Customer Side] Submit QR Order to Staging
exports.createQrOrder = async (req, res) => {
  try {
    const { cafeUserName, customerName, customerPhone, table, items } = req.body;

    // Validate essential fields
    if (!cafeUserName || !table || !items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields (cafeUserName, table, or items)."
      });
    }

    const newQrOrder = new Order({
      cafeUserName,
      customerName,
      customerPhone,
      table,
      items
    });

    await newQrOrder.save();

    res.status(201).json({
      success: true,
      message: "Order placed successfully! Waiting for restaurant approval."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 2. [Admin Side] Fetch Pending QR Orders for a Café
exports.getPendingQrOrders = async (req, res) => {
  try {
    const { cafeUserName } = req.params;
    
    // Fetch pending orders and populate table name and menu item details
    const pendingOrders = await Order.find({ cafeUserName })
      .populate('table', 'name')
      .populate('items.menu', 'name')
      .sort({ createdAt: -1 }); // Newest orders first

    res.status(200).json({
      success: true,
      data: pendingOrders
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. [Admin Side] Accept Order (Transfer from Staging -> Your Live Order Model)
exports.acceptQrOrder = async (req, res) => {
  try {
    const { qrOrderId } = req.params;

    const qrOrder = await Order.findById(qrOrderId);
    if (!qrOrder) {
      return res.status(404).json({
        success: false,
        message: "QR order has expired (30 min limit reached) or already been processed."
      });
    }

    // Create a new document in your actual live Order model using your exact schema structure
    const liveOrder = new Order({
      customerName: qrOrder.customerName,
      customerPhone: qrOrder.customerPhone,
      cafeUserName: qrOrder.cafeUserName,
      table: qrOrder.table,
      items: qrOrder.items,
      totalPrice: qrOrder.totalPrice,
      orderStatus: "PENDING", // Starts fresh in the active kitchen queue
      orderBy: "website_qr"   // Tag indicating it originated from a web/QR customer flow
    });

    await liveOrder.save();

    // Delete the order from the staging collection so it disappears from the pending page
    await OrderQr.findByIdAndDelete(qrOrderId);

    res.status(200).json({
      success: true,
      message: "Order accepted successfully and pushed to live kitchen!"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. [Admin Side] Reject Order (Manually delete from Staging)
exports.rejectQrOrder = async (req, res) => {
  try {
    const { qrOrderId } = req.params;

    const deletedOrder = await Order.findByIdAndDelete(qrOrderId);
    if (!deletedOrder) {
      return res.status(404).json({ 
        success: false, 
        message: "Order not found or already expired." 
      });
    }

    res.status(200).json({
      success: true,
      message: "QR order rejected and removed."
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};