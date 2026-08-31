const expenseModel = require("./expense.model");
const Expense = require("./expense.model");

class ExpenseController {
    // Create Expense (Accessible by both Owner and Staff)
    create = async (req, res) => {
        try {
            const { itemName, price, description,cafeUserName,addedBy } = req.body;

            // if (!req.user) {
            //     return res.status(401).json({
            //         status: "Error",
            //         message: "Unauthorized access.",
            //         data: null
            //     });
            // }

            // const cafeUserName = req.user.cafeUserName;
            // const addedBy = req.user.name || req.user.userName;

            if (!cafeUserName) {
                return res.status(400).json({
                    status: "Error",
                    message: "Cafe user name is required in user context.",
                    data: null
                });
            }

            const newExpense = await Expense.create({
                itemName,
                price,
                description,
                addedBy,
                cafeUserName
            });

            return res.status(201).json({
                status: "Success",
                message: "Expense recorded successfully",
                data: newExpense
            });
        } catch (error) {
            console.error("Error creating expense:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // Get All Expenses By Cafe User Name
    getAllByCafeUserName = async (req, res) => {
        try {
            const cafeUserName = req.params.cafeUserName || req.user?.cafeUserName;

            if (!cafeUserName) {
                return res.status(400).json({
                    status: "Error",
                    message: "Cafe user name is required",
                    data: null
                });
            }

            const expenses = await Expense.find({ cafeUserName }).sort({ createdAt: -1 });

            return res.status(200).json({
                status: "Success",
                message: "Expenses fetched successfully",
                count: expenses.length,
                data: expenses
            });
        } catch (error) {
            console.error("Error fetching expenses:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    // Delete Expense By ID
    deleteById = async (req, res) => {
        try {
            const { id } = req.params;

            const deletedExpense = await Expense.findByIdAndDelete(id);

            if (!deletedExpense) {
                return res.status(404).json({
                    status: "Error",
                    message: "Expense record not found",
                    data: null
                });
            }

            return res.status(200).json({
                status: "Success",
                message: "Expense deleted successfully",
                data: deletedExpense
            });
        } catch (error) {
            console.error("Error deleting expense:", error);
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };

    deleteAll = async(req, res) => {
        try {
            const result = await expenseModel.deleteMany({});
            
                return res.status(200).json({
                  success: true,
                  message: `Successfully deleted all expenses.`,
                  deletedCount: result.deletedCount, 
                });
        } catch (error) {
            return res.status(500).json({
                status: "Error",
                message: "Internal server error",
                error: error.message
            });
        }
    };
}

const expenseCltr = new ExpenseController();
module.exports = expenseCltr;