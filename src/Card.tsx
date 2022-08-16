import { ReactNode } from "react";

import "./Card.css";

export default function Card(props: {
  children?: ReactNode;
  className?: string;
  header?: string;
}) {
  const className = props.className ? `card ${props.className}` : "card";
  return (
    <section className={className}>
      {props.header && <h2 className="card__header">{props.header}</h2>}
      {props.children}
    </section>
  );
}
