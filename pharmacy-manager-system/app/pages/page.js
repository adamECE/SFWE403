import Link from "next/link";
export default function MainPage() {
  const blockStyle = {
    margin: "10 auto",
    border: "0 ",
    padding: "20px",
    width: "80%",
    justifyContent: "space-between",
    alignItems: "center",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    left: "10%",
  };
  return (
    <div>
      <div style={blockStyle}>
        <Link
          className="user-button"
          href="./pages/dashboards/managerDashboard/"
        >
          My Dashboard{" "}
        </Link>{" "}
        <Link className="user-button" href="./pages/settings">
          My Account Settings{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
