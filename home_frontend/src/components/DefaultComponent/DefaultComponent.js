import axios from "axios";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginSuccess } from "../../redux/slices/authSlice";
import Footer from "../Footer/Footer";
import Header from "../Header/Header";

function DefaultComponent({ children }) {
    const changeInfo = useSelector((state) => state.user.isChangeInfo);
    const dispatch = useDispatch();
    useEffect(() => {
        async function getUserLogin() {
            try {
                const response = await axios.get("api/auth/me");
                if(response.data){
const user = response.data;
                dispatch(loginSuccess({ ...user }));
                }
                
            } catch (error) {
                console.log(error);
            }
        }

        getUserLogin();
    }, [changeInfo]);
    return (
        <div>
            <Header />
            {children}
            <Footer />
        </div>
    );
}

export default DefaultComponent;
