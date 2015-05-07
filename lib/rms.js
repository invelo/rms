var _ = require('lodash');
var rules = require('./rules.js')
  , bridge = require('./bridge.js');

module.exports = function() {

  var status = {};


  function proxy() {
    return proxy;
  }
  proxy.rules = rules();
  proxy.bridge = bridge();

  proxy.keys = function(keys) {
    for(var i=0; i<5; i++) {
      if(proxy.ready() && proxy.rules().Cashier.Loaded === false) {
        window.focus();
        window.qsBridge.FireEvent('ExecuteProgram', "", "C:\\\\Invelo\\\\bin\\\\wsh.exe", 'C:\\\\Invelo\\\\lib\\\\keys.js "{ENTER}{ENTER}"');
      }
    }

    return proxy;
  };
  proxy.open = function(url) {
    var timestamp = new Date().getTime();

    try {
      proxy.bridge('ShowHTML',url+'?_='+timestamp);
    }catch(err){
      proxy.error(err);
    }
    return proxy;
  };
  proxy.autoauth = function(sql,user) {
    var auth = proxy.rules().Database.OpenRecordset(sql,false);
    if (auth.EOF === true) {
      auth.AddNew(_.keys(user),_.values(user));
      auth.UpdateBatch();
    }

    return proxy;
  };
  proxy.ready = function() {
    var status;
    try {

      status = proxy.rules().isPOS;
      if(status === true) return true;

    }catch(err){
      status = proxy.rules().isPOS;
    }

    return status;

  };
  proxy.init = function(tasks) {
    for(var i=0; i<tasks.length; i++) {
      proxy.bridge(tasks[i]);
    }
    return proxy;
  };
  proxy.connect = function() {


  };
  proxy.require = function(obj) {
    try {
      return new window.ActiveXObject(obj);
    }catch(err){
      return err;
    }
  };
  proxy.connection = function(raw) {
    var c = proxy.rules().OpenRecordSet('SELECT * FROM [Cashier];',false);
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
  proxy.create = function() {


    function Session() {
      return this;
    }

    Session.prototype.parse = function() {

    };
    Session.prototype.detect = function() {
      var co = {};
      var db = proxy.rules().OpenRecordSet('SELECT * FROM [Cashier];',false);
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
    Session.prototype.create = function() {


        this.connection = proxy.require('QSRules.ConnectionInfo');
        this.session = proxy.require('QSRules.SessionClass');


        _.assign(this.connection,this.detect());


      try {
        this.session.Database.OpenConnection(this.connection,false);
      }catch(err){

      }

      return this;

    };

    return new Session();

  };
  proxy.error = function(e) {
    status.ok = false;
    status.condition = "error";
    status.message = e;

    return proxy;
  };
  proxy.status = function() {
    return status;
  };

  return proxy;
};
