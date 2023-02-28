const date = new Date();
const lastDay =
  date.getDate() + date.getMonth().toString() + date.getFullYear().toString();

//caculate current week of year
var oneJan = new Date(date.getFullYear(), 0, 1);
var numberOfDays = Math.floor((date - oneJan) / (24 * 60 * 60 * 1000));
var weekOfYear = Math.ceil((date.getDay() + 1 + numberOfDays) / 7);
const lastWeek = weekOfYear + date.getFullYear().toString();

function getPreviousDay(previousNumDay) {
  const date = new Date();
  const previous = new Date(date.getTime());
  previous.setDate(date.getDate() - previousNumDay);

  return previous;
}
function GetLastDay(dateParams) {
  return (
    dateParams.getDate() +
    dateParams.getMonth().toString() +
    dateParams.getFullYear().toString()
  );
}

module.exports = { lastDay, lastWeek, getPreviousDay, GetLastDay };
