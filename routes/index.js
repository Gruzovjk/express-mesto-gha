const router = require("express").Router();

const usersRoutes = require("./users");
const cardsRoutes = require("./cards");

router.use("/users", usersRoutes);
router.use("/cards", cardsRoutes);
router.use("*", () => {
  throw new Error("Запрашиваемого адреса не существует");
});

module.exports = router;
