// Type check
exports.type = function (o) {
  var s = Object.prototype.toString.call(o)
  return s.match(/\[object (.*?)\]/)[1].toLowerCase()
}

// Fix date timezone format issue
exports.repairDate = function (date) {
  date = new Date(date);
  return `${date.getUTCFullYear()}-${zero(date.getUTCMonth() + 1)}-${zero(date.getUTCDate())} ${zero(date.getUTCHours())}:${zero(date.getUTCMinutes())}:${zero(date.getUTCSeconds())}`;
}

// Date formatting
exports.dateFormat = function (date) {
  return `${date.getFullYear()}-${zero(date.getMonth() + 1)}-${zero(date.getDate())} ${zero(date.getHours())}:${zero(date.getMinutes())}:${zero(date.getSeconds())}`
}

// Pad with leading zero if less than 10
function zero (d) {
  return d.toString().padStart(2, '0')
}
