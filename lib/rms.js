  /**
   * This is the __module__ description for the `RMS` module.
   *
   *     var rms = require('rms');
   * @module rms
   */
module.exports = function() {

  'use strict';

  var _ = require('lodash');
  var rules = require('./rules.js')
    , bridge = require('./bridge.js');


  var status = {};


  /**
   * RMS
   * @class RMS
   * @constructor
   */
  var rms = function rms() {
    return rms;
  }

  /**
   * Rules
   * @for RMS
   * @method rules
   * @return {Session}
   */
  rms.rules = rules();


  /**
   * Bridge
   * @for RMS
   * @method bridge
   * @return {Bridge}
   */
  rms.bridge = bridge();


  /**
   * Keys
   * @for RMS
   * @method keys
   * @return {Boolean}
  **/
  rms.keys = function(keys) {
    for(var i=0; i<5; i++) {
      if(rms.ready() && rms.rules().Cashier.Loaded === false) {
        window.focus();
        window.qsBridge.FireEvent('ExecuteProgram', "", "C:\\\\Invelo\\\\bin\\\\wsh.exe", 'C:\\\\Invelo\\\\lib\\\\keys.js "{ENTER}{ENTER}"');
      }
    }

    return rms;
  };

  /**
   * Wrapper method for ShowHTML
   *
   *     rms.open("https://example.com");
   * @for RMS
   * @method open
   * @chainable
   * @return {Function}
  **/
  rms.open = function(url) {
    var timestamp = new Date().getTime();

    try {
      rms.bridge('ShowHTML',url+'?_='+timestamp);
    }catch(err){
      rms.error(err);
    }
    return rms;
  };


  /**
   * Auto Auth
   * @for RMS
   * @method autoauth
   * @chainable
   * @return {Function}
   */
  rms.autoauth = function(sql,user) {
    var auth = rms.rules().Database.OpenRecordset(sql,false);
    if (auth.EOF === true) {
      auth.AddNew(_.keys(user),_.values(user));
      auth.UpdateBatch();
    }

    return rms;
  };


  /**
   * Ready
   * @for RMS
   * @method ready
   * @return {Boolean}
   */
  rms.ready = function() {
    var status;
    try {

      status = rms.rules().isPOS;
      if(status === true) return true;

    }catch(err){
      status = rms.rules().isPOS;
    }

    return status;

  };


  /**
   * Initialize
   * @for RMS
   * @method init
   * @chainable
   * @return {Function}
   */
  rms.init = function(tasks) {
    for(var i=0; i<tasks.length; i++) {
      rms.bridge(tasks[i]);
    }
    return rms;
  };



  rms.connect = function() {


  };


  /**
   * Require
   * @for RMS
   * @method require
   * @return {Function}
   */
  rms.require = function(obj) {
    try {
      return new window.ActiveXObject(obj);
    }catch(err){
      return err;
    }
  };

  /**
   * connection
   * @for RMS
   * @method connection
   * @return {Function}
   */
  rms.connection = function(raw) {
    var c = rms.rules().OpenRecordSet('SELECT * FROM [Cashier];',false);
    var s = c.ActiveConnection.ConnectionString;
    var co = {};

    if(raw) return s;

    s = s.split(';');
    for(var i=0; i<s.length; i++) {
      var key = String(s[i].split('=')[0]).toLowerCase();
      var value = s[i].split('=')[1];
      co[key] = value;
    }

    return {
      server: co['data source'],
      database: co['initial catalog'],
      username: co['user id'],
      password: co['password'],
      machine: co['workstation id']
    };
  };



  rms.create = function() {

  /**
   * Session
   * @class Session
   * @constructor
   */
  function Session() {
    return this;
  }

  /**
   * Detect
   * @method detect
   * @returns {Object} connection object for RMS ADO
   * @for Session
   *
  **/
  Session.prototype.detect = function() {
    var co = {};
    var db = rms.rules().OpenRecordSet('SELECT * FROM [Cashier];',false);
    var s = String(db.ActiveConnection.ConnectionString).split(';');

    for(var i=0; i<s.length; i++) {
      var key = String(s[i].split('=')[0]).toLowerCase();
      var value = s[i].split('=')[1];
      co[key] = value;
    }

    this.credentials = {
      InitialCatalog: co['initial catalog'],
      DataSource: co['data source'],
      UserID: co['user id'],
      Password: co['password'],
      ConnectTimeout: 30,
      Provider: "SQLOLEDB"
    };

    console.log(this.credentials);

    return this.credentials;

  };


  /**
   * Create
   * @method create
   * @returns {Session} establishes ADO connection for session
   * @chainable
   * @for Session
   *
  **/
  Session.prototype.create = function() {


      this.connection = rms.require('QSRules.ConnectionInfo');
      this.session = rms.require('QSRules.SessionClass');


      _.assign(this.connection,this.detect());


    try {
      this.session.Database.OpenConnection(this.connection,false);
    }catch(err){

    }

    return this;

  };

  return new Session();

  };

  /**
   * Error
   * @for RMS
   * @method error
   * @chainable
   * @return {Function}
   */
  rms.error = function(e) {
    status.ok = false;
    status.condition = "error";
    status.message = e;

    return rms;
  };


  /**
   * Status
   * @for RMS
   * @method status
   * @return {Object}
   */
  rms.status = function() {
    return status;
  };

  return rms;
};
