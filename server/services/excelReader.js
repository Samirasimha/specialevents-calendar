const supabase = require("../config/supabaseClient");
const readXlsxFile = require("read-excel-file/node");
const ics = require("ics");
const ExcelConfig = require("../model/ExcelConfig");
const fs = require("fs");
const excelConfigFilePath = "./jsonConfig/SetupSheet.json";

//#region public Methods

const testOfTime = async (req, res) => {
  const data = await ExtractFromJson();

  console.log(data.configs);

  return await ExtractFromJson();
};

//#endregion

//#region private Methods

const ExtractFromJson = async () => {
  return fs.readFileSync(excelConfigFilePath, "utf8", (err, jsonData) => {
    if (err) {
      console.error("Error reading JSON file:", err.message);
      return;
    }

    try {
      // return ExcelConfig.from(JSON.parse(jsonData));
      console.log("Returning the Json");
      // console.log(jsonData);
      return ExcelConfig.from(JSON.parse(jsonData));
    } catch (parseErr) {
      console.error("Error parsing JSON:", parseErr.message);
    }
  });
};

//#endregion

//#region Legacy
const ReadExcelFile = async (req, res) => {
  try {
    const excelData = await ConvertExcelToReadableRows(req);

    let date = new Date(excelData[0][0]);

    date.setHours(0, 0, 0, 0);
    let events = [];
    let calendarEvents = [];
    for (let i = 1; i < excelData.length; i++) {
      if (excelData[i][0] == null || typeof excelData[i][0] == "string")
        continue;

      let row = {};

      row.date = date;

      // row.starttime = await ProcessTimeAndDate(date, excelData[i][0]);
      // row.endtime = await ProcessTimeAndDate(date, excelData[i][1]);

      row.starttime = await convertToUTC(excelData[0][0], excelData[i][0]);
      row.endtime = await convertToUTC(excelData[0][0], excelData[i][1]);

      if (row.endtime < row.starttime) {
        row.endtime = row.endtime.getDate() + 1;
      }

      row.starttime = new Date(row.starttime)
        .toISOString()
        .toLocaleString("zh-TW");

      row.endtime = new Date(row.endtime).toISOString().toLocaleString("zh-TW");

      row.title = excelData[i][2];
      row.location = excelData[i][3];
      row.description = "Instructions : " + excelData[i][4] + "\n" + "\n";
      row.description +=
        "Event Start Time : " +
        (await ProcessTimeAndDate(date, excelData[i][5])) +
        "\n";

      row.description +=
        "Event End Time : " +
        (await ProcessTimeAndDate(date, excelData[i][6])) +
        "\n";

      row.description += "Reservation Type : " + excelData[i][7] + "\n";

      row.coordinator = excelData[i][8];

      events.push(row);
      calendarEvents.push(await CreateEventObj(row));
    }

    const { err } = await supabase.from("events").delete().eq("date", date);
    console.log(err);

    const { data, error } = await supabase
      .from("events")
      .insert(events)
      .select();

    console.log(calendarEvents);
    return await CreateiCalendarFile(calendarEvents);
  } catch (ex) {
    console.log(ex);
  }
};

async function CreateEventObj(Event) {
  let newEvent = {};

  newEvent.start = await FormatDateForIcs(Event.starttime);
  newEvent.end = await FormatDateForIcs(Event.endtime);
  newEvent.title = Event.title;
  newEvent.description = Event.description;
  newEvent.location = Event.location;
  newEvent.uid = Event.title;

  return newEvent;
}

async function CreateiCalendarFile(Events) {
  // Create the iCalendar data
  // console.log(Events);
  const { error, value } = ics.createEvents(Events);

  if (error) {
    console.error("Error creating iCalendar event:", error);
    //res.status(500).send("Error generating iCalendar data");
    return;
  }

  return value;
}

//#region private methods

async function convertToUTC(
  dateString,
  timeString,
  timeZone = "America/Fort_Wayne"
) {
  // Parse the date and time strings
  const dateTimeString = `${dateString} ${timeString}`;
  const dateTime = new Date(dateTimeString);

  // Get the local time offset in minutes
  const localOffset = dateTime.getTimezoneOffset();

  // Get the time zone offset for the specified time zone in milliseconds
  const timeZoneOffset =
    new Date(
      dateTime.toLocaleString("en-US", { timeZone })
    ).getTimezoneOffset() *
    60 *
    1000;

  // Calculate the total offset in milliseconds
  const totalOffset = localOffset * 60 * 1000 - timeZoneOffset;

  // Adjust the date and time to UTC
  const utcDateTime = new Date(dateTime.getTime() + totalOffset);

  return utcDateTime;
}

function convertToTimeZone(date, timeZone = "America/Fort_Wayne") {
  // Create a new date object with the same UTC time
  const utcDate = new Date(date.getTime());

  // Get the time zone offset for the specified time zone in milliseconds
  const timeZoneOffset =
    new Date(
      utcDate.toLocaleString("en-US", { timeZone })
    ).getTimezoneOffset() *
    60 *
    1000;

  // Adjust the date and time to the specified time zone
  const timeZoneDate = new Date(utcDate.getTime() + timeZoneOffset);

  // Extract the year, month, date, hour, and minute
  const year = timeZoneDate.getFullYear();
  const month = timeZoneDate.getMonth() + 1; // Months are 0-indexed, so add 1
  const day = timeZoneDate.getDate();
  const hour = timeZoneDate.getHours();
  const minute = timeZoneDate.getMinutes();

  return [year, month, day, hour, minute];
}

async function FormatDateForIcs(date) {
  const jsDate = new Date(date);

  return [
    jsDate.getFullYear(),
    jsDate.getMonth() + 1,
    jsDate.getDate(),
    jsDate.getHours(),
    jsDate.getMinutes(),
  ];
}

async function ConvertExcelToReadableRows(excel) {
  let response = [];
  await readXlsxFile(excel.file.buffer).then((rows) => {
    response = rows;
  });

  return response;
}

async function ProcessTimeAndDate(date, time) {
  // Create a new Date object using the parsed timestamp from 'time'
  let timeDate = new Date(Date.parse(time));

  // Set the time components from 'time' on the 'date' object
  date.setHours(timeDate.getHours());
  date.setMinutes(timeDate.getMinutes());
  date.setSeconds(timeDate.getSeconds());
  date.setMilliseconds(timeDate.getMilliseconds());

  // Return a new Date object with the updated date and time
  return new Date(date);
}

//#endregion
//#endregion

module.exports = {
  ReadExcelFile,
  testOfTime,
};
