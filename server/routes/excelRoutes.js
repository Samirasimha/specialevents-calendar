const express = require("express");
const excelController = require("../controller/ExcelController");
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

console.log("first");

router.post(
  "/insert",
  upload.single("excelFile"),
  excelController.ReadExcelAndAddToDatabase
);

module.exports = router;
