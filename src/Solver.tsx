import { ChangeEvent, MouseEvent, useState } from "react";

import Card from "./Card";

import "./Solver.css";

const PLACE_COUNT: number = 6;

interface ChooserRowProps {
  numbers: Array<number>;
  onChange: (value: number) => void;
}

function ChooserRow(props: ChooserRowProps) {
  return (
    <div className="solver__chooser_row">
      {props.numbers.map((value, index) => (
        <button
          autoFocus={value === 100}
          className="solver__chooser_value"
          key={index}
          onClick={() => props.onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

interface ChooserProps {
  onChange: (value: number) => void;
}

function Chooser(props: ChooserProps) {
  return (
    <Card className="solver__chooser" header="Available tiles">
      <ChooserRow numbers={[100, 75, 50, 25]} {...props} />
      <ChooserRow numbers={[10, 9, 8, 7, 6]} {...props} />
      <ChooserRow numbers={[5, 4, 3, 2, 1]} {...props} />
    </Card>
  );
}

interface PlaceProps {
  id: number;
  isCurrent?: boolean;
  onClick?: () => void;
  value?: number;
}

function Place(props: PlaceProps) {
  let className = "solver__place";
  let title = `Place #${props.id}`;
  if (props.isCurrent) {
    className += " solver__place--current";
    title += " (current)";
  }
  return (
    <button className={className} onClick={props.onClick} title={title}>
      {props.value}
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
    <Card className="solver__board" header="Chosen tiles">
      <div className="solver__places">
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
    </Card>
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
