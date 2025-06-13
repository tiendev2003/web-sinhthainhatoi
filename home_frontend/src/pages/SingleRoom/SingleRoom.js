import { FormControl, Grid, MenuItem, Pagination, Paper, Select } from "@mui/material";
import { Box } from "@mui/system";
import SortIcon from "@mui/icons-material/Sort";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useEffect, useState } from "react";
import axios from "axios";

import { useSearchParams } from "react-router-dom";
import RoomList from "../../components/RoomList/RoomList";
function SingleRoom() {
    const [search, setSearch] = useSearchParams();
    const [sortBy, setSortBy] = useState(search.get("sort") ? search.get("sort") : "bookingCount,desc");

    useEffect(() => {
        async function getRoom() {
            const room = await axios.get(`api/room/single?sort=${sortBy}`);
            setRooms(room.data);
        }

        getRoom();
    }, [sortBy]);
    const [page, setPage] = useState(1);
    const [rooms, setRooms] = useState();

    const handleChange = (event) => {
        setSortBy(event.target.value);
        search.set("sort", event.target.value);
        setSearch(search);
    };

    return (
        <>
            <ContainerComponent>
                <Box sx={{ padding: "0 30px", backgroundColor: "transparent" }}>
                    <Paper
                        sx={{
                            padding: "10px",
                            margin: "20px 0",
                            backgroundColor: "#f7f8f9",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}
                    >
                        <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>Phòng đơn</h2>
                        <div style={{ display: "flex", alignItems: "center" }}>
                            <SortIcon />
                            <span style={{ fontSize: "1.5rem", marginRight: "12px" }}>Sắp xếp: </span>
                            <FormControl size="small" sx={{ border: "none" }}>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={sortBy}
                                    onChange={handleChange}
                                >
                                    <MenuItem value={"bookingCount,desc"}>Xu hướng</MenuItem>
                                    <MenuItem value={"title,asc"}>Tên A → Z</MenuItem>
                                    <MenuItem value={"title,desc"}>Tên Z → A</MenuItem>
                                    <MenuItem value={"price,asc"}>Giá tăng dần</MenuItem>
                                    <MenuItem value={"price,desc"}>Giá giảm dần</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                </Box>
                <Box sx={{ padding: "0 30px", marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                        {rooms && <RoomList rooms={rooms.slice((page - 1) * 4, (page - 1) * 4 + 4)} />}
                    </Grid>
                </Box>
                {rooms && Number((rooms?.length / 8).toFixed(0)) > 1 && (
                    <Pagination
                        sx={{
                            paddimg: 20,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            marginBottom: "20px",
                            "& .MuiPaginationItem-root": {
                                color: "var(--primary-color)",
                            },
                        }}
                        variant="outlined"
                        onChange={(_, value) => {
                            setPage(value);
                        }}
                        shape="rounded"
                        count={Math.floor(Number(rooms?.length / 4)) + 1}
                    />
                )}
            </ContainerComponent>
        </>
    );
}

export default SingleRoom;
