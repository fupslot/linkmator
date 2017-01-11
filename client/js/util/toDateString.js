'use strict';

function toDateString(date) {
  if (typeof date === 'string') {
    date = new Date(date);
  }


  if (isNaN(date.getTime())) {
    return '';
  }

  const diff = (new Date()).getTime() - date.getTime();
  const in24hour = diff < (24 * 60 * 60 * 1000);
  const overAYear = diff > (365 * 24 * 60 * 60 * 1000);
  const lessThanHour = diff < (60 * 60 * 1000);

  if (in24hour) {
    if (lessThanHour) {
      const v = Math.floor(diff / (60 * 1000));
      return `${v}m`;
    } else {
      const v = Math.floor(diff / (60 * 60 * 1000));
      return `${v}h`;
    }
  } else {
    const monthNames = [
      'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
      'Jul', 'Aug', 'Sep', 'Nov', 'Oct', 'Dec'
    ];
    const monthName = monthNames[date.getMonth()];
    const da = date.getDate();
    const te = (da === 1) ? 'st' : (da === 2) ? 'nd' : (da === 3) ? 'rd' : '';
    const year = (overAYear && date.getFullYear()) || '';
    return `${monthName} ${da}${te} ${year}`;
  }
}


module.exports = toDateString;
