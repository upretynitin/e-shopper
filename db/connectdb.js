const mongoose = require('mongoose')

const connectdb = () => {
    // For Local Db
    return mongoose.connect(process.env.LIVE_URL)


        // For cloud db
        // return mongoose.connect(database)

        .then(() => {
            console.log('connection succesfully')
        })
        .catch((error) => {
            console.log(error)
        })
}
module.exports = connectdb