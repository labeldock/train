(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.cast);
    global.enumerable = mod.exports;
  }
})(this, function (_exports, _isLike, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.hashMap = _exports.times = _exports.deep = _exports.all = void 0;

  var all = function all(data, fn) {
    data = (0, _cast.asArray)(data);

    if (data.length === 0) {
      return false;
    }

    for (var i = 0, l = data.length; i < l; i++) {
      if (!fn(data[i], i)) {
        return false;
      }
    }

    ;
    return true;
  };

  _exports.all = all;

  var deep = function deep(data) {};

  _exports.deep = deep;

  var times = function times(length, fn) {
    var result = [];

    for (var i = 0, l = length; i < l; i++) {
      result.push(fn(i));
    }

    return result;
  };

  _exports.times = times;

  var hashMap = function hashMap(object, fn) {
    if (typeof object === "object" && !(0, _isLike.isArray)(object)) for (var k in object) {
      object[k] = fn(object[k], k);
    } else return fn(object, void 0);
    return object;
  };

  _exports.hashMap = hashMap;
});
//# sourceMappingURL=enumerable.js.map