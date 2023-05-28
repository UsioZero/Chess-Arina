const { execSync } = require('child_process');
const path = require('path');

const runCommand = async (req, res) => {
    let com = req.body.com;
    const comPath = req.body.path;
    const args = req.body.args;
    //console.log(req.headers["user-agent"])
    if(req.headers["user-agent"].includes("Linux")) com = "./" + com;
    //console.log(`"${path.join(__dirname, comPath)} ${com}" ${args}`);

    const command = `cd ${path.join(__dirname, comPath)} && ${com} ${args}`

    console.log('command starts');
    const result = execSync(command);
    //console.log(result.toString());
    console.log("command ends");
    res.json({"result":result.toString()});
}

module.exports = runCommand;