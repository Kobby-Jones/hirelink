import { Link, useParams } from "react-router-dom";

export default function ThankYou() {
  const { applicationId } = useParams();

  return (
    <div style={{ maxWidth: 900, margin: "40px auto", padding: 16 }}>
      <h2>Thank you!</h2>
      <p>Your application has been submitted successfully.</p>
      <p>
        <strong>Application ID:</strong> {applicationId}
      </p>
      <Link to="/">Back to roles</Link>
    </div>
  );
}
