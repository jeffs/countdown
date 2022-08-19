use wasm_bindgen::prelude::*;

#[wasm_bindgen]
pub fn solve(target: i32, values: &[i32]) -> String {
    format!("TODO: solve({target}, {values:?})")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn solve() {
        panic!("TODO")
    }
}
