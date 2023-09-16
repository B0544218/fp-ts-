import { Eq } from 'fp-ts/Eq'

type Ordering = -1 | 0 | 1

// interface Ord<A> extends Eq<A> {
//   readonly compare: (x: A, y: A) => Ordering
// }
import { Ord, fromCompare } from 'fp-ts/Ord'

// const ordNumber: Ord<number> = {
//     equals: (x, y) => x === y,
//     compare: (x, y) => (x < y ? -1 : x > y ? 1 : 0)
// }
// 使用內建的fromCompare
const ordNumber: Ord<number> = fromCompare((x, y) => (x < y ? -1 : x > y ? 1 : 0))
////////////////////////////

function min<A>(O: Ord<A>): (x: A, y: A) => A {
    return (x, y) => (O.compare(x, y) === 1 ? y : x)
  }
  
const result1 = min(ordNumber)(0, 1)
console.log(result1)

type User = {
    name: string
    age: number
}
// const byAge: Ord<User> = fromCompare((x, y) => ordNumber.compare(x.age, y.age))
import { contramap } from 'fp-ts/Ord'
const byAge: Ord<User> = contramap((user: User) => user.age)(ordNumber)
const getYounger = min(byAge)
const younerUser = getYounger({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 }) // { name: 'Giulio', age: 45 }
console.log(younerUser)


import { reverse } from 'fp-ts/Ord'
const max = <A>(O: Ord<A>): ((x: A, y: A) => A) => {
    const reversedOrd = reverse(O); // 反轉排序器
    return (x, y) => (reversedOrd.compare(x, y) === 1 ? y : x);
  };
  const getOlder = max(byAge); // 使用 max 函數

const olderUser = getOlder({ name: 'Guido', age: 48 }, { name: 'Giulio', age: 45 });

console.log(olderUser); 