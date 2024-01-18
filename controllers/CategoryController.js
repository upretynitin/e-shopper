const UserModel = require("../models/Category");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");
const CategoryModel = require("../models/Category");

cloudinary.config({
  cloud_name: "ddc3epubs",
  api_key: "433914787825219",
  api_secret: "J0gZRtPMMvc70LUC9QNTlgpBNjI",
});

class CategoryController {
  static categoryinsert = async (req, res) => {
    try {
      const { cname, imagen } = req.body;
      const file = req.files.image;
      const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "categoryimageApi",
      });
      const result = new CategoryModel({
        cname: cname,
        image: {
          public_id: image_upload.public_id,
          url: image_upload.secure_url,
        },
      });
      await result.save();
      res.status(201).json({
        status: "success",
        message: "Category Inserted Successfully 😃🍻",
      });
    } catch (error) {
      console.log(error);
    }
  };

  static categorydisplay = async (req, res) => {
    try {
      const category = await CategoryModel.find();
      // console.log(category);
      res.status(201).json({
        status: "success",
        message: "successfull",
        category,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static categoryview = async (req, res) => {
    try {
      //    console.log(req.params.id);
      const category = await CategoryModel.findById(req.params.id);
      res.status(201).json({
        status: "success",
        message: "successfull",
        category,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static categoryupdate = async (req, res) => {
    try {
      const { cname, image } = req.body;
      if (req.files) {
        // console.log(req.params.id);
        const category = await CategoryModel.findById(req.params.id);
        const imageid = category.image.public_id;
        // console.log(imageid);
        await cloudinary.uploader.destroy(imageid);
        const file = req.files.image;
        const image_upload = await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            folder: "categoryimageApi",
          }
        );
        var data = {
          cname: cname,
          image: {
            public_id: image_upload.public_id,
            url: image_upload.secure_url,
          },
        };
      } else {
        var data = {
          cname: cname,
        };
      }
      const update = await CategoryModel.findByIdAndUpdate(req.params.id, data);
      res.status(201).json({
        status: "success",
        message: "successfull",
        update,
      });
    } catch (error) {
      console.log(error);
    }
  };

  static categorydelete = async (req, res) => {
    try {
      await CategoryModel.findByIdAndDelete(req.params.id);
      res.status(201).json({
        status: "success",
        message: "Delete Successfully",
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = CategoryController;
