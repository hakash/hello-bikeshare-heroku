const router = require("express").Router();


router.get("/hello",(req,res)=>{
	res.status(200);
	res.json({message:"Hello!"});
	res.end();
});

router.get("/gbfs/:gbfsurl", async (req,res)=>{
	const BikeshareFeed = require("bysykkel/BikeshareFeed");
	const autodiscoverUrl = decodeURIComponent(req.params.gbfsurl);
	console.log("Fetching:",autodiscoverUrl)
	const bf = new BikeshareFeed(autodiscoverUrl,"Demo Ghost","My Demo");
	try {
		let err = await bf.loadFeed();
		if(err){
			throw err;
		}
		res.status(200);
		res.send(bf.csv());
		res.end();
	}
	catch(err){
		console.log("Error fetching data: ", err.statusCode);
		res.status(err.statusCode || 500);
		res.end();
	}	
});

module.exports = router;
