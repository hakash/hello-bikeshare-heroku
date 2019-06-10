const express = require("express");

const app = express();
app.use("/",require("./router"));
app.use("/",express.static(__dirname + "/public"));

if(!process.env.PORT) process.env['PORT'] = 3000;

app.listen(process.env.PORT,()=>{
	console.log(`Listening to port ${process.env.PORT}. Open http://localhost:${process.env.PORT} to view.`);
});