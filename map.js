function Map(opt){
	var self = this;
	//#############################################INIT#############################################
	$.when(
		$.getScript( opt.path+"lib/jquery.mobile-1.5.0-alpha.1.min.js" ),
		$.getScript( opt.path+"lib/lazyload.js" ),
		$.getScript( opt.path+"lib/jquery.dataTables.min.js" ),
		$.getScript( opt.path+"lib/mapbox-gl.js" ),
		$.getScript( opt.path+"lib/geo-viewport.js" ),
		$.getScript( opt.path+"lib/traffic-layers.js" ),
		$.Deferred(function( deferred ){
			$( deferred.resolve );
		})
	).done(function(){
		$( "head" ).prepend( '<link href="'+opt.path+'lib/jquery.dataTables.min.css" rel="stylesheet" type="text/css" />'+
			'<link href="'+opt.path+'lib/mapbox-gl.css" rel="stylesheet" />' );

		var trs = "";
		var filters = "";
		var columnDefs = [];
		var order = [];
		var counter = 0;
		var orderable = [];

		var userLang = navigator.language || navigator.userLanguage; 
		if(userLang == "it-IT"){
			var repositions = "Riposiziona";
			var search_area = "Cerca in quest'area";
			var mex = 'Fai doppio click in un punto della mappa per cambiare la tua posizione e clicca su "'+search_area+'" per vedere i punti d\'interesse';
		} else {
			var repositions = "Repositions";
			var search_area = "Search in this area";
			var mex = 'Double-click anywhere on the map to change your position and click on "'+search_area+'" for see the points of interest';
		}
		
		$("<style type='text/css'> .button_map{background:#3498db; color:#fff; border-radius:3px; position:absolute; margin-left: auto; margin-right: auto; left: 0; right: 0; width:200px; border:1px solid #000; text-align:center; z-index:99; cursor:pointer; font-size:23px; padding:5px 10px;}</style>").appendTo("head");
		
		function ord_reverse(type){
			if(type=="asc")
				return "desc";
			else
				return "asc";
		}

		if(typeof opt.table !== "undefined"){
			for(var i in opt.table.cols){
				trs += '<th>'+opt.table.cols[i].label+'</th>';
				columnDefs.push({"type": "non-empty-string", "targets": [counter],"visible": opt.table.cols[i].visible});

				if(typeof opt.table.cols[i].order !=="undefined")
					order.push([counter,opt.table.cols[i].order]);

				if(typeof opt.table.cols[i].orderable !== "undefined"){
					filters += '<span id = "filter_opt_'+counter+'" data-idx = "'+counter+'">'+opt.table.cols[i].orderable+'</span>';
					orderable[counter] ="asc";
					$(document).delegate('#filter_opt_'+counter,'click',function(){
						var counter = $(this).attr("data-idx");
						orderable[counter] = ord_reverse(orderable[counter]);
						self.table.order( [ counter, orderable[counter] ] ).draw();
					});
				}
				
				if(typeof opt.table.cols[i].check !== "undefined"){
					filters += '<span><input type="checkbox" id = "check_opt_'+counter+'" class="table_check_opt" data-idx = "'+counter+'">'+opt.table.cols[i].check+'</span>';
				}

				counter++;
			}
		}

		$("#"+opt.id).css("height",$(window).height()+"px");
		$("#"+opt.id).html('<div id="map"></div>');

		if(opt.search_button){
			//$(document).ready(function(){
				$("#map").append('<div id="search_area" class="button_map" style="top:10px;">'+search_area+'</div>');
				
				$("#search_area").click(function(){
					search_in_area();
				});
			//});
		}

		$('<div id="table_list" class="page" style="display:none;">'+filters+'<table id="example" class="display" cellspacing="0" width="100%"><thead><tr>'+trs+'</tr></thead><tfoot><tr>'+trs+'</tr></tfoot><tbody></tbody></table></div>').insertAfter("#"+opt.id);
		
		$(".table_check_opt").click(function(){
			var wa = "0";
			if($(this).is(':checked'))
				wa = "1";
				
			self.table
			.columns(3)
			.search(wa, true, false)
			.draw();
		});

		$("#map").css("height","100%");
		$("#"+opt.id).parents().each(function(){
			$(this).css("height","100%");
		});

		$(document).click(function(){
			lazyload();
		});

		function str(txt){
			if(typeof txt === "undefined")
				return "";
			return txt.toString();
		}
		function regex(rule, str){
			let m;
			var ret = [];
			while ((m = rule.exec(str)) !== null) {
				// This is necessary to avoid infinite loops with zero-width matches
				if (m.index === rule.lastIndex) {
					rule.lastIndex++;
				}
				
				// The result can be accessed through the `m`-variable.
				var part = [];
				m.forEach((match, groupIndex) => {
					part.push(match);
				});
				ret.push(part);
			}
			return ret;
		}
		function convertImageLazyload(content){
			var img = regex(/<img(.*?)>/gm, content);
			for(var i in img){
				new_img = img[i][0].replace(' src=',' data-src=');
				new_img = new_img.replace('<img ','<img src="images/loading.gif" ');

				var clas = regex(/class="(.*?)"/gm, img[i][0]);
				if(clas.length > 0){
					new_img = new_img.replace(clas[0][0],'class="'+clas[0][1]+' lazyload"');
				} else
					new_img = new_img.replace('<img ','<img class="lazyload" ');

				content = content.replace(img[i][0],new_img)
			}
			return content;
		}
		function map_refresh(){
			self.map.setCenter({"lng":self.userlng,"lat":self.userlat});
		}

		var unique = [];
		self.dataToView = function(data){
			var row_unique = [];
			if(typeof self.table !== "undefined")
				self.table.clear();
			
			for(var i in data){
				if(unique.indexOf(data[i].unique) == -1){
					unique.push(data[i].unique);
					self.addMarker([data[i].lat, data[i].lng], convertImageLazyload(data[i].content), data[i].custom);
				}

				if(row_unique.indexOf(data[i].unique) == -1 && typeof self.table !== "undefined"){
					row_unique.push(data[i].unique);

					for(var j in data[i].table)
						data[i].table[j] = convertImageLazyload(data[i].table[j]);

					self.table.row.add( data[i].table);
				}
			}

			if(typeof self.table !== "undefined")
				self.table.draw(false);
			$("#table_list").css("display","block");
			$(document).resize();
		}

		//#############################################MAP#############################################
		
		/*$.ajax({
			url: opt.path+opt.style,
			type:'HEAD',
			error: function()
			{
				alert(opt.path+opt.style+" Doesn't exists");
			}
		});*/
		
		if(typeof opt.zoom === "undefined")
			opt.zoom = 15;

		if(typeof opt.navigator_mode === "undefined" || opt.navigator_mode === false)
			opt.navigator_mode = 0
		else
			opt.navigator_mode = 60
	
		mapboxgl.accessToken = opt.token;
		self.map = new mapboxgl.Map({
			container: "map",
			style: opt.style,
			center: opt.center,
			zoom: opt.zoom,
			minZoom: opt.minZoom,
			pitch: opt.navigator_mode,
			bearing: 0, // bearing in degrees
		});

		if(opt.traffic){
			self.map.on('load', function(){

				self.map.addSource('trafficSource', {
					type: 'vector',
					url: 'mapbox://mapbox.mapbox-traffic-v1'
				});

				var firstPOILabel = self.map.getStyle().layers.filter(function(obj){ 
					return obj["source-layer"] == "poi_label";
				});

				for(var i = 0; i < trafficLayers.length; i++) {
					self.map.addLayer(trafficLayers[i], firstPOILabel[0].id);
				}
			});
		}
		
		//*********************************************EVENT//*********************************************
		
		/*'touchstart', 'touchend', 'touchmove', 'touchcancel',
		'mouseout', 'mousedown', 'mouseup', 'mousemove',
		'click', 'dblclick', 'contextmenu',
		'dragstart', 'drag', 'dragend',
		'movestart', 'move', 'moveend',
		'zoomstart', 'zoom', 'zoomend',
		'rotatestart', 'rotate', 'rotateend',
		'pitchstart', 'pitch', 'pitchend',
		'boxzoomstart', 'boxzoomend', 'boxzoomcancel'*/
		
		function singleEvent(){
			search_in_area();
		}
	
		if(typeof opt.search_button === "undefined" || !opt.search_button){
			var lastevent = -1;
			setInterval(function(){
				if(lastevent != -1){
					current = new Date();   
					if((current - lastevent) > 300){
						singleEvent();
						lastevent = -1;
					}
				}
			},300);		
			
			var setCenterDisabled = false;
			self.map.on('moveend', function(){ 
				lastevent = new Date();
			});
			self.map.on('dragend', function(){ 
				lastevent = new Date();
			});
			self.map.on('zoomend', function(){ 
				lastevent = new Date();
			});
			self.map.on('rotateend', function(){ 
				lastevent = new Date();
			});
			self.map.on('pitchend', function(){ 
				lastevent = new Date();
			});
				
			var lastmovestart = -1
			var moving = false;
			self.map.on('touchstart', function(){ 
				lastmovestart = new Date();
				moving = true;
			});	
			self.map.on('touchend', function(){ 
				moving = false;
				
				if((new Date() - lastmovestart) > 500){
					setCenterDisabled = true;
					$("#map").append('<div id="repositions" class="button_map" style="bottom:10px;">'+repositions+'</div>');
				}
			});

			$(document).delegate("#repositions", "click", function(){
				setCenterDisabled = false;
				if(lastSetCenter != -1)
					self.setCenter(lastSetCenter);
				$("#repositions").remove();
			});
		}
		//*********************************************EVENT//*********************************************

		self.userlat = opt.center[1];
		self.userlng = opt.center[0];
		self.userpin = -1;
		//self.changeuserpos();

		self.changeuserpos = function(coords){
			if(typeof coords !== "undefined"){
				self.userlng = coords.lng;
				self.userlat = coords.lat;
			}
			if(self.userpin != -1)
				self.userpin.remove();
			if(typeof opt.userpin === "undefined"){
				opt.userpin = {
					image: opt.path+"userpin.svg",
					width: "27px",
					height: "41px",
					top: "-15px"
				};
			}

			self.userpin = self.addMarker([self.userlng, self.userlat],JSON.stringify([self.userlng, self.userlat]), opt.userpin);
		}
		
		var prevArea = -1;
		function search_in_area(){
			if(start_dblclick){
				start_dblclick = false;
				self.changeuserpos();
			}
			//var zoom = self.map.getZoom();
			//if(zoom > 10){
			var bounds = self.map.getBounds();
			var sw = bounds.getSouthWest().wrap().toArray();
			var ne = bounds.getNorthEast().wrap().toArray();
			
			var diff = Math.abs(sw[1] - prevArea[0]) + Math.abs(sw[0] - prevArea[1]) + Math.abs(ne[1] - prevArea[2]) + Math.abs(ne[0] - prevArea[3])
			prevArea = [sw[1], sw[0], ne[1], ne[0]];
			
			if(typeof opt.onChange !== "undefined" && diff > 0.000001){
				//console.log(diff);
				opt.onChange(sw[1], sw[0], ne[1], ne[0], self.userlat, self.userlng);
			}
			//}
		}

		var start_dblclick = false;
		self.map.on('dblclick', function (e) {
			self.userlat = e.lngLat["lat"];
			self.userlng = e.lngLat["lng"];
			start_dblclick = true;
		});

		if(opt.enable_gps === true){
			navigator.geolocation.getCurrentPosition(function(pos){
				self.userlat = pos.coords.latitude;
				self.userlng = pos.coords.longitude;
				self.changeuserpos();
				map_refresh();
			});
		}
		
		self.addMarker = function(coord, content, custom){
			var popup = new mapboxgl.Popup({ offset: 25 }).setHTML(content);

			if(typeof custom !== "undefined"){
				var el = document.createElement('div');
				el.className = custom.class;
				el.style.top = custom.top;
				el.innerHTML = '<img width="'+custom.width+'" height="'+custom.height+'" src="'+custom.image+'" />';
				var marker = new mapboxgl.Marker(el).setLngLat(coord).setPopup(popup).addTo(self.map);
			} else {
				var marker = new mapboxgl.Marker().setLngLat(coord).setPopup(popup).addTo(self.map);
			}
			return marker;	
		}

		self.map.on('load', function () {
			map_refresh();
		});

		/*self.map.on('moveend', function (e) {
			///////////////////////////////////////////////////////////
		});*/

		var lastSetCenter = -1;
		self.setCenter = function(val){	
			if(!setCenterDisabled && !moving){
				self.map.setCenter(val);
				lastSetCenter = val;
			}
		}

		self.setZoom = function(val){
			self.map.setZoom(val);
		}
		
		self.setBearing = function(val){
			self.map.setBearing(val);
		}

		$(document).resize(function(){
			$("#"+opt.id).css("height",$(window).height()+"px");
			if($("#CustomCSS").length == 0){
				$('head').append('<style id="CustomCSS" type="text/css"></style>');
			}

			var w = ($(window).width()/100)*opt.popup_width_percentage;
			var h = ($(window).height()/100)*opt.popup_height_percentage;

			$('#CustomCSS').text('.mapboxgl-popup-content {height:'+h+'px; width:'+w+'px;}');
			//.desc{margin:15px 0; max-width:'+($(window).width()-60)+'px;}
		});

		//#############################################TABLE#############################################
		if(typeof opt.table !== "undefined"){
			//Order exclude empty cells
			jQuery.extend( jQuery.fn.dataTableExt.oSort, {
				"non-empty-string-asc": function (str1, str2) {
				if(str1 == "")
					return 1;
				if(str2 == "")
					return -1;
				return ((str1 < str2) ? -1 : ((str1 > str2) ? 1 : 0));
				},
			 
				"non-empty-string-desc": function (str1, str2) {
				if(str1 == "")
					return 1;
				if(str2 == "")
					return -1;
				return ((str1 < str2) ? 1 : ((str1 > str2) ? -1 : 0));
				}
			} );

			self.table;
			$.getJSON( opt.path+opt.table.lang+".json", function( data ) {
				self.table = $('#example').DataTable({
					"order": order,
					"columnDefs": columnDefs,
					"language": data
				});
			});

			// Apply the search
			/*table.columns().every( function () {
				var that = this;
			 
				$( 'input', this.header() ).on( 'keyup change', function () {
					if ( that.search() !== this.value ) {
						that.search( this.value ).draw();
						lazyload();
						}
				} );
			} );*/

			$(document).delegate(".paginate_button","click",function(){ 
				$('html,body').animate({scrollTop : $('#example').offset().top},1000);
			});

			$('#example').on( 'page.dt', function () {
				setTimeout(function(){lazyload();},1000);
			} );
			$('#example').on( 'order.dt', function () {
				setTimeout(function(){lazyload();},1000);
			} );
			lazyload();
		}

		/**************************Quando l'utente smette di scrivere**************************/
		var typingTimer;                //timer identifier
		var doneTypingInterval = 2000;  //time in ms, 5 second for example
		var $input = $('#example_filter input');

		//on keyup, start the countdown
		$input.on('keyup', function () {
			clearTimeout(typingTimer);
			typingTimer = setTimeout(doneTyping, doneTypingInterval);
		});

		//on keydown, clear the countdown 
		$input.on('keydown', function () {
			clearTimeout(typingTimer);
		});

		//user is "finished typing," do something
		function doneTyping () {
			lazyload();
		}
		/**************************Quando l'utente smette di scrivere**************************/

		//#############################################HOW USE#############################################
		function setCookie(name,value,days) {
			var expires = "";
			if (days) {
				var date = new Date();
				date.setTime(date.getTime() + (days*24*60*60*1000));
				expires = "; expires=" + date.toUTCString();
			}
			document.cookie = name + "=" + (value || "")  + expires + "; path=/";
		}
		function getCookie(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		}

		if(!getCookie("howusemap") && (typeof opt.show_guide === "undefined" || opt.show_guide !== false)){
			$("html").append('<div id="howusemap" style="display: flex; justify-content: center; align-items: center; position:fixed; background:rgba(0,0,0,0.75); top:0px; left:0px; width:100%; height:100%; text-align:center;"><div style="background:#fff; border-radius:5px; padding:20px; -webkit-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75); -moz-box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75); box-shadow: 5px 5px 5px 0px rgba(0,0,0,0.75);"><div>'+mex+'</div><button style="background:#2ecc71; border:none; padding:5px 15px; margin-top:5px; border-radius:2px; color:#fff; cursor:pointer;">Ok!</button></div></div>');

			$("#howusemap, #howusemap button").click(function(){
				$("#howusemap").remove();
				setCookie("howusemap",1,99999)
			});
		}
	});
}
