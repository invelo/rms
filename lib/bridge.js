
var _ = require('lodash')
  , proxy = require('./proxy.js')();



module.exports = qsBridge;

function qsBridge() {

    var __status = {
        ready: false,
        message: '',
        code: 0
    };

    var events = {
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
      ShowHTML: function (name,path) {
          return proxy().FireEvent(name,path);
      },
      ExecuteProgram: function (name,title,cmd,params) {
        return proxy().FireEvent(name,title||"",cmd,params);
      },
      PerformAddItem: function (name,id,sku,qty,priceOverride,price,descOverride,desc) {
        return proxy().FireEvent(name,id,sku,qty,priceOverride,price,descOverride,desc);
      }
    };


    function defaultHandler(name) {
        return proxy().FireEvent(name);
    }
    function emptyHandler() {
        console.log(arguments);
        return null;
    }
    function emptyCallback() {};
    function bridgeError(code, msg, ready) {
        return new Error(msg);
    }
    function validateRequest() {

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



    var proceedures = [];


    function bridge(name, callback) {
        return bridge.fire(name,callback);
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
    bridge.status = function () {
        return _.pick(__status, ['message','code','ready']);
    };
    bridge.all = function () {
        return events;
    };
    bridge.ready = function () {
        var status = bridge.status();
        return (bridge.status().ready === true) ? true : bridgeError(status.code,status.message,status.ready);
    };

    return createBridge();
}
