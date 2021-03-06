define('Util', [], function() {
    var util = {
        inherit: function(parent, child) {
            for (var prop in parent) {
                if (prop in child) {
                    continue;
                }
                child[prop] = parent[prop];
            }
            return child;
        },
        isArray: function(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        },
        isObject: function(o) {
            return Object.prototype.toString.call(o) === '[object Object]';
        },
        isString: function(o) {
            return Object.prototype.toString.call(o) === '[object String]';
        },
        isFunction: function(o) {
            return Object.prototype.toString.call(o) === '[object Function]';
        }
    };
    return util;
});