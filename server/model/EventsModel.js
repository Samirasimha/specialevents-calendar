class EventsModel {
  constructor(date, startTime, endTime, title, location, coordinator) {
    this.date = date;
    this.startTime = startTime;
    this.endTime = endTime;
    this.title = title;
    this.location = location;
    this.coordinator = coordinator;
  }
}

module.exports = EventsModel;
