import { ReactNode } from "react";

import "./Card.css";

export default function Card(props: {
  children?: ReactNode;
  className?: string;
}) {
  const className = props.className ? `card ${props.className}` : "card";
  return <section className={className}>{props.children}</section>;
}
