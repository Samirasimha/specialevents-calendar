const express = require("express");
require("dotenv").config();
const excelRoutes = require("./routes/excelRoutes");
const ics = require("ics");
const app = express();
app.listen(3000);

app.use("/excel", excelRoutes);

// app.post("/upload", upload.single("excelFile"), async (req, res) => {
//   // Access the uploaded file from req.file.buffer
//   const excelBuffer = req.file.buffer;

//   await readXlsxFile(excelBuffer).then((rows) => {
//     console.log(rows);
//     response = rows;
//   });

//   const events = [
//     {
//       start: [2024, 1, 1, 12, 0], // [year, month, day, hour, minute]
//       end: [2024, 1, 1, 14, 0], // [year, month, day, hour, minute]
//       title: "Excel Event 1",
//       description:
//         "This is the first sample event with <b>HTML content</b>.<br>Location: Location 1",
//       location: "Location 1",
//       uid: "event1",
//     },
//     {
//       start: [2024, 1, 2, 10, 0],
//       end: [2024, 1, 2, 12, 0],
//       title: "Excel Event 2",
//       description:
//         "This is the first sample event with <i>HTML content</i>.<br>Location: Location 1",
//       location: "Location 2",
//       uid: "event2",
//     },
//   ];

//   // Create the iCalendar data
//   const { error, value } = ics.createEvents(events);

//   if (error) {
//     console.error("Error creating iCalendar event:", error);
//     res.status(500).send("Error generating iCalendar data");
//     return;
//   }

//   // Set the response headers for an iCalendar file
//   res.setHeader("Content-Type", "text/calendar");
//   res.setHeader("Content-Disposition", "attachment; filename=calendar.ics");

//   // Send the iCalendar file as the response
//   res.send(response);

//   // res.status(200).send(jsonData);
// });
