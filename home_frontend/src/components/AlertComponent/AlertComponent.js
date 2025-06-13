import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { HotelState } from "../MyContext/MyContext";

function AlertComponent() {
    const { alert, setAlert } = HotelState();

    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }
        setAlert({
            open: false,
        });
    };
    console.log(alert.origin);
    return (
        <Snackbar anchorOrigin={alert.origin} open={alert.open} autoHideDuration={4000} onClose={handleClose}>
            <MuiAlert
                elevation={6}
                variant="filled"
                onClose={handleClose}
                severity={alert.type}
                sx={{ width: "100%", fontSize: "1.5rem" }}
            >
                {alert.message}
            </MuiAlert>
        </Snackbar>
    );
}

export default AlertComponent;
