
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

## Method
| Method | Params | Description |
|--|--|--|
|center|  |  |
|change_user_position|  |  |
|enable_gps|  |  |
|id|  |  |
|minZoom|  |  |
|navigator_mode|  |  |
|onChange|  |  |
|path|  |  |
|popup_height_percentage|  |  |
|popup_width_percentage|  |  |
|search_button|  |  |
|show_guide|  |  |
|style|  |  |
|table|  |   |
|userpin|  |  |
|zoom|  |  |
## Property
| Property | Default | Description |
|--|--|--|
|  |  |  |

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
[Datatables](https://datatables.net)
[Jquery](https://jquery.com)
[Lazyload](https://appelsiini.net/projects/lazyload)
[Mapbox](https://www.mapbox.com)

