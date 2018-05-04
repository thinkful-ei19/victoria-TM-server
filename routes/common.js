const moment = require('moment');

function userFriendlyDate(date) {
  return moment(date).calendar(null, {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: '[Last] dddd',
    sameElse: 'MMM DD YYYY'
  });
}

function convertTasksDate(tasks) {
  return tasks.map(task => {
    const { comment, created, title, content, id } = task;
    const due = userFriendlyDate(task.due);
    return {
      comment,
      created,
      title,
      content,
      due,
      id
    };
  })
}
module.exports = {
  userFriendlyDate,
  convertTasksDate
}
