

var CategoriesHelper = {
	selectIndex: function(value, options) {
		for(x=0; x<options.length; x++) {
			if(value === options[x].outerText) {
				return x;
			}
		}	
	},

	parseVideos: function(parseBy, allData) {
		var output = [];
		if(parseBy !== "All") {
			for(var x=0; x<allData.length; x++) {
				for(i=0; i<allData[x].categories.length; i++) {
					if(parseBy === allData[x].categories[i]) {
						output.push(allData[x]);
						break;
					}
				}
			}
			return output;
		} 
		return allData;
	},

	selectList: function(type, jsonData, jsonLength, actualCategory) {
		var data = jsonData;
		var length = jsonLength;
		var categories = ['All'];
		var control = 0;
		var item ="";
		for(x=0; x<length; x++) {
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
		if(type === "select-category") {
			for(x=0; x<categories.length; x++) {
				if(categories[x] === actualCategory) {
					item += "<option value="+categories[x]+" selected>"+categories[x]+"</option>";
				} else {
					item += "<option value="+categories[x]+" >"+categories[x]+"</option>";
				}
			}
		}

		return item;
	},

	eventList: function() {
		$(".list-item-shadow-categories").click(function(){
			var data = $(this).attr("data");
			CategoriesHelper.selectIndex(data);
		});

	}


};
