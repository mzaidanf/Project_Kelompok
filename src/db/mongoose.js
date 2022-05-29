const mongoose = require('mongoose')
//use then
mongoose.connect(process.env.MONGODB_URI_DEV || process.env.MONGODB_URI)