const OrderModel = require("../order/order.model");
const TableModel = require("../owner/table/table.model");

class StatsController {
  
  // Helper to parse date filters from query parameters
  _getDateRange(query) {
    const { filter, startDate, endDate } = query;
    const start = new Date();
    const end = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    if (filter === 'yesterday') {
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    } else if (filter === 'thisWeek') {
      const firstDayOfWeek = start.getDate() - start.getDay(); // Sunday or adjust as needed
      start.setDate(firstDayOfWeek);
    } else if (filter === 'thisMonth') {
      start.setDate(1);
    } else if (filter === 'custom' && startDate && endDate) {
      return {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }
    // Default is 'today'

    return { start, end };
  }

  dashboardSummary = async (req, res, next) => {
    try {
      const { cafeUserName } = req.params;
      const { start, end } = this._getDateRange(req.query);

      // Orders created within the selected range count as "period orders"
      const periodOrders = await OrderModel.countDocuments({
        cafeUserName,
        createdAt: { $gte: start, $lte: end }
      });

      const completedOrders = await OrderModel.countDocuments({
        cafeUserName,
        orderStatus: "COMPLETED",
        createdAt: { $gte: start, $lte: end }
      });

      const pendingOrders = await OrderModel.countDocuments({
        cafeUserName,
        orderStatus: "PENDING",
        createdAt: { $gte: start, $lte: end }
      });

      const preparingOrders = await OrderModel.countDocuments({
        cafeUserName,
        orderStatus: "PREPARING",
        createdAt: { $gte: start, $lte: end }
      });

      const readyOrders = await OrderModel.countDocuments({
        cafeUserName,
        orderStatus: "READY",
        createdAt: { $gte: start, $lte: end }
      });

      const occupiedTables = await TableModel.countDocuments({
        cafeUserName,
        isOccupied: true
      });

      const availableTables = await TableModel.countDocuments({
        cafeUserName,
        isOccupied: false
      });

      const revenue = await OrderModel.aggregate([
        {
          $match: {
            cafeUserName,
            createdAt: { $gte: start, $lte: end }
          }
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$totalPrice" },
            averageOrder: { $avg: "$totalPrice" }
          }
        }
      ]);

      res.json({
        success: true,
        periodOrders,
        completedOrders,
        pendingOrders,
        preparingOrders,
        readyOrders,
        occupiedTables,
        availableTables,
        totalRevenue: revenue[0]?.totalRevenue || 0,
        averageOrderValue: revenue[0]?.averageOrder || 0
      });

    } catch (err) {
      next(err);
    }
  }

  getBestSellingItems = async (req, res, next) => {
    try {
      const { cafeUserName } = req.params;
      const { start, end } = this._getDateRange(req.query);

      const bestSellingItems = await OrderModel.aggregate([
        {
          $match: {
            cafeUserName,
            orderStatus: "COMPLETED",
            createdAt: { $gte: start, $lte: end },
          },
        },
        {
          $unwind: "$items",
        },
        {
          $group: {
            _id: "$items.menu",
            totalSold: {
              $sum: "$items.quantity",
            },
            totalRevenue: {
              $sum: "$items.subtotal",
            },
          },
        },
        {
          $sort: {
            totalSold: -1,
          },
        },
        {
          $lookup: {
            from: "menus",
            localField: "_id",
            foreignField: "_id",
            as: "menu",
          },
        },
        {
          $unwind: "$menu",
        },
        {
          $project: {
            _id: 0,
            menuId: "$menu._id",
            name: "$menu.name",
            image: "$menu.image.secureUrl",
            category: "$menu.category",
            price: "$menu.price",
            totalSold: 1,
            totalRevenue: 1,
          },
        },
      ]);

      return res.status(200).json({
        success: true,
        message: "Best selling items fetched successfully.",
        total: bestSellingItems.length,
        data: bestSellingItems,
      });
    } catch (error) {
      next(error);
    }
  };
}

const statsCltr = new StatsController();
module.exports = statsCltr;