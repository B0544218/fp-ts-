// A category is a pair (Objects, Morphisms) where:
// Objects is a collection of objects
// Morphisms is a collection of morphisms (or arrows) between the objects

// (composition of morphisms) whenever f: A ⟼ B and g: B ⟼ C then g ∘ f: A ⟼ C 
// (associativity) 箭頭的組合必須是結合的。這表示如果有三個箭頭 f, g, 和 h，其中 f 從對象 A 到 B，g 從對象 B 到 C，h 從對象 C 到 D，那麼 (h ∘ g) ∘ f 必須等於 h ∘ (g ∘ f)
// (identity) Category 必須包含一個恆等箭頭，它表示對象自己到自己的恆等關係
// category通常用於描述函數和函數之間的關係
function f(s: string): number {
    return s.length
  }
  
function g(n: number): boolean {
    return n > 2
}

// h = g ∘ f
function h(s: string): boolean {
    return g(f(s))
}



function compose<A, B, C>(g: (b: B) => C, f: (a: A) => B): (a: A) => C {
    return a => g(f(a))
}
// compose 函數接受兩個函數 g 和 f 作為參數，它們的型別分別是 (b: B) => C 和 (a: A) => B。
// compose 函數的返回型別是 (a: A) => C，這意味著它返回一個新的函數，該函數接受一個 A 型別的參數，並返回一個 C 型別的結果