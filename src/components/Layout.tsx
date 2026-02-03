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
          <Link className="button" to="/">
            Public
          </Link>
          <Link className="button" to="/admin">
            Admin
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
