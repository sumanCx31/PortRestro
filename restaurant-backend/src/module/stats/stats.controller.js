const OrderModel = require("../order/order.model");
const TableModel = require("../owner/table/table.model");

class StatsController {
dashboardSummary = async (req,res,next)=>{
    try{

        const {cafeUserName} = req.params;

        const start = new Date();
        start.setHours(0,0,0,0);

        const end = new Date();
        end.setHours(23,59,59,999);

        const todayOrders = await OrderModel.countDocuments({
            cafeUserName,
            createdAt:{
                $gte:start,
                $lte:end
            }
        });

        const completedOrders = await OrderModel.countDocuments({
            cafeUserName,
            orderStatus:"COMPLETED"
        });

        const pendingOrders = await OrderModel.countDocuments({
            cafeUserName,
            orderStatus:"PENDING"
        });

        const preparingOrders = await OrderModel.countDocuments({
            cafeUserName,
            orderStatus:"PREPARING"
        });

        const readyOrders = await OrderModel.countDocuments({
            cafeUserName,
            orderStatus:"READY"
        });

        const occupiedTables = await TableModel.countDocuments({
            cafeUserName,
            isOccupied:true
        });

        const availableTables = await TableModel.countDocuments({
            cafeUserName,
            isOccupied:false
        });

        const revenue = await OrderModel.aggregate([
            {
                $match:{
                    cafeUserName,
                    createdAt:{
                        $gte:start,
                        $lte:end
                    }
                }
            },
            {
                $group:{
                    _id:null,
                    totalRevenue:{
                        $sum:"$totalPrice"
                    },
                    averageOrder:{
                        $avg:"$totalPrice"
                    }
                }
            }
        ]);

        res.json({
            todayOrders,
            completedOrders,
            pendingOrders,
            preparingOrders,
            readyOrders,
            occupiedTables,
            availableTables,
            todayRevenue:revenue[0]?.totalRevenue || 0,
            averageOrderValue:revenue[0]?.averageOrder || 0
        });

    }catch(err){
        next(err);
    }
}

getBestSellingItems = async (req, res, next) => {
    try {
      const { cafeUserName } = req.params;

      const bestSellingItems = await OrderModel.aggregate([
        {
          $match: {
            cafeUserName,
            orderStatus: "COMPLETED",
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