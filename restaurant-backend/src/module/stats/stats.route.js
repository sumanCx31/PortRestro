// GET /api/v1/analytics/dashboard/:cafeUserName

const express = require("express");
const statsCltr = require("./stats.controller");
const StatsRouter = express.Router();

StatsRouter.get("/dashboard/:cafeUserName", statsCltr.dashboardSummary);
StatsRouter.get(
  "/best-selling/:cafeUserName",
  statsCltr.getBestSellingItems
);
module.exports = StatsRouter;