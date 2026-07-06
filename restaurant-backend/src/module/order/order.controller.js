const OrderModel = require("./order.model");
const MenuModel = require("../menu/menu.model");

class OrderController {
    createOrder = async (req,res,next)=>{
        try{
            const {
                customerName="Guest",
                customerPhone=null,
                table,
                items,
                paymentMethod
            } = req.body;
            let totalPrice = 0;
            const orderItems = [];
            for(const item of items){
                const menu = await MenuModel.findById(item.menu);
                if(!menu){
                    return res.status(404).json({
                        message:"Menu item not found"
                    });
                }
                const subtotal = menu.price * item.quantity;
                totalPrice += subtotal;
                orderItems.push({
                    menu:menu._id,
                    quantity:item.quantity,
                    price:menu.price,
                    subtotal
                });
            }

            const order = await OrderModel.create({
                customerName,
                customerPhone,
                table,
                takenBy:req.loggedInUser._id,
                items:orderItems,
                totalPrice,
                paymentMethod
            });
            res.status(201).json({
                success:true,
                message:"Order created successfully",
                data:order
            });
        }catch(error){
            next(error);
        }
    }
}

module.exports = new OrderController();