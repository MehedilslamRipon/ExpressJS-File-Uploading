// dependencies
const express = require('express');
const multer = require('multer');
const path = require('path');

const app = express();

// serve static files
app.use(express.static(`${__dirname}/public`));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// file upload folder
const UPLOADS_FOLDER = './uploads';

// define the storage
let storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, UPLOADS_FOLDER);
   },
   filename: (req, file, cb) => {
      const fileExt = path.extname(file.originalname);
      const fileName =
         file.originalname
            .replace(fileExt, '')
            .toLowerCase()
            .split(' ')
            .join('_') +
         '_' +
         Date.now();

      cb(null, fileName + fileExt);
   },
});

let upload = multer({
   storage: storage,
   limits: {
      fileSize: 1e8,
   },
   fileFilter: (req, file, cb) => {
      // console.log(file);
      if (file.fieldname === 'avatar') {
         if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg' ||
            file.mimetype === 'application/x-zip-compressed'
         ) {
            cb(null, true);
         } else {
            cb(new Error('Only .jpg, .jpeg, .png & .zip format allowed!'));
         }
      } else {
         cb(new Error('There was an unknown error!'));
      }
   },
});

// route
app.get('/', (req, res) => {
   res.render('index');
});

app.post('/', upload.array('avatar', 50), (req, res) => {
   res.render('success');
   // setTimeout(() => {
   //    res.render('success');
   // }, 3000);
});

// default error handler
app.use((err, req, res, next) => {
   if (err) {
      if (err instanceof multer.MulterError) {
         res.status(500).send('There was an upload error!');
      } else {
         res.status(500).send(err.message);
      }
   } else {
      res.status(200).send('success!');
   }
});

// server port
const PORT = process.env.PORT || 3000;

// start the server
app.listen(PORT, () => {
   console.log(`Server is running on PORT: ${PORT}`);
});

module.exports = app;
