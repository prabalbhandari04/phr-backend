require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')
const morgan = require('morgan')
const multer = require("multer");
const dotenv = require('dotenv');
const swaggerJsDocs = require("swagger-jsdoc");
const swaggerUi = require('swagger-ui-express')
const qrcode = require("qrcode");
const ejs = require("ejs");
var fs = require('fs');
require('colors');
const exp = require("constants");

// Express initiated
const app = express()
app.use(morgan('dev'))
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }));

//SwaggerDocs
const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: "Ayuh API",
            description: "Ayuh API Information",
            contact: {
                name: "Ayuh"
            },
            servers: ["http://localhost:5000"]
        }
    },
    apis: ["./routes/*.js"]
    // apis : ["server.js"]
};

const swaggerDocs = swaggerJsDocs(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
const fileRoutes = require('./routes/fileRouter');
app.use('/user', require('./routes/userRouter'))
app.use('/avatar', require('./routes/avatarRouter'))
app.use('/doctor', require('./routes/doctorRouter'))
app.use('/book', require('./routes/appointmentRouter'))
app.use('/file', require ('./routes/fileRouter'))
app.use('/folder', require ('./routes/folderRouter'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

/** 
 * @swagger 
 * /:
 *   get: 
 *     description: Server testing
 *      content : 
 *          application/json:
 *     responses:  
 *       200: 
 *         description: Success
 *       500:
 *        description: Server Error  
 *   
 */ 
app.get("/", (req, res, next) => {
    res.send("Ayuh backend running in staging environment!");
  });

// qr code
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "view"));

app.use(express.static("public"));


// Connect to mongodb
const URI = process.env.MONGODB_URL
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if(err) throw err;
    console.log(
        `Ayuh database connected.`.green.bold
      );
})

if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))
    app.get('*', (req, res)=>{
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
    })
}

// PORT connected
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
    console.log(
        `Ayuh Server connected at: ${PORT}`.blue.bold);
})