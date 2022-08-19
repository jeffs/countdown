/** Asynchronous operations for solving Countdown challenges. */
export default interface SolveWorker {
  postAdd(a: number, b: number): void;
}
