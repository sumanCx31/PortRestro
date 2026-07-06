const authRouter = require("../module/auth/auth.router");
const staffRouter = require("../module/owner/staffRegistration/register.route");

const router = require("express").Router()
router.get("/",(req, res, next) => {
    res.json({
        data: null,
         message: "Health ok",
        status: "Sucess",
        options: null
    })
})

router.use("/auth",authRouter);
router.use("/staff",staffRouter);

module.exports = router;