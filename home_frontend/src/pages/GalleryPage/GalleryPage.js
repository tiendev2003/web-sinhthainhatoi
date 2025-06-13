import axios from "axios";
import { useEffect, useState } from "react";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import LightGallery from "lightgallery/react";

// import styles
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-zoom.css";
import "lightgallery/css/lg-thumbnail.css";

// import plugins if you need
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";
import { Box, styled } from "@mui/system";

function GalleryPage() {
    const [gallery, setGallery] = useState([]);
    useEffect(() => {
        async function getGallery() {
            const res = await axios.get("/api/gallery/list");
            setGallery(res.data);
        }
        getGallery();
    }, []);
    const StyledImg = styled("img")({});
    const lightGalleryItem = gallery.map((item, index) => {
        return (
            <a key={index} href={`${process.env.REACT_APP_HOST_URL}${item}`}>
                <StyledImg
                    sx={{
                        width: { lg: "25%", md: "50%", sm: "100%", ms: "100%", xs: "100%" },
                        height: { lg: "250px", md: "350px", sm: "500px", ms: "250px", xs: "250px" },
                        padding: "5px",
                        borderRadius: "15px",
                        overflow: "hidden",
                    }}
                    alt=""
                    src={`${process.env.REACT_APP_HOST_URL}${item}`}
                />
            </a>
        );
    });
    return (
        <ContainerComponent>
            <Box sx={{ padding: "12px 0" }}>
                <LightGallery speed={500} plugins={[lgThumbnail, lgZoom]}>
                    {lightGalleryItem}
                </LightGallery>
            </Box>
        </ContainerComponent>
    );
}

export default GalleryPage;
