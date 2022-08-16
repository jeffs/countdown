import { ReactNode } from "react";

import "./Card.css";

export default function Card(props: {
  children?: ReactNode;
  className?: string;
  disabled?: boolean;
  header?: string;
}) {
  const className = props.className ? `card ${props.className}` : "card";
  let headerClass = "card__header";
  if (props.disabled) {
    headerClass += " card__header--disabled";
  }
  return (
    <section className={className}>
      {props.header && <h2 className={headerClass}>{props.header}</h2>}
      {props.children}
    </section>
  );
}
