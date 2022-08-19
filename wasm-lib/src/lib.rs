use wasm_bindgen::prelude::*;

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
pub fn solve(target: i32, values: &[i32]) -> String {
    assert_eq!(values.len(), 6);

    format!("TODO: solve({target}, {values:?})")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_solve_trivial() {
        assert_eq!(solve(100, &[100; 6]), "100");
    }
}
