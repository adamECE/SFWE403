import Link from "next/link";

export default function CreateAccount() {
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
  const centerStyle = {
    textAlign: "center",
    color: "white",
  };

  return (
    <div>
      <h1> Create Account </h1>{" "}
      <h2 style={centerStyle}> What kind of account do you want to make ? </h2>{" "}
      <div style={blockStyle}>
        <Link className="user-button" href="./createAccount/createUserAccount">
          Staff{" "}
        </Link>{" "}
        <Link
          className="user-button"
          href="./createAccount/createPatientAccount"
        >
          {" "}
          Patient{" "}
        </Link>{" "}
      </div>{" "}
    </div>
  );
}
