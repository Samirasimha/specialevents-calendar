const { ReadExcelFile } = require("../services/excelReader");

const ReadExcelAndAddToDatabase = async (req, res) => {
  console.log("second");

  let response = await ReadExcelFile(req);
  // Set the response headers for an iCalendar file
  res.setHeader("Content-Type", "text/calendar");
  res.setHeader("Content-Disposition", "attachment; filename=calendar.ics");

  // Send the iCalendar file as the response
  res.send(response);
};

module.exports = {
  ReadExcelAndAddToDatabase,
};
