#![allow(dead_code, unused_variables)]

use std::cmp::Ordering;
use std::collections::VecDeque;
use std::fmt;
use wasm_bindgen::prelude::*;

/// Operations are ordered by decreasing precedence, and secondarily by placing
/// operations that produce smaller results (division, subtraction) ahead of
/// those that produce larger ones (multiplication, addition).  Because all of
/// these operations are left-associative, keeping high-precedence operations
/// on the left minimizes the need for parentheses.
#[derive(Clone, Copy, Eq, Ord, PartialEq, PartialOrd)]
enum Op {
    Div,
    Mul,
    Sub,
    Add,
}

impl Op {
    fn apply_add(self, x: &Expr, y: &Expr) -> Option<Expr> {
        todo!()
    }

    fn apply(self, x: &Expr, y: &Expr) -> Option<Expr> {
        assert!(x <= y);
        match self {
            Op::Div => {
                let (xv, yv) = (x.value(), y.value());
                match xv.cmp(&yv) {
                    Ordering::Less => (yv % xv == 0).then(|| self.expr(y, x)),
                    _ => (xv % yv == 0).then(|| self.expr(x, y)),
                }
            }
            Op::Mul => Some(Expr::Op(self, Box::new(x.clone()), Box::new(y.clone()))),
            Op::Sub => match x.value().cmp(&y.value()) {
                Ordering::Less => Some(self.expr(y, x)),
                Ordering::Equal => None,
                Ordering::Greater => Some(self.expr(x, y)),
            },
            Op::Add => Some(self.expr(x, y)),
        }
    }

    fn expr(self, lhs: &Expr, rhs: &Expr) -> Expr {
        Expr::Op(self, Box::new(lhs.clone()), Box::new(rhs.clone()))
    }

    fn iter() -> impl Iterator<Item = Op> {
        [Op::Div, Op::Mul, Op::Sub, Op::Add].into_iter()
    }
}

/// Simple values are ordered ahead of operations so that BFS of the solve tree
/// (below) will find the simplest solutions first.
#[derive(Clone, Eq, Ord, PartialEq, PartialOrd)]
enum Expr {
    Val(i32),
    Op(Op, Box<Expr>, Box<Expr>),
}

impl Expr {
    fn value(&self) -> i32 {
        match self {
            Expr::Val(val) => *val,
            Expr::Op(Op::Div, lhs, rhs) => lhs.value() / rhs.value(),
            Expr::Op(Op::Mul, lhs, rhs) => lhs.value() * rhs.value(),
            Expr::Op(Op::Sub, lhs, rhs) => lhs.value() - rhs.value(),
            Expr::Op(Op::Add, lhs, rhs) => lhs.value() + rhs.value(),
        }
    }
}

impl fmt::Display for Expr {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        // TODO: Elide unnecessary parentheses.
        match self {
            Expr::Val(val) => write!(f, "{val}"),
            Expr::Op(Op::Div, lhs, rhs) => write!(f, "({lhs} / {rhs})"),
            Expr::Op(Op::Mul, lhs, rhs) => write!(f, "({lhs} * {rhs})"),
            Expr::Op(Op::Sub, lhs, rhs) => write!(f, "({lhs} - {rhs})"),
            Expr::Op(Op::Add, lhs, rhs) => write!(f, "({lhs} + {rhs})"),
        }
    }
}

/// Returns an expression combining (some or all of) the specified values to
/// produce the specified target number, or the closest number possible if the
/// target cannot be produced exactly. The only operations used are addition,
/// subtraction, multiplication, and division, and all intermediate values are
/// natural numbers.
#[wasm_bindgen]
pub fn solve(target: i32, values: &[i32]) -> String {
    assert!(!values.is_empty(), "Expected values");

    // If the first specified value happens to match the target exactly, return
    // it. Otherwise, begin tracking the closest expression found so far, so we
    // can return it if we don't manage to compute the target exactly.
    //
    // On the actual Countdown game show, none of the initial values can ever
    // match the target, because the lowest valid target (101) exceeds the
    // highest available input value (100).
    if values[0] == target {
        return values[0].to_string();
    }
    let mut closest = Expr::Val(values[0]);

    // Beginning with the initially specified values, do a Breadth First Search
    // (BFS) of a tree of expression multisets represented as reverse-sorted
    // lists.  Return immediately if we find any expression whose result
    // matches the target.  The children of each node are computed by applying
    // one of the basic binary operations (+, -, *, /) to two of its
    // expressions.  For example, one child of [100, 75, 4, 3, 2, 1] would be
    // [75, 3, 2, 1, 100 / 4].
    let mut queue: VecDeque<Vec<Expr>> = {
        let mut root: Vec<Expr> = values.iter().map(|&val| Expr::Val(val)).collect();
        root.sort();
        VecDeque::from([root])
    };
    while let Some(exprs) = queue.pop_front() {
        if let Some(expr) = exprs
            .iter()
            .find(|expr| expr.value().abs_diff(target) < closest.value().abs_diff(target))
        {
            if expr.value() == target {
                return expr.to_string();
            }
            closest = expr.clone();
        }
        for i in 0..(exprs.len() - 1) {
            for j in (i + 1)..exprs.len() {
                let mut zs = exprs.clone();
                let y = zs.swap_remove(j);
                let x = zs.swap_remove(i);
                queue.extend(Op::iter().flat_map(|op| op.apply(&x, &y)).map(|z| {
                    let mut child = zs.clone();
                    child.push(z);
                    child.sort();
                    child
                }));
            }
        }
    }
    closest.to_string() // We didn't find an exact match.
}

#[cfg(test)]
mod tests {
    use super::*;

    /// This test exercises the case in which an operation is applied to
    /// equivalent expressions.  It catches a regression in which the `apply`
    /// method expected its first argument to be strictly less than its right.
    #[test]
    fn test_solve_issue_981() {
        solve(981, &[50, 100, 6, 7, 6, 8]);
    }

    #[test]
    fn test_solve_trivial() {
        assert_eq!(solve(100, &[100; 6]), "100");
        assert_eq!(solve(100, &[75, 50, 4, 3, 2, 1]), "(2 * 50)");
    }
}
