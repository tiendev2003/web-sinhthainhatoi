const userModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const Joi = require("joi");
const { log } = require("console");

const register = async (req, res) => {
    try {
        const { lastName, firstName, email, phone, password, role } = req.body;
        // check email duplication
        const duplicateEmail = await userModel.findOne({ email: email });

        if (duplicateEmail === null) {
            // creat data in database
            let user = await new userModel({
                lastName,
                firstName,
                email,
                phone,
                verified:true,
                password: bcrypt.hashSync(password, 10),
                role: role || "regular",
            }).save();

            const token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const url = `${process.env.BASE_URL}/users/${user.id}/verify/${token.token}`;
            await sendEmail(user.email, "Verify Email", url);

            res.status(201).send({ message: "Một email xác thực đã được gửi đến email của bạn vui lòng xác thực!" });
        } else res.status(202).send({ title: "Email đã tồn tại trên hệ thống" });
    } catch (error) {
        console.log(error);
    }
};

const verifyEmail = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });

        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });

        if (!token) return res.status(400).send({ message: "Invalid link" });

        await userModel.updateOne({ _id: user._id }, { verified: true });
        await Token.deleteOne({ _id: token._id });
        res.status(200).send({ message: "Email verified successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// send password link
const sendPasswordLink = async (req, res) => {
    try {
        const emailSchema = Joi.object({
            email: Joi.string().email().required().label("Email"),
        });
        const { error } = emailSchema.validate(req.body);
        if (error) return res.status(400).send({ message: error.details[0].message });

        let user = await userModel.findOne({ email: req.body.email });
        if (!user) return res.status(409).send({ message: "User with given email does not exist!" });

        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
        }

        const url = `${process.env.BASE_URL}/password-reset/${user._id}/${token.token}/`;
        await sendEmail(user.email, "Password Reset", url);

        res.status(200).send({ message: "Password reset link sent to your email account" });
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

// verify password reset link
const verifyResetPasswordLink = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        res.status(200).send("Valid Url");
    } catch (error) {
        res.status(500).send({ message: "Internal Server Error" });
    }
};

//  set new password
const setNewPassword = async (req, res) => {
    try {
        const user = await userModel.findOne({ _id: req.params.id });
        if (!user) return res.status(400).send({ message: "Invalid link" });

        const token = await Token.findOne({
            userId: user._id,
            token: req.params.token,
        });
        if (!token) return res.status(400).send({ message: "Invalid link" });

        if (!user.verified) user.verified = true;

        (user.password = bcrypt.hashSync(req.body.password, 10)), await user.save();
        await Token.deleteOne({ _id: token._id });

        res.status(200).send({ message: "Password reset successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: "Internal Server Error" });
    }
};

const login = async (req, res) => {
    // check email,password

    const user = await userModel.findOne({ email: req.body.email });
    if (!user) {
        return res.status(201).send("Email không tồn tại trên hệ thống!");
    }
    //check password
    const isPassword = bcrypt.compareSync(req.body.password, user.password);
    if (!isPassword) {
        return res.status(201).send("Password bạn vừa nhập không đúng!");
    }

    // Check verified
    if (!user.verified) {
        let token = await Token.findOne({ userId: user._id });
        if (!token) {
            token = await new Token({
                userId: user._id,
                token: crypto.randomBytes(32).toString("hex"),
            }).save();
            const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;
            await sendEmail(user.email, "Verify Email", url);
        }

        return res.status(202).send({ message: "Một email xác thực đã được gửi đến email của bạn vui lòng xác thực!" });
    }

    const jwtToken = jwt.sign(
        {
            _id: user.id,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            phone: user.phone,
            email: user.email,
        },
        process.env.SECRET_JWT,
        {
            expiresIn: "1h",
        }
    );

    return res.status(200).send({
        accessToken: jwtToken,
    });
};

const getUserLogin = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        res.json({
            _id: user._id,
            lastName: user.lastName,
            firstName: user.firstName,
            email: user.email,
            role: user.role,
            phone: user.phone,
        });
    } catch (error) {}
};

module.exports = {
    register,
    verifyEmail,
    login,
    getUserLogin,
    sendPasswordLink,
    setNewPassword,
    verifyResetPasswordLink,
};
