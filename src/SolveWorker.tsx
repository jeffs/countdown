/** Asynchronous operations for solving Countdown challenges. */
export default interface SolveWorker {
  postChallenge(target: number, values: Array<number>): void;
}
