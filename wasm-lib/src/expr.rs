#![allow(dead_code, unused_imports)]

use std::fmt;

// We begin with a set of six values.  Each operation we apply replaces two
// expressions with a single result, reducing the cardinality by one.  We
// therefore never have more than six expressions in a set.
const SET_CAPACITY: usize = 6;

pub struct Set {
    // Each usize is the position of an Expr in a cache.  Sorted by Expr (not
    // usize) value.
    exprs: [usize; SET_CAPACITY],
    size: usize,
}

impl Set {
    fn slice(&self) -> &[usize] {
        &self.exprs[0..self.size]
    }
}

impl PartialEq for Set {
    fn eq(&self, other: &Set) -> bool {
        self.slice() == other.slice()
    }
}

#[derive(Clone, Copy, Eq, Hash, PartialEq)]
pub enum Expr {
    Val(i32),
    Add(usize, usize),
    Sub(usize, usize),
    Mul(usize, usize),
    Div(usize, usize),
}
