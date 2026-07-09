const authRouter = require("../module/auth/auth.router");
const OrderRouter = require("../module/order/order.router");
const MenuRouter = require("../module/owner/menu/menu.route");
const staffRouter = require("../module/owner/staffRegistration/register.route");
const tableRouter = require("../module/owner/table/table.route");

const router = require("express").Router()
router.get("/",(req, res, next) => {
    res.json({
        data: null,
         message: "Health ok",
        status: "Success",
        options: null
    })
})

router.use("/auth",authRouter);
router.use("/staff",staffRouter);
router.use("/table",tableRouter);
router.use("/order",OrderRouter);
router.use("/menu",MenuRouter);

module.exports = router;