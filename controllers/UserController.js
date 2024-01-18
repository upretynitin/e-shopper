const UserModel = require("../models/User");
const bcrypt = require("bcrypt");
const cloudinary = require("cloudinary").v2;
const jwt = require("jsonwebtoken");

cloudinary.config({
  cloud_name: "ddc3epubs",
  api_key: "433914787825219",
  api_secret: "J0gZRtPMMvc70LUC9QNTlgpBNjI",
});

class UserController {
  static getalluser = async (req, res) => {
    try {
      const users = await UserModel.find();
      // console.log(user)
      res.status(201).json({
        status: "success",
        message: "successfull",
        users,
      });
      // res.send('hello user')
    } catch (error) {
      console.log(error);
    }
  };

  static getuserdetails = async (req, res) => {
    try {
      const { id, name, email } = req.data1;
      const user = await UserModel.findById(req.data1.id);
      // console.log(user)
      res.status(201).json({
        status: "success",
        message: "successfull",
        user,
      });
      res.send("hello user");
    } catch (error) {
      console.log(error);
    }
  };

  static userinsert = async (req, res) => {
    try {
      // console.log(req.files.image)
      // console.log(req.body)
      const file = req.files.image;
      // image upload code
      const image_upload = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "profile Image api",
      });
      // console.log(image_upload)
      const { name, email, password, course } = req.body;
      const user = await UserModel.findOne({ email: email });
      if (user) {
        res
          .status(401)
          .json({ status: "success", message: "THIS EMAIL IS ALREADY EXISTS" });
      } else {
        if (name && email && password) {
          const hashpassword = await bcrypt.hash(password, 10);
          const result = new UserModel({
            name: name,
            email: email,
            password: hashpassword,
            course: course,
            image: {
              public_id: image_upload.public_id,
              url: image_upload.secure_url,
            },
          });
          await result.save();
          res.status(201).json({
            status: "success",
            message: "Registration Successfully",
          });
        } else {
          res
            .status(401)
            .json({ status: "failed", message: "ALL FIELD REQUIRED" });
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  static verifylogin = async (req, res) => {
    console.log(req.body);
    try {
      const { email, password } = req.body;
      if (email && password) {
        const user = await UserModel.findOne({ email: email });

        if (user != null) {
          const isMatched = await bcrypt.compare(password, user.password);
          if (isMatched) {
            const token = jwt.sign({ ID: user._id }, "nitin123456uprety");
            // console.log(token)
            res.cookie("token", token);
            res.status(201).json({
              status: "success",
              message: "successful",
              token: token,
              user,
            });
          } else {
            res
              .status(401)
              .json({
                status: "failed",
                message: "email or password is not valid",
              });
          }
        } else {
          res
            .status(401)
            .json({ status: "failed", message: "you are not register user" });
        }
      } else {
        res
          .status(401)
          .json({ status: "failed", message: "all field required" });
      }
    } catch (err) {
      console.log(err);
    }
  };
  static updateprofile = async (req, res) => {
    try {
      // console.log(req.files.image);
      // const { name, email, id } = req.data1;
      if (req.files) {
        const user = await UserModel.findById(req.data1.id);
        const imageid = user.image.public_id;
        // console.log(imageid)
        await cloudinary.uploader.destroy(imageid);
        const file = req.files.image;
        // image upload code
        const image_upload = await cloudinary.uploader.upload(
          file.tempFilePath,
          {
            folder: "profile Image",
          }
        );

        var data = {
          name: req.body.name,
          email: req.body.email,
          image: {
            public_id: image_upload.public_id,
            url: image_upload.secure_url,
          },
        };
      } else {
        var data = {
          name: req.body.name,
          email: req.body.email,
        };
      }

      // update code
      const result = await UserModel.findByIdAndUpdate(req.data1.id, data);

      res.status(200).json({
        success: true,
        message: "profile update successfully",
        result,
      });
    } catch (error) {
      console.log(err);
    }
  };
  static updatepassword = async (req, res) => {
    try {
      // console.log(req.body)
      // const { name, email, id } = req.data1
      const { oldpassword, newpassword, cpassword } = req.body;
      if (oldpassword && newpassword && cpassword) {
        const user = await UserModel.findById(req.data1.id);
        // console.log(user)

        // for password compareing
        const ismatched = await bcrypt.compare(oldpassword, user.password);
        if (!ismatched) {
          res
            .status(401)
            .json({ status: "failed", message: "old password is incorrect" });
        } else {
          if (newpassword != cpassword) {
            res
              .status(401)
              .json({
                status: "failed",
                message: "  Password and confirm password do not match",
              });
          } else {
            const newhashpassword = await bcrypt.hash(newpassword, 10);
            await UserModel.findByIdAndUpdate(req.data1.id, {
              password: newhashpassword,
            });
            res.status(201).json({
              status: 'success',
              message: 'PASSWORD UPDATED SUCCESSFULLY 😃',

          })
          }
        }
      } else {
        return res.status(400).json({
          status: 'failed',
          message: 'All fiels required',
      })
      }
    } catch (error) {
      console.log(error);
    }
  };
  static logout = async (req, res) => {
    try {
      res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true,
      });

      res.status(200).json({
        success: true,
        message: "Logged Out",
      });
    } catch (error) {
      console.log(error);
    }
  };
}

module.exports = UserController;
