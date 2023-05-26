const path = require('path');
const fs = require('fs');

const fileSaver = (req, res) => {
    const file = req.file;
    console.log(file);
    const uId = req.body.jsonData.uId;
    const isAvatar = req.body.jsonData.isAvatar;

    fs.mkdirSync(path.join(__dirname, '../public/img/profiles/', uId));
    const filePath = path.join(__dirname, '../public/img/profiles', uId, (isAvatar ? "avatar" : "bg") + path.extname(file));

    console.log(filePath);

    // file.mv(filePath, (err) => {
    //     if (err) return res.status(500).json({ status: "error", messoge: err })
    // })

    // fs.rename(
    //     path.join(__dirname, '../public/img/test/', files[key]),
    //     path.join(__dirname,
    //         '../public/img/front_img/',
    //         `${result.id}${path.extname(files[key])}`), (err) => {
    //             if (err) {
    //                 console.log(err);
    //             }
    //         }
    // );

    return res.json({ status: "success", message: Object.keys(files).toString() });
}

module.exports = fileSaver;