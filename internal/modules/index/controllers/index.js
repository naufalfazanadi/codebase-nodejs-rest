const wrapper = require('../../../../pkg/utils/wrapper')
const healthz = require('../../../../pkg/utils/health')


// -------------------------------------------------
// Index Root Function
function index(req, res) {
  wrapper.response(res, 'success', wrapper.data(''), 'Codebase NodeJS REST is running')
}


// -------------------------------------------------
// Index Health Function
function health(req, res) {
  healthz.healthCheck(res)
}


// -------------------------------------------------
// Export Module
module.exports = {
  index,
  health
}
