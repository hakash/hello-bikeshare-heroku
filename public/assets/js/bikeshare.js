function loadGbfs(url){
	setTimeout(() => {
		fetch("/gbfs/" + encodeURIComponent(url))
		.then(res => { 
			if(res.status !== 200) {
				let err = new Error("Error fetching data.");
				err.status = res.status;
				err.url = url;
				throw err;
			}
			
			return res.text(); 
		})
		.then(res => {
			//console.log(res);
			let data = csvToArray(res);
			let indexMap = mapHeaderIndex(data.shift());
			displayData(data,indexMap);
		})
		.catch( err => {
			if(err.status){
				displayError(err);
			}
		})
	},0);
}

function mapHeaderIndex(headers){
	let map = {
		"station_id": headers.indexOf("station_id"),
		"name": headers.indexOf("name"),
		"address": headers.indexOf("address"),
		"lat": headers.indexOf("lat"),
		"lon": headers.indexOf("lon"),
		"numBikesAvail": headers.indexOf("numBikesAvail"),
		"numDocksAvail": headers.indexOf("numDocksAvail"),
		"capacity": headers.indexOf("capacity")
	};

	return map;
}

function csvToArray(text) {
    let p = '', row = [''], ret = [row], i = 0, r = 0, s = !0, l;
    for (l of text) {
        if ('"' === l) {
            if (s && l === p) row[i] += l;
            s = !s;
        } else if (',' === l && s) l = row[++i] = '';
        else if ('\n' === l && s) {
            if ('\r' === p) row[i] = row[i].slice(0, -1);
            row = ret[++r] = [l = '']; i = 0;
        } else row[i] += l;
        p = l;
    }
    return ret;
};


function displayData(dataLines, indexMap){
	let table = document.querySelector("#feed_result");

	let newTBody = document.createElement("tbody");

	dataLines.forEach(line => {
		let lineElement = document.createElement("tr");
		line.shift();
		line.forEach( (item, idx) => {
			let td = document.createElement("td");
			td.innerText = item;
			// Center text?
			switch(idx){
				case indexMap.lat:
				case indexMap.lon:
				case indexMap.numBikesAvail:
				case indexMap.numDocksAvail:
				case indexMap.capacity:
					//td.classList.add("align-center");
				break;
			}

			if(!isNaN(item)){
				td.classList.add("align-center");
			}

			lineElement.appendChild(td);
		})

		newTBody.appendChild(lineElement);
	})

	table.replaceChild(newTBody, table.querySelector("tbody"));
}

function submitGbfs(event){
	if(event.keyCode === 13){
		loadCustomGbfs();
	}
}

function loadCustomGbfs(){
	loadGbfs( document.getElementById('custom_gbfs').value);
}

function displayError(err){
	let msg = ["An error occurred fetching your data."];

	if(err.status == 404){
		msg.push("The Bikeshare Feed could not be found. Please review the URL below:");
		msg.push(err.url || "No URL supplied");
	}

	let dialog = document.querySelector("#error_dialog");
	msg.forEach(line => {
		let div = document.createElement("div");
		div.innerText = line;
		console.log(div);
		dialog.appendChild( div );
	})

	$(dialog).fadeIn();

	setTimeout(()=> $(dialog).fadeOut(undefined,()=>dialog.innerHTML = ""), 10000);
}