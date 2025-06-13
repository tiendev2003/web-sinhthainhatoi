import { useEffect, useState, Fragment } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./styles.module.css";

const PasswordReset = () => {
    const [validUrl, setValidUrl] = useState(false);
    const [error, setError] = useState(null);
    const [password, setPassword] = useState("");
    const [passwordRetype, setPasswordRetype] = useState();
    const [msg, setMsg] = useState("");

    const param = useParams();
    const url = `${process.env.REACT_APP_HOST_URL}/api/auth/password-reset/${param.id}/${param.token}`;

    useEffect(() => {
        const verifyUrl = async () => {
            try {
                await axios.get(url);
                setValidUrl(true);
            } catch (error) {
                setValidUrl(false);
            }
        };
        verifyUrl();
    }, [param, url]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password === passwordRetype) {
            try {
                const { data } = await axios.post(url, { password });
                setMsg(data.message);
                setError("");
                window.location = "/login";
            } catch (error) {
                if (error.response && error.response.status >= 400 && error.response.status <= 500) {
                    setError(error.response.data.message);
                    setMsg("");
                }
            }
        } else setError("Passwords do not match");
    };

    return (
        <Fragment>
            {validUrl ? (
                <div className={styles.container}>
                    <form className={styles.form_container} onSubmit={handleSubmit}>
                        <h1>Đặt lại mật khẩu</h1>
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                            value={password}
                            required
                            className={styles.input}
                        />
                        <input
                            type="password"
                            placeholder="Nhập lại mật khẩu"
                            name="password"
                            onChange={(e) => setPasswordRetype(e.target.value)}
                            value={passwordRetype}
                            required
                            className={styles.input}
                        />
                        {error && <div className={styles.error_msg}>{error}</div>}
                        {msg && <div className={styles.success_msg}>{msg}</div>}
                        <button type="submit" className={styles.green_btn}>
                            Xác nhận
                        </button>
                    </form>
                </div>
            ) : (
                <h1>404 Not Found</h1>
            )}
        </Fragment>
    );
};

export default PasswordReset;
