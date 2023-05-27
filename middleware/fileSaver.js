const path = require('path');
const fs = require('fs');

const fileSaver = (req, res) => {
    const files = req.files;
    //console.log(files);

    const uId = JSON.parse(req.body.jsonData).uId; // may be JSON.parse() is nit necessary
    const isAvatar = JSON.parse(req.body.jsonData).isAvatar; // may be JSON.parse() is nit necessary

    const folderPath = path.join(__dirname, '../public/img/profiles/', uId);
    fs.access(folderPath, fs.constants.F_OK, (err) => {
        if (err) {
            fs.mkdirSync(folderPath);
        }
    })

    const filePath = path.join(folderPath, (isAvatar ? "avatar" : "bg") + path.extname(files.file.name));

    console.log(filePath);

    files.file.mv(filePath, (err) => {
        if (err) return res.status(500).json({ status: "error", messoge: err })
    })

    return res.json({ status: "success", /*message: Object.keys(file).toString()*/ });
}

module.exports = fileSaver;