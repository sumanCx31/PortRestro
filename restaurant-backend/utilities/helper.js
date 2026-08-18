const fs = require("fs");
const randomStringGenerator = (length = 100) => {
    let chars = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    const len = chars.length;
    let random = ''

    for(let i = 0; i < length; i++){
        const posn = Math.ceil(Math.random() * len);
        random += chars[posn];
    }
    return random;
}

const deleteFile = (filePath) => {
    if(fs.existsSync(filePath)){
        fs.unlinkSync(filePath);
    }
}


module.exports = {
    randomStringGenerator,
    deleteFile,
}