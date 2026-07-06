const USER_ROLES = Object.freeze({
  OWNER: "OWNER",
  ADMIN: "admin",
  MANAGER: "manager",
  WAITER: "waiter",
  CASHIER: "cashier",
});

const Status = Object.freeze({
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  BLOCKED: "BLOCKED",
});

const GENDER = Object.freeze({
  MALE: "MALE",
  FEMALE: "FEMALE",
  OTHER: "OTHER",
});

const TABLE_STATUS = Object.freeze({
  AVAILABLE: "AVAILABLE",
  OCCUPIED: "OCCUPIED",
  RESERVED: "RESERVED",
  CLEANING: "CLEANING",
});

const ORDER_STATUS = Object.freeze({
  PENDING: "PENDING",
  PREPARING: "PREPARING",
  READY: "READY",
  SERVED: "SERVED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
});

const PAYMENT_STATUS = Object.freeze({
  PENDING: "PENDING",
  PAID: "PAID",
  FAILED: "FAILED",
  REFUNDED: "REFUNDED",
});

const PAYMENT_METHOD = Object.freeze({
  CASH: "CASH",
  CARD: "CARD",
  ESEWA: "ESEWA",
  KHALTI: "KHALTI",
  FONEPAY: "FONEPAY",
});

module.exports = {
  USER_ROLES,
  Status,
  GENDER,
  TABLE_STATUS,
  ORDER_STATUS,
  PAYMENT_STATUS,
  PAYMENT_METHOD,
};