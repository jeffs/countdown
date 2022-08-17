import { ChangeEvent, MouseEvent, useEffect, useState } from "react";

import Card from "./Card";

import "./Solver.css";

const PLACE_COUNT: number = 6;

function ChooserRow(props: {
  disabled?: boolean;
  numbers: Array<number>;
  onChange: (value: number) => void;
}) {
  return (
    <div className="solver__chooser_row">
      {props.numbers.map((value, index) => (
        <button
          autoFocus={value === 100}
          className="solver__chooser_value"
          disabled={props.disabled}
          key={index}
          onClick={() => props.onChange(value)}
        >
          {value}
        </button>
      ))}
    </div>
  );
}

function Chooser(props: {
  disabled?: boolean;
  onChange: (value: number) => void;
}) {
  return (
    <Card
      disabled={props.disabled}
      className="solver__chooser"
      header="Available tiles"
    >
      <ChooserRow numbers={[100, 75, 50, 25]} {...props} />
      <ChooserRow numbers={[10, 9, 8, 7, 6]} {...props} />
      <ChooserRow numbers={[5, 4, 3, 2, 1]} {...props} />
    </Card>
  );
}

function Place(props: {
  id: number;
  isCurrent?: boolean;
  onClick?: () => void;
  value?: number;
}) {
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

function Board(props: {
  onClick?: (placeID: number) => void;
  placeID?: number;
  values: Array<number | undefined>;
}) {
  return (
    <Card className="solver__board" header="Chosen tiles">
      <div className="solver__places">
        {props.values.map((value, index) => (
          <Place
            id={index + 1}
            key={index}
            onClick={() => props.onClick?.(index)}
            isCurrent={index === props.placeID}
            value={value}
          />
        ))}
      </div>
    </Card>
  );
}

function Target(props: {
  current?: boolean; // Whether to highlight as an input receiver.
  onChange?: (value?: number) => void;
  onFocus?: () => void;
  value?: number;
}) {
  let inputRef: HTMLInputElement | null;
  useEffect(() => {
    if (props.current) {
      inputRef?.focus();
    }
  }, [props.current]);

  let inputClass = "solver__target_input";
  if (props.current) {
    inputClass += " solver__target_input--current";
  }

  let handleChange;
  if (props.onChange) {
    const onChange = props.onChange as (value?: number) => void;
    handleChange = function handleChange(event: ChangeEvent<HTMLInputElement>) {
      const text = event.target.value.trim();
      if (text.length > 3) {
        return;
      } else if (text.length === 0) {
        onChange(undefined);
      } else {
        const value = parseInt(text);
        if (isNaN(value)) {
          return;
        }
        onChange(value);
      }
    }
  }

  return (
    <Card header="Target">
      <div className="solver__target_content">
        <input
          className={inputClass}
          onChange={handleChange}
          onFocus={props.onFocus}
          placeholder="???"
          ref={(elem) => {
            inputRef = elem;
          }}
          inputMode="numeric"
          pattern="[1-9][0-9][0-9]"
          value={props.value ?? ""}
        />
      </div>
    </Card>
  );
}

// At any time, input may be directed to either Places (which hold tile
// values), or the Target (which holds the three-digit numeric goal).
enum ReceiverKind {
  Place,
  Target,
}

interface ReceiverPlace {
  kind: ReceiverKind.Place;
  id: number;
}

interface ReceiverTarget {
  kind: ReceiverKind.Target;
}

// Descriptor indicating which control will receive input.
type Receiver = ReceiverPlace | ReceiverTarget;

export default function Solver() {
  const [receiver, setReceiver] = useState<Receiver>({
    kind: ReceiverKind.Place,
    id: 0,
  });

  const [target, setTarget] = useState<number>();

  const [values, setValues] = useState<Array<number | undefined>>(
    Array(PLACE_COUNT).fill(undefined)
  );

  function handleChoice(value: number) {
    switch (receiver.kind) {
      case ReceiverKind.Place:
        const newValues = [...values];
        newValues[receiver.id] = value;
        setValues(newValues);
        setReceiver(
          receiver.id + 1 < PLACE_COUNT
            ? { kind: ReceiverKind.Place, id: receiver.id + 1 }
            : { kind: ReceiverKind.Target }
        );
        break;
      case ReceiverKind.Target:
        console.warn("Tile chosen, but receiver is Target, not a Place.");
        break;
    }
  }

  function handleBoardClick(id: number) {
    setReceiver({ kind: ReceiverKind.Place, id });
  }

  function handleTargetFocus() {
    setReceiver({ kind: ReceiverKind.Target });
  }

  function handleTargetChange(value?: number) {
    setTarget(value);
  }

  return (
    <div className="solver">
      <h1>Solver</h1>
      {receiver.kind === ReceiverKind.Place ? (
        <>
          <Target
            onChange={handleTargetChange}
            onFocus={handleTargetFocus}
            value={target}
          />
          <Board
            onClick={handleBoardClick}
            placeID={receiver.id}
            values={values}
          />
          <Chooser onChange={handleChoice} />
        </>
      ) : (
        <>
          <Target
            current
            onChange={handleTargetChange}
            onFocus={handleTargetFocus}
            value={target}
          />
          <Board onClick={handleBoardClick} values={values} />
          <Chooser disabled onChange={handleChoice} />
        </>
      )}
    </div>
  );
}
