import type { ReactNode } from "react";
import { Link } from "react-router-dom";

export default function Layout(props: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  const { title, subtitle, right, children } = props;

  return (
    <div className="container">
      <div className="topbar">
        <div className="brand">
          <h1>{title}</h1>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        <div className="hStack">
          {right}
          <Link
            className="button"
            to="/"
            style={{ fontSize: 13, padding: "7px 14px" }}
          >
            Public
          </Link>
          <Link
            className="button primary"
            to="/admin"
            style={{ fontSize: 13, padding: "7px 14px" }}
          >
            Admin →
          </Link>
          <Link className="button" to="/flowchart">Flowchart</Link>
        </div>
      </div>
      {children}
    </div>
  );
}