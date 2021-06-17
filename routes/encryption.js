var CryptoJS = require("crypto-js");
var key = "Key@123"
module.exports = {
    Encrypt(password) {
        var ciphertext = CryptoJS.AES.encrypt(password, key).toString();
        return ciphertext
    },
    Decrypt(password) {
        var bytes = CryptoJS.AES.decrypt(password, key);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        return originalText
    }
}