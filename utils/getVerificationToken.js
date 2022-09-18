const VerificationToken = require("../models/verificationTokenModel");
const crypto = require("crypto");

const getVerificationToken = async (id) => {
    const token = await new VerificationToken({
        userId: id,
        token: crypto.randomBytes(32).toString("hex"),
    }).save();

    return token;
};

module.exports = getVerificationToken;
