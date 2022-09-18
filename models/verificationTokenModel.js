const { Schema, model } = require("mongoose");

const verificationTokenSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true,
    },
    token: {
        type: String,
        required: true,
    },
});

module.exports = model("VerificationToken", verificationTokenSchema);
