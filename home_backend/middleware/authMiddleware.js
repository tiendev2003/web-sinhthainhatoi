const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");
const isAuthentication = (req, res, next) => {
    try {
        const bearerHeader = req.headers["authorization"];
        const accessToken = bearerHeader.split(" ")[1];
        const decodedJwt = jwt.verify(accessToken, process.env.SECRET_JWT);
        // set userID to req object

        req.userId = decodedJwt._id;
    } catch (error) {
        // gửi mã lỗi về client để client biết refresh token
        if (error instanceof jwt.TokenExpiredError) {
            return res.status(401).send("Token expired");
        }
        return res.status(401).send("Authentication not valid");
    }
    next();
};

const isAdmin = async (req, res, next) => {
    try {
        const userId = req.userId;
        const user = await userModel.findById(userId);
        // role is admin
        if (user.role === "admin" || user.role === "subadmin") {
            next();
        }
    } catch (error) {
        return res.status(401).send("Authentication not valid");
    }
};

module.exports = {
    isAuthentication: isAuthentication,
    isAdmin: isAdmin,
};
