import TextField from "@mui/material/TextField";

export default function SubHeaderComponent() {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <TextField
        id="outlined-basic"
        label="Search"
        variant="outlined"
        size="small"
        style={{ margin: "5px" }}
      />
    </div>
  );
}
