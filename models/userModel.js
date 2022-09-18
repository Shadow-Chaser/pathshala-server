const { Schema, model } = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        minLength: [5, "Minimum Length of the email must be 5"],
        maxLength: 255,
    },
    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024,
    },
    emailVerified: {
        type: Boolean,
        default: false,
    },
});

userSchema.methods.generateJWTToken = function () {
    const token = jwt.sign({ _id: this._id, email: this.email }, process.env.JWT_SECRET_KEY, {
        expiresIn: "60000",
    });

    return token;
};

module.exports = model("User", userSchema);
