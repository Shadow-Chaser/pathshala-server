const router = require("express").Router();

const {
    signUp,
    signIn,
    verifyEmail,
    forgetPassword,
    updatePassword,
    resetPassword,
} = require("../controllers/userController");

// Route definition
router.route("/signup").post(signUp);
router.route("/signin").post(signIn);
router.route("/verify/:id/:token").get(verifyEmail);
router.route("/forget-password").post(forgetPassword);
router.route("/reset-password/:userId/:token").get(updatePassword).post(resetPassword);

module.exports = router;
