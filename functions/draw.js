(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports);
    global.draw = mod.exports;
  }
})(this, function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.drawCircleVars = void 0;

  /*
    usage
    const size = 20
    const stroke = 1
  
    const { x, y, radius, diameter } = drawCircleVars(size, stroke);
    
    const d = `M${x} ${y} 
    a ${radius} ${radius} 0 0 1 0 ${diameter}
    a ${radius} ${radius} 0 0 1 0 -${diameter}`
  
    <svg viewbox="0 0 {size} {size}">
      <path d="{d}" stroke-width="stroke"></path>
    </svg>
  */
  var drawCircleVars = function drawCircleVars(circleWidth, strokeWidth) {
    if (strokeWidth === void 0) {
      strokeWidth = 0;
    }

    var circumference = (circleWidth - strokeWidth) / 2 * (3.14159 * 2);
    var radius = circumference / (3.14159 * 2);
    var diameter = radius * 2;
    var x = circleWidth / 2;
    var y = strokeWidth / 2; //const circumLength  = drawRatio == 1 ? drawRatio : drawRatio * circumference;

    return {
      x: x,
      y: y,
      radius: radius,
      diameter: diameter,
      circumference: circumference,
      circleWidth: circleWidth,
      strokeWidth: strokeWidth
    };
  };

  _exports.drawCircleVars = drawCircleVars;
});
//# sourceMappingURL=draw.js.map