var mongoose = require("mongoose");
mongoose.set("debug",true);
var url = "mongodb://127.0.0.1:27017/Users"

mongoose.connect(url,{
    useUnifiedTopology:true,
    useNewUrlParser:true
}).then(data=>{
    console.log("Database connect successfully.")
}).catch(err=>{
    console.log(err)
});

module.exports = mongoose