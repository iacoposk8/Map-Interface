
# Map Interface
A simple interface for Mapbox

## Installation

    git clone https://github.com/iacoposk8/Map-Interface
Go to [https://www.maptiler.com](https://www.maptiler.com), register, create the style of your map and download the json file to put in the Map-Interface folder. I named this file style.json.

## Quickstart

    <script src="Map-Interface/map.js"></script>
    <div id="map_container"></div>
    <script>
    var map = new Map({
		id: 'map_container', 
		zoom: 8, 
		path: 'Map-Interface/',
		style: 'style.json', 
		center: [40.6976701,-74.2598756]
    });
    </script>
