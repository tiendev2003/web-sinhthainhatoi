const socketIO = require("socket.io");
const userModel = require("../models/userModel");

let io; // Khai báo biến để lưu đối tượng io

module.exports = {
    init: (httpServer) => {
        io = socketIO(httpServer, {
            cors: {
                origin: process.env.BASE_URL,
                methods: ["GET", "POST"],
            },
        });
        io.on("connection", (socket) => {
            console.log("Kết nối với socket.io ", socket.id);
            socket.on("login", async (userId) => {
                // Lưu socketId vào cơ sở dữ liệu (hoặc update nếu đã tồn tại)
                // Ví dụ, sử dụng mongoose
                try {
                    const updatedUser = await userModel.findByIdAndUpdate(
                        userId,
                        { socketId: socket.id },
                        { new: true } // This option makes the method return the updated document
                    );
                    console.log(`Updated socketId for user ${userId}`);
                } catch (error) {
                    console.error(error);
                }
            });

            socket.on("updateSocketId", async (userId) => {
                try {
                    await userModel.findByIdAndUpdate(userId, { socketId: socket.id }, { new: true });
                    console.log(`Updated socketId for user ${userId}`);
                } catch (error) {
                    console.error(error);
                }
            });

            // Xử lý sự kiện ngắt kết nối
            socket.on("disconnect", async () => {
                try {
                    // Xóa socketId khi ngắt kết nối
                    await userModel.updateMany({ socketId: socket.id }, { socketId: null });
                    console.log("Ngắt kết nối với socket.io");
                } catch (error) {
                    console.error(error);
                }
            });
        });
        return io; // Trả về đối tượng io
    },
    getIO: () => {
        if (!io) {
            throw new Error("Socket.io not initialized!");
        }
        return io;
    },
};
