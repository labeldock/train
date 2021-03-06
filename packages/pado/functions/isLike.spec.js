import {
  isNone,
  likeString,
  likeNumber,
  isObject,
  likeObject,
  isEmpty,
  isPlainObject,
  eqof,
  eqeq,
  isEqual,
  likeEqual,
  isPresence
} from './isLike'

describe('Functions isLike', ()=>{
  it('isNone', ()=>{
    const NI = Number.NEGATIVE_INFINITY
    const PI = Number.POSITIVE_INFINITY
    
    expect(isNone()).toEqual(true)
    expect(isNone(undefined)).toEqual(true)
    expect(isNone(void 0)).toEqual(true)
    expect(isNone(NaN)).toEqual(true)
    expect(isNone(null)).toEqual(true)
    expect(isNone(NI)).toEqual(false)
    expect(isNone(PI)).toEqual(false)
    expect(isNone(0)).toEqual(false)
    expect(isNone(-0)).toEqual(false)
    expect(isNone(true)).toEqual(false)
    expect(isNone({})).toEqual(false)
    expect(isNone("")).toEqual(false)
  })
  
  it('likeString', ()=>{
    expect(likeString("")).toEqual(true)
    expect(likeString(123)).toEqual(true)
    expect(likeString({})).toEqual(false)
    expect(likeString(undefined)).toEqual(false)
    expect(likeString(null)).toEqual(false)
    expect(likeString(NaN)).toEqual(false)
    expect(likeString(true)).toEqual(false)
  })
  
  it('likeNumber', ()=>{
    expect(likeNumber(0)).toEqual(true)
    expect(likeNumber("0")).toEqual(true)
    expect(likeNumber(-20)).toEqual(true)
    expect(likeNumber("-20")).toEqual(true)
    expect(likeNumber(100.1)).toEqual(true)
    expect(likeNumber("100.1")).toEqual(true)
    expect(likeNumber("100.1.1")).toEqual(false)
    expect(likeNumber(Number.POSITIVE_INFINITY)).toEqual(false)
    expect(likeNumber(Number.NEGATIVE_INFINITY)).toEqual(false)
    expect(likeNumber(NaN)).toEqual(false)
    expect(likeNumber(true)).toEqual(false)
    expect(likeNumber(undefined)).toEqual(false)
  })
  
  // isEmpty
  it('isEmpty', ()=>{
    expect(isEmpty(null)).toEqual(true)
    expect(isEmpty(void 0)).toEqual(true)
    expect(isEmpty([])).toEqual(true)
    expect(isEmpty({})).toEqual(true)
    expect(isEmpty(NaN)).toEqual(true)
    expect(isEmpty("")).toEqual(true)
    expect(isEmpty("  ")).toEqual(true)
    
    expect(isEmpty(" A ")).toEqual(false)
    expect(isEmpty(true)).toEqual(false)
    expect(isEmpty(0)).toEqual(false)
    expect(isEmpty(1)).toEqual(false)
    expect(isEmpty([1])).toEqual(false)
    expect(isEmpty({ 'foo': 'bar' })).toEqual(false)
  })
  
  it('isObject', ()=>{
    expect(isObject({})).toEqual(true)
    expect(isObject([1, 2, 3])).toEqual(true)
    expect(isObject(function (){})).toEqual(false)
    expect(isObject(null)).toEqual(false)
  })
  
  it('likeObject', ()=>{
    expect(likeObject({})).toEqual(true)
    expect(likeObject([1, 2, 3])).toEqual(true)
    expect(likeObject(function (){})).toEqual(true)
    expect(likeObject(null)).toEqual(false)
  })
  
  var DummyClass = function (){}
  var dummyInstance = new DummyClass()
  
  it('isPlainObject', ()=>{
    expect(isPlainObject({})).toEqual(true)
    expect(isPlainObject([])).toEqual(false)
    expect(isPlainObject(1)).toEqual(false)
    expect(isPlainObject("")).toEqual(false)
    expect(isPlainObject(new Date())).toEqual(false)
    expect(isPlainObject(dummyInstance)).toEqual(false)
  })
  
  it('eqof', ()=>{
    expect(eqof()).toEqual("none")
    expect(eqof(undefined)).toEqual("none")
    expect(eqof(null)).toEqual("none")
    expect(eqof(NaN)).toEqual("none")
    expect(eqof(1)).toEqual("value")
    expect(eqof(1.1)).toEqual("value")
    expect(eqof("1")).toEqual("value")
    expect(eqof([])).toEqual("array")
    expect(eqof({})).toEqual("hash")
    expect(eqof(true)).toEqual("boolean")
    expect(eqof(function (){})).toEqual("function")
    expect(eqof(dummyInstance)).toEqual("object")
  })
  
  it('eqeq', ()=>{
    expect(eqeq("1", 1)).toEqual(true)
    expect(eqeq(undefined, null)).toEqual(true)
    expect(eqeq(NaN, null)).toEqual(true)
    expect(eqeq(47, 47)).toEqual(true)
    expect(eqeq("47", "47")).toEqual(true)
    expect(eqeq(47, "47")).toEqual(true)
    expect(eqeq(true, true)).toEqual(true)
    
    //
    expect(eqeq([], [])).toEqual(true)
    expect(eqeq({}, {})).toEqual(true)
    
    //
    expect(eqeq(["1"], [1])).toEqual(true)
    expect(eqeq([47], ["47"])).toEqual(true)
    expect(eqeq({ foo: "bar" }, { foo: "bar" })).toEqual(true)
    expect(eqeq([{ foo: "bar" }], [{ foo: "bar" }])).toEqual(true)
    expect(eqeq({ foo: 123 }, { foo: "123" })).toEqual(true)
    
    //
    expect(eqeq([{ foo: 123, bar: [2, [3, 4]] }], [{ foo: 123, bar: [2, [3, 4]] }])).toEqual(true)
    expect(eqeq([{ foo: 123, bar: [2, 3] }], [{ foo: "123", bar: ["2", "3"] }])).toEqual(true)
    
    //
    expect(eqeq(false, true)).toEqual(false)
    expect(eqeq(1, 2)).toEqual(false)
    expect(eqeq("3", "4")).toEqual(false)
  })
  
  it('isEqual', ()=>{
    expect(isEqual(1, 1)).toEqual(true)
    expect(isEqual(undefined, null)).toEqual(true)
    expect(isEqual(NaN, null)).toEqual(true)
    expect(isEqual("47", "47")).toEqual(true)
    expect(isEqual(true, true)).toEqual(true)
    
    //
    expect(isEqual([], [])).toEqual(true)
    expect(isEqual({}, {})).toEqual(true)
    
    //
    expect(isEqual([1], [1])).toEqual(true)
    expect(isEqual(["1"], [1])).toEqual(false)
    
    //
    expect(isEqual({ foo: "bar" }, { foo: "bar" })).toEqual(true)
    expect(isEqual({ foo: 123 }, { foo: "123" })).toEqual(false)
    
    //
    expect(isEqual([{ foo: "123", bar: [2, 3] }], [{ foo: "123", bar: [2, 3] }])).toEqual(true)
    expect(isEqual([{ foo: "123", bar: [2, 3] }], [{ foo: "123", bar: ["2", "3"] }])).toEqual(false)
    
    //
    expect(isEqual("1", 1)).toEqual(false)
    expect(isEqual(true, false)).toEqual(false)
    expect(isEqual(1, 2)).toEqual(false)
    expect(isEqual("3", "4")).toEqual(false)
  })
  
  it('likeEqual', ()=>{
    expect(likeEqual([], [])).toEqual(true)
    expect(likeEqual({}, {})).toEqual(true)
    expect(likeEqual([[[2, 3], 4], 5], [[[2, 3], 4], 5])).toEqual(true)
    
    expect(likeEqual({ $edit: true }, { $edit: false })).toEqual(true)
    expect(likeEqual({ $history: [1, 2] }, { $history: [1, 2] })).toEqual(true)
    expect(likeEqual({ _history: [1, 2] }, { _history: [1, 2] })).toEqual(true)
    expect(likeEqual({ _history: [1, 2], name: "ana" }, { _history: [1, 2, 3], name: "ana" })).toEqual(true)
  })
  
  it('isPresence', ()=>{
    expect(isPresence('')).toEqual(true)
    expect(isPresence(0)).toEqual(true)
    //null is '' (defined value)
    expect(isPresence(null)).toEqual(true)
    expect(isPresence([])).toEqual(true)
    expect(isPresence({})).toEqual(true)
    expect(isPresence(true)).toEqual(true)
    expect(isPresence(false)).toEqual(true)
    expect(isPresence(new Date())).toEqual(true)
    
    expect(isPresence(undefined)).toEqual(false)
    expect(isPresence()).toEqual(false)
  })
})
