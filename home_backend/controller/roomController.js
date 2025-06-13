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
    console.log("Update room request received", req.body);
    const roomId = req.params.id;
    let imagesToDelete = req.body.imagesToDelete || [];
    let oldImages = req.body.oldImage || [];

    const oldRoom = await roomModel.findById(roomId);
    if (!oldRoom) {
      return res.status(404).send("Không tìm thấy phòng cần cập nhật");
    }

    const newImagePaths = [];
    if (req.files && req.files.length > 0) {
      for (let i = 0; i < req.files.length; i++) {
        newImagePaths.push("/upload/room/" + req.files[i].filename);
      }
    }

    if (imagesToDelete && typeof imagesToDelete === "string") {
      imagesToDelete = [imagesToDelete];
    } else if (!imagesToDelete || !Array.isArray(imagesToDelete)) {
      imagesToDelete = [];
    }

    if (oldImages && typeof oldImages === "string") {
      oldImages = [oldImages];
    } else if (!oldImages || !Array.isArray(oldImages)) {
      oldImages = [];
    }

    if (imagesToDelete.length > 0) {
      imagesToDelete.forEach((imageUrlToDelete) => {
        const filePathToDelete = "." + imageUrlToDelete;
        if (fs.existsSync(filePathToDelete)) {
          try {
            fs.unlinkSync(filePathToDelete);
            console.log(`Successfully deleted file: ${filePathToDelete}`);
          } catch (err) {
            console.error(`Failed to delete file ${filePathToDelete}:`, err);
          }
        } else {
          console.warn(`File not found for deletion: ${filePathToDelete}`);
        }
      });
    }

    let finalImages = [...oldImages, ...newImagePaths];

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

    const newRoomNos = reqRoomStatus.map((status) => status.roomNo);

    const updatedRoomStatus = reqRoomStatus.map((status) => {
      const oldStatus = oldRoom.roomStatus.find(
        (s) => s.roomNo === status.roomNo
      );
      return {
        roomNo: status.roomNo,
        bookedDate: oldStatus ? oldStatus.bookedDate : [],
        _id: status.roomNo,
      };
    });

    const updateData = {
      roomStatus: updatedRoomStatus,
      roomType: req.body.roomType,
      title: req.body.title,
      services: req.body.services,
      adults: req.body.adults,
      children: req.body.children,
      area: req.body.area,
      price: req.body.price,
      cover: finalImages.length > 0 ? finalImages[0] : oldRoom.cover || "",
      images: finalImages,
      description: req.body.description,
    };

    const response = await roomModel.findByIdAndUpdate(roomId, updateData, {
      new: true,
    });

    if (response) {
      return res.send("Cập nhật phòng thành công");
    } else {
      return res.status(404).send("Không tìm thấy phòng cần cập nhật");
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
    const singleRoom = await roomModel
      .find({ roomType: "single" })
      .sort(sortBy)
      .exec();
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
    const doubleRoom = await roomModel
      .find({ roomType: "double" })
      .sort(sortBy)
      .exec();
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
    const vipRoom = await roomModel
      .find({ roomType: "vip" })
      .sort(sortBy)
      .exec();
    return res.status(200).send(vipRoom);
  } catch (error) {
    //gửi mã lỗi để client refresh token
    console.log(error);
  }
};

const getRoomCommunity = async (req, res) => {
  let sort = req.query.sort || "title";
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "asc";
  }
  try {
    const communityRoom = await roomModel
      .find({ roomType: "community" })
      .sort(sortBy)
      .exec();
    return res.status(200).send(communityRoom);
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
  getRoomCommunity,
};
