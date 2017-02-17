


var vdf = require('vdf'),
    http = require('http'),
    fs = require('fs');

var numRegions = 200;
var contentServerAddress = "http://103.10.125.136";
function getContentListUrl(regionId, count) { return `${contentServerAddress}/serverlist/${regionId}/${count}/`;}
function getContentList(region) {
  return new Promise(function(resolve,reject) {
    var url = getContentListUrl(region,100);
    console.error(`Requesting upstream: ${url}`);
  var request =  http.request(url, function(response) {
    var data = "";
    response.on('data', function(d) { data += d; });
    response.on('end', function() {
      resolve(data);
    });
    response.on('error', function(e) {
      reject(e);
    });
  });
  request.end();
  })
}

var regionIdList = Array.apply(null, Array(numRegions)).map(function (ignore, i) {return i+1 ;}); //+1 so array is 1 indexed


var promiseList = regionIdList.map(function(regionId) {
	return (
		getContentList(regionId)
		.then(function(serverListData) {
			var data = vdf.parse(serverListData);
			var keyList = Object.keys(data.serverlist);
			return keyList.map(function(id) { return data.serverlist[id].vhost});
			
		})
		.catch(function() {console.error(`Region ID ${regionId} failed`, arguments); return []; })
	);
})

Promise.all(promiseList).then(function(serverListList) {
	var allServers = {};
	if (Array.isArray(serverListList)) {
		serverListList.forEach(function(regionalServers) {
			if (Array.isArray(regionalServers)) {
				regionalServers.forEach(function(server) {
					allServers[server] = true;
				});
			}
		})
	}

	Object.keys(allServers).forEach(function(server) { console.log(server); })
	
	// Optional: write to a file instead
	//fs.writeFileSync("servers.json", JSON.stringify(Object.keys(allServers), null, 2))
})