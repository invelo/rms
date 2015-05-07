var _ = require('lodash');

module.exports = qsRules;


function qsRules(window, config) {
    var proxy = require('./proxy')();


    /**
     * Session
     * @class Session
     * @constructor
     */
    function rules() {
      return proxy().RequestQSRules();
    }

    _.assign(rules, {
      status: require('./rules/status')(rules),
      transaction: require('./rules/transaction')(rules),
      tender: require('./rules/tender')(rules),
      reason: require('./rules/reason')(rules),
      register: require('./rules/register')(rules),
      customer: require('./rules/customer')(rules),
      configuration: require('./rules/configuration')(rules),
      database: require('./rules/database')(rules),
      entries: require('./rules/entries')(rules),
      entry: require('./rules/entry')(rules),
      cashier: require('./rules/cashier')(rules),
      item: require('./rules/item')(rules),
      place: require('./rules/place')(rules),
      session: require('./rules/session')(rules)
    });

    return rules;
}
