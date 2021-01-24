// -------------------------------------------------
// String to Title Case Function
function strToTitleCase(str) {
  return str.replace (/\w\S*/g, function(txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })
}


// -------------------------------------------------
// String Space to Undercase Function
function strSpaceToUnderscore(str) {
  return str.replace (/ /g, '_')
}

const isJSON = (str) => {
  if (!str) return false
  str = str.replace(new RegExp('\\\\(?:["\\\\\\/bfnrt]|u[0-9a-fA-F]{4})', 'g'), '@')
  const regex = new RegExp('"[^"\\\\\\n\\r]*"|true|false|null|-?\\d+'+
    '(?:\\.\\d*)?(?:[eE][+\\-]?\\d+)?', 'g')
  str = str.replace(regex, ']')
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  return (/^[\],:{}\s]*$/).test(str)
}


// -------------------------------------------------
// Export Module
module.exports = {
  strToTitleCase,
  strSpaceToUnderscore,
  isJSON
}
