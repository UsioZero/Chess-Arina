const path = require('path');
const fs = require('fs');

const fileSaver = (req, res) => {
    const file = req.file;
    console.log(req.files);
    // const uId = req.body.jsonData.uId; // may be JSON.parse() is nit necessary
    // const isAvatar = req.body.jsonData.isAvatar; // may be JSON.parse() is nit necessary

    // fs.mkdirSync(path.join(__dirname, '../public/img/profiles/', uId));
    // const filePath = path.join(__dirname, '../public/img/profiles', uId, (isAvatar ? "avatar" : "bg") + path.extname(file));

    // console.log(filePath);

    // // file.mv(filePath, (err) => {
    // //     if (err) return res.status(500).json({ status: "error", messoge: err })
    // // })

    return res.json({ status: "success", /*message: Object.keys(file).toString()*/ });
}

module.exports = fileSaver;