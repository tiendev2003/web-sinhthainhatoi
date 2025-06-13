import { Link } from "react-router-dom";
import styles from "./styles.module.css";
import axios from "axios";
import { useEffect } from "react";
function PaymentSuccess() {
    const queryString = window.location.search;

    // Tạo một đối tượng URLSearchParams để phân tích chuỗi query parameters
    const params = new URLSearchParams(queryString);

    // Lấy giá trị của tham số có tên là 'vnp_ResponseCode'
    const vnpResponseCode = params.get("vnp_ResponseCode");
    useEffect(() => {
        async function callIPN() {
            try {
                await axios.get(`api/payment/vnpay_ipn${queryString}`);
            } catch (error) {
                console.log(error);
            }
        }
        callIPN();
    }, []);
    console.log(queryString);
    if (vnpResponseCode === "00")
        return (
            <div className={styles.container}>
                <img width={"255px"} src="/images/success.png" alt="success_img" />
                <h1>Thanh toán thành công!</h1>
                <Link to="/">
                    <button className={styles.green_btn}>Về trang chủ</button>
                </Link>
            </div>
        );
    else
        return (
            <div className={styles.container}>
                <img width={"255px"} src="/images/failed.png" alt="failed_img" />
                <h1>Thanh toán thất bại!</h1>
                <Link to="/">
                    <button className={styles.green_btn}>Về trang chủ</button>
                </Link>
            </div>
        );
}

export default PaymentSuccess;
