import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";

import MenuIcon from "@mui/icons-material/Menu";
import LeftList from "../LeftList/LeftList";

export default function LeftDrawer() {
    const [state, setState] = React.useState({ left: false });

    const toggleDrawer = (anchor, open) => (event) => {
        if (event && event.type === "keydown" && (event.key === "Tab" || event.key === "Shift")) {
            return;
        }

        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => (
        <Box sx={{ width: 250 }} role="presentation">
            <LeftList />
        </Box>
    );

    return (
        <div>
            {["left"].map((anchor) => (
                <React.Fragment key={anchor}>
                    <MenuIcon
                        onClick={toggleDrawer(anchor, true)}
                        sx={{
                            fill: "black",
                            width: "26px",
                            height: "24px",
                            marginLeft: "12px",
                        }}
                    />
                    <SwipeableDrawer
                        anchor={anchor}
                        open={state[anchor]}
                        onClose={toggleDrawer(anchor, false)}
                        onOpen={toggleDrawer(anchor, true)}
                    >
                        {list(anchor)}
                    </SwipeableDrawer>
                </React.Fragment>
            ))}
        </div>
    );
}
