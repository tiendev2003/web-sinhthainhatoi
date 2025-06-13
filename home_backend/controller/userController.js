const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const getListUsers = async (req, res) => {
    try {
        const users = await userModel.find();
        return res.status(200).send(users);
    } catch (error) {
        //gửi mã lỗi để client refresh token
        console.log(error);
    }
};

const deleteUser = async (req, res) => {
    try {
        // delete user
        const userId = req.params.userId;
        await userModel.findByIdAndRemove(userId);
        return res.status(200).send("delete user successfully");
    } catch (error) {
        // log error
    }
};
const updateUser = async (req, res) => {
    try {
        // update user
        const userId = req.params.userId;
        await userModel.findByIdAndUpdate(
            userId,
            {
                lastName: req.body.lastName,
                firstName: req.body.firstName,
                email: req.body.email,
                phone: req.body.phone,
                role: req.body.role,
            },
            { new: true }
        );
        return res.status(200).send("Update user successfully");
    } catch (error) {}
};

const userUpdateInfo = async (req, res) => {
    const userId = req.userId;
    try {
        await userModel.findByIdAndUpdate(userId, req.body, { new: true });
        return res.status(200).send("Update user successfully");
    } catch (error) {}
};
const userChangePassword = async (req, res) => {
    const userId = req.userId;
    const oldPassword = req.body.oldPass;
    const newPassword = req.body.newPass;
    try {
        const user = await userModel.findById(userId);
        const isPassword = bcrypt.compareSync(oldPassword, user.password);
        if (isPassword) {
            await userModel.updateOne({ _id: userId }, { $set: { password: bcrypt.hashSync(newPassword) } });
            res.status(200).send("Update user successfully");
        } else {
            res.status(201).send("Mật khẩu cũ không chính xác!");
        }
    } catch (error) {}
};

module.exports = {
    getListUsers,
    deleteUser,
    updateUser,
    userUpdateInfo,
    userChangePassword,
};
