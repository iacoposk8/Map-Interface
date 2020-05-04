
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
    	center: [-74.2598756,40.6976701]
    });
    </script>
new Map return a mapboxgl.Map object

## Method
| Method | Params | Description |
|--|--|--|
|change_user_position|  |  |
|onChange|  |  |
|setCenter|  |  |
|dataToView|  |  |
|changeuserpos|  |  |
|addMarker|  |  |
|setBearing|  |  |
|setZoom|  |  |

## Property
| Property | Values | Description |
|--|--|--|
|center| [longitude, latitude] | Set center of the map |
|enable_gps| true or false (default is false) | If is true enable browser gps position e launch changeuserpos when position change  |
|id| string | Is the css id where place the map |
|minZoom| number | set the minimum zoom beyond which you cannot go (useful if you are creating a navigator) |
|navigator_mode| true or false (default is false) | If is true the map will be tilted |
|path| string | the path of library, usually is "Map-Interface" |
|popup_height_percentage| number | if you use the onChange function you can insert markers with info inside a popup |
|popup_width_percentage| number | if you use the onChange function you can insert markers with info inside a popup |
|search_button| true or false (default is false) | if is true it shows a search button which if clicked will launch the onChange function. If it is false the onChange function is launched every time there is a change on the map such as a change of position, zoom etc... |
|show_guide| true or false (default is true) | if true it shows a popup on how to use the map on first use |
|style| string | path of json file of style generated on [https://www.maptiler.com](https://www.maptiler.com) |
|table| object | lang: language file json there are two example in Map-Interface folder, cols: array with object. label: column header, visible: true or flase, order: asc or desc, orderable: column sorting string (in case it's hidden), check:  |
|userlat|  |  |
|userlng|  |  |
|userpin|  |  |
|zoom|  |  |

    table: {
    	lang: "it",
    	cols: [
    		{label: "Distanza Km", visible: false, order: "asc", orderable:"Ordina per distanza"},
    		{label: "Anni", visible: false, orderable:"Ordina per età"},
    		{label: "Info", visible: true},
    		{label: "Whatsapp", visible: false, check: "Visualizza solo con Whatsapp"}
    	]
    },

## Libraries of this project

 - [Datatables](https://datatables.net) 
 - [Jquery](https://jquery.com)
 - [Lazyload](https://appelsiini.net/projects/lazyload)
 - [Mapbox](https://www.mapbox.com)
