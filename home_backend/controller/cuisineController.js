const cuisineModel = require("../models/cuisineModel");
const fs = require("fs"); // Added fs import

const createCuisine = (req, res, next) => {
  const reqFiles = [];
  const url = req.protocol + "://" + req.get("host");
  for (let i = 0; i < req.files.length; i++) {
    reqFiles.push("/upload/cuisine/" + req.files[i].filename);
  }

  // Handle tags properly - ensure it's always an array
  let tags = [];
  if (req.body.tags !== undefined) {
    if (Array.isArray(req.body.tags)) {
      tags = req.body.tags;
    } else if (typeof req.body.tags === 'string') {
      tags = [req.body.tags];
    }
  }

  const newCuisineModel = new cuisineModel({
    type: req.body.type,
    title: req.body.title,
    images: reqFiles,
    listedPrice: req.body.listedPrice,
    promotionalPrice: req.body.promotionalPrice,
    description: req.body.description,
    tags: tags,
    summary: req.body.summary,
  });
  newCuisineModel
    .save()
    .then(() => res.json("new cuisine added!"))
    .catch((err) => res.status(400).json(`Error:${err}`));
};

const getListCusines = async (req, res) => {
  let sort = req.query.sort != null ? req.query.sort : "orderCount";
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);
  let sortBy = {};

  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "desc";
  }

  try {
    const cuisines = await cuisineModel.find().sort(sortBy).exec();
    return res.status(200).send(cuisines);
  } catch (error) {
    //gửi mã lỗi để client refresh token
    console.log(error);
  }
};
const getListFood = async (req, res) => {
  let sort = req.query.sort || "orderCount";
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "desc";
  }
  try {
    const food = await cuisineModel.find({ type: "food" }).sort(sortBy).exec();
    return res.status(200).send(food);
  } catch (error) {
    //gửi mã lỗi để client refresh token
    console.log(error);
  }
};
const getListDrink = async (req, res) => {
  let sort = req.query.sort || "orderCount";
  req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

  let sortBy = {};
  if (sort[1]) {
    sortBy[sort[0]] = sort[1];
  } else {
    sortBy[sort[0]] = "desc";
  }
  try {
    const drinks = await cuisineModel
      .find({ type: "drink" })
      .sort(sortBy)
      .exec();
    return res.status(200).send(drinks);
  } catch (error) {
    //gửi mã lỗi để client refresh token
    console.log(error);
  }
};

const getCuisineDetail = async (req, res) => {
  const cuisineId = req.params.id;
  const cuisine = await cuisineModel.findById(cuisineId);
  res.json(cuisine);
};

const deleteCuisine = async (req, res) => {
  const cuisineId = req.params.id;
  const response = await cuisineModel.findByIdAndRemove(cuisineId);
  const images = response.images.map((image) => "." + image);
  images.map((file) => {
    fs.unlinkSync(file);
  });
  return res.status(200).send("Xóa thành công!");
};
const updateCuisine = async (req, res) => {
    console.log("Update cuisine request received", req.body);
    const cuisineId = req.params.id;
    let imagesToDelete = req.body.imagesToDelete || [];
    let oldImages = req.body.oldImage || [];

    const newImagePaths = [];
    if (req.files && req.files.length > 0) {
        for (let i = 0; i < req.files.length; i++) {
            newImagePaths.push("/upload/cuisine/" + req.files[i].filename);
        }
    }

    // Ensure imagesToDelete is an array
    if (imagesToDelete && typeof imagesToDelete === "string") {
        imagesToDelete = [imagesToDelete];
    } else if (!imagesToDelete || !Array.isArray(imagesToDelete)) {
        imagesToDelete = [];
    }

    // Ensure oldImages is an array
    if (oldImages && typeof oldImages === "string") {
        oldImages = [oldImages];
    } else if (!oldImages || !Array.isArray(oldImages)) {
        oldImages = [];
    }

    try {
        const cuisine = await cuisineModel.findById(cuisineId);
        if (!cuisine) {
            return res.status(404).send("Cuisine not found.");
        }

        // Delete specified images from file system
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

        // Set final images: combine remaining old images with new images
        let finalImages = [...oldImages, ...newImagePaths];

        const updateData = {};
        if (req.body.type !== undefined) updateData.type = req.body.type;
        if (req.body.title !== undefined) updateData.title = req.body.title;
        if (req.body.listedPrice !== undefined)
            updateData.listedPrice = req.body.listedPrice;
        if (req.body.promotionalPrice !== undefined)
            updateData.promotionalPrice = req.body.promotionalPrice;
        if (req.body.description !== undefined)
            updateData.description = req.body.description;
        if (req.body.summary !== undefined) updateData.summary = req.body.summary;
        
        // Handle tags properly - ensure it's always an array
        if (req.body.tags !== undefined) {
            if (Array.isArray(req.body.tags)) {
                updateData.tags = req.body.tags;
            } else if (typeof req.body.tags === 'string') {
                updateData.tags = [req.body.tags];
            } else {
                updateData.tags = [];
            }
        }

        updateData.images = finalImages; // Set the final list of images

        const updatedCuisine = await cuisineModel.findByIdAndUpdate(
            cuisineId,
            updateData,
            { new: true, runValidators: true }
        );
        return res.status(200).send(updatedCuisine);
    } catch (error) {
        console.error("Error updating cuisine:", error);
        if (error.name === "ValidationError") {
            return res.status(400).send(`Validation Error: ${error.message}`);
        }
        return res.status(500).send("Lỗi cập nhật ẩm thực!");
    }
};

module.exports = {
  createCuisine,
  getListCusines,
  getListFood,
  getListDrink,
  getCuisineDetail,
  deleteCuisine,
  updateCuisine,
};
