const router = require("express").Router();

const usersRoutes = require("./users");
const cardsRoutes = require("./cards");

router.use("/users", usersRoutes);
router.use("/cards", cardsRoutes);
router.use("*", (req, res) => {
  res
    .status(constants.HTTP_STATUS_NOT_FOUND)
    .send({ message: "По указанному url ничего нет" });
});

module.exports = router;
