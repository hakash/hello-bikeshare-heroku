const express = require("express");

const app = express();
app.use("/",require("./router"));
app.use("/",express.static(__dirname + "/public"));

app.listen(3000,()=>{
	console.log("Listening to port 3000. Open http://localhost:3000 to view.");
});