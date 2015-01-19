(function(window, document, undefined){


	
var JSONObject;

var ajax = {
	loadJSON: function(url) {
		var xmlhttp = new XMLHttpRequest();

		xmlhttp.onreadystatechange=function() {
			if (xmlhttp.readyState==4 && xmlhttp.status==200) {
				JSONObject = JSON.parse(xmlhttp.responseText);
				ajax.callback(JSONObject); // callback
			}
		}
		xmlhttp.open("POST", url, true);
		xmlhttp.send();
	},

	callback: function(JSONObject) { // callback funkcia - ulozenie json suboru do objektu 
		videos.allData = JSONObject;
		videos.jsonData = JSONObject;
		videos.jsonLength = JSONObject.length;
		pagination.page = 1;
		pagination.itemsWriteSelect();
		categories.selectList();
		videos.write();
	}
};

var videos = {
	timestampParse: function(timestamp) {
		var date = new Date(timestamp*1);
		var day = date.getDate();
		var month = date.getMonth();
		var year = date.getFullYear();
		var day_w = date.getDay();

		days_array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		months_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return days_array[day_w]+", "+day+" "+months_array[month]+" "+year;
	},

	getImage: function(image) {
		if(image == "") {
			return "no-image";
		} else {
			return image;
		}
	},

	getCategories: function(categories) {
		categories_string = "";
		for(i=0; i<categories.length; i++) {
			if(i+1 === categories.length) {
				categories_string += "<span data="+categories[i]+" class=list-item-shadow-categories>"+categories[i]+"</span>"; 
			} else {
				categories_string += "<span data="+categories[i]+" class=list-item-shadow-categories>"+categories[i]+"</span>"+", "; 
			}
		}

		if(categories.length === 0) {
			return "No category";
		}
		return categories_string;
	},


	write: function(page, media) {
		JSONObject = videos.jsonData;
		pagination.pagePanel();
		page = pagination.page;
		var keys = Object.keys(JSONObject[0]);
		var response;

		var item_min, item_max, i;
		var item = "";
		var body = "";

		item_min = pagination.item_min(page, media);
		item_max = pagination.item_max(page, media);

		var li = document.createElement("li"); 
		li.className = "list-item";  

		var div = document.createElement("div");
		div.className = "list-item-shadow";

		var span = document.createElement("span");
		span.className = "list-item-shadow-title";

		var video = document.createElement("video");
		video.className = "list-item-video";
		video.setAttribute('style', 'background: url({{ image }}.jpg);background-size: cover;background-position: center center;');
		video.controls = true;

		var article = document.createElement("article");
		article.className = "list-item-text";

		var h2 = document.createElement("h2");
		h2.className = "list-item-title";

		var h3 = document.createElement("h3");
		h3.className = "list-item-date";                    

		var title = document.createTextNode("{{ title }}");
		var timestamp = document.createTextNode("{{ timestamp }}");
		var video_title = document.createTextNode("{{ categories }}");


		li.appendChild(div);
		div.appendChild(span);
		span.appendChild(video_title);  
		li.appendChild(video);
		li.appendChild(article);
		article.appendChild(h2);
		article.appendChild(h3);
		h2.appendChild(title);
		h3.appendChild(timestamp);

		
		document.getElementById("item-template").innerHTML = "";
		document.getElementById("item-template").appendChild(li);
		
		for(i=item_min; i<item_max; i++) {
			item = document.getElementById('item-template').innerHTML;
			for(x=0; x<4; x++) {
				key = keys[x];
				switch(key) {
					case 'categories': response = videos.getCategories(JSONObject[i][key]);break;
					case 'image': response = videos.getImage(JSONObject[i][key]);break;
					case 'timestamp': response = videos.timestampParse(JSONObject[i][key]);break;
					default: response = JSONObject[i][key]; break;
				}
				item = item.replace("{{ "+key+" }}", response);
			}
			body += item;
			item = "";
		}
		
		document.getElementsByClassName("list-body")[0].innerHTML = body;
		$(".list-item").fadeOut(1, function(){
			$(".list-item").fadeIn(500);
		});	
		animations.itemHover();
		animations.paginationButtonHover();
		categories.eventList();
	}
};


var pagination = {
	nextPage: function()
	{
		var itemsOnPage = pagination.itemsToPageNum();
		var page = pagination.page;
		var items_all = videos.jsonLength;

		if(itemsOnPage*page < items_all) {
			page++;
			pagination.page = page;
			videos.write(page);
		}
	},

	previousPage: function()
	{
		var page =  pagination.page;
		if(page > 1) {
			page--;
			pagination.page = page;
			videos.write(page);
		}
	},

	pagePanel: function()
	{
		var itemsOnPage = pagination.itemsToPageNum();
		var page =  pagination.page;
		var items_all = videos.jsonLength;
		var page_item = "";
		var pages = Math.ceil(items_all/itemsOnPage);

		if(page === 1) {
			document.getElementById("paging-previous").style.visibility = "hidden";
		} else {
			document.getElementById("paging-previous").style.visibility = "visible";
		}

		if(page === pages) {
			document.getElementById("paging-next").style.visibility = "hidden";
		} else {
			document.getElementById("paging-next").style.visibility = "visible";
		}

		if(page > 2) {
			page_item += '<div class="paging-pagenum" data-id="1">1</div>';
			if(page > 3) { page_item += "..."; }
		}
		for(x=1; x<=pages; x++) {
			if(x-1 === page) {
				page_item += '<div class="paging-pagenum" data-id="'+x+'" >'+x+'</div>';
			}

			if(x === page) {
				page_item += '<div class="paging-selected" data-id="'+x+'">'+x+'</div>';
			}

			if(x+1 === page) {
				page_item += '<div class="paging-pagenum" data-id="'+x+'">'+x+'</div>';
			}
		}

		if(page+1 < pages ) {
			if(page+2 < pages) { page_item += "..."; } 
			page_item += '<div class="paging-pagenum" data-id="'+pages+'">'+pages+'</div>';
		}
		document.getElementById("paging-buttons").innerHTML = page_item;
		pagination.clickEvent();
		animations.paginationPageButtonHover();
	},


	concretePage: function(page) {
		pagination.page = page;
		videos.write(page);
	},

	item_min: function(page, media) {
		var itemsOnPage = pagination.itemsToPageNum()*1;
		var items_all = videos.jsonLength;
		
		if(page == undefined) {
			page = 1;
		}

		if(media == 'mobile') {
			return 0;
		} else {
			return (page-1)*itemsOnPage;
		}
	},

	item_max: function(page, media) {
		var items_all = videos.jsonData.length*1;
		var itemsOnPage = pagination.itemsToPageNum();
		if(page == undefined) {
			return itemsOnPage;
		}

		if(media == 'mobile') {
			return page*itemsOnPage;
		} else {	
			page = Math.ceil(page);
			if((items_all-((page-1)*itemsOnPage)) <= itemsOnPage) {
				return items_all;
			}
			else {
				return page*itemsOnPage;
			}
		}
	},

	itemsToPageFunc: function() {
		var num = document.getElementById("list-select").value;
		pagination.itemsToPage = num*1;

		page_actual = pagination.page;
		var page_all = videos.jsonLength / pagination.itemsToPage;

		if(page_actual >= page_all) {
			page_actual = page_all;
		}

		pagination.page = Math.ceil(page_actual);
		videos.write(page_actual);
		pagination.pagePanel();
	},

	itemsToPageNum: function() {
		if(pagination.itemsToPage == undefined) {
			return 12;
		} else {
			return pagination.itemsToPage*1;
		}
	},

	itemsWriteSelect: function() {
		var item;
		var array = [8,12,16,20];
		var num;

		num = pagination.itemsToPageNum();
		for(x=0; x<array.length; x++) {
			if(array[x] == num) {
				item += "<option value="+array[x]+" selected>"+array[x]+"</option>";
			} else {
				item += "<option value="+array[x]+" >"+array[x]+"</option>";
			}
		}
		document.getElementById("list-select").innerHTML = item;
	},

	clickEvent: function() {
		$(document).ready(function(){
			$(".paging-pagenum").click(function(){
				var index = $(this).attr("data-id");
				pagination.concretePage(index*1);
			});
		});
	}
};


var categories = {
	select: function() {
		var value = document.getElementById("category-select").value;
		categories.category = value;

		if(categories.category !== "All") {
			videos.jsonData = categories.parseVideos(categories.category);
			videos.jsonLength = videos.jsonData.length;
			pagination.itemsWriteSelect();
			pagination.itemsToPageFunc();
			//videos.write();
		} else {
			videos.jsonData = videos.allData;
			videos.jsonLength = videos.jsonData.length;
			pagination.itemsWriteSelect();
			pagination.itemsToPageFunc();
			//videos.write();
		}
	},

	selectIndex: function(value) {
		var options = document.getElementById("category-select").options;
		console.log(options[0].outerText);
		for(x=0; x<options.length; x++) {
			if(value === options[x].outerText) {
				document.getElementById("category-select").selectedIndex = x;
				break;
			}
		}
		categories.select();
	},

	parseVideos: function(parseBy) {
		var output = [];
		for(x=0; x<videos.allData.length; x++) {
			for(i=0; i<videos.allData[x].categories.length; i++) {
				if(parseBy === videos.allData[x].categories[i]) {
					output.push(videos.allData[x]);
					break;
				}
			}
		}
		return output;
	},

	selectList: function() {
		var data = videos.jsonData;
		var categories = ['All'];
		var control = 0;
		var item ="";

		for(x=0; x<videos.jsonLength; x++) {
			for(i=0; i<videos.jsonData[x].categories.length; i++) {
				for(j=0; j<categories.length; j++) {
					if(videos.jsonData[x].categories[i] !== categories[j]) {
						control = 1;
					} else {
						control = 0;
						break;
					}
				}	
				if(control === 1) {
					categories.push(videos.jsonData[x].categories[i]);
					control = 0;
				}
			}
		}


		for(x=0; x<categories.length; x++) {
			if(categories[x] == categories.category) {
				item += "<option value="+categories[x]+" selected>"+categories[x]+"</option>";
			} else {
				item += "<option value="+categories[x]+" >"+categories[x]+"</option>";
			}
		}
		document.getElementById("category-select").innerHTML = item;
	},

	eventList: function() {
		$(".list-item-shadow-categories").click(function(){
			var data = $(this).attr("data");
			categories.selectIndex(data);
		});

	}


};


var loading = {
	loadMore: function() {
		var page =  pagination.page;
		var items_all = videos.jsonLength;

		if(12*page < items_all)
		{
			page++;
			pagination.page = page;
			videos.write(page, 'mobile');
		}
	}
};


var animations = {
	itemHover: function() {

			$(".list-item-shadow").fadeOut();
			$(".list-item-shadow-title").slideUp();

			$(".list-item").mouseenter(function(){
				var index = $(this).index();
				$(".list-item-shadow").eq(index).fadeIn(150, function(){
					$(".list-item-shadow-title").eq(index).slideDown(200);
				});
			});

			$(".list-item").mouseleave(function(){
				var index = $(this).index();
				$(".list-item-shadow-title").eq(index).slideUp(500, function(){
					$(".list-item-shadow").eq(index).fadeOut(300);
				});
			});
	},

	paginationButtonHover: function() {
		$(".button").mouseenter(function(){
			$(this).fadeOut(100, function(){
				$(this).css('background-color', '#2162A6');
				$(this).fadeIn(100);
			});
		});

		$(".button").mouseleave(function(){
			$(this).fadeOut(100, function(){
				$(this).css('background-color', '#5aa1ec');
				$(this).fadeIn(100);
			});
		});
	},

	paginationPageButtonHover: function() {
		$(".paging-pagenum").mouseenter(function(){
			$(this).fadeOut(100, function(){
				$(this).css('background-color', '#2162A6');
				$(this).fadeIn(100);
			});
		});

		$(".paging-pagenum").mouseleave(function(){
			$(this).fadeOut(100, function(){
				$(this).css('background-color', '#5aa1ec');
				$(this).fadeIn(100);
			});
		});
	}
};

document.getElementById("list-select").addEventListener("change", pagination.itemsToPageFunc);
document.getElementById("paging-previous").addEventListener("click", pagination.previousPage);
document.getElementById("paging-next").addEventListener("click", pagination.nextPage);
document.getElementById("load-button").addEventListener("click", loading.loadMore);
document.getElementById("category-select").addEventListener("change", categories.select);


ajax.loadJSON("http://academy.tutoky.com/api/json.php"); // nacitanie json suboru cez AJAX

}(window, document));



