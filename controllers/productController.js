const fs = require("fs");
const formidable = required("formidable");
const { Product, validate } = require("../models/productModel");

const addProduct = async (req, res) => {
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files));
};
