const galleryModel = require("../models/galleryModel");
const fs = require("fs");

const createGallery = async (req, res) => {
    const reqFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        reqFiles.push("/upload/gallery/" + req.files[i].filename);
    }
    let gallery = [];
    let id;
    const oldGallery = await galleryModel.find();
    if (oldGallery.length > 0) {
        gallery = oldGallery[0].images;
        id = oldGallery[0]._id;
    }

    const newGallery = [...gallery, ...reqFiles];
    console.log(newGallery);
    if (oldGallery.length === 0) {
        const newGalleryModel = new galleryModel({
            images: reqFiles,
        });
        newGalleryModel
            .save()
            .then(() => {
                res.json("new images added!");
            })
            .catch((err) => {
                res.status(400).json(`Error:${err}`);
            });
    } else {
        await galleryModel.findByIdAndUpdate(id, { images: newGallery }, { new: true });
        res.send("new images added!");
    }
};
const getListImages = async (req, res) => {
    const response = await galleryModel.find();

    if (response.length > 0) {
        res.send(response[0].images);
    } else {
        res.send([]);
    }
};
const deleteImages = async (req, res) => {
    let gallery = [];
    let id;
    const image = req.body.path;
    const imageRemove = "." + image;
    

    const oldGallery = await galleryModel.find();
    if (oldGallery.length > 0) {
        gallery = oldGallery[0].images;
        id = oldGallery[0]._id;
    }
    const newGallery = gallery.filter((item) => {
        return item !== image;
    });
    
    await galleryModel.findByIdAndUpdate(id, { images: newGallery }, { new: true });
    res.send("delete image succesfully!");
    fs.unlinkSync(imageRemove);
};
module.exports = {
    createGallery,
    getListImages,
    deleteImages,
};
