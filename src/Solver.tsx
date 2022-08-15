import "./Solver.css";

function Tile(props: { value: number }) {
  return <button>{props.value}</button>;
}

function Row() {
  return (
    <div className="row">
      <Tile value={1} />
      <Tile value={2} />
    </div>
  );
}

export default function Solver() {
  return (
    <>
      <h1>Solver</h1>
      <Row />
    </>
  );
}
