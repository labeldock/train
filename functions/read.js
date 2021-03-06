(function (global, factory) {
  if (typeof define === "function" && define.amd) {
    define(["exports", "./isLike", "./baseFunction", "./enumerable", "./cast"], factory);
  } else if (typeof exports !== "undefined") {
    factory(exports, require("./isLike"), require("./baseFunction"), require("./enumerable"), require("./cast"));
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, global.isLike, global.baseFunction, global.enumerable, global.cast);
    global.read = mod.exports;
  }
})(this, function (_exports, _isLike, _baseFunction, _enumerable, _cast) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.readDown = _exports.hasValue = _exports.hasProperty = _exports.get = _exports.readPath = _exports.readString = void 0;

  function _extends() { _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; return _extends.apply(this, arguments); }

  //read.readString.spec.js
  var readString = function () {
    var rebaseMatches = function rebaseMatches(matches) {
      return (0, _baseFunction.baseEntries)((0, _cast.asArray)(matches));
    };

    return function (text, matches, castFn, props) {
      var payload = {
        content: text,
        props: props
      };
      var newMatchEntries = rebaseMatches(matches);
      var castingState = {
        firstIndex: 0,
        lastIndex: text.length,
        castingStart: 0,
        cursor: 0
      };

      if (typeof props === "object" && (0, _isLike.isNumber)(props.start)) {
        castingState.castingStart = props.start;
        castingState.cursor = props.start;
      }

      var open = function open(_ref) {
        var _ref$castingState = _ref.castingState,
            firstIndex = _ref$castingState.firstIndex,
            lastIndex = _ref$castingState.lastIndex,
            castingStart = _ref$castingState.castingStart,
            cursor = _ref$castingState.cursor,
            matchEntries = _ref.matchEntries,
            castFn = _ref.castFn,
            parentScope = _ref.parentScope;

        if (cursor >= lastIndex) {
          return false;
        } //find match


        var matchesMap = matchEntries.map(function (_ref2) {
          var matchType = _ref2[0],
              matchExp = _ref2[1];
          return [(0, _baseFunction.matchString)(text, matchExp, cursor), matchType, matchExp];
        });
        var firstMatch = (0, _cast.asArray)(matchesMap).sort(function (_ref3, _ref4) {
          var a = _ref3[0],
              aPriority = _ref3[1];
          var b = _ref4[0],
              bPriority = _ref4[1];
          return a[0] < 0 ? true : b[0] < 0 ? false : a[0] == b[0] ? aPriority < bPriority : a[0] > b[0];
        })[0]; // top match is not exsist

        if (!firstMatch) {
          return false;
        } // unmatched


        if (firstMatch[0][0] === -1) {
          firstMatch = [[-1, 0], -1, null];
        } //next variant


        var _firstMatch = firstMatch,
            _firstMatch$ = _firstMatch[0],
            matchIndex = _firstMatch$[0],
            matchSize = _firstMatch$[1],
            matchType = _firstMatch[1],
            matchExp = _firstMatch[2];
        var castStart = castingStart;
        var castEnd = matchType === -1 ? lastIndex : matchIndex + matchSize;
        var castSize = castEnd - castStart;
        var skipSize = castSize - matchSize; //next params

        var matching = {
          matchType: matchType,
          matchExp: matchExp,
          matchIndex: matchIndex,
          matchSize: matchSize,
          skipSize: skipSize
        };
        var casting = {
          firstIndex: firstIndex,
          lastIndex: lastIndex,
          castStart: castStart,
          castEnd: castEnd,
          castSize: castSize
        };
        var scope = {
          fork: function fork(matchEntries, castFn) {
            var newMatchEntries = rebaseMatches(matches);
            open({
              castingState: {
                firstIndex: matching.matchIndex,
                lastIndex: matching.matchIndex + matchSize,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: newMatchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          next: function next(needCursor) {
            var cursorTo = (0, _isLike.isNumber)(needCursor) ? needCursor : casting.castEnd;
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: cursorTo,
                cursor: cursorTo
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          },
          enter: function enter(enterMatches, enterCastFn) {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: matching.matchIndex,
                cursor: matching.matchIndex
              },
              matchEntries: rebaseMatches(enterMatches),
              castFn: enterCastFn,
              parentScope: {
                next: scope.next
              }
            });
          },
          exit: function exit(needCursor) {
            parentScope && parentScope.next((0, _isLike.isNumber)(needCursor) ? needCursor : casting.castEnd);
          },
          more: function more() {
            open({
              castingState: {
                firstIndex: firstIndex,
                lastIndex: lastIndex,
                castingStart: castStart,
                cursor: casting.castEnd
              },
              matchEntries: matchEntries,
              castFn: castFn,
              parentScope: parentScope
            });
          }
        };
        castFn(_extends({}, payload, {}, matching, {}, casting, {}, scope));
        return true;
      };

      open({
        castingState: castingState,
        matchEntries: newMatchEntries,
        castFn: castFn
      });
      return payload;
    };
  }();

  _exports.readString = readString;

  var readPath = function () {
    var __filterDotPath = function __filterDotPath(dotPath, removeFirstDot) {
      return removeFirstDot && dotPath.indexOf(".") === 0 ? dotPath.substr(1) : dotPath;
    };

    var __filterBlockPath = function __filterBlockPath(blockPath) {
      //remove []
      blockPath = blockPath.substring(1, blockPath.length - 1); //interger

      if (/^[0-9]+$/.test(blockPath)) {
        return parseInt(blockPath, 10);
      } //remove ''


      if (/^\'.*\'$/.test(blockPath) || /^\".*\"$/.test(blockPath)) {
        blockPath = blockPath.substring(1, blockPath.length - 1);
      }

      return blockPath;
    };

    return function (pathParam) {
      if ((0, _isLike.isArray)(pathParam)) {
        return pathParam;
      }

      if ((0, _isLike.likeString)(pathParam)) {
        if ((0, _isLike.isNumber)(pathParam)) {
          return [pathParam];
        }

        if (typeof pathParam === "string") {
          //one depth
          if (!/\.|\[/.test(pathParam)) {
            return [pathParam];
          } //multiple depth


          var _readString = readString(pathParam, [".", "["], function (_ref5) {
            var content = _ref5.content,
                path = _ref5.props.path,
                matchExp = _ref5.matchExp,
                castStart = _ref5.castStart,
                castEnd = _ref5.castEnd,
                skipSize = _ref5.skipSize,
                enter = _ref5.enter,
                next = _ref5.next;

            if (matchExp === ".") {
              skipSize && path.push(content.substr(castStart, skipSize));
              next();
            }

            if (matchExp === "[") {
              var stackCount = 0;

              if (skipSize) {
                path.push(__filterDotPath(content.substr(castStart, skipSize), castStart !== 0));
              }

              enter(["[", "]"], function (_ref6) {
                var matchExp = _ref6.matchExp,
                    castStart = _ref6.castStart,
                    castEnd = _ref6.castEnd,
                    more = _ref6.more,
                    exit = _ref6.exit;
                if (matchExp === "[") stackCount++;
                if (matchExp === "]") stackCount--;
                if (matchExp === null) return;

                if (stackCount === 0) {
                  path.push(__filterBlockPath(content.substring(castStart, castEnd)));
                  exit();
                } else {
                  more();
                }
              });
            }

            if (matchExp === null) {
              path.push(__filterDotPath(content.substr(castStart, castEnd), castStart !== 0));
            }
          }, {
            path: []
          }),
              result = _readString.props.path;

          return result;
        }
      }

      return [];
    };
  }();

  _exports.readPath = readPath;

  var get = function get(target, path, defaultValue) {
    if (typeof target === "object") {
      switch (typeof path) {
        case "number":
          path += "";

        case "string":
          path = readPath(path);

        case "object":
          if ((0, _isLike.isArray)(path)) {
            var allget = (0, _enumerable.all)(path, function (name) {
              if ((0, _isLike.likeObject)(target) && (target.hasOwnProperty(name) || target[name])) {
                target = target[name];
                return true;
              } else {
                return false;
              }
            });
            return allget ? target : defaultValue;
          } else {
            return;
          }

          break;

        case "function":
          return path.call(this, target);
      }
    } else if (typeof target === "function") {
      return target.apply(this, Array.prototype.slice.call(arguments, 1));
    }

    return target;
  };

  _exports.get = get;

  var hasProperty = function hasProperty(target, pathParam) {
    return (0, _enumerable.all)(readPath(pathParam), function (path) {
      if ((0, _isLike.likeObject)(target) && (0, _isLike.likeString)(path) && target.hasOwnProperty(path)) {
        target = target[path];
        return true;
      }

      return false;
    });
  };

  _exports.hasProperty = hasProperty;

  var hasValue = function () {
    var defaultObjectValueFunc = function defaultObjectValueFunc(object, value) {
      return object === value;
    };

    var functionKeyObjectValueProc = function functionKeyObjectValueProc(functionKey) {
      return function (object, value) {
        return Boolean(functionKey(object, value));
      };
    };

    var selectKeyObjectValueProc = function selectKeyObjectValueProc(leftSelect, rightSelect) {
      var useLeftSelector = typeof leftSelect === "string" || typeof leftSelect === "number";
      var useRightSelector = leftSelect === rightSelect ? useLeftSelector : typeof rightSelect === "string" || typeof rightSelect === "number";
      return function (object, value) {
        if (useLeftSelector && !object.hasOwnProperty(leftSelect)) return false;
        if (useRightSelector && !value.hasOwnProperty(rightSelect)) return false;
        return (useLeftSelector ? get(object, leftSelect) : object) === (useRightSelector ? get(value, rightSelect) : value);
      };
    };

    return function (obj, value, key, getKey) {
      if (typeof key === "boolean") {
        if (typeof getKey !== "boolean") {
          getKey = key;
        }

        key = void 0;
      }

      if (obj === value) {
        return true;
      } else if ((0, _isLike.likeObject)(obj)) {
        if (value === void 0 && key === void 0) return !(0, _isLike.isEmpty)(obj);
        var proc;

        if (key) {
          if (typeof key === "function") {
            proc = functionKeyObjectValueProc(key);
          } else if ((0, _isLike.isArray)(key) && key.length > 1) {
            proc = selectKeyObjectValueProc(key[0], key[1]);
          } else if (typeof key === "string" || typeof key === "number") {
            proc = selectKeyObjectValueProc(key, key);
          }
        } else {
          proc = defaultObjectValueFunc;
        }

        if ((0, _isLike.isArray)(obj)) {
          for (var i = 0, l = obj.length; i < l; i++) {
            if (proc(obj[i], value)) return getKey ? i : true;
          }
        } else {
          for (var objKey in obj) {
            if (obj.hasOwnProperty(objKey) && proc(obj[objKey], value)) return getKey ? objKey : true;
          }
        }
      }

      return getKey ? void 0 : false;
    };
  }();

  _exports.hasValue = hasValue;

  var readDown = function readDown(rootValue, readFn, rootParam) {
    var enterScope = function enterScope(value, depth, param) {
      return (0, _isLike.isArray)(value) ? arrayScope(value, depth, param) : (0, _isLike.isObject)(value) ? objectScope(value, depth, param) : primitiveScope(value, depth, param);
    };

    var arrayScope = function arrayScope(array, depth, param) {
      return readFn({
        type: "array",
        value: array,
        key: null,
        depth: depth,
        param: param,
        enter: function enter(param) {
          var childrenDepth = depth + 1;
          return Array(array.length).fill(void 0).map(function (v, i) {
            return i;
          }).map(function (key) {
            var value = array[key];
            return enterScope(value, childrenDepth, param);
          });
        }
      });
    };

    var objectScope = function objectScope(object, depth, param) {
      return readFn({
        type: "object",
        value: object,
        key: null,
        depth: depth,
        param: param,
        enter: function enter(param) {
          var childrenDepth = depth + 1;
          return Object.keys(object).map(function (key) {
            var value = object[key];
            return readFn({
              type: "hash",
              key: key,
              value: value,
              depth: depth,
              param: param,
              enter: function enter(param) {
                return enterScope(value, childrenDepth, param);
              }
            });
          });
        }
      });
    };

    var primitiveScope = function primitiveScope(value, depth, param) {
      readFn({
        type: "value",
        key: null,
        value: value,
        depth: depth,
        param: param,
        enter: function enter(param) {
          return param;
        }
      });
    };

    enterScope(rootValue, 0, rootParam);
    return rootParam;
  };

  _exports.readDown = readDown;
});
//# sourceMappingURL=read.js.map