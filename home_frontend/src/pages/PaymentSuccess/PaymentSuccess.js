import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";
function PaymentSuccess() {
    const queryString = window.location.search;
    const [redirectPath, setRedirectPath] = useState("/");

    // Tạo một đối tượng URLSearchParams để phân tích chuỗi query parameters
    const params = new URLSearchParams(queryString);

    // Lấy giá trị của tham số có tên là 'vnp_ResponseCode'
    const vnpResponseCode = params.get("vnp_ResponseCode");
    const vnpTxnRef = params.get("vnp_TxnRef");

    useEffect(() => {
        async function callIPN() {
            try {
                await axios.get(`api/payment/vnpay_ipn${queryString}`);
                
                // Lấy thông tin payment để xác định loại thanh toán
                if (vnpTxnRef) {
                    try {
                        const paymentResponse = await axios.get(`/api/payment/info/${vnpTxnRef}`);
                        const paymentInfo = paymentResponse.data;
                        
                        if (paymentInfo.targetType === "tableOrder") {
                            setRedirectPath("/my-table-bookings");
                        } else if (paymentInfo.targetType === "booking") {
                            setRedirectPath("/booking");
                        } else if (paymentInfo.targetType === "order") {
                            setRedirectPath("/order");
                        }
                    } catch (error) {
                        console.log("Could not get payment info:", error);
                        // Fallback to homepage
                        setRedirectPath("/");
                    }
                }
            } catch (error) {
                console.log(error);
            }
        }
        callIPN();
    }, [queryString, vnpTxnRef]);
    console.log(queryString);    if (vnpResponseCode === "00")
        return (
            <div className={styles.container}>
                <img width={"255px"} src="/images/success.png" alt="success_img" />
                <h1>Thanh toán thành công!</h1>
                <Link to={redirectPath}>
                    <button className={styles.green_btn}>
                        {redirectPath === "/my-table-bookings" ? "Về trang đặt bàn" : 
                         redirectPath === "/booking" ? "Về trang đặt phòng" :
                         redirectPath === "/order" ? "Về trang gọi món" : "Về trang chủ"}
                    </button>
                </Link>
            </div>
        );
    else
        return (
            <div className={styles.container}>
                <img width={"255px"} src="/images/failed.png" alt="failed_img" />
                <h1>Thanh toán thất bại!</h1>
                <Link to={redirectPath}>
                    <button className={styles.green_btn}>
                        {redirectPath === "/my-table-bookings" ? "Về trang đặt bàn" : 
                         redirectPath === "/booking" ? "Về trang đặt phòng" :
                         redirectPath === "/order" ? "Về trang gọi món" : "Về trang chủ"}
                    </button>
                </Link>
            </div>
        );
}

export default PaymentSuccess;
