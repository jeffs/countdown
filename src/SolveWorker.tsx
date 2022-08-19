/** Asynchronous operations for solving Countdown challenges. */
export default interface SolveWorker {
  addAnswerListener(listener: (target: number, answer: string) => void): void;

  postChallenge(target: number, values: Array<number>): void;
}
