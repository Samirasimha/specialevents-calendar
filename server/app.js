const express = require("express");
require("dotenv").config();
const excelRoutes = require("./routes/excelRoutes");
const ics = require("ics");
const app = express();
app.listen(3000);

app.use("/excel", excelRoutes);
