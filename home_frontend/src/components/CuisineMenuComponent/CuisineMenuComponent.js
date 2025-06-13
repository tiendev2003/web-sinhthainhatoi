import Paper from "@mui/material/Paper";
import MenuList from "@mui/material/MenuList";
import MenuItem from "@mui/material/MenuItem";

import { styled } from "@mui/system";
import { Link } from "react-router-dom";
import { Typography } from "@mui/material";
function CuisineMenuComponent() {
    const StyledPaper = styled(Paper)({
        position: "absolute",
        top: "57px",
        left: "0",
        "&::before": {
            content: '""',
            position: "absolute",
            width: "100%",
            height: "30px",
            display: "block",
            backgroundColor: "transparent",
            top: "-30px",
        },
        display: "none",
        zIndex: "2",
    });
    const StyledTypography = styled(Typography)({
        fontSize: "1.6rem",
    });
    return (
        <StyledPaper sx={{ width: 200 }}>
            <MenuList sx={{ padding: 0 }} dense>
                <Link to={"/food"}>
                    <MenuItem>
                        <StyledTypography color="inherit">Món ăn</StyledTypography>
                    </MenuItem>
                </Link>
                <Link to={"/drink"}>
                    <MenuItem>
                        <StyledTypography color="inherit">Đồ uống</StyledTypography>
                    </MenuItem>
                </Link>
            </MenuList>
        </StyledPaper>
    );
}

export default CuisineMenuComponent;
