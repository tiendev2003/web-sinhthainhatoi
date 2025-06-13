import { FormControl, Grid, MenuItem, Pagination, Paper, Select } from "@mui/material";
import { Box } from "@mui/system";
import SortIcon from "@mui/icons-material/Sort";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";
import { useEffect, useState } from "react";
import axios from "axios";

import { useSearchParams } from "react-router-dom";
import CuisineList from "../../components/CuisineList/CuisineList";
function Drink() {
    const [search, setSearch] = useSearchParams();
    const [sortBy, setSortBy] = useState(search.get("sort") ? search.get("sort") : "orderCount,desc");

    useEffect(() => {
        async function getRoom() {
            const drink = await axios.get(`api/cuisine/drink?sort=${sortBy}`);
            setDrink(drink.data);
        }

        getRoom();
    }, [sortBy]);
    const [page, setPage] = useState(1);
    const [drink, setDrink] = useState();

    const handleChange = (event) => {
        setSortBy(event.target.value);
        search.set("sort", event.target.value);
        setSearch(search);
    };
    const count =
        Number(drink?.length % 8) === 0 ? Number(drink?.length / 8) : Math.floor(Number(drink?.length / 8)) + 1;
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
                        <h2 style={{ textTransform: "uppercase", fontSize: "1.8rem" }}>đồ uống</h2>
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
                                    <MenuItem value={"orderCount,desc"}>Xu hướng</MenuItem>
                                    <MenuItem value={"title,asc"}>Tên A → Z</MenuItem>
                                    <MenuItem value={"title,desc"}>Tên Z → A</MenuItem>
                                    <MenuItem value={"promotionalPrice,asc"}>Giá tăng dần</MenuItem>
                                    <MenuItem value={"promotionalPrice,desc"}>Giá giảm dần</MenuItem>
                                </Select>
                            </FormControl>
                        </div>
                    </Paper>
                </Box>
                <Box sx={{ padding: "0 30px", marginBottom: "20px" }}>
                    <Grid container spacing={2}>
                        {drink && <CuisineList cuisine={drink.slice((page - 1) * 8, (page - 1) * 8 + 8)} />}
                    </Grid>
                </Box>
                {Drink && count > 1 && (
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
                        count={count}
                    />
                )}
            </ContainerComponent>
        </>
    );
}

export default Drink;
