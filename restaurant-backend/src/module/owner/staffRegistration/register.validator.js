const joi = require("joi");

const staffDTO = joi.object({
    name: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password:joi.string().regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_])[A-Za-z\d!@#$%^&*()_]{8,25}$/
  ).required(),
    confirmPassword: joi.string().equal(joi.ref("password")).required().messages({"any.only":"Password and ConfirmPassword must be same"}),
    phone: joi.string().max(21).allow(null,"").optional().default(null),
    userName: joi.string().required().min(2).max(50).regex(/^[a-zA-Z0-9_]+$/).messages({"string.pattern.base":"Username can only contain letters, numbers, and underscores."}),
})     

module.exports = {
    staffDTO
}
