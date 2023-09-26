import Link from "next/link";
export default function ManagerDashboard() {
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
        <Link className="user-button" href="./managerDashboard/createAccount">
          Create User Accounts{" "}
        </Link>{" "}
        <Link className="user-button" href="../inventory">
          Inventory{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
