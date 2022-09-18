const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const sendEmail = require("../utils/mailer");
const getVerificationToken = require("../utils/getVerificationToken");
const VerificationToken = require("../models/verificationTokenModel");
const Joi = require("joi");

/* 
 ToDO : send response with `return` keyword
 e,g if (user) return res.status(400).send("User already registered!");
*/

/*
  @desc   Register new user
  @route  POST /api/user/signup
  @access Public
*/
const signUp = async (req, res) => {
    let user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send("User already registered!");

    user = new User({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
    });

    if (user.password) user.password = await bcrypt.hash(user.password, 10);

    try {
        const result = await user.save();

        // Email verification
        const verificationToken = await getVerificationToken(result._id);
        const verifyLink = `${process.env.BASE_URL}/user/verify/${verificationToken.userId}/${verificationToken.token}`;
        await sendEmail(user.email, "Verify Email", verifyLink, result.name, "verifyEmail.ejs");

        res.status(201).send({
            data: {
                name: result.name,
                email: result.email,
                msg: "An Email will be sent to your account to verify!",
            },
        });
    } catch (err) {
        return res.status(400).send(err.message);
    }
};

/*
@desc   Authenticate existing user
@route  POST /api/user/signup
@access Public
*/
const signIn = async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("Invalid email or password!");
        if (!user.emailVerified) return res.status(400).send("Please verify your email to login!");

        const validUser = await bcrypt.compare(req.body.password, user.password);
        if (!validUser) return res.status(400).send("Invalid email or password!");

        const access_token = user.generateJWTToken();
        res.status(200).send({ access_token });
    } catch {
        res.send("Invalid email or password!");
    }
};

/*
@desc   Verify email
@route  GET /api/user/verify/:id/:token
@access Public
*/
const verifyEmail = async (req, res) => {
    try {
        // Todo : add email template e.g handlebars, ejs
        const user = await User.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send("Invalid link");

        const token = await VerificationToken.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link");

        await User.updateOne({ _id: user._id, emailVerified: true });
        await VerificationToken.findByIdAndRemove(token._id);

        res.send("Email verified successfully!");
    } catch (error) {
        res.status(400).send("An error occurred");
    }
};

/*
@desc   Forget password
@route  POST /api/user/forget-password
@access Public
*/
const forgetPassword = async (req, res) => {
    try {
        const emailSchema = Joi.object({ email: Joi.string().email().required() });
        const { error } = emailSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(400).send("User with given email doesn't exist");

        let token = await VerificationToken.findOne({ userId: user._id });
        if (!token) token = await getVerificationToken(user._id);

        const link = `${process.env.BASE_URL}/user/reset-password/${user._id}/${token.token}`;

        await sendEmail(user.email, "Reset Password", link, user.name, "forgetPassword.ejs");

        res.send("password reset link sent to your email account");
    } catch (err) {
        res.send("An error occurred!");
        console.error(err);
    }
};

/*
@desc   Update password
@route  Get /api/user/reset-password/:userId/:token
@access Public
*/
const updatePassword = async (req, res) => {
    try {
        res.render("resetPassword", {
            redirectUrl: process.env.BASE_URL + "/user" + req.url,
        });
    } catch (error) {
        res.send(error);
    }
};

/*
@desc   Reset password
@route  POST /api/user/reset-password/:userId/:token
@access Public
*/
const resetPassword = async (req, res) => {
    try {
        const passwordSchema = Joi.object({ password: Joi.string().required() });
        const { error } = passwordSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(400).send("invalid link or expired");

        const token = await VerificationToken.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send("Invalid link or expired");

        if (req.body.password) user.password = await bcrypt.hash(req.body.password, 10);
        await user.save();
        await token.delete();

        res.send("Password reset successfully.");
    } catch (error) {
        res.send("An error occurred");
        console.log(error);
    }
};

module.exports = {
    signUp,
    signIn,
    verifyEmail,
    forgetPassword,
    updatePassword,
    resetPassword,
};
