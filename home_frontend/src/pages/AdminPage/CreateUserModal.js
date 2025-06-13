import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Dialog from "@mui/material/Dialog";
import { styled } from "@mui/system";
import { Box, Typography } from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { HotelState } from "../../components/MyContext/MyContext";
import { useDispatch, useSelector } from "react-redux";
import { getUserList } from "../../redux/slices/userSlice";

const StyledBox = styled(Box)({
    boxShadow: "0px 1px 69.16px 6.84px rgba(20,64,51,0.05)",

    borderRadius: "10px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: "20px",
    margin: "0",
});
const StyledTextField = styled("input")`
    height: 45px;
    padding: 0 20px;
    color: #333;
    line-height: 45px;
    border: 1px solid #e1e1e1 !important;
    box-shadow: none;
    background: #fff;
    margin-bottom: 15px;
    width: 100%;
    outline: none;
    border: initial;
    font-size: 1.4rem;
`;

function SimpleDialog(props) {
    const isAdmin = useSelector((state) => state.auth.user.role) === "admin";

    const { onClose, selectedValue, open } = props;

    const handleClose = () => {
        onClose(selectedValue);
    };

    const [lastName, setLastName] = useState("");
    const [firstName, setFirstName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const handleChangeLastName = (event) => {
        setLastName(event.target.value);
    };
    const handleChangeFirstName = (event) => {
        event.preventDefault();
        setFirstName(event.target.value);
    };

    const handleChangeEmail = (event) => {
        setEmail(event.target.value);
    };
    const handleChangePhone = (event) => {
        setPhone(event.target.value);
    };
    const handleChangePassword = (event) => {
        setPassword(event.target.value);
    };
    const { setAlert } = HotelState();
    const dispatch = useDispatch();
    const handleSubmit = async (event) => {
        event.preventDefault();

        const response = await axios.post("api/auth/register", {
            lastName,
            firstName,
            email,
            phone,
            password,
            role,
        });
        if (response.status === 200) {
            handleClose();
            setLastName("");
            setFirstName("");
            setEmail("");
            setPassword("");
            setPhone("");
            setRole("");
            async function getListUser() {
                const response = await axios.get("auth/admin/user");
                dispatch(getUserList([...response.data]));
            }

            getListUser();
            setAlert({
                open: true,
                message: "Đã tạo tài khoản thành công!",
                type: "success",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        } else if (response.status === 201) {
            setAlert({
                open: true,
                message: response.data.title,
                type: "error",
                origin: { vertical: "bottom", horizontal: "center" },
            });
        }
    };

    const [role, setRole] = useState("");

    const handleChange = (event) => {
        setRole(event.target.value);
    };

    return (
        <Dialog sx={{ margin: "0" }} onClose={handleClose} open={open}>
            <Typography variant="h5" sx={{ textAlign: "center", marginTop: "20px" }} fontSize="2rem">
                Create new user
            </Typography>
            <StyledBox
                sx={{ width: { lg: "30vw", md2: "40vw", md: "40vw", sm: "100vw", xs: "100vw" } }}
                onSubmit={handleSubmit}
                component="form"
                autoComplete="off"
            >
                <StyledTextField
                    id="last-name"
                    name="last-name"
                    placeholder="Họ"
                    onChange={handleChangeLastName}
                    value={lastName}
                    autoComplete="false"
                    required
                />
                <StyledTextField
                    id="first-name"
                    name="first-name"
                    placeholder="Tên"
                    value={firstName}
                    autoComplete="false"
                    onChange={handleChangeFirstName}
                    required
                />
                <StyledTextField
                    id="email"
                    name="email"
                    placeholder="Email"
                    type="email"
                    value={email}
                    autoComplete="false"
                    onChange={handleChangeEmail}
                    required
                />
                <StyledTextField
                    id="phone"
                    name="phone"
                    placeholder="Số điện thoại"
                    value={phone}
                    onChange={handleChangePhone}
                    autoComplete="false"
                    required
                />
                <StyledTextField
                    id="password"
                    name="password"
                    autoComplete="current-password"
                    placeholder="Mật khẩu"
                    type="password"
                    value={password}
                    onChange={handleChangePassword}
                    required
                />

                <FormControl disabled={!isAdmin} fullWidth sx={{ marginBottom: "20px" }}>
                    <InputLabel id="demo-simple-select-label">Quyền</InputLabel>
                    <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={role}
                        label="Quyền"
                        onChange={handleChange}
                    >
                        <MenuItem value="admin">Admin</MenuItem>
                        <MenuItem value="subadmin">Subadmin</MenuItem>
                        <MenuItem value="regular">Regular</MenuItem>
                    </Select>
                </FormControl>

                <Button variant="contained" type="submit" sx={{ fontSize: "1.6rem" }}>
                    thêm mới
                </Button>
            </StyledBox>
        </Dialog>
    );
}

SimpleDialog.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    selectedValue: PropTypes.string.isRequired,
};

export default function CreateUserDialog() {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = (value) => {
        setOpen(false);
    };

    return (
        <div>
            <Button variant="contained" onClick={handleClickOpen} sx={{ marginRight: "20px", fontSize: "1.6rem" }}>
                Tạo tài khoản
            </Button>
            <SimpleDialog selectedValue="none" open={open} onClose={handleClose} />
        </div>
    );
}
