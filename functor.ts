// 現在回到我們的主要問題
// 我們如何組合兩個通用函數f: (a: A) => B和g: (c: C) => D？

// 由於一般問題很棘手，我們需要對和施加一些約束。BC
// 我們已經知道如果B = C那麼解就是通常的函數組合

// compose_ 函數接受兩個函數 g 和 f 作為參數，它們的型別分別是 (b: B) => C 和 (a: A) => B。
// compose_ 函數的返回型別是 (a: A) => C，這意味著它返回一個新的函數，該函數接受一個 A 型別的參數，並返回一個 C 型別的結果。
function compose_<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
    return a => g(f(a))
}

// 其中約束B = F<C>導致函子functors (函子是保留類別結構的類別之間的映射，即保留恆等態射和組合。)
// 因此functors可以說是
    // 它具有一個 map 方法。
    // map 方法接受一個函數作為參數，並將這個函數應用於容器內的值。
    // map 方法返回一個新的相同型別的容器，其中包含映射後的值。

//當f=Array
function lift<B, C>(g: (b: B) => C): (fb: Array<B>) => Array<C> {
    return fb => fb.map(g)
}

// lift 函數接受一個函數 g，該函數的型別是 (b: B) => C，表示它將一個 B 型別的值映射到一個 C 型別的值。
// lift 函數的返回型別是 (fb: Array<B>) => Array<C>，這意味著它返回一個新的函數，該函數接受一個 Array<B>（fb），並返回一個新的 Array<C>。
// 在函數體內，它定義了這個新函數的行為。這個新函數接受一個陣列 fb，然後使用 map 函數將函數 g 映射到 fb 中的每個元素上，從而產生一個新的 Array<C>。


import { Option, isNone, none, some } from 'fp-ts/Option'
//當f=Option
function lift1<B, C>(g: (b: B) => C): (fb: Option<B>) => Option<C> {
  return fb => (isNone(fb) ? none : some(g(fb.value)))
}
import { Task } from 'fp-ts/Task'
//當f=Task
function lift2<B, C>(g: (b: B) => C): (fb: Task<B>) => Task<C> {
  return fb => () => fb().then(g)
}
