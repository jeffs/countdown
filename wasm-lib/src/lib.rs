use std::collections::{HashMap, VecDeque};
use std::fmt;
use wasm_bindgen::prelude::*;

#[allow(dead_code)]
#[derive(Clone, Copy, Eq, Hash, PartialEq)]
enum Expr {
    Val(i32),
    Add(usize, usize),
    Sub(usize, usize),
    Mul(usize, usize),
    Div(usize, usize),
}

impl fmt::Display for Expr {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Expr::Val(val) => write!(f, "{val}"),
            Expr::Add(left, right) => write!(f, "({left}) + ({right})"),
            Expr::Sub(left, right) => write!(f, "({left}) - ({right})"),
            Expr::Mul(left, right) => write!(f, "({left}) * ({right})"),
            Expr::Div(left, right) => write!(f, "({left}) / ({right})"),
        }
    }
}

// The initial values form the root node of a tree, in which each node is a
// multiset of expressions.  We do a Breadth First Search (BFS) of this tree,
// lazily generating child nodes as we go, until we find a multiset containing
// an expression whose result matches the target; or, until we've exhausted the
// possibilities.
//
//  Collect the initial values into a multiset.
//  Push the initial values into an otherwise empty queue.
//
//  While the queue is not empty:
//      Pop the next multiset from the queue.
//      If any expression in the set matches the target,
//          return the (formatted) expression.
//      If the set contains more than one expression:
//          For each (unordered) pair from the set:
//              Flatmap over the four operators (+-*/) to generate child sets.
//              Add these children to the queue.
//  Return "No solution."
//
// The number of values in Countdown is always 6, but I am reliably informed
// that the trait `FromWasmAbi` is not implemented for `[i32; 6]`.
#[wasm_bindgen]
pub fn solve(_target: i32, values: &[i32]) -> String {
    assert_eq!(values.len(), 6);

    // A vec of all unique expressions, and a map from expressions to their
    // indexes in the vec.
    let mut expr_vec: Vec<Expr> = Vec::new();
    let mut expr_map: HashMap<Expr, usize> = HashMap::new();

    for &val in values {
        let val = Expr::Val(val);
        if !expr_map.contains_key(&val) {
            expr_map.insert(val, expr_vec.len());
            expr_vec.push(val);
        }
    }

    // Queue of multisets.  Each multiset is a vec of indexes into expr_vec.
    let mut queue: VecDeque<Vec<usize>> = VecDeque::new();
    queue.push_back(values.iter().map(|&v| expr_map[&Expr::Val(v)]).collect());

    if let Some(expr_indexes) = queue.pop_front() {
        let strings: Vec<_> = expr_indexes
            .into_iter()
            .map(|i| expr_vec[i])
            .map(|x| x.to_string())
            .collect();
        strings.join("/")

    //     for i in 0..exprs.len() {
    //         for j in (i + 1)..exprs.len() {
    //             let mut new_exprs = Vec::new();
    //             new_exprs.append(&exprs[0..i]);
    //         }
    //     }
    } else {
        "oops".to_string()
    }

    //format!("TODO: solve({target}, {values:?})")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solve_trivial() {
        solve(100, &[100; 6]);
        //assert_eq!(solve(100, &[100; 6]), "100");
    }
}
