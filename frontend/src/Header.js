import React, { useContext } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./AuthProvider";

export default function Header() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar color="success" position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Lloyds Technology Center
          </Typography>
          <Typography
            variant="subtitle1"
            component="div"
            style={{ padding: "1%", "&:hover": { cursor: "pointer" } }}
            onClick={handleLogout}
          >
            Logout
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
