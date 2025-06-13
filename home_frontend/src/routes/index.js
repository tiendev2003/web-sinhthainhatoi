import AboutPage from "../pages/AboutPage/AboutPage";
import AccountPage from "../pages/AccountPage/AccountPage";
import InfoChange from "../pages/AccountPage/InforChange";
import PasswordChange from "../pages/AccountPage/passwordChange";
import AdminBillPage from "../pages/AdminPage/AdminBillPage";
import AdminBookingPage from "../pages/AdminPage/AdminBookingPage";
import AdminContactPage from "../pages/AdminPage/AdminContactPage";
import AdminCuisineDetail from "../pages/AdminPage/AdminCuisineDetail";
import AdminCuisineEdit from "../pages/AdminPage/AdminCuisineEdit";
import AdminCuisinePage from "../pages/AdminPage/AdminCuisinePage";
import AdminGalleryPage from "../pages/AdminPage/AdminGalleryPage";
import AdminOrderPage from "../pages/AdminPage/AdminOrderpage";
import AdminPage from "../pages/AdminPage/AdminPage";
import AdminRoomDetail from "../pages/AdminPage/AdminRoomDetail";
import AdminRoomEdit from "../pages/AdminPage/AdminRoomEdit";
import AdminRoomPage from "../pages/AdminPage/AdminRoomPage";
import AdminUploadImage from "../pages/AdminPage/AdminUploadImage";
import AdminUserPage from "../pages/AdminPage/AdminUserPage";
import CreateRoom from "../pages/AdminPage/CreateRoom";
import CuisineCreate from "../pages/AdminPage/CuisineCreate";
import BookingPage from "../pages/BookingPage/BookingPage";
import ContactPage from "../pages/ContactPage/ContactPage";
import CuisineDetailPage from "../pages/CuisineDetailPage/CuisineDetailPage";
import CuisinePage from "../pages/CuisinePage/CuisinePage";
import DoubleRoom from "../pages/DoubleRoom/DoubleRoom";
import DrinkPage from "../pages/DrinkPage/DrinkPage";
import FoodPage from "../pages/FoodPage/Foodpage";
import GalleryPage from "../pages/GalleryPage/GalleryPage";
import HomePage from "../pages/HomePage/HomePage";
import Login from "../pages/Login/Login";
import NotFoundPage from "../pages/NotFoundPage/NotFoundPage";
import OrderPage from "../pages/OrderPage/OrderPage";
import Register from "../pages/Register/Register";
import RoomDetailPage from "../pages/RoomDetailPage/RoomDetailpage";
import RoomPage from "../pages/RoomPage/RoomPage";
import SingleRoom from "../pages/SingleRoom/SingleRoom";
import VipRoom from "../pages/VipRoom/VipRoom";
import EmailVerify from "../pages/EmailVerify/EmailVerify";
import ForgotPassword from "../pages/ForgotPassword";
import PasswordReset from "../pages/PasswordReset";
import NotificationPage from "../pages/NotificationPage/NotificationPage";
import PaymentSuccess from "../pages/PaymentSuccess/PaymentSuccess";
import BookingDetailPage from "../pages/BookingDetailPage/BookingDetailPage";
import AdminNotificationPage from "../pages/AdminPage/AdminNotificationPage";
import OrderDetailPage from "../pages/OrderDetailPage/OrderDetailPage";
export const routes = [
    {
        path: "/",
        page: HomePage,
        isShowHeader: true,
    },

    {
        path: "/cuisine",
        page: CuisinePage,
        isShowHeader: true,
    },
    {
        path: "/cuisine/:id",
        page: CuisineDetailPage,
        isShowHeader: true,
    },
    {
        path: "/room",
        page: RoomPage,
        isShowHeader: true,
    },
    {
        path: "/room/:id",
        page: RoomDetailPage,
        isShowHeader: true,
    },
    {
        path: "/booking/:id",
        page: BookingDetailPage,
        isShowHeader: true,
    },
    {
        path: "/order/:id",
        page: OrderDetailPage,
        isShowHeader: true,
    },
    {
        path: "/about",
        page: AboutPage,
        isShowHeader: true,
    },
    {
        path: "/single-room",
        page: SingleRoom,
        isShowHeader: true,
    },
    {
        path: "/double-room",
        page: DoubleRoom,
        isShowHeader: true,
    },
    {
        path: "/vip-room",
        page: VipRoom,
        isShowHeader: true,
    },
    {
        path: "/food",
        page: FoodPage,
        isShowHeader: true,
    },
    {
        path: "/drink",
        page: DrinkPage,
        isShowHeader: true,
    },

    {
        path: "/contact",
        page: ContactPage,
        isShowHeader: true,
    },
    {
        path: "/gallery",
        page: GalleryPage,
        isShowHeader: true,
    },
    {
        path: "/login",
        page: Login,
        isShowHeader: true,
    },
    {
        path: "/register",
        page: Register,
        isShowHeader: true,
    },
    {
        path: "/admin",
        page: AdminPage,
    },
    {
        path: "/admin/notification",
        page: AdminNotificationPage,
    },
    {
        path: "/admin/booking/:id",
        page: AdminBookingPage,
    },
    {
        path: "/admin/user",
        page: AdminUserPage,
    },
    {
        path: "/admin/room",
        page: AdminRoomPage,
    },
    {
        path: "/admin/room/create",
        page: CreateRoom,
    },
    {
        path: "admin/room/:id",
        page: AdminRoomDetail,
    },
    {
        path: "admin/room/edit/:id",
        page: AdminRoomEdit,
    },
    {
        path: "admin/cuisine/",
        page: AdminCuisinePage,
    },
    {
        path: "admin/cuisine/create",
        page: CuisineCreate,
    },
    {
        path: "admin/cuisine/detail/:id",
        page: AdminCuisineDetail,
    },
    {
        path: "admin/cuisine/edit/:id",
        page: AdminCuisineEdit,
    },
    {
        path: "admin/booking",
        page: AdminBookingPage,
    },
    {
        path: "admin/order",
        page: AdminOrderPage,
    },
    {
        path: "admin/contact",
        page: AdminContactPage,
    },
    {
        path: "admin/gallery",
        page: AdminGalleryPage,
    },
    {
        path: "admin/gallery/upload",
        page: AdminUploadImage,
    },
    {
        path: "admin/bill/:id",
        page: AdminBillPage,
    },
    {
        path: "/order",
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: "/account",
        page: AccountPage,
        isShowHeader: true,
    },
    {
        path: "/account/infochange",
        page: InfoChange,
        isShowHeader: true,
    },
    {
        path: "/account/passwordchange",
        page: PasswordChange,
        isShowHeader: true,
    },
    {
        path: "/booking",
        page: BookingPage,
        isShowHeader: true,
    },
    {
        path: "/notification",
        page: NotificationPage,
        isShowHeader: true,
    },
    {
        path: "/users/:id/verify/:token",
        page: EmailVerify,
        isShowHeader: false,
    },
    {
        path: "/forgot-password",
        page: ForgotPassword,
        isShowHeader: false,
    },
    {
        path: "/password-reset/:id/:token",
        page: PasswordReset,
        isShowHeader: false,
    },
    {
        path: "/payment-success",
        page: PaymentSuccess,
        isShowHeader: false,
    },
    {
        path: "*",
        page: NotFoundPage,
    },
];
