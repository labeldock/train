(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./index.js"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./index.js"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.index);
    global.padoCore = mod.exports;
  }
})(this, function (_exports, functions) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.default = _exports.factory = void 0;
  functions = _interopRequireWildcard(functions);

  function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = Object.defineProperty && Object.getOwnPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : {}; if (desc.get || desc.set) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } } newObj.default = obj; return newObj; } }

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  var Bow = function Bow() {};

  var BowFactory = function BowFactory(fns) {
    var BOX = function BOX(payload) {
      return new Bow(payload);
    };

    function applyBoxFns(BowFns) {
      for (var name in BowFns) {
        BOX[name] = BowFns[name];
      }
    }

    applyBoxFns(fns);
    return BOX;
  };

  var DEFAULT = BowFactory(_extends({}, functions));
  var factory = BowFactory;
  _exports.factory = factory;
  var _default = DEFAULT;
  _exports.default = _default;
});
//# sourceMappingURL=pado.core.js.map