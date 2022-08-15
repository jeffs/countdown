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
  onClick?: () => void;
  value?: number;
}

function Place({ id, onClick, value }: PlaceProps) {
  return (
    <button className="solver__place" onClick={onClick} title={`Place #${id}`}>
      {value}
    </button>
  );
}

interface BoardProps {
  onClick?: (placeId: number) => void;
  values: Array<number | undefined>;
}

function Board({ onClick, values }: BoardProps) {
  return (
    <div className="solver__board">
      {values.map((value, index) => (
        <Place
          id={index + 1}
          key={index}
          onClick={() => onClick?.(index)}
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
      <Board onClick={setPlaceId} values={values} />
      <Dialog
        onChange={handleChange}
        placeId={placeId}
        value={values[placeId]}
      />
    </>
  );
}
