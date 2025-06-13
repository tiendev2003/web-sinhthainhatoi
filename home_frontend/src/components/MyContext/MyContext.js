import { createContext, useContext, useState } from "react";

const Hotel = createContext();
function MyContext({ children }) {
    const [alert, setAlert] = useState({
        open: false,
        message: "",
        type: "success",
        origin: { vertical: "bottom", horizontal: "center" },
    });

    return <Hotel.Provider value={{ alert, setAlert }}>{children}</Hotel.Provider>;
}

export default MyContext;
export const HotelState = () => {
    return useContext(Hotel);
};
