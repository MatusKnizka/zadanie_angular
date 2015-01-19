(function(window, document) {
	
	const PAGE = 1;
	const ITEM_TO_PAGE = 12;
	const CATEGORY = 'All';

	

	function videoList(url, page, itemsToPage, category) {
		this.load(url, function(xhr) { 
			this.page = page;
			this.itemsToPage = itemsToPage;
			this.category = category;
			this.favorites = 'All';
			this.allData = JSON.parse(xhr.responseText);
			this.jsonData = JSON.parse(xhr.responseText); 
			this.jsonLength = JSON.parse(xhr.responseText).length; 
			this.render();
		}.bind(this));
	}

	videoList.prototype.load = function(url, callback) {
		var xhr;
		if(typeof XMLHttpRequest !== 'undefined') xhr = new XMLHttpRequest();
		else {
			var versions = ["MSXML2.XmlHttp.5.0", 
			"MSXML2.XmlHttp.4.0",
			"MSXML2.XmlHttp.3.0", 
			"MSXML2.XmlHttp.2.0",
			"Microsoft.XmlHttp"]

			for(var i = 0, len = versions.length; i < len; i++) {
				try {
					xhr = new ActiveXObject(versions[i]);
					break;
				} catch(e){}
             } // end for
         }    
         xhr.onreadystatechange = ensureReadiness; 
         function ensureReadiness() {
         	if(xhr.readyState < 4) {
         		return;
         	}  
         	if(xhr.status !== 200) {
         		return;
         	}  
         	if(xhr.readyState === 4) {
         		callback(xhr);
         	}           
         }     
         xhr.open('GET', url, true);
         xhr.send('');
     }

     videoList.prototype.render = function() {
     	this.write(this.page); // WRITE VIDEO ITEMS TO PAGE
     	this.pagination(); // PAGINATION
     	paginationHelper.clickEvent();  // PAGINATION EVENT IN JQUERY
     	animations.paginationPageButtonHover();  // ANIMATIONS OF PAGINATION
     	categoriesHelper.selectList(this.jsonData, this.jsonLength, this.category); // SELECT LIST FOR CATEGORIES
     	paginationHelper.itemsWriteSelect(this.itemsToPage);  // SELECT LIST FOR NUMBER OF ITEMS ON PAGE
     	animations.itemHover(); // ANIMATION FOR ITEM
     	animations.paginationButtonHover();  // ANIMATION FOR PREV AND NEXT BUTTON
     	categoriesHelper.eventList();
     };

     videoList.prototype.write = function(page, media) {
     	var JSONObject = this.jsonData;
     	var item_min = writeHelper.item_min(page, media, this.jsonLength, this.itemsToPage);
     	var item_max = writeHelper.item_max(page, media, this.jsonLength, this.itemsToPage);

     	var frag = document.createDocumentFragment();
     	document.getElementsByClassName("list-body")[0].innerHTML = "";

     	for(var i=item_min; i<item_max; i++) {
     		var li = document.createElement("li"); 
     		li.className = "list-item";  

     		var div = document.createElement("div");
     		div.className = "list-item-shadow";

     		var span = document.createElement("span");
     		span.className = "list-item-shadow-title";

     		var video = document.createElement("video");
     		video.className = "list-item-video";
     		video.controls = true;

     		var article = document.createElement("article");
     		article.className = "list-item-text";

     		var h2 = document.createElement("h2");
     		h2.className = "list-item-title";

     		var h3 = document.createElement("h3");
     		h3.className = "list-item-date";                   

     		li.appendChild(div);
     		div.appendChild(span);
     		li.appendChild(video);
     		li.appendChild(article);
     		article.appendChild(h2);
     		article.appendChild(h3); 
     		
     		var title = document.createTextNode(JSONObject[i]['title']);
     		var timestamp = document.createTextNode(writeHelper.timestampParse(JSONObject[i]['timestamp']));
     		var video_title = writeHelper.getCategories(JSONObject[i]['categories']);
     		video.setAttribute('style', 'background: url('+writeHelper.getImage(JSONObject[i]['image'])+'.jpg);background-size: cover;background-position: center center;');

     		span.appendChild(video_title);  
     		h2.appendChild(title);
     		h3.appendChild(timestamp);
     		frag.appendChild(li);
     	}

     	document.getElementsByClassName("list-body")[0].appendChild(frag);
     	$(".list-item").fadeOut(1, function(){
     		$(".list-item").fadeIn(500);
     	});	
     };

     videoList.prototype.pagination = function() {
     	var itemsOnPage = paginationHelper.itemsToPageNum(this.itemsToPage);
     	var page = this.page*1;
     	var items_all = this.jsonLength;
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
     };

     videoList.prototype.select = function() {
     	this.category = document.getElementById("category-select").value;
     	if(this.category !== "All") {
     		this.jsonData = categoriesHelper.parseVideos(this.category, this.allData);
     	} else {
     		this.jsonData = this.allData;
     	}
     	this.jsonLength = this.jsonData.length;
     	this.changeItemsToPage();
     };

     videoList.prototype.changePage = function(operation) {	
     	switch(operation) {
     		case 'next': this.page = paginationHelper.nextPage(this.page, this.jsonLength, this.itemsToPage);break;
     		case 'previous': this.page = paginationHelper.previousPage(this.page);break;
     		default: this.page = paginationHelper.concretePage(operation);break;
     	}
     	this.render();
     };


     videoList.prototype.changeItemsToPage = function() {
     	this.itemsToPage = document.getElementById("list-select").value*1;
     	var page_actual = this.page*1;
     	var page_all = this.jsonLength / this.itemsToPage;
     	if(page_actual >= page_all) {
     		page_actual = page_all;
     	}

     	this.page = Math.ceil(page_actual);
     	this.render();
     };



	//HELPER CLASS FOR FUNCTION WRITE
	var writeHelper = {
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
			var out = document.createDocumentFragment();
			var span;

			if(categories.length === 0) {
				span = document.createElement("span");
				span_text = document.createTextNode("No categories");	
				span.appendChild(span_text);
				return out.appendChild(span);
			}

			for(var i=0; i<categories.length; i++) {
				span = document.createElement("span");
				span.className = "list-item-shadow-categories";
				span.setAttribute("data", categories[i]);

				if(i+1 === categories.length) {
					span_text = document.createTextNode(categories[i]);	
				} else {
					span_text = document.createTextNode(categories[i]+", ");	
				}

				span.appendChild(span_text);
				out.appendChild(span);
			}
			return out;
		}, 

		item_min: function(page, media, length, itemsToPage) {
			var itemsOnPage = paginationHelper.itemsToPageNum(itemsToPage);
			var items_all = length;
			if(page == undefined) {
				page = 1;
			}

			if(media == 'mobile') {
				return 0;
			} else {
				return (page-1)*itemsOnPage;
			}
		},

		item_max: function(page, media, length, itemsToPage) {
			var itemsOnPage = paginationHelper.itemsToPageNum(itemsToPage);
			var items_all = length;
			if(page == undefined) {
				return itemsOnPage;
			}

			if(media === 'mobile') {
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
		}
	};
// END



// HELPER CLASS FOR PAGINATION
var paginationHelper = {
	nextPage: function(page, items_all, itemsToPage) {
		if(itemsToPage*page < items_all) {
			page++;
		}
		return page;
	},

	previousPage: function(page) {
		if(page > 1) {
			page--;		
		}
		return page;
	},

	concretePage: function(page) {
		return page;
	},

	itemsToPageNum: function(itemsToPage) {
		if(itemsToPage == undefined) {
			return 12;
		} else {
			return itemsToPage*1;
		}
	},

	itemsWriteSelect: function(num) {
		var item;
		var array = [8,12,16,20];
		var num;

		for(var x=0; x<array.length; x++) {
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
				list.changePage(index);
			});
		});
	}
};


var categoriesHelper = {
	selectIndex: function(value) {
		var options = document.getElementById("category-select").options;
		for(x=0; x<options.length; x++) {
			if(value === options[x].outerText) {
				document.getElementById("category-select").selectedIndex = x;
				break;
			}
		}
		list.select();	
	},

	parseVideos: function(parseBy, allData) {
		var output = [];
		for(var x=0; x<allData.length; x++) {
			for(i=0; i<allData[x].categories.length; i++) {
				if(parseBy === allData[x].categories[i]) {
					output.push(allData[x]);
					break;
				}
			}
		}
		return output;
	},

	selectList: function(jsonData, jsonLength, actualCategory) {
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
		for(x=0; x<categories.length; x++) {
			if(categories[x] === actualCategory) {
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
			categoriesHelper.selectIndex(data);
		});
	}
};



// ANIMATION FUNCTIONS
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
// END ANIMATION

var list = new videoList("http://academy.tutoky.com/api/json.php", PAGE, ITEM_TO_PAGE, CATEGORY);


document.getElementById("list-select").addEventListener("change", function(){list.changeItemsToPage()}.bind(this));
document.getElementById("paging-previous").addEventListener("click", function(){list.changePage('previous')}.bind(this));
document.getElementById("paging-next").addEventListener("click", function(){list.changePage('next')}.bind(this));
//document.getElementById("load-button").addEventListener("click", loading.loadMore);
document.getElementById("category-select").addEventListener("change", function(){list.select()}.bind(this));


}(window, document));




/*

var num = 0;
var favorites_field = [];
var all_field = ["ta ne 1", "ta ne 2", "ta ne 3"];
// FAVORITES
var favorites = {

	showControlWindow: function(position) {
		$(".list-favorites").click(function(){
			$(".favorites").fadeToggle();
		});
		console.log("position" +position);
		if(position != undefined) {
		favorites_field.push(all_field[position]);
		}

		var item = "";
		var body = "";
		for(var x = 0; x<all_field.length; x++) {
			item += "<div class='favorites-list-item'>"+all_field[x]+"</div>";
		}
		document.getElementsByClassName("favorites-list")[0].innerHTML = item;

		item = "";
		console.log(item);
		for(var x = 0; x<favorites_field.length; x++) {
			item += "<div class='favorites-list-item'>"+favorites_field[x]+"</div>";
		}
		document.getElementsByClassName("favorites-list")[1].innerHTML = item;
	},
	moveWithDiv: function(e) {

		var item = $(".favorites-list-item").eq(num);
			
		var pos_x = e.offsetX+10 + ($(e.target).index()*0);
		var pos_y = e.offsetY+10;
		


		item.css("top", pos_y);
		item.css("left", pos_x);

		console.log(pos_x, pos_y, num, $(e.target).index());
	},

	moveTo: function(e) {
		//$(".favorites-list-item").eq(num).appendTo($(".favorites-list").eq($(e.target).index()));
		var position = $(e.target).children().index();
		favorites.showControlWindow(num);
		//$(".favorites-list-item").eq(num).css("top", 0);
		//$(".favorites-list-item").eq(num).css("left", position);
		//console.log(num, $(e.target).index());
		
	},


	controlMouse: function() {
		$(".favorites-list-item").mousedown(function(e){
			num = $(this).index();
			$(".favorites").mousemove(favorites.moveWithDiv);	

		});

		$(".favorites").mouseup(function(e){
			$(".favorites").off("mousemove");
			favorites.moveTo(e);
		});
	}
};
 */