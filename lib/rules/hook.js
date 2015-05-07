'use static';

var _ = require('lodash');

module.exports = function(proxy) {

  var handlers = {
    'PostTransaction': {},
    'TenderBegin': {},
    'ExportAccounting': {},
    'AddItem': {},
    'RefreshDisplay': {},
    'InitializeTransaction': {},
    'StartPOS': {},
    'QuitPOS': {},
    'SavePurchaseOrder': {},
    'SaveSupplier': {},
    'SaveCustomer': {},
    'StartManager': {},
    'QuitManager': {},
    'SaveItem': {},
    'TenderEnd': {}
  };


  function hooks() {


  }
  hooks.add = function(name,handler) {
    handlers[name].push(handler);
    hooks;
  };
  hooks.list = function(name) {
    if(name) return handlers[name];

    return handlers;

  };
  hooks.remove = function() {

  };
  hooks.trigger = function(name,callback) {
  };


  return function() {
    hooks;
  };

};


