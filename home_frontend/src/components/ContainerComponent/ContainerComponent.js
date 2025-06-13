import { Container } from "@mui/material";
function ContainerComponent({ children }) {
    return (
        <Container
            sx={{
                maxWidth: { lg: "1349px", md: "100%", xs: "100%" },
                width: { md: "100%", xs: "100%" },
                paddingLeft: { md: "12px", xs: "12px" },
                paddingRight: { md2: "14px", md: "14px", xs: "12px" },
            }}
        >
            {children}
        </Container>
    );
}

export default ContainerComponent;
