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

  static from(json) {
    return Object.assign(new Student(), json);
  }
}

module.exports = ExcelConfig;
