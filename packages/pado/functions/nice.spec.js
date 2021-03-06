import { limitNumber, turn, turnTime } from './nice'

describe('Functions nice', ()=>{
  it("limitNumber", ()=>{
    expect(limitNumber(1, 2, 0)).toEqual(1)
    expect(limitNumber(-1, 2, 0)).toEqual(0)
    expect(limitNumber(9, 2, 0)).toEqual(2)
    expect(limitNumber(-10, 5, -5)).toEqual(-5)
    expect(limitNumber(-20, 10, 10)).toEqual(10)
    expect(limitNumber([-10, 0, 10], -30)).toEqual([0, -30, -30])
    expect(limitNumber([-10, 0, 10], -30, null)).toEqual([-30, -30, -30])
    expect(limitNumber([-10, 0, 10], -30, NaN)).toEqual([-30, -30, -30])
  })
  
  it('turn', ()=>{
    expect(turn(0, 3)).toEqual(0)
    expect(turn(1, 3)).toEqual(1)
    expect(turn(2, 3)).toEqual(2)
    expect(turn(3, 3)).toEqual(0)
    expect(turn(4, 3)).toEqual(1)
    expect(turn(0, 2, 2)).toEqual(0)
    expect(turn(1, 2, 2)).toEqual(0)
    expect(turn(2, 2, 2)).toEqual(1)
    expect(turn(3, 2, 2)).toEqual(1)
    expect(turn(4, 2, 2)).toEqual(0)
    expect(turn(5, 2, 2)).toEqual(0)
  })
  
  it('turnTime', ()=>{
    expect(turnTime(0, 3)).toEqual([0, 0])
    expect(turnTime(1, 3)).toEqual([1, 0])
    expect(turnTime(2, 3)).toEqual([2, 0])
    expect(turnTime(3, 3)).toEqual([0, 1])
    expect(turnTime(4, 3)).toEqual([1, 1])
    expect(turnTime(0, 2, 2)).toEqual([0, 0])
    expect(turnTime(1, 2, 2)).toEqual([0, 0])
    expect(turnTime(2, 2, 2)).toEqual([1, 0])
    expect(turnTime(3, 2, 2)).toEqual([1, 0])
    expect(turnTime(4, 2, 2)).toEqual([0, 1])
    expect(turnTime(5, 2, 2)).toEqual([0, 1])
  })
})
