const userRouter = require("./userRoute");

module.exports = (app) => {
    app.use("/api/user", userRouter);
};
