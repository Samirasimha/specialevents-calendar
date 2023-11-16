class ExcelConfig {
  constructor() {
    this.Name = "SpecialEventsSetUp";
    this.Header = 1;
    this.HeaderDataType = "string";
    this.timeZone = "America/Fort_Wayne";
    this.Events = [];
  }

  addEvent(event) {
    this.Events.push(event);
  }
}

module.exports = ExcelConfig;
