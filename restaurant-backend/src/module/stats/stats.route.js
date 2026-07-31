// GET /api/v1/analytics/dashboard/:cafeUserName

const express = require("express");
const statsCltr = require("./stats.controller");
const StatsRouter = express.Router();

// Supports query params: ?filter=today|yesterday|thisWeek|thisMonth|custom&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
StatsRouter.get("/dashboard/:cafeUserName", statsCltr.dashboardSummary);

// Supports query params: ?filter=today|yesterday|thisWeek|thisMonth|custom&startDate=YYYY-MM-DD&endDate=YYYY-MM-DD
StatsRouter.get("/best-selling/:cafeUserName", statsCltr.getBestSellingItems);

module.exports = StatsRouter;