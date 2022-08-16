import { ChangeEvent, MouseEvent, useState } from "react";

import "./Solver.css";

const PLACE_COUNT: number = 6;

//const NUMBERS: Array<number> = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 25, 50, 75, 100];
const BIG_NUMBERS: Array<number> = [100, 75, 50, 25];
const LITTLE_NUMBERS: Array<number> = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1];

interface ChooserProps {
  onChange: (value: number) => void;
}

function Chooser(props: ChooserProps) {
  return (
    <>
      <div className="solver__chooser_row">
        {BIG_NUMBERS.map((value, index) => (
          <button
            className="solver__chooser_value"
            key={index}
            onClick={() => props.onChange(value)}
          >
            {value}
          </button>
        ))}
      </div>
      <div className="solver__chooser_row">
        {LITTLE_NUMBERS.map((value, index) => (
          <button
            className="solver__chooser_value"
            key={index}
            onClick={() => props.onChange(value)}
          >
            {value}
          </button>
        ))}
      </div>
    </>
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
    setPlaceId((placeId + 1) % PLACE_COUNT);
    setValues(newValues);
  }

  return (
    <>
      <h1>Solver</h1>
      <Board onClick={setPlaceId} placeId={placeId} values={values} />
      <Chooser onChange={handleChange} />
    </>
  );
}
