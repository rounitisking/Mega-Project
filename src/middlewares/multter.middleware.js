// user jo bhi file dega usko ham apne disk pr rakhenge
// expres does not have the ability to modify the file or cannot do file handeling
// to useupload fucntion -- use it like a middleware -- 
//if i want to take a single file then -- upload.single('avatar)
// if i am uploading multiple files then -- upload.array('photos', 12) -- here 12 is the number of file i want to except public. images 


import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.fieldname + '-' + uniqueSuffix)
  }
})

export const upload = multer({ storage: storage,
    limits: {
        fileSize : 1*1000*1000
    }
 })