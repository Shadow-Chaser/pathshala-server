const express = require("express");
const cors = require("cors");
const compression = require("compression");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(compression());

app.set("view engine", "ejs");

require("./routes")(app);

// ------------------------------
// app.get("/test", (req, res) => {
//     res.render("verifyEmail", {
//         name: "Ashab",
//         siteURL: "some.com",
//         siteName: "Some",
//         verifyURL:
//             "www.fjdf.com/fdfhiofoifewoiueiofoeiuifgfgfgfgfgfgfgfgfgfgfgfdsfdsfjiosu34/fijfjifjdisfjw48ur8ffg8tu58tgjruiotu58",
//     });
// });
// -------------------------------

module.exports = app;
