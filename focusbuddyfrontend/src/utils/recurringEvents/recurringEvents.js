import { datetime, RRule } from "rrule";
import moment from "moment";

const recurringEvents = async (eventDate, eventTime, repeatType, endTimes) => {

    try{
  // Assuming eventDate is in the format "YYYY-MM-DD" and eventTime is in the format "8:31am"
  const parsedDateTime = moment(
    `${eventDate} ${eventTime}`,
    "YYYY-MM-DD h:mma"
  );

  // Convert to JavaScript Date object
  const combinedDateTime = parsedDateTime.toDate();

  const rule = new RRule({
    freq:
      repeatType === "Repeat weekly"
        ? RRule.WEEKLY
        : repeatType === "Repeat daily"
        ? RRule.DAILY
        : null,
    wkst: RRule.SU,
    count: endTimes,
    dtstart: combinedDateTime,
  });
  console.log(rule.all());

  return rule.all();
}catch(err){
    console.log(err);
}
};

export default recurringEvents;
