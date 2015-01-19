(function(window, document) {
	
	const PAGE = 1;
	const ITEM_TO_PAGE = 12;
	const CATEGORY = 'All';

	

	// trieda AjaxHelper, staticka metoda load (nepotrebuje instanciu)
	AjaxHelper.load = function(url, params, func) {
		var xhr = new XMLHttpRequest();

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

	// trieda DateTimeHelper, staticka metoda load (nepotrebuje instanciu)
	var DateTimeHelper = {
		timestampParse: function(timestamp) {
			var date = new Date(timestamp*1);
			var day = date.getDate();
			var month = date.getMonth();
			var year = date.getFullYear();
			var day_w = date.getDay();

			days_array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
			months_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
			return days_array[day_w]+", "+day+" "+months_array[month]+" "+year;
		}
	}


	
	// trieda List, staticka metoda load (nepotrebuje instanciu)
	function List(name, url, page, itemsToPage, media) {
		this.name = name;
		this.rootElement = document.getElementById(name);
		this.url = url;
		this.page = page;
		this.itemsToPage = itemsToPage;
		this.categories = [];
		this.media = media;
		this.data = [];
		this.itemStart = 1;
		this.itemEnd =  this.itemsToPage;
		this.selectedCategory = "";

		this.load();
	}

	List.prototype.load = function() {
		AjaxHelper.load(this.url, [], this.processResponse);
	}

	List.prototype.processResponse = function(xhr) {
		var obj = JSON.parse(xhr.responseText);
		this.videos = obj;

		// find all categories
		for ()
		render();
	}

	List.prototype.selectCategory = function(selectedCategory) {
		this.selectedCategory = selectedCategory;
		this.page = 1;
		render();
	}

	List.prototype.nextPage = function() {
		var itemEnd = (this.page+1)*this.itemsToPage;
		if (data.length <= itemEnd)
			this.page += 1;
			this.itemStart = this.page*this.itemsToPage;
			this.itemEnd = itemEnd;
		}
	}

	List.prototype.previousPage = function() {
		if (this.page !== 1) {
			this.page -= 1;
			this.itemStart = this.page*this.itemsToPage;
			this.itemEnd = (this.page-1)*this.itemsToPage;
		}
	}

    List.prototype._render = function() {
     	this._renderList();
     	this._renderPagination();
     	/*paginationHelper.clickEvent();
     	animations.paginationPageButtonHover();  // ANIMATIONS OF PAGINATION
     	categoriesHelper.selectList(this.jsonData, this.jsonLength, this.category); // SELECT LIST FOR CATEGORIES
     	paginationHelper.itemsWriteSelect(this.itemsToPage);  // SELECT LIST FOR NUMBER OF ITEMS ON PAGE
     	animations.itemHover(); // ANIMATION FOR ITEM
     	animations.paginationButtonHover();  // ANIMATION FOR PREV AND NEXT BUTTON
     	categoriesHelper.eventList();*/
     };

     List.prototype._renderList = function(page, media) {
     	//var JSONObject = this.jsonData;
     	//var itemMin = writeHelper.item_min(page, media, this.jsonLength, this.itemsToPage);
     	//var itemMax = writeHelper.item_max(page, media, this.jsonLength, this.itemsToPage);

     	var frag = document.createDocumentFragment();
     	this.rootElement.getElementsByClassName("list-body")[0].innerHTML = "";

     	for(var i=this.itemStart; i<this.itemEnd; i++) {
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
     		
     		var title = document.createTextNode(this.data[i]['title']);
     		var timestamp = document.createTextNode(DateTimeHelper.timestampParse(this.data[i]['timestamp']));
     		var videoTitle = WriteHelper.getCategories(this.data[i]['categories']);
     		video.setAttribute('style', 'background: url('+WriteHelper.getImage(this.data[i]['image'])+'.jpg);background-size: cover;background-position: center center;');

     		span.appendChild(video_title);  
     		h2.appendChild(title);
     		h3.appendChild(timestamp);
     		frag.appendChild(li);
     	}

     	this.rootElement.getElementsByClassName("list-body")[0].appendChild(frag);
     	/*$(".list-item").fadeOut(1, function(){
     		$(".list-item").fadeIn(500);
     	});*/	
    };

     List.prototype._renderPagination = function() {
     	//var itemsOnPage = paginationHelper.itemsToPageNum(this.itemsToPage);
     	//var page = this.page*1;
     	//var items_all = this.jsonLength;
     	var pageItems = "";
     	var pages = Math.ceil(this.data.length/this.itemsToPage);

     	// first page
     	if(this.page === 1) {
     		//TODO change to class
     		this.rootElement.getElementById("paging-previous").style.visibility = "hidden";
     	} else {
     		//TODO change to class
     		this.rootElement.getElementById("paging-previous").style.visibility = "visible";
     	}

     	// last page
     	if(this.page === pages) {
     		//TODO change to class
     		this.rootElement.getElementById("paging-next").style.visibility = "hidden";
     	} else {
     		//TODO change to class
     		this.rootElement.getElementById("paging-next").style.visibility = "visible";
     	}

     	if(this.page > 2) {
     		pageItems += '<div class="paging-pagenum" data-id="1">1</div>';
     		if(this.page > 3) {
     			pageItems += "...";
     		}
     	}

     	for( var x=1; x<=pages; x++) {
     		if(x-1 === this.page) {
     			pageItems += '<div class="paging-pagenum" data-id="'+x+'" >'+x+'</div>';
     		}

     		if(x === this.page) {
     			pageItems += '<div class="paging-selected" data-id="'+x+'">'+x+'</div>';
     		}

     		if(x+1 === this.page) {
     			pageItems += '<div class="paging-pagenum" data-id="'+x+'">'+x+'</div>';
     		}
     	}

     	if(this.page+1 < pages ) {
     		if(this.page+2 < pages) { pageItems += "..."; } 
     		pageItems += '<div class="paging-pagenum" data-id="'+pages+'">'+pages+'</div>';
     	}

		//TODO change to class
     	this.rootElement.getElementById("paging-buttons").innerHTML = pageItems;
     };

     List.prototype.select = function() {
     	this.category = document.getElementById("category-select").value;
     	if(this.category !== "All") {
     		this.jsonData = categoriesHelper.parseVideos(this.category, this.allData);
     	} else {
     		this.jsonData = this.allData;
     	}
     	this.jsonLength = this.jsonData.length;
     	this.changeItemsToPage();
     };

     List.prototype.changePage = function(operation) {	
     	switch(operation) {
     		case 'next': this.page = paginationHelper.nextPage(this.page, this.jsonLength, this.itemsToPage);break;
     		case 'previous': this.page = paginationHelper.previousPage(this.page);break;
     		default: this.page = paginationHelper.concretePage(operation);break;
     	}
     	this.render();
     };


     List.prototype.changeItemsToPage = function() {
     	this.itemsToPage = document.getElementById("list-select").value*1;
     	var page_actual = this.page*1;
     	var page_all = this.jsonLength / this.itemsToPage;
     	if(page_actual >= page_all) {
     		page_actual = page_all;
     	}

     	this.page = Math.ceil(page_actual);
     	this.render();
     };

	
	var WriteHelper = {
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
				spanText = document.createTextNode("No categories");	
				span.appendChild(spanText);
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

				span.appendChild(spanText);
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

	itemsWriteSelect: function(pagingOptions, selectedPage, rootElement, selectParentClass) {
		var item;
		//var array = [8,12,16,20];

		for(var x=0; x<pagingOptions.length; x++) {
			if(pagingOptions[x] == selectedPage) {
				item += "<option value="+pagingOptions[x]+" selected>"+pagingOptions[x]+"</option>";
			} else {
				item += "<option value="+pagingOptions[x]+" >"+pagingOptions[x]+"</option>";
			}
		}
		rootElement.getElementById(selectParentClass).innerHTML = item;
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


var CategoriesHelper = {
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

// konkretne instancie triedy List
var list1 = new List("videolist1", "http://academy.tutoky.com/api/json.php", PAGE, ITEM_TO_PAGE, CATEGORY);
//var list2 = new List("videolist2", "http://academy.tutoky.com/api/json.php", PAGE, ITEM_TO_PAGE, CATEGORY);

document.getElementById("list-select").addEventListener("change", function(){list.changeItemsToPage()}.bind(this));
document.getElementById("paging-previous").addEventListener("click", function(){list.changePage('previous')}.bind(this));
document.getElementById("paging-next").addEventListener("click", function(){list.changePage('next')}.bind(this));
//document.getElementById("load-button").addEventListener("click", loading.loadMore);
document.getElementById("category-select").addEventListener("change", function(){list.select()}.bind(this));


}(window, document));