const roomModel = require("../models/roomModel");
const fs = require("fs");
const createRoom = (req, res) => {
    const reqFiles = [];

    for (let i = 0; i < req.files.length; i++) {
        reqFiles.push("/upload/room/" + req.files[i].filename);
    }

    const reqRoomStatus = [];

    if (typeof req.body.roomStatus === "object") {
        for (let i = 0; i < req.body.roomStatus.length; i++) {
            reqRoomStatus.push({
                roomNo: req.body.roomStatus[i],
                bookedDate: [],
                _id: req.body.roomStatus[i],
            });
        }
    } else
        reqRoomStatus.push({
            roomNo: req.body.roomStatus,
            bookedDate: [],
            _id: req.body.roomStatus,
        });

    const newRoomModel = new roomModel({
        roomStatus: reqRoomStatus,
        roomType: req.body.roomType,
        title: req.body.title,
        services: req.body.services,
        adults: req.body.adults,
        children: req.body.children,
        area: req.body.area,
        price: req.body.price,
        cover: reqFiles[0],
        images: reqFiles,
        description: req.body.description,
        bookingCount: 0,
    });
    newRoomModel
        .save()
        .then(() => {
            res.json("new room added!");
        })
        .catch((err) => {
            res.status(201).json(`Error:${err}`);
            req.files.map((file) => {
                fs.unlinkSync(file.path);
            });
        });
};

const editRoom = async (req, res, next) => {
    try {
        const oldImage = req.body.oldImage;
        let oldFile;

        const roomId = req.params.id;
        const oldRoom = await roomModel.findById(roomId);

        const reqFiles = [];
        for (let i = 0; i < req.files.length; i++) {
            reqFiles.push("/upload/room/" + req.files[i].filename);
        }

        const reqRoomStatus = [];
        if (typeof req.body.roomStatus === "object") {
            for (let i = 0; i < req.body.roomStatus.length; i++) {
                reqRoomStatus.push({
                    roomNo: req.body.roomStatus[i],
                    bookedDate: [],
                    _id: req.body.roomStatus[i],
                });
            }
        } else {
            reqRoomStatus.push({
                roomNo: req.body.roomStatus,
                bookedDate: [],
                _id: req.body.roomStatus,
            });
        }

        // Tạo một mảng chứa các roomNo mới từ reqRoomStatus
        const newRoomNos = reqRoomStatus.map((status) => status.roomNo);

        // Tạo mảng chứa các roomNo bị loại bỏ bằng cách so sánh với oldRoom.roomStatus
        const removedRoomNos = oldRoom.roomStatus.filter((status) => !newRoomNos.includes(status.roomNo));

        // Tạo mảng roomStatus mới với bookedDate rỗng cho những roomNo mới, giữ nguyên bookedDate của những roomNo cũ
        const updatedRoomStatus = reqRoomStatus.map((status) => {
            const oldStatus = oldRoom.roomStatus.find((s) => s.roomNo === status.roomNo);
            return {
                roomNo: status.roomNo,
                bookedDate: oldStatus ? oldStatus.bookedDate : [],
                _id: status.roomNo,
            };
        });

        if ((reqFiles.length > 0 && oldImage) || (oldImage && reqFiles.length === 0)) {
            // Xóa các file cũ nếu có file mới hoặc không có file mới như trong hàm gốc
            if (reqFiles.length > 0) {
                oldFile = oldImage.map((image) => "." + image);
                oldFile.map((file) => {
                    fs.unlinkSync(file);
                });
            }

            // Cập nhật roomModel với mảng roomStatus mới
            const response = await roomModel.findByIdAndUpdate(
                roomId,
                {
                    roomStatus: updatedRoomStatus,
                    roomType: req.body.roomType,
                    title: req.body.title,
                    services: req.body.services,
                    adults: req.body.adults,
                    children: req.body.children,
                    area: req.body.area,
                    price: req.body.price,
                    cover: reqFiles.length > 0 ? reqFiles[0] : oldImage[0],
                    images: reqFiles.length > 0 ? reqFiles : oldImage,
                    description: req.body.description,
                },
                { new: true }
            );

            if (response) {
                return res.send("Cập nhật phòng thành công");
            } else {
                return res.status(404).send("Không tìm thấy phòng cần cập nhật");
            }
        } else {
            return res.status(400).send("Yêu cầu không hợp lệ. Hãy cung cấp hình ảnh mới hoặc giữ nguyên hình ảnh cũ.");
        }
    } catch (err) {
        console.error("Lỗi khi cập nhật phòng: ", err);
        res.status(500).send("Đã xảy ra lỗi khi cập nhật phòng");
    }
};

const getRoomList = async (req, res) => {
    let sort = req.query.sort ? req.query.sort : "bookingCount";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "desc";
    }

    try {
        const rooms = await roomModel.find().sort(sortBy);
        return res.status(200).send(rooms);
    } catch (error) {
        //gửi mã lỗi để client refresh token
        console.log(error);
    }
};

const getRoomSingle = async (req, res) => {
    let sort = req.query.sort || "title";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "asc";
    }
    try {
        const singleRoom = await roomModel.find({ roomType: "single" }).sort(sortBy).exec();
        return res.status(200).send(singleRoom);
    } catch (error) {
        //gửi mã lỗi để client refresh token
        console.log(error);
    }
};
const getRoomDouble = async (req, res) => {
    let sort = req.query.sort || "title";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "asc";
    }
    try {
        const doubleRoom = await roomModel.find({ roomType: "double" }).sort(sortBy).exec();
        return res.status(200).send(doubleRoom);
    } catch (error) {
        //gửi mã lỗi để client refresh token
        console.log(error);
    }
};
const getRoomVip = async (req, res) => {
    let sort = req.query.sort || "title";
    req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

    let sortBy = {};
    if (sort[1]) {
        sortBy[sort[0]] = sort[1];
    } else {
        sortBy[sort[0]] = "asc";
    }
    try {
        const vipRoom = await roomModel.find({ roomType: "vip" }).sort(sortBy).exec();
        return res.status(200).send(vipRoom);
    } catch (error) {
        //gửi mã lỗi để client refresh token
        console.log(error);
    }
};

const getRoomDetail = async (req, res) => {
    const id = req.params.id;
    const room = await roomModel.findById(id);
    res.send(room);
};

const deleteRoom = async (req, res) => {
    const roomId = req.params.id;
    const response = await roomModel.findByIdAndRemove(roomId);
    const images = response.images.map((image) => "." + image);
    images.map((file) => {
        fs.unlinkSync(file);
    });
    return res.status(200).send("Xóa phòng thành công!");
};

module.exports = {
    createRoom,
    getRoomList,
    getRoomDetail,
    editRoom,
    deleteRoom,
    getRoomSingle,
    getRoomDouble,
    getRoomVip,
};
