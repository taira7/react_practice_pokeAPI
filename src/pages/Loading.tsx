import CircularProgress from "@mui/material/CircularProgress";

export const Loading = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
      }}
    >
      <CircularProgress size={200} />
    </div>
  );
};
