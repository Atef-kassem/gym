const router = require("express").Router();
const protect = require("../middlewares/protectionMiddleware");
const restrictionMiddleware = require("../middlewares/restrictionMiddleware");
const { signup, login, forgotPassword, resetPassword, updatePassword, getMe } = require("../controllers/authController");
const {
  getAllUsers,
  updateUser,
  getUser,
  updateMyData,
  deActivateUser,
  deleteUser,
} = require("../controllers/userController");
const loginValidator = require("../middlewares/loginValidator");

router.post("/signup", signup);
router.post("/login", loginValidator, login); //! Rate limiting removed
router.post("/forgotpassword", forgotPassword);
router.patch("/restpassword/:token", resetPassword);

// TODO protect all routes come after this
router.use(protect);

router.get("/me", getMe);

router.patch("/updatepassword", updatePassword);
router.patch("/updatemydata", updateMyData);
router.delete("/deActivateUser", deActivateUser);

// TODO retrict all normal users  only admin can access
router.use(restrictionMiddleware("admin"));

router.route("/").get(getAllUsers);

router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
