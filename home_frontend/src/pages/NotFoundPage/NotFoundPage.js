import { Box, Button, Container, Grid, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

function NotFoundPage() {
    const navigate = useNavigate();
    return (
        <Box
            sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "100vh",
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid xs={6}>
                        <Typography variant="h1">404</Typography>
                        <Typography variant="h6">Trang Không Tồn Tại.</Typography>
                        <Button
                            variant="contained"
                            onClick={() => {
                                navigate("/");window.scrollTo(0, 0);
                            }}
                        >
                            Back Home
                        </Button>
                    </Grid>
                    <Grid xs={6}>
                        <img
                            src="https://cdn.pixabay.com/photo/2017/03/09/12/31/error-2129569__340.jpg"
                            alt=""
                            width={500}
                            height={250}
                        />
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}

export default NotFoundPage;
