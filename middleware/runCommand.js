const { exec } = require('child_process');
const path = require('path');

const runCommand = (req, res) => {
    const com = req.body.com;
    const comPath = req.body.path;
    const args= req.body.args;
    // console.log(`"${path.join(__dirname, comPath)} ${com}" ${args}`);

    exec(`"${path.join(__dirname, comPath)} ${com}" ${args}`, (error, stdout, stderr) => {
        if (error) {
            throw error;
        }
        console.log(stdout);
    });
}

module.exports = runCommand;