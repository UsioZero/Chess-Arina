const path = require('path');
const fs = require('fs');

const fileSaver = (req, res) => {
    const file = req.file;
    console.log(file);
    const uId = SON.parse(req.body.jsonData).uId; // may be JSON.parse() is nit necessary
    const isAvatar = JSON.parse(req.body.jsonData).isAvatar; // may be JSON.parse() is nit necessary

    fs.mkdirSync(path.join(__dirname, '../public/img/profiles/', uId));
    const filePath = path.join(__dirname, '../public/img/profiles', uId, (isAvatar ? "avatar" : "bg") + path.extname(file));

    console.log(filePath);

    // file.mv(filePath, (err) => {
    //     if (err) return res.status(500).json({ status: "error", messoge: err })
    // })

    return res.json({ status: "success", message: Object.keys(files).toString() });
}

module.exports = fileSaver;