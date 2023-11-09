const express = require("express");
const multer = require("multer");
const xlsx = require("xlsx");
const ics = require("ics");
require("dotenv").config();
const supabase = require("./config/supabaseClient");
// const ics = require("./dist");

// Set up multer to handle file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
app.listen(3000);

app.get("/", async (req, res) => {
  console.log(supabase);

  await supabase.from("Table1").insert([
    {
      Name: "SomeName",
      SomeId: 1234,
    },
  ]);

  const { data, error } = await supabase.from("Table1").select();

  res.status(200).send({ data, error });
});

app.post("/upload", upload.single("excelFile"), (req, res) => {
  // Access the uploaded file from req.file.buffer
  const excelBuffer = req.file.buffer;

  const workbook = xlsx.read(excelBuffer, { type: "buffer" });

  // Assuming there is only one sheet in the Excel file
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];

  // Convert the sheet to JSON format
  const jsonData = xlsx.utils.sheet_to_json(sheet);

  // Now you can use jsonData for further processing

  console.log(jsonData);

  // Perform your desired operations with the Excel data

  // Send a response

  // ics

  const events = [
    {
      start: [2024, 1, 1, 12, 0], // [year, month, day, hour, minute]
      end: [2024, 1, 1, 14, 0], // [year, month, day, hour, minute]
      title: "Excel Event 1",
      description:
        "This is the first sample event with <b>HTML content</b>.<br>Location: Location 1",
      location: "Location 1",
      uid: "event1",
    },
    {
      start: [2024, 1, 2, 10, 0],
      end: [2024, 1, 2, 12, 0],
      title: "Excel Event 2",
      description:
        "This is the first sample event with <i>HTML content</i>.<br>Location: Location 1",
      location: "Location 2",
      uid: "event2",
    },
  ];

  // Create the iCalendar data
  const { error, value } = ics.createEvents(events);

  if (error) {
    console.error("Error creating iCalendar event:", error);
    res.status(500).send("Error generating iCalendar data");
    return;
  }

  // Set the response headers for an iCalendar file
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", "attachment; filename=calendar.ics");

  // Send the iCalendar file as the response
  res.send(value);

  // res.status(200).send(jsonData);
});
