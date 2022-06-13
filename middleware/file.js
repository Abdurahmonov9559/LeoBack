const multer = require('multer') // npm i multer

const storageConfig = multer.diskStorage({
    destination: (req, file, cb) =>{
        cb(null, "uploads");
    },
    filename: (req, file, cb) =>{
        const uniquePreffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, uniquePreffix + '-' +file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
  
    if(file.mimetype === "image/png" || 
    file.mimetype === "image/jpg"|| file.mimetype === 'application/pdf' ||
    file.mimetype === "image/jpeg" || file.mimetype==='image/svg+xml'){
        cb(null, true);
    }
    else{
        cb(null, false);
    }
}

module.exports = multer({storage:storageConfig, fileFilter: fileFilter})