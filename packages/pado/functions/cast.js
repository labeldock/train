import {
  isNumber,
  isArray,
  isAbsoluteNaN,
  isPlainObject,
  isObject,
  isFunction,
  isNode
} from './isLike'

import {
  baseAsArray,
  stringTest,
  baseKeys
} from './baseFunction'

export const asArray = baseAsArray

export const toArray = function (data, option){
  if(typeof data === "undefined" || data === null || isAbsoluteNaN(data)) return []
  if(isArray(data)) return Array.prototype.slice.call(data)
  if(typeof data === "object" && typeof data.toArray === "function") return data.toArray()
  if(typeof data === "string" && typeof option === "string") return data.split(option)
  return [data]
}

export const asObject = function (data, defaultKey = "default"){
  if(isPlainObject(data)){
    return data
  } else {
    return { [defaultKey]: data }
  }
}

export const toNumber = function (v, d){
  switch (typeof v){ case "number":return v; case "string":const vr = v.replace(/[^.\d\-]/g, "") * 1; return isAbsoluteNaN(vr) ? 0 : vr; break }
  switch (typeof d){ case "number":return d; case "string":const dr = d * 1; return isAbsoluteNaN(dr) ? 0 : dr; break }
  return 0
}

export const cleanObject = function (data){
  if(data instanceof Array){
    Array.prototype.splice.call(data, 0, data.length)
  } else if(typeof data == "object"){
    Object.keys(data).forEach(key=>{ delete data[key] })
  }
  return data
}

export const clone = function (target){
  switch (typeof target){
    case "undefined": case "function": case "boolean": case "number": case "string": return target; break
    case "object":
      if(target === null) return target
    
      if(isArray(target)){
        let r = []
        for(let i = 0, length = target.length; i < length; i++)r.push(target[i])
        return r
      }
    
      if(!isPlainObject(target)){
        if(target instanceof Date){
          let r = new Date()
          r.setTime(target.getTime())
          return r
        }
        return target
      }
    
      let r = {}
    
      Object.keys(target).forEach(k=>{
        if(target.hasOwnProperty(k)) r[k] = target[k]
      })
      return r
      break
    default : 
      console.error("clone::copy failed : target => ", target)
      return target 
      break
  }
}

export const cloneDeep = function (target){
  if(typeof target === "object"){
    let d
    if(isArray(target)){
      if(!isArray(d)){ d = [] };
      for(var i = 0, l = target.length; i < l; i++) d.push(((typeof target[i] === "object" && target[i] !== null) ? clone(target[i]) : target[i]))
      return d
    } else {
      d = {}
      Object.keys(target).forEach(p=>{
        (typeof target[p] === "object" && target[p] !== null && d[p]) ? clone(target[p], d[p]) : d[p] = target[p]
      })
      return d
    }
  } else {
    return clone(target)
  }
}

const getKeyWithValue = function (obj, value){
  if(isArray(obj)){
    for(var i = 0, l = obj.length; i < l; i++) if(obj[i] === value) return i
  } 
  if(isObject(obj)){
    for(var key in obj) if(obj[key] === value) return key
  }
  return undefined
}

export const removeValue = function (obj, value){
  var detect = true
  var array  = isArray(obj)

  while(detect){
    var key = getKeyWithValue(obj, value)
    if(typeof key === "undefined"){
      detect = false
    } else {
      if(array){
        obj.splice(key, 1)
      } else {
        delete obj[key]
      }
    }
  }

  return obj
}


// Only one unique value is left.
export const unique = function (array, findKey){
  const result    = []
  const uniqueSet = new Set()
  if(typeof findKey === "undefined"){ findKey = (v)=>v }
  if(typeof findKey === "string"){ const keyPath = findKey; findKey = (v)=>v[keyPath] }
  array.forEach((v)=>{
    const key = findKey(v)
    if(uniqueSet.has(key)) return
    uniqueSet.add(key)
    result.push(v)
  })
  return result
}

export const getKeyBy = function (object, value){
  if(isFunction(value)){
    if(isArray(object)) for(var i = 0, l = object.length; i < l; i++) if(value(object[i], i) === true) return i
    if(isObject(object)) for(var key in object) if(value(object[key], key) === true) return key
  } else {
    if(isArray(object)) for(var i = 0, l = object.length; i < l; i++) if(object[i] === value) return i
    if(isObject(object)) for(var key in object) if(object[key] === value) return key
  }
}

// Change the positions of the specified indexes in the array
export const moveOf = function (data, oldIndex, newIndex){
  data = asArray(data)
  oldIndex !== newIndex && 
  isNumber(oldIndex) &&
  isNumber(newIndex) &&
  oldIndex >= 0 && oldIndex < data.length && 
  Array.prototype.splice.call(data, newIndex > data.length ? data.length : newIndex, 0, Array.prototype.splice.call(data, oldIndex, 1)[0])
  return data
}
export const move = (data, oldIndex, newIndex)=>moveOf(toArray(data), oldIndex, newIndex)


// Supports self concat.
const baseConcatOf = (data, args)=>{
  const result = asArray(data)
  return (args.forEach(data=>{ asArray(data).forEach(value=>{ result.push(value) }) }), result)
}
export const concatOf = (data, ...args)=>baseConcatOf(data, args)
export const concat = (data, ...args)=>baseConcatOf(toArray(data), args)


// Removes the value of data that does not return a positive value to the filter function.
export const filterOf = function (data, filterFn, exitFn){
  const dataArray = asArray(data)
  const dataKeys = baseKeys(data)
  const isOnExit = typeof exitFn === "function"
  const exitArray = isOnExit ? [] : null
  for(let i = 0, removedIndex = 0, l = dataKeys.length; i < l; i++, removedIndex++){
    const datumKey = dataKeys[i]
    const datum = dataArray[datumKey]
    if(filterFn(datum, datumKey) !== true){
      const exitDatum = dataArray.splice(i, 1)
      i--
      l--
      isOnExit && exitArray.push([removedIndex, exitDatum])
    }
  }
  isOnExit && exitFn(exitArray, dataArray)
  return dataArray
}
export const filter = (data, func, exitFn)=>filterOf(toArray(data), func, exitFn)


// Put the specified value in the specified index.
export const insertOf = function (data, v, a){
  data = asArray(data)
  return (data.splice(typeof a === "number" ? a : 0, 0, v), data)
}
export const insert = (data, v, a)=>insertOf(toArray(data), v, a)


// Removes all contents of an array or object.
export const clearOf = function (data, fillFn, sp){
  if(isArray(data)){
    sp = Array.prototype.splice.call(data, 0, data.length)
  } else if(typeof data == "object"){
    sp = {}
    for(var key in data){ sp[key] = data[key]; delete data[key] } 
  }
  return (fillFn && fillFn(data, sp)), data
}

// sort
export const sortOf = function (data, filter){
  if(data.length == 0){
    return data
  }
  
  switch (filter){
    case 'desc':
      filter = function (a, b){ return a > b }
      break
    case undefined:
    case 'asc':
    default:
      if(typeof filter !== "function"){
        filter = function (a, b){ return a < b }
      }
      break
  }

  var result = [data[0]]

  for(var i = 1, l = data.length; i < l; i++){
    for(var ri = 0, rl = result.length; ri < rl; ri++){
      if(filter(data[i], result[ri]) === true){
        insertOf(result, data[i], ri)
        break
      }
      if((ri + 1) === result.length){
        result.push(data[i])
      }
    }
  }

  clearOf(data)

  for(var i = 0, l = result.length; i < l; data.push(result[i]), i++);
  
  return data
}

export const sort = (data, filter)=>sortOf(toArray(data), filter)

// If have defined multiple key names in one hash, change them appropriately.
// rebase({ "a,b":1 }) => { "a":1, "b":1 }
export const rebase = function (obj, ref){
  var result = {}
  for(var key in obj){
    if(key === ".*"){
      var refValue = obj[key]
      for(var i = 0, d = Object.keys(ref), l = d.length; i < l; i++){
        var refKey = d[i]
        if(typeof refValue === "function"){
          result[refKey] = obj[key]
        } else {
          if((typeof refValue !== "object" && typeof refValue !== "object") || isNode(refValue)){
            result[refKey] = refValue
          } else {
            result[refKey] = Object.assign(result[refKey], refValue)
          }
        }
      }
    } else if(key.indexOf(",") > -1){
      key.split(",").forEach(deepKey=>{
        deepKey = deepKey.trim()
        if(typeof obj[key] === "function"){
          result[deepKey] = obj[key]
        } else {
          if((!result.hasOwnProperty(deepKey) && typeof obj[key] !== "object") || isNode(obj[key])){
            result[deepKey] = obj[key]
          } else {
            result[deepKey] = Object.assign(result[deepKey] || (isArray(obj[key]) ? [] : {}), obj[key], obj[deepKey])
          }
        }
      })
    } else {
      if(typeof obj[key] === "function"){
        result[key] = obj[key]
      } else {
        if((typeof result[key] !== "object" && typeof obj[key] !== "object") || isNode(obj[key])){
          result[key] = obj[key]
        } else {
          result[key] = Object.assign(result[key], obj[key])
        }
      }
    }
  }
  return result
}

const removeKey = function (datum, rule){
  if(!isObject(datum)) return datum
  const removeRule = typeof rule === "function" ? (key, value)=>rule(value, key) : rule
  const removeKeys = baseKeys(datum, removeRule)
  if(!removeKeys.length) return datum
  
  isArray(datum)
    ? removeKeys.forEach((originalIndex, offset)=>{
      const removeIndex = originalIndex - offset
      datum.splice(removeIndex, 1)
    })
    : removeKeys.forEach(key=>{ delete datum[key] })

  return datum
}

// If the rule matches the rule, remove the key
export const omitOf = (datum, rule)=>removeKey(datum, rule)
export const omit = (datum, rule)=>omitOf(clone(datum), rule)

// If the rule matches the rule, preserve the key.
export const pickOf = (datum, rule)=>removeKey(datum, (value, key)=>!stringTest(key, rule, value))
export const pick = (datum, rule)=>pickOf(clone(datum), rule)

// Remove the key that has a value of undefined
//const COMPACT_MATCH_FN = value=>typeof value !== "undefined"
const COMPACT_MATCH_FN = value=>{
  return typeof value === "undefined"
}
export const compactOf = (datum)=>omitOf(datum, COMPACT_MATCH_FN)
export const compact = (datum)=>compactOf(clone(datum))

// Clears key values starting with $
const FREE_MATCH_EXPRESSION = /^\$/
export const freeOf = (datum)=>omitOf(datum, FREE_MATCH_EXPRESSION)
export const free = (datum)=>freeOf(clone(datum))

// Remove the key that begins with $ or has a value of undefined.
export const purgeOf = (datum)=>omitOf(datum, (value, key)=>FREE_MATCH_EXPRESSION.test(key) || COMPACT_MATCH_FN(value))
export const purge = (datum)=>purgeOf(clone(datum))

/* Experimental
export const injectOf = (data,injectFn)=>keys(data).reduce((dest, key)=>((dest[key] = injectFn(dest[key], key)), dest),asObject(data))
export const inject = (data, injectFn)=>injectOf(clone(data), injectFn);

export const mapOf = (data, mapFn)=>asArray(data).map(mapFn);
export const map = (data, mapFn)=>mapOf(clone(data), mapFn);
*/


//
export const instance = function (func, proto){
  var ins; var DummyInstance = function (param){ if(typeof param === "object") for(var k in param) this[k] = param[k] }
  if(typeof func == "object"){
    if(typeof proto === "object") DummyInstance.prototype = proto
    ins = new DummyInstance(func)
  }
  if(typeof func == "function"){
    if(typeof proto === "object") func.prototype = proto
    ins = (new func())
  }
  return ins
}

export const alloc = function (init){
  let fn = init()
  const rn = function (...args){
    return fn.apply(this, args)
  }
  rn['reset'] = function (){ fn = init(rn, rn) }
  rn['$constructor'] = fn
  return rn
}

// TODO
/*
const syncData = (function (){
  const ENTER_HOOK  = (newDatum)=>Object.assign({}, newDatum)
  const UPDATE_HOOK = (oldDatum, newDatum)=>Object.assign({}, oldDatum, newDatum)
  
  return function (oldData, newData, getId, options){
    if(!/string|function/.test(typeof getId)) throw new Error("syncData need getId")
  
    if(typeof getId === "string"){
      const getIdString = getId
      getId = e=>_.get(e, getIdString)
    }

    oldData = asArray(oldData)
    newData = asArray(newData)

    const result = []
    const hooks  = asObject(options, "afterEach")
    
    if(typeof hooks["enter"] !== "function"){
      hooks["enter"] = ENTER_HOOK
    }
    
    if(typeof hooks["update"] !== "function"){
      hooks["update"] = UPDATE_HOOK
    }
    
    const oldDataMap = _.map(oldData, e=>{
      return { id: getId(e), ref: e }
    })
    
    
    asArray(newData).forEach((newDatum, i)=>{
      const newId = getId(newDatum)
      
      let oldDatum = _.get(oldDataMap[_.findIndex(oldDataMap, e=>e.id === newId)], "ref")
      let genDatum
      let dirty = false
      // eslint-disable-next-line no-undef
      if(oldDatum){
        // change is not dirty, modify is dirty
        if(typeof oldDatum !== typeof newDatum){
          dirty = false
        } else { // same type
          const oldOwnKeys = Object.keys(oldDatum).filter(key=>!(key.indexOf("$") === 0))
          const newOwnKeys = Object.keys(newDatum).filter(key=>!(key.indexOf("$") === 0))

          // inspect key chnage
          if(_.isEqual(oldOwnKeys, newOwnKeys)){
            dirty = !_.isEqual(_.pick(oldDatum, oldOwnKeys), _.pick(newDatum, newOwnKeys))
          } else {
            dirty = true
          }
        }
        
        if(typeof hooks["beforeUpdate"] === "function"){
          if(hooks["beforeUpdate"](oldDatum, newDatum) === false){
            return
          }
        }
        
        genDatum = hooks["update"](oldDatum, newDatum)
        
        if(typeof hooks["afterUpdate"] === "function"){
          genDatum = hooks["afterUpdate"](genDatum, oldDatum, newDatum)
        }
      } else {
        if(typeof hooks["beforeEnter"] === "function"){
          if(hooks["beforeEnter"](newDatum) === false){
            return
          }
        }
        
        genDatum = hooks["enter"](newDatum)
        
        if(typeof hooks["afterEnter"] === "function"){
          genDatum = hooks["afterEnter"](genDatum, newDatum)
        }
      }

      if(typeof hooks["afterEach"] === "function"){
        hooks["afterEach"](genDatum, i, dirty)
      }

      result.push(genDatum)
    })

    return result
  }
}())
*/
