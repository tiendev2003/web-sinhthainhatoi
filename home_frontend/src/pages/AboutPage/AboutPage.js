import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import ContainerComponent from "../../components/ContainerComponent/ContainerComponent";

function AboutPage() {
    return (
        <div style={{ margin: "20px 0" }}>
            <ContainerComponent>
                <Box sx={{ padding: "0 30px" }}>
                    <Typography sx={{ fontWeight: "600", marginBottom: "10px" }} fontSize="1.6rem" variant="h2">
                        VỀ CHÚNG TÔI
                    </Typography>
                    <Typography sx={{ marginBottom: "15px" }} fontSize="1.4rem">
                        Là khu sinh thái tọa lạc tại trung tâm của Thái Nguyên.
                        <img src="/images/about_1_nhatio.jpg" alt="" width="100%" style={{ marginTop: "15px" }} />
                    </Typography>
                    <Typography sx={{ marginBottom: "15px" }} fontSize="1.4rem">
                        Khu sinh thái Nhà Tôi Thái Nguyên đi vào hoạt động từ tháng 6/2018 với mô hình ban đầu chỉ là một không gian ẩm thực - sinh thái, có vườn cây, ao cá, có những món ăn mang hương vị ba miền, được các đầu bếp thể hiện mang đặc trưng của núi rừng Việt Bắc. Tuy nhiên trong quá trình hoạt động nhận thấy được nhu cầu ngày càng lớn của du khách, mỗi vị khách đến đây không chỉ muốn thưởng thức ẩm thực mà còn muốn được vui chơi và nghỉ dưỡng. Chính vì lẽ đó mà khu sinh thái Nhà tôi đã từng bước mở rộng, nâng cấp và hoàn thiện nhiều dịch vụ mới, đáp ứng được đúng theo tên gọi “khu sinh thái”.

Theo chia sẻ của anh Khánh, quản lý của cơ sở, hiện tại Khu sinh thái Nhà Tôi có tổng diện tích khoảng gần 10 ha, được chia thành các khu như: Khu vực nhà hàng gồm hệ thống phòng ăn trong nhà và phòng ăn bên ngoài; khu nhà nghỉ với hệ thống phòng nghỉ riêng (khoảng 10 phòng) và khu nhà nghỉ cộng đồng (sức chứa khoảng 40 khách); khu trải nghiệm tham gia các hoạt động team building; khu bể bơi; khu cafe.
                    </Typography>
                    <Typography sx={{ marginBottom: "15px" }} fontSize="1.4rem">
                        <strong>Khu sinh thái Nhà Tôi</strong> tích hợp đầy đủ tất cả các dịch vụ cho Quý khách có một chuyến công
                        tác hoặc kỳ nghỉ thật sự tiện ích như nhà hàng, phòng hội nghị, hồ bơi, dịch vụ đón tiễn sân
                        bay, các tour du lịch, chơi golf, vé máy bay với chất lượng tốt nhất do những nhân viên chuyên
                        nghiệp của khách sạn đảm nhiệm . Đảm bảo tuyệt đối chất lượng dịch vụ do khách sạn cung cấp là
                        cam kết hàng đầu của chúng tôi. Điều này góp phần tạo nên sự khác biệt của hệ thống Khách sạn{" "}
                        <strong>Khu sinh thái Nhà Tôi</strong>.
                    </Typography>
                    <Typography sx={{ marginBottom: "15px" }} fontSize="1.4rem">
                        <img src="/images/about_2_nhatoi.jpg" alt="" width="100%" style={{ marginTop: "15px" }} />
                        Đến với Nhà Tôi các du khách sẽ được trải nghiệm một không gian ngập tràn cây xanh, men theo những con dốc thoai thoải ven hồ, tản bộ ngắm cảnh, thoải mái chụp hình tại bất cứ không gian nào. Từng cành cây, khóm hoa trong khu sinh thái đều được chăm sóc một cách tỉ mỉ, những vân gỗ trên lan can của lối đi, con đường dốc xuống… đều được thiết kế sao cho tiện lợi nhất, tạo cho du khách sự gần gũi như là chính ngôi nhà của mình.
                    </Typography>
                    <Typography sx={{ marginBottom: "15px" }} fontSize="1.4rem">
                        Đến với <strong>Khu sinh thái Nhà Tôi</strong> là đến với sư tinh tế nhất về chất lượng, dịch vụ và sự thân
                        thiện như chính ngôi nhà của bạn.
                    </Typography>
                    <Typography
                        sx={{ fontWeight: "600", marginBottom: "10px", fontStyle: "italic" }}
                        fontSize="1.6rem"
                        variant="h2"
                    >
                        HÃY ĐẾN Khu sinh thái Nhà Tôi ĐỂ TRẢI NGHIỆM SỰ KHÁC BIỆT!
                    </Typography>
                </Box>
            </ContainerComponent>
        </div>
    );
}

export default AboutPage;
