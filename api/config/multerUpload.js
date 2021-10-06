const multer = require("multer");

//filters
const fileFilterSong = (req,file,cb) => {
    const fileType = file.mimetype.split("/")[0];
    if(fileType === "audio" || fileType === "image")
        cb(null, true);
    else
        cb("the files needs to be audios or an images", false);
};

const fileFilterImgOnly = (req,file,cb) => {
    const fileType = file.mimetype.split("/")[0];
    if(fileType === "image")
        cb(null, true);
    else
        cb("the files needs to be images", false);

};

//storages
const storageSong = multer.diskStorage({
    destination: (req,file,cb) =>{
        const mimetype = file.mimetype.split("/")[0];
        if(mimetype === "audio")
            cb(null,"./files/songs/"+req.user.id);
        else if(mimetype === "image")
            cb(null,"./files/icons/songs/"+req.user.id);
    },
    filename: (req,file,cb) =>{
        const crypto = require("crypto");
        let extention = file.originalname.split(".");
        extention = extention[extention.length-1];
        cb(null,crypto.randomBytes(20).toString("hex")+"."+extention);
    }
});


const storageAlbum = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"./files/icons/albums/"+req.user.id);
    },
    filename: (req,file,cb) =>{
        const crypto = require("crypto");
        let extention = file.originalname.split(".");
        extention = extention[extention.length-1];
        cb(null,crypto.randomBytes(20).toString("hex")+"."+extention);
    }
});

const storageArtist = multer.diskStorage({
    destination: (req,file,cb) =>{
        cb(null,"./files/banners");
    },
    filename: (req,file,cb) =>{
        const crypto = require("crypto");
        let extention = file.originalname.split(".");
        extention = extention[extention.length-1];
        cb(null,crypto.randomBytes(20).toString("hex")+"."+extention);
    }
});

//set the upload middleware
const uploadSong = multer({storage: storageSong,fileFilter: fileFilterSong});
const uploadAlbum = multer({storage: storageAlbum,fileFilter: fileFilterImgOnly});
const uploadArtist = multer({storage: storageArtist,fileFilter: fileFilterImgOnly});

module.exports = {
    uploadSong: uploadSong,
    uploadAlbum: uploadAlbum,
    uploadArtist: uploadArtist
}