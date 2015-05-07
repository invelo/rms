
module.exports = function () {
    'use strict';

    function fake() {
        return {
            FireEvent: function () {
                return true;
            },
            RequestQSRules: function () {
                return {};
            }
        };
    }

    function proxy() {
        try {
            if (window && window.qsBridge && window.qsBridge.RequestQSRules().isPOS === true) return window.qsBridge;

            if (window && window.qsBridge && window.qsBridge.RequestQSRules().isPOS === false) return 'isQSRules';

        } catch (err) {
            return fake();
        }
    }
    return proxy;
};