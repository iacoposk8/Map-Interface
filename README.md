

# Map Interface
A simple interface for Mapbox

## Installation

    git clone https://github.com/iacoposk8/Map-Interface
Go to [https://www.maptiler.com](https://www.maptiler.com), register, create the style of your map and download the json file to put in the Map-Interface folder. I named this file style.json.

## Quickstart
Create an html file outside the Map-Interface folder and on a host with https enabled. In this html file add theese lines:

    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script src="Map-Interface/map.js"></script>
    <div id="map_container"></div>
    <script>
    var map = new Map({
    	id: 'map_container', 
    	zoom: 8, 
    	path: 'Map-Interface/',
    	style: 'style.json', 
    	center: [40.6976701, -74.2598756],
    });
    </script>
in this case map.map is a mapboxgl.Map object

## Events
| Method | Params | Description |
|--|--|--|
|onChange| swLat, swLng, neLat, neLng, user_lat, user_lng | It is called every time there is a change in the map display area, such as a zoom or pan, etc. You will be given the coordinates south west of latitude, south west of longitude, north east of latitude, north east of longitude that you can use to limit the loading of markers. You will also be given the user's location. |

## Method
| Method | Params | Description |
|--|--|--|
|changeuserpos| {"lat":number,"lng":number} | Change the user's location |
|dataToView| Array of objects, clear table true or false (default is true) | Adds markers to the map and table. See an example at the bottom of the page |
|setBearing| number in in degrees | Usually the north is put at the top, with this function you can rotate the map |
|setCenter| {"lat":number,"lng":number} | Allows you to change the center of the map |
|setZoom| number | Allows you to change the zoom  |

## Property
| Property | Values | Description |
|--|--|--|
|center| [latitude, longitude] | Set center of the map |
|enable_gps| bool (default is false) | If is true enable browser gps position e launch changeuserpos when position change  |
|id| string | Is the css id where place the map |
|minZoom| number | set the minimum zoom beyond which you cannot go (useful if you are creating a navigator) |
|navigator_mode| bool (default is false) | If is true the map will be tilted |
|path| string | the path of library, usually is "Map-Interface" |
|popup_height_percentage| number | if you use the onChange function you can insert markers with info inside a popup |
|popup_width_percentage| number | if you use the onChange function you can insert markers with info inside a popup |
|search_button| bool (default is false) | if is true it shows a search button which if clicked will launch the onChange function. If it is false the onChange function is launched every time there is a change on the map such as a change of position, zoom etc... |
|show_guide| bool (default is true) | if true it shows a popup on how to use the map on first use |
|style| string | path of json file of style generated on [https://www.maptiler.com](https://www.maptiler.com) or url |
|table| object | See an example at the end of the page. Displays a marker table below the map. **lang**: language file json there are two example in Map-Interface folder, **cols**: array with object. **label**: column header, **visible**: true or flase, order: asc or desc, **orderable**: column sorting string (to sort a hidden column), **check**: checkbox to filter the results of a column |
|token| string | Token generated on [https://www.maptiler.com](https://www.maptiler.com)  |
|traffic| bool (default is false) | Color the streets based on traffic  |
|userpin| object | See an example at the end of the page. Change the graphic style of the user's marker (double click on the map to view it). **image**: path of the image, **width**: image width (px), **height**: image height (px), **top**: top position (px)  |
|zoom| number | zoom level of the map  |

## Complete example

    <script src="https://code.jquery.com/jquery-1.10.2.js"></script>
    <script src="Map-Interface/map.js"></script>
    <div id="map_container"></div>
    <script>
    var map = new Map({
    	id: 'map_container', 
    	zoom: 10, 
    	path: 'Map-Interface/',
    	style: 'mapbox://styles/mapbox/streets-v11', 
    	token: 'XXXXXXXXXXXXXXXXXXXXXXXXXX', 
    	center: [40.6976701, -74.2598756],
    	table: {
    		lang: "it",
    		cols: [
    			{label: "Distance Km", visible: false, order: "asc", orderable:"Sort by distance"},
    			{label: "Info", visible: true},
    			{label: "Website", visible: false, check: [{"label":"Display only with website", "value":"1"}, {"label":"Display only without website", "value":"0"}]}
    		]
    	},
    	userpin: {
    		image: "Map-Interface/navigator.svg",
    		width: "27px",
    		height: "41px",
    		top: "-15px"
    	},
    	onChange:function(swLat, swLng, neLat, neLng, user_lat, user_lng){
    		//map.setZoom(10);
    		data_view = [];
    		e = [{"number":1,"lat":40.6976701,"lng":-74.2598756, "content":"Marker 1", "distance":10, "website":1}, {"number":2,"lat":40.6867701,"lng":-74.2488756, "content":"Marker 2", "distance":20, "website":0}, {"number":3,"lat":40.6267701,"lng":-74.2288756, "content":"Marker 3", "distance":40, "website":0},{"number":4,"lat":40.6567701,"lng":-74.2888756, "content":"Marker 4", "distance":30, "website":1}];
    		for(i in e){
    			data_view.push({
    				unique: e[i].number,
    				lat: e[i]["lat"],
    				lng: e[i]["lng"],
    				content: e[i].content,
    				table: [e[i].distance, e[i].content, e[i].website ] 
    			});
    		}
    		map.dataToView(data_view);
    	}
    });
    </script>

## Libraries of this project

 - [Datatables](https://datatables.net) 
 - [Jquery](https://jquery.com)
 - [Lazyload](https://appelsiini.net/projects/lazyload)
 - [Mapbox](https://www.mapbox.com)
