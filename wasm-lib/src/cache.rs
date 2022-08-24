#![allow(dead_code)]

use std::collections::HashMap;
use std::hash::Hash;

pub struct Cache<T> {
    vec: Vec<T>,
    map: HashMap<T, usize>,
}

impl<T: Eq + Hash> Cache<T> {
    pub fn new() -> Cache<T> {
        Cache {
            vec: Vec::new(),
            map: HashMap::new(),
        }
    }

    pub fn position(&mut self, key: T) -> usize {
        if let Some(&index) = self.map.get(&key) {
            index
        } else {
            let index = self.vec.len();
            self.map.insert(key, index);
            index
        }
    }
}
