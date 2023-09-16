import { Semigroup } from 'fp-ts/Semigroup'

// Monoid 是 Semigroup 的擴展
// 添加了一個額外的特性，即 empty，代表中性元素。
// empty 屬性：Monoid 接口中包含一個 empty 屬性，它代表 Monoid 類型中的中性元素。這個中性元素對於特定 Monoid 來說是唯一的。
interface Monoid<A> extends Semigroup<A> {
  readonly empty: A
}
/** number `Monoid` under addition */
const monoidSum: Monoid<number> = {
    concat: (x, y) => x + y,
    empty: 0
  }
  
  /** number `Monoid` under multiplication */
  const monoidProduct: Monoid<number> = {
    concat: (x, y) => x * y,
    empty: 1
  }
  
  const monoidString: Monoid<string> = {
    concat: (x, y) => x + y,
    empty: ''
  }
  
  /** boolean monoid under conjunction */
  const monoidAll: Monoid<boolean> = {
    concat: (x, y) => x && y,
    empty: true
  }
  
  /** boolean monoid under disjunction */
  const monoidAny: Monoid<boolean> = {
    concat: (x, y) => x || y,
    empty: false
  }
  const semigroupSpace: Semigroup<string> = {
    concat: (x, y) => x + ' ' + y
  }
type Point = {
    x: number
    y: number
}
import { struct } from 'fp-ts/Monoid'

const monoidPoint: Monoid<Point> = struct({
    x: monoidSum,
    y: monoidSum
})
type Vector = {
    from: Point
    to: Point
  }
  
const monoidVector: Monoid<Vector> = struct({
    from: monoidPoint,
    to: monoidPoint
})

const vector1: Vector = {
    from: { x: 1, y: 2 },
    to: { x: 3, y: 4 }
  };
  
const vector2: Vector = {
    from: { x: 5, y: 6 },
    to: { x: 7, y: 8 }
};
  
// 使用 monoidVector 的 concat 方法來組合兩個向量
const combinedVector: Vector = monoidVector.concat(vector1, vector2);
console.log(combinedVector);

/////////////////////
import { concatAll } from 'fp-ts/Monoid'

concatAll(monoidSum)([1, 2, 3, 4]) // 10
concatAll(monoidProduct)([1, 2, 3, 4]) // 24
concatAll(monoidString)(['a', 'b', 'c']) // 'abc'
concatAll(monoidAll)([true, false, true]) // false
concatAll(monoidAny)([true, false, true]) // true


///////////////
import { getLastMonoid, some, none } from 'fp-ts/Option'
const M = getLastMonoid<number>()
M.concat(some(1), none) // some(1)
M.concat(some(1), some(2)) // some(2)

