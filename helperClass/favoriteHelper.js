var FavoriteHelper = {
	enableButton: function(favoriteEnable) {
		var item = "";
		var enableCase = "";
		if(favoriteEnable) {
			enableCase = "ENABLE";
		} else {
			enableCase = "DISABLE";
		}
		item += "<span class='favorites-enable-button'>";
		item += "favorite list is ";
		item += "<span class='favorites-enable-button-response'>";
		item += enableCase;
		item += "</span>";
		item += "</span>";
		return item;
	},



	selectList: function(type, jsonData, jsonLength, actualCategory) {
		var data = jsonData;
		var length = jsonLength;
		var categories = ["Football"];
		var control = 0;
		var item ="";
		for(x=0; x<jsonLength; x++) {
			for(i=0; i<data[x].categories.length; i++) {
				for(j=0; j<categories.length; j++) {
					if(data[x].categories[i] !== categories[j]) {
						control = 1;
					} else {
						control = 0;
						break;
					}
				}	
				if(control === 1) {
					categories.push(data[x].categories[i]);
					control = 0;
				}
			}
		}
		for(x=0; x<categories.length; x++) {
			item += "<div class='favorites-list-item'>"+categories[x]+"</div>";
		}
		return item;
	},

	parseVideosByFavorites: function(parseBy, allData) {
		var output = [];
		
			for(var x=0; x<parseBy.length; x++) {
				output.push(allData[parseBy[x]]);
			}
			return output;
		
	},

	textToItem: function(video) {
		var storage = JSON.parse(localStorage.getItem("favorites"));
		for(var i=0; i<storage.items.length; i++) {
			if(parseInt(storage.items[i]) === video) {
				return "Out of favorites";
			}
		}
		return "Add to favorites";
	}, 

	addToFavorites: function(storage, itemId) {
		for(var i=0; i<storage.length; i++) {
			if(storage[i] === itemId) {
				storage.splice(i, 1);
				return storage;
			} 
		}
		storage.push(itemId);
		return storage;
	}, 

	tagFavoriteItems: function(itemsToPage, page) {
		var storage = JSON.parse(localStorage.getItem("favorites"));
     	for(var x=0; x<itemsToPage; x++) {
     		for(var i=0; i<storage.items.length; i++) {
     			if(parseInt(storage.items[i]) === x*page)
     			$(".list-item").eq(x).css("background", "#ffcc00");
     		}
     	}
	}



};