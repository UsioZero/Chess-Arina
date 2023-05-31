const path = require('path');
const fs = require('fs');
function checkFolderExists(folderPath) {
    try {

        fs.accessSync(folderPath, fs.constants.F_OK);
        return true;
    } catch (err) {
    
        return false;
    }
}
const fileSaver = (req, res) => {
    const files = req.files;


    const uId = JSON.parse(req.body.jsonData).uId; 
    const isAvatar = JSON.parse(req.body.jsonData).isAvatar; 

    const folderPath = path.join(__dirname, '../public/img/profiles/', uId);

    if (!checkFolderExists(folderPath)) {
        fs.mkdirSync(folderPath);
    }


    const filePath = path.join(folderPath, (isAvatar ? "avatar" : "bg") + path.extname(files.file.name));

    console.log(filePath);

    files.file.mv(filePath, (err) => {
        if (err) return res.status(500).json({ status: "error", messoge: err })
    })

    return res.json({ status: "success", /*message: Object.keys(file).toString()*/ });
}

module.exports = fileSaver;