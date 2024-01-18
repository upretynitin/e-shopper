const jwt = require('jsonwebtoken')
const UserModel = require('../models/User')

const checkauth = async (req, res, next) => {
    // console.log('hello middlewear')
    // token get
    const{token}=req.cookies
    // console.log(token)
    if(!token){
        res
            .status(401)
            .json({ status: "failed", message: "unauthorized user please no token "})
    }else{
        const verifytoken = jwt.verify(token,'nitin123456uprety')
        // for user data show
        const data = await UserModel.findOne({_id:verifytoken.ID})
        // console.log(data)
        req.data1=data
        // console.log(verifytoken)
        next()
    }
}
module.exports = checkauth