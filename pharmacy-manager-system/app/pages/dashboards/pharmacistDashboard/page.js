import DashboardBtn from "@/pages/components/DashboardBtn";

export default function PharmacistDashboard() {
  const dashboardNames = ["Test1", "Test2", "Test3"];
  const dashboardDsts = ["/", "/", "/"]; //TODO: Update with actual paths

  const dashboardStyles = {
    marign: "10 auto",

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
    <div
      style={{
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
      }}
    >
      <h1 style={{ textAlign: "center" }}>Pharmacist Dashboard</h1>
      <div style={dashboardStyles}>
        <DashboardBtn name="CheckTest" dst="./pharmacistDashboard/testingPage" />
        <DashboardBtn name="Test 2" dst="/" />
        <DashboardBtn name="Test 3" dst="/" />
        <DashboardBtn name="Test 4" dst="/" />
      </div>
    </div>
  );
}
