
var _ = require('lodash')
  , proxy = require('./proxy.js')();



module.exports = qsBridge;

function qsBridge() {

    var __status = {
        ready: false,
        message: '',
        code: 0
    };

    /**
     * Events
     * @property events {Object}
     * @for Bridge
    **/
    var events;
    var Event = events = {
      CancelTransaction: [],
      ClearCustomer: [],
      ClearStatus: [],
      ConcludeTransction: [],
      CreateBackOrder: [],
      CreateHold: [],
      CreateLayway: [],
      CreatePostVoid: [],
      CreateQuote: [],
      CreateSale: [],
      CreateWorkOrder: [],
      CurrencyToString: [_.isFinite],
      DateTimeToString: [_.isDate],
      DateToString: [_.isDate],
      DoubleToString: [_.isFinite],
      ExecuteProgram: [_.isString, _.isString, _.isString],
      ExecuteProgramAndWait: [_.isString, _.isString, _.isString],
      Format: [_.isString, _.isString],
      GetStatusText: [],
      HideCustom: [],
      HideFunction: [],
      HideMe: [],
      HideStatus: [],
      HideTotals: [],
      HideWebStatus: [],
      InitializeTransaction: [],
      Login: [],
      Logout: [],
      MsgBox: [_.isString,_.isString,_.isString],
      PerformAddItem: [_.isFinite,_.isString,_.isFinite,_.isBoolean,_.isFinite,_.isBoolean,_.isString],
      PerformRecall: [],
      PerformTransactionLookup: [],
      PostDrawerFunction: [],
      PostDrop: [],
      PostNoSale: [],
      PostOpenClose: [],
      PostPayment: [],
      PostPayout: [],
      PostTransaction: [_.isBoolean],
      PostTransactionUnattended: [_.isBoolean],
      PrintLastReceipt: [],
      PrintXReport: [],
      PrintZReport: [],
      PrintZZReport: [],
      Quit: [],
      RecallBackOrder:[],
      RecallHold:[],
      RecallLayway:[],
      RecallQuote:[],
      RecallWorkOrder:[],
      RefreshDisplay:[],
      Secure:[],
      SelectBackOrder:[],
      SelectCustomer:[],
      SelectHoldTransaction:[],
      SelectItem:[],
      SelectLayway:[],
      SelectProcess:[],
      SelectQuote:[],
      SelectSalesRep:[],
      SelectShippingEdit:[],
      SelectSubstituteItem:[_.isFinite],
      SelectTransaction:[],
      SelectWorkOrder:[],
      SetCustomer:[_.isFinite],
      SetGridDefaultsEdit:[], //Non-JS
      SetGridDefaultsList:[], //Non-JS
      SetStatus:[_.isString],
      SetSubsitituteItem:[_.isFinite],
      SetTransactionSalesRep:[_.isFinite],
      ShowAbout:[],
      ShowAutoGenerate:[],
      ShowCalendar:[],
      ShowCalendarEventReminder:[],
      ShowClosingAmounts:[],
      ShowCustom:[],
      ShowDiscount:[],
      ShowDisplayProperties:[],
      ShowFunction:[],
      ShowGasPumpDeposits:[],
      ShowGraphs:[],
      ShowHTML:[_.isString],
      ShowItemComment:[],
      ShowJournalViewer:[],
      ShowMenu:[], //Non-JS
      ShowMessages:[],
      ShowNewMessage:[],
      ShowOpeningAmounts:[],
      ShowPickupOrder:[],
      ShowSalesTaxSelector:[],
      ShowSerialNumber:[],
      ShowStatus:[],
      ShowTimeClock:[],
      ShowTotals:[],
      ShowTransaction:[],
      ShowWebStatus:[],
      Tender:[],
      TimeToString:[_.isDate],
      ToggleReceiptPrintersOn:[],
      ToggleReturnMode:[],
      ToggleTaxableItem:[],
      ToggleTaxableTransation:[]
    };

    var handlers = {

      /**
       * FireEvent
       * @method showHTML
       * @for Bridge
       * @private
       * @param name {String}
       * @return {Boolean}
      **/
      ShowHTML: function (name,path) {
          return proxy().FireEvent(name,path);
      },

      /**
       * ExecuteProgram
       * @method executeProgram
       * @for Bridge
       * @private
       * @param name {String}
       * @param title {String}
       * @param cmd {String}
       * @param params {String}
       * @return {Boolean}
      **/
      ExecuteProgram: function (name,title,cmd,params) {
        return proxy().FireEvent(name,title||"",cmd,params);
      },

      /**
       * Wrapper method for ShowHTML
       *
       *     rms.bridge("PerformAddItem",0,'ITEM01',1,true,5.55,true,'Item new description');
       * @method performAddItem
       * @for Bridge
       * @private
       * @param name="PerformAddItem" {String}
       * @param id=0 {Number} value must exist in [Item].ID.
       * @param sku="" {String} value must exist in either [Item].ItemLookupCode or [Alias].ID.
       * @param qty=1 {Number}
       * @param priceOverride=false {Boolean}
       * @param price=0 {Number}
       * @param descOverride=false {Boolean}
       * @param desc="" {String} Description that will replace the description defined in the database.
       * @return {Boolean}
      **/
      PerformAddItem: function (name,id,sku,qty,priceOverride,price,descOverride,desc) {
        return proxy().FireEvent(name,id,sku,qty,priceOverride,price,descOverride,desc);
      }
    };


    function defaultHandler(name) {
        return proxy().FireEvent(name);
    }
    function emptyHandler() {
        return null;
    }
    function emptyCallback() {}
    function bridgeError(code, msg, ready) {
        return new Error(msg);
    }



    function createBridge() {
        var e;
        for (var key in events) {
            e = events[key];
            e.canInvoke = true;
            e.canOverride = true;
            e.canEmit = true;
            e.hasAccess = [];
            e.qsRules = null;
            e.bridge = (_.isEmpty(e)) ? defaultHandler : (handlers[key] || emptyHandler);
            e.custom = null;
        }

        return bridge;
    }


    /**
     * FireEvent
     * @method bridge
     * @for Bridge
     * @param name {String} description
     * @return {Function}
    **/
    function bridge(name, callback) {
        return bridge.fire(name,callback);
    }

    for(var event in events) {
      bridge[event] = events[event];
    }

    bridge.fire = function () {
        var args = Array.prototype.slice.call(arguments,0);
        var name = arguments[0];
        var handler = events[name];
        var func = handler.bridge;
        var count = Number(arguments.length);
        var last = arguments[count - 1];
        var hasCallback = _.isFunction(last);
        var callback = (hasCallback) ? last : emptyCallback;

        var result;

        if (hasCallback) {
            result = func.apply(null, Array.prototype.slice.call(arguments,0,count-1));

        } else {
            result = func.apply(null, Array.prototype.slice.call(arguments, 0));
        }

        bridge.result = result;
        callback(result);
        return bridge;
    };

    /**
     * Status
     * @method status
     * @for Bridge
     * @return {Function}
     *
    **/
    bridge.status = function () {
        return _.pick(__status, ['message','code','ready']);
    };

    /**
     * Events
     * @method all
     * @for Bridge
     * @return {Object}
     *
    **/
    bridge.all = function () {
        return events;
    };


    /**
     * Ready
     * @method ready
     * @for Bridge
     * @return {Boolean|Error}
     *
    **/
    bridge.ready = function () {
        var status = bridge.status();
        return (bridge.status().ready === true) ? true : bridgeError(status.code,status.message,status.ready);
    };

    return createBridge();
}
