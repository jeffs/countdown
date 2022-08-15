import React from "react";

import "./Solver.css";

const TILE_COUNT = 6;

function Dialog() {
  return (
    <dialog className="solver__dialog" open>
      Hello, dialog.
    </dialog>
  );
}

interface TileProps {
  id: number;
  value?: number;
}

function Tile({ id, value }: TileProps) {
  function handleClick(event: React.MouseEvent) {
    alert(value);
  }

  return (
    <button
      className="solver__tile"
      onClick={handleClick}
      title={`Tile #${id}`}
    >
      {value}
    </button>
  );
}

function Row() {
  const [values, setValues] = React.useState<Array<number | undefined>>(
    Array(TILE_COUNT).fill(undefined)
  );

  return (
    <div className="solver__row">
      {values.map((value, index) => (
        <Tile id={index + 1} key={index} value={value} />
      ))}
    </div>
  );
}

export default function Solver() {
  return (
    <>
      <h1>Solver</h1>
      <Row />
      <Dialog />
    </>
  );
}
