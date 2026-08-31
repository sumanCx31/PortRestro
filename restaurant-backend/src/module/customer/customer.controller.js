const CustomerModel = require('./customer.model');

class CustomerController {
  createCustomer = async (req, res, next) => {
    try {
      const { phone, cafeUserName } = req.body;
      const existingCustomer = await CustomerModel.findOne({ phone, cafeUserName });
      
      if (existingCustomer) {
        return res.status(400).json({
          success: false,
          message: "Number already registered for this cafe.",
          status: "ALREADY_REGISTERED!!",
        });
      }

      const customer = new CustomerModel(req.body);
      const savedCustomer = await customer.save();

      return res.status(201).json({
        success: true,
        message: "Customer registered successfully.",
        data: savedCustomer,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getAllCustomers = async (req, res, next) => {
    try {
      const { cafeUserName } = req.params;
      const customers = await CustomerModel.find({ cafeUserName }).sort({ createdAt: -1 });
      
      return res.status(200).json({
        success: true,
        count: customers.length,
        data: customers,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

module.exports = new CustomerController();