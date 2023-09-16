// 問題 要如何寫這段
// liftA2(g): (fb: F<B>) => (fc: F<C>) => F<D>


// 柯里化（Currying）：
// g: (b: B) => (c: C) => D
// 對於一個接受 (B, C) 兩個參數並返回 D 的函數 g，柯里化將其轉換為接受 B 並返回一個函數，這個函數接受 C 並返回 D。


// 在函數子中沒有合法的操作可以從 F<(c: C) => D> 解壓縮成 (fc: F<C>) => F<D>，這是一個難以解決的問題。

// Apply
// So let's introduce a new abstraction Apply that owns such a unpacking operation
import { Functor } from 'fp-ts/Functor'
import { HKT } from 'fp-ts/HKT'
// the HKT type is the fp-ts way to represent a generic type constructor
//  so when you see HKT<F, X> you can think to the type constructor F applied to the type X (i.e. F<X>).

interface Apply<F> extends Functor<F> {
    ap: <C, D>(fcd: HKT<F, (c: C) => D>, fc: HKT<F, C>) => HKT<F, D>
}
// 當你看到 HKT<F, X>，它表示型別建構子 F 應用到型別 X 上，通常寫作 F<X>。這是 fp-ts 中用來處理函數式的高級型別操作的一種方式。
// 這個方法接受兩個參數：fcd 和 fc。fcd 是一個函數的型別建構子，它包含一個函數，該函數將從 C 到 D 的映射。
// 我們將 fcd 中的函數應用於 fc 中的值。根據 ap 的定義，fcd 是一個型別建構子，其中包含從 C 到 D 的函數。當我們使用 fcd 中的函數對 fc 中的值進行應用時，我們將 C 型別的值映射為 D 型別的值。
// 因此，可以認為 fc 包含從 C 到 D 的值，因為在 ap 操作中，我們將 C 型別的值轉換為 D 型別的值。
// ap 方法的目的是將 fcd 中的函數應用於 fc 中的值，並返回一個新的型別建構子，其中包含 D 型別的值。


// 此外，如果存在能夠將類型 A 的值提升為類型 F<A> 的值的操作，那將會很方便。
interface Applicative<F> extends Apply<F> {
    of: <A>(a: A) => HKT<F, A>
  }
// 這個方法接受一個值 a，並將其包裝成一個具有型別 HKT<F, A> 的型別建構子。換句話說，of 方法將一個普通的值轉換為具有特殊型別的容器。

// F=Array
import { flatten } from 'fp-ts/Array'

const applicativeArray = {
  map: <A, B>(fa: Array<A>, f: (a: A) => B): Array<B> => fa.map(f),
  of: <A>(a: A): Array<A> => [a],
  ap: <A, B>(fab: Array<(a: A) => B>, fa: Array<A>): Array<B> =>
    flatten(fab.map(f => fa.map(f)))
}

// F = Option
import { Option, some, none, isNone } from 'fp-ts/Option'

const applicativeOption = {
  map: <A, B>(fa: Option<A>, f: (a: A) => B): Option<B> =>
    isNone(fa) ? none : some(f(fa.value)),
  of: <A>(a: A): Option<A> => some(a),
  ap: <A, B>(fab: Option<(a: A) => B>, fa: Option<A>): Option<B> =>
    isNone(fab) ? none : applicativeOption.map(fa, fab.value)
}

// F = Task
import { Task } from 'fp-ts/Task'

const applicativeTask = {
  map: <A, B>(fa: Task<A>, f: (a: A) => B): Task<B> => () => fa().then(f),
  of: <A>(a: A): Task<A> => () => Promise.resolve(a),
  ap: <A, B>(fab: Task<(a: A) => B>, fa: Task<A>): Task<B> => () =>
    Promise.all([fab(), fa()]).then(([f, a]) => f(a))
}


//  使用Applicative解決問題we now write liftA2
type Curried2<B, C, D> = (b: B) => (c: C) => D
// 該函數接受一個參數 B，然後返回一個函數，該函數接受一個參數 C，最終返回 D
function liftA2<F>(
  F: Apply<F>
): <B, C, D>(g: Curried2<B, C, D>) => Curried2<HKT<F, B>, HKT<F, C>, HKT<F, D>> {
  return g => fb => fc => F.ap(F.map(fb, g), fc)
//   我們首先接受 g，然後返回一個函數，該函數接受 fb，再返回一個函數，該函數接受 fc。最後，我們在函數體內使用 F.ap 和 F.map 方法來將 g 中的函數應用於 fb 和 fc 中的值，然後返回結果。
}