var db = require("../models");
var jwt = require('jsonwebtoken');
async function Authentication(req, res, next) {
    try {
        if (req.headers.authorization) {
            var auth = req.headers.authorization.toString().split(" ");
            var decoded = jwt.verify(auth[1], process.env.Jwt_token);
            if (decoded.identifier == "Login") {
                var user_id = await db.users.findOne({  _id: decoded.user_id } )
                if (user_id) {
                    req.body.user_id = user_id._id
                    next();
                } else {
                    res.json({ "res": 0, "message": "Token has been expire." });
                }
            } else {
                res.json({ "res": 0, "message": "Invalid Auth." });
            }
        } else {
            res.json({ "res": 0, "message": "Please provide Authenciation information." });
        }
    } catch (e) {
        res.json({ "res": 0, "message": "Please provide Authenciation information." });
    }

}
module.exports = Authentication;