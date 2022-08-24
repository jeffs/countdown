use std::collections::VecDeque;
use std::fmt;
use wasm_bindgen::prelude::*;

#[derive(Clone)]
pub enum Expr {
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

#[wasm_bindgen]
pub fn solve(target: i32, values: &[i32]) -> String {
    let mut queue: VecDeque<Vec<Expr>> = VecDeque::new();
    let root: Vec<Expr> = values.iter().map(|&val| Expr::Val(val)).collect();
    let mut closest = root[0].clone();
    queue.push_back(root);
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
    }
    closest.to_string() // We didn't find an exact match.
}
