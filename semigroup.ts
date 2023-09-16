interface Semigroup<A> {
    concat: (x: A, y: A) => A
}
// 它包括一個非空集合 A 和一個二元關聯運算 *。這個 * 運算是一個接受兩個 A 集合中的元素作為輸入，
// 並返回一個 A 集合中的元素作為輸出的函數。
// Semigroup這種結構在函數式編程中用於表示可以進行結合操作的數學結構。

const semigroupProduct: Semigroup<number> = {
    concat: (x, y) => x * y
}
/** number `Semigroup` under addition */
const semigroupSum: Semigroup<number> = {
    concat: (x, y) => x + y
}
const semigroupString: Semigroup<string> = {
    concat: (x, y) => x + y
} 
/** Always return the first argument */
function getFirstSemigroup<A = never>(): Semigroup<A> {
    return { concat: (x, y) => x }
}

/** Always return the second argument */
function getLastSemigroup<A = never>(): Semigroup<A> {
    return { concat: (x, y) => y }
}

function getArraySemigroup<A = never>(): Semigroup<Array<A>> {
    return { concat: (x, y) => x.concat(y) }
}
function of<A>(a: A): Array<A> {
    return [a]
}


/////////////////
// Deriving from Ord:
// There's another way to build a semigroup instance for a type A: 
// if we already have an Ord instance for A, then we can "turn it" into a semigroup.
import { ordNumber } from 'fp-ts/Ord'
import { min, max } from 'fp-ts/Semigroup'

/** Takes the minimum of two values */
const semigroupMin: Semigroup<number> = min(ordNumber)

/** Takes the maximum of two values  */
const semigroupMax: Semigroup<number> = max(ordNumber)

semigroupMin.concat(2, 1) // 1
semigroupMax.concat(2, 1) // 2


type Point = {
    x: number
    y: number
}
  
// const semigroupPoint: Semigroup<Point> = {
// concat: (p1, p2) => ({
//     x: semigroupSum.concat(p1.x, p2.x),
//     y: semigroupSum.concat(p1.y, p2.y)
//     })
// }

import { struct } from 'fp-ts/Semigroup'

const semigroupPoint: Semigroup<Point> = struct({
  x: semigroupSum,
  y: semigroupSum
})
type Vector = {
    from: Point
    to: Point
  }
  
const semigroupVector: Semigroup<Vector> = struct({
    from: semigroupPoint,
    to: semigroupPoint
})

import {SemigroupAll} from 'fp-ts/boolean'
import { getSemigroup } from 'fp-ts/function'
// import {Semigroup} from 'fp-ts/Semigroup'

/** `semigroupAll` is the boolean semigroup under conjunction */
const semigroupPredicate: Semigroup<(p: Point) => boolean> = getSemigroup(
    SemigroupAll
)<Point>()

const isPositiveX = (p: Point): boolean => p.x >= 0
const isPositiveY = (p: Point): boolean => p.y >= 0

const isPositiveXY = semigroupPredicate.concat(isPositiveX, isPositiveY)

isPositiveXY({ x: 1, y: 1 }) // true
isPositiveXY({ x: 1, y: -1 }) // false
isPositiveXY({ x: -1, y: 1 }) // false
isPositiveXY({ x: -1, y: -1 }) // false


//////////

// Folding
// By definition concat works with only two elements of A, what if we want to concat more elements?
// The fold function takes a semigroup instance, an initial value and an array of elements:
import { concatAll } from 'fp-ts/Semigroup'
import { SemigroupSum, SemigroupProduct } from 'fp-ts/number'

const sum = concatAll(SemigroupSum)(0)
console.log(sum([1, 2, 3, 4]) )// 10

const product = concatAll(SemigroupProduct)(1)
console.log(product([1, 2, 3, 4]) ) // 24


import { getApplySemigroup, some, none } from 'fp-ts/Option'

const S = getApplySemigroup(semigroupSum)

console.log(S.concat(some(1), none) )// none
console.log(S.concat(some(1), some(2)) )// some(3)