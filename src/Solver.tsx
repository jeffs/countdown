import { ChangeEvent, MouseEvent, useState } from "react";

import "./Solver.css";

const PLACE_COUNT: number = 6;

const NUMBERS: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];

interface DialogProps {
  onChange: (value: number) => void;
  placeId: number;
  value?: number;
}

function Dialog(props: DialogProps) {
  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    props.onChange(Number(event.target.value));
  }

  return (
    <div className="solver__dialog">
      <h2>Tile #{props.placeId + 1}</h2>
      {NUMBERS.map((value, index) => (
        <label key={index}>
          <input
            checked={value === props.value}
            name="number"
            value={value}
            onChange={handleChange}
            type="radio"
          />
          {value}
        </label>
      ))}
    </div>
  );
}

interface PlaceProps {
  id: number;
  isCurrent?: boolean;
  onClick?: () => void;
  value?: number;
}

function Place({ id, isCurrent, onClick, value }: PlaceProps) {
  let className = "solver__place";
  let title = `Place #${id}`;
  if (isCurrent) {
    className += " solver__place--current";
    title += " (current)";
  }
  return (
    <button className={className} onClick={onClick} title={title}>
      {value}
    </button>
  );
}

interface BoardProps {
  onClick?: (placeId: number) => void;
  placeId?: number;
  values: Array<number | undefined>;
}

function Board(props: BoardProps) {
  return (
    <div className="solver__board">
      {props.values.map((value, index) => (
        <Place
          id={index + 1}
          key={index}
          onClick={() => props.onClick?.(index)}
          isCurrent={index === props.placeId}
          value={value}
        />
      ))}
    </div>
  );
}

export default function Solver() {
  const [placeId, setPlaceId] = useState<number>(0);
  const [values, setValues] = useState<Array<number | undefined>>(
    Array(PLACE_COUNT).fill(undefined)
  );

  function handleChange(value: number) {
    const newValues = [...values];
    newValues[placeId] = value;
    setValues(newValues);
  }

  return (
    <>
      <h1>Solver</h1>
      <Board onClick={setPlaceId} placeId={placeId} values={values} />
      <Dialog
        onChange={handleChange}
        placeId={placeId}
        value={values[placeId]}
      />
    </>
  );
}
