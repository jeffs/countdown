use std::collections::VecDeque;
use std::fmt;
use wasm_bindgen::prelude::*;

#[derive(Clone)]
enum Expr {
    Val(i32),
    Add(Box<Expr>, Box<Expr>),
    Sub(Box<Expr>, Box<Expr>),
    Mul(Box<Expr>, Box<Expr>),
    Div(Box<Expr>, Box<Expr>),
}

impl Expr {
    fn value(&self) -> i32 {
        match self {
            Expr::Val(val) => *val,
            Expr::Add(left, right) => left.value() + right.value(),
            Expr::Sub(left, right) => left.value() - right.value(),
            Expr::Mul(left, right) => left.value() * right.value(),
            Expr::Div(left, right) => left.value() / right.value(),
        }
    }
}

impl fmt::Display for Expr {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match self {
            Expr::Val(val) => write!(f, "{val}"),
            Expr::Add(left, right) => write!(f, "{left} + {right}"),
            Expr::Sub(left, right) => write!(f, "{left} - {right}"),
            Expr::Mul(left, right) => write!(f, "{left} * {right}"),
            Expr::Div(left, right) => write!(f, "{left} / {right}"),
        }
    }
}

enum Op {
    Add,
    Sub,
    Mul,
    Div,
}

impl Op {
    fn apply(&self, x: &Expr, y: &Expr) -> Option<Expr> {
        todo!()
    }

    fn iter() -> impl Iterator<Item = Op> {
        [Op::Add, Op::Sub, Op::Mul, Op::Div].into_iter()
    }
}

// Consider the initial values to be the root of a tree in which each node is
// an unordered list (i.e., a multiset) of expressions.  Perform a breadth
// first search of the tree until either some expression (from a multiset)
// matches the target value, or the tree is exhausted.  In the latter case,
// return an expression having the closest possible value to the target.
//
// Applying any operation to any pair of expressions from a list produces
// either zero or one child list (having one fewer expression than its parent).
// For example, starting from [1, 2, 3, 4, 75, 100], choosing [4, 75], and
// applying addition produces the child list [100, 3, 2, 1, (4 + 75)].
// Applying division would produce no child list, as neither 75 nor 4 is
// divisible by the other.  For the commutative operations (addition and
// multiplication), operands are considered only in sorted order.  For the
// non-commutative operations (subtraction and division), at most one order
// produces a natural value (i.e., a strictly positive) integer, and all other
// values (fractions and non-positive numbers) are disregarded.
#[wasm_bindgen]
pub fn solve(target: i32, values: &[i32]) -> String {
    let root: Vec<Expr> = values.iter().map(|&val| Expr::Val(val)).collect();
    let mut closest = root[0].clone();
    let mut queue: VecDeque<Vec<Expr>> = VecDeque::from([root]);
    while let Some(exprs) = queue.pop_front() {
        if let Some(expr) = exprs
            .iter()
            .find(|expr| expr.value().abs_diff(target) < closest.value().abs_diff(target))
        {
            closest = expr.clone();
        }
        if closest.value() == target {
            return closest.to_string();
        }
        for i in 0..(exprs.len() - 1) {
            for j in (i + 1)..exprs.len() {
                let mut zs = exprs.clone();
                let y = zs.swap_remove(j);
                let x = zs.swap_remove(i);
                for z in Op::iter().flat_map(|op| op.apply(&x, &y)) {
                    let mut child = zs.clone();
                    child.push(z);
                    queue.push_back(child);
                }
            }
        }
    }
    closest.to_string() // We didn't find an exact match.
}
