'use static';


module.exports = function(proxy) {


  function cashier() {
    return cashier.proxy().cashier;
  }
  cashier.proxy = proxy;
  cashier.cashDrawer = function() {
    return cashier().cashDrawer;
  };
  cashier.cashDrawerNumber = function() {
    return cashier().cashDrawerNumber;
  };
  cashier.emailAddress = function() {
    return cashier().emailAddress;
  };
  cashier.failedLogonAttempts = function() {
    return cashier().failedLogonAttempts;
  };
  cashier.firstName = function() {
    return cashier().firstName;
  };
  cashier.floorLimit = function() {
    return cashier().floorLimit;
  };
  cashier.hasPrivilege = function(perm) {
    return false;
  };
  cashier.id = function() {
    return cashier().ID;
  };
  cashier.maxOverShortAmount  = function(perm) {
    return cashier().maxOverShortAmount;
  };
  return cashier;


};