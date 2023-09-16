// interface Eq<A> {
//     /** returns `true` if `x` is equal to `y` */
//     readonly equals: (x: A, y: A) => boolean
//   }
// 等同於
import { Eq } from 'fp-ts/Eq'

const eqNumber: Eq<number> = {
equals: (x, y) => x === y
}
const isEqual = eqNumber.equals(5, 5); // 使用 eqNumber 的 equals 方法比較 5 和 5 是否相等

if (isEqual) {
  console.log("數字相等"); // 如果 isEqual 為 true，則輸出 "數字相等"
} else {
  console.log("數字不相等"); // 如果 isEqual 為 false，則輸出 "數字不相等"
}
///////////////// 
function elem<A>(E: Eq<A>): (a: A, as: Array<A>) => boolean {
    return (a, as) => as.some(item => E.equals(item, a))
  }
  
const result = elem(eqNumber)(3, [1, 2, 3]) // true
console.log(result)
/////////////////
type Point = {
    x: number
    y: number
  }
  
const eqPoint: Eq<Point> = {
equals: (p1, p2) => p1.x === p2.x && p1.y === p2.y
}
const point1: Point = { x: 1, y: 2 };
const point2: Point = { x: 2, y: 2 };
const isEqual1 = eqPoint.equals(point1, point2); // 使用 eqPoint 的 equals 方法比較 point1 和 point2 是否相等
console.log(isEqual1); // 輸出 true，因為 point1 和 point2 的 x 和 y 屬性相等

////////////////
// Indeed the fp-ts/Eq module exports a getStructEq combinator:

import { contramap } from 'fp-ts/Eq'
type User = {
  userId: number
  name: string
}

/** two users are equal if their `userId` field is equal */
// 將user => user.userId的輸出值，輸入到eqNumber表達式
const eqUser = contramap((user: User) => user.userId)(eqNumber)
// code: (contramap) <A, B>(f: (b: B) => A) => (fa: Eq<A>) => Eq<B>
// contramap<number, User>(f: (b: User) => number): (fa: Eq<number>) => Eq<User>
const result2 = eqUser.equals({ userId: 1, name: 'Giulio' }, { userId: 1, name: 'Giulio Canti' }) 
console.log(result2)