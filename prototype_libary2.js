(function(window, document, undefined){

	/**
	* List of .
	* @const {number} PAGE - first page after loading.
	* @const {number} ITEM_TO_PAGE - items to page for first loading.
	* @const {string} URL - url for json file.
	* @const {string} HTML_SCOPE - scope to show items
	*/

	const PAGE = 1;
	const ITEM_TO_PAGE = 12;
	const CATEGORY = 'All';
	const URL = "http://academy.tutoky.com/api/json.php";
	const HTML_SCOPE = "videolist";
	const SELECTED_CATEGORY = "All";


	const PAGING_OPTIONS = [8, 12, 16, 20];
	
	const CLASS_NAME_PAGING_PREVIOUS = "paging-previous";
	const CLASS_NAME_PAGING_NEXT = "paging-next";
	const CLASS_NAME_CATEGORY_SELECT = "favorites-category-select";
	const CLASS_NAME_PAGING_LOAD_MORE = "load-button";
	const CLASS_NAME_PAGING_ITEMS_TO_PAGE_SELECT = "favorites-list-items-to-page";
	const CLASS_NAME_FAVORITES_ENABLE_BUTTON = "favorites-enable-button";

	/**
	* List of items.
	* @constructor
	* @param {string} htmlScope - in how html scope we need to show items.
	* @param {string} url - url adress for json file.
	* @param {string} page - first page after loading.
	* @param {string} itemsToPage - number of items to show.
	* @param {string} media - type of media (mobile or desktop)
	*/

	function List(htmlScope, url, page, itemsToPage, media, selectedCategory) {
		this.name = htmlScope;
		this.rootElement = document.getElementById(htmlScope);
		this.url = url;
		this.page = page;
		this.itemsToPage = itemsToPage;
		this.categories = [];
		this.media = media;
		this.allData = [];
		this.data = [];
		this.itemStart = 1;
		this.itemEnd =  this.itemsToPage;
		this.selectedCategory = selectedCategory;
		this.load();
	}

	List.prototype.load = function() {
		AjaxHelper.load(this.url, [], this.processResponse.bind(this));


		var storage = JSON.parse(localStorage.getItem("favorites"));
     	storage.enable = false; 
     	localStorage.setItem("favorites", JSON.stringify(storage));


		this.rootElement.getElementsByClassName( CLASS_NAME_FAVORITES_ENABLE_BUTTON )[0].addEventListener("click", function(){ this.changeFavoriteSettings("enable_button") }.bind(this));
		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_PREVIOUS )[0].addEventListener("click", function(){this.changePage('previous')}.bind(this));
		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_NEXT )[0].addEventListener("click", function(){this.changePage('next')}.bind(this));
		this.rootElement.getElementsByClassName( CLASS_NAME_CATEGORY_SELECT )[0].addEventListener("change", function(){this.selectCategory()}.bind(this));
		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_LOAD_MORE )[0].addEventListener("click", function(){}.bind(this));

		$(".list-favorites").click(function(){
			$(".favorites").fadeToggle();
		});

		//listener for categories in videowindow.
		this.rootElement.querySelector(".list-body").addEventListener("click", function (e){
			if(e.target.getAttribute("data") !== null) {
				var data = e.target.getAttribute("data");
				var options = rootElement.getElementById(CLASS_NAME_CATEGORY_SELECT).options;
				rootElement.getElementById(CLASS_NAME_CATEGORY_SELECT).selectedIndex = CategoriesHelper.selectIndex(data, options);
				this.selectCategory();
			}    

			if(e.target.getAttribute("data-fav") !== null) {
				this.changeFavoriteSettings("add_to_favorites", e.target.getAttribute("data-fav"));
			} 		
		}.bind(this), false);


		this.itemsWriteSelect(PAGING_OPTIONS, CLASS_NAME_PAGING_ITEMS_TO_PAGE_SELECT);
	}


	List.prototype._render = function() {
		this._renderFavoriteListSettings();
		this.itemStart = WriteHelper.itemMin(this.page, this.media, this.data.length, this.itemsToPage);
		this.itemEnd =  WriteHelper.itemMax(this.page, this.media, this.data.length, this.itemsToPage);

		this._renderList();
		this._renderPagination();

     	this.rootElement.getElementsByClassName(CLASS_NAME_CATEGORY_SELECT)[0].innerHTML = CategoriesHelper.selectList("select-category", this.data, this.data.length, this.selectedCategory); // SELECT LIST FOR CATEGORIES
     	
     	animationsHelper.itemHover(); // ANIMATION FOR ITEM
     	animationsHelper.paginationButtonHover();  // ANIMATION FOR PREV AND NEXT BUTTON
     	animationsHelper.paginationPageButtonHover();  // ANIMATIONS OF PAGINATION
     }

     List.prototype.selectCategory = function() {
     	var storage = JSON.parse(localStorage.getItem("favorites"));
     	if(storage.enable) {
     		alert("mas zvolene favorit");
     	}
     	this.selectedCategory = this.rootElement.getElementsByClassName( CLASS_NAME_CATEGORY_SELECT )[0].value;
     	this.data = CategoriesHelper.parseVideos(this.selectedCategory, this.allData);
     	this.page = paginationHelper.maxPages(this.page, this.itemsToPage, this.data);
     	this._render();
     }

     List.prototype.processResponse = function(xhr) {
     	var obj = JSON.parse(xhr.responseText);
     	this.data = obj;
     	this.allData = obj;
     	this._render();
     }

     List.prototype._renderList = function() {
     	var frag = document.createDocumentFragment();

     	this.rootElement.getElementsByClassName("list-body")[0].innerHTML = "";

     	for(var i=this.itemStart; i<this.itemEnd; i++) {
     		var li = document.createElement("li"); 
     		li.className = "list-item"; 

     		var div = document.createElement("div");
     		div.className = "list-item-shadow";

     		var favorite = document.createElement("span");
     		favorite.className = "list-item-shadow-favorite";

     		favorite.setAttribute("data-fav", i);

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
     		div.appendChild(favorite);
     		div.appendChild(span);
     		li.appendChild(video);
     		li.appendChild(article);
     		article.appendChild(h2);
     		article.appendChild(h3); 
     		
     		var favoriteText = document.createTextNode(FavoriteHelper.textToItem(i));
     		var title = document.createTextNode(this.data[i]['title']);
     		var timestamp = document.createTextNode(DateTimeHelper.timestampParse(this.data[i]['timestamp']));
     		var videoTitle = WriteHelper.getCategories(this.data[i]['categories']);
     		video.setAttribute('style', 'background: url('+WriteHelper.getImage(this.data[i]['image'])+'.jpg);background-size: cover;background-position: center center;');

     		favorite.appendChild(favoriteText);
     		span.appendChild(videoTitle);  
     		h2.appendChild(title);
     		h3.appendChild(timestamp);
     		frag.appendChild(li);	
     	}

     	this.rootElement.getElementsByClassName("list-body")[0].appendChild(frag);
     	$(".list-item").fadeOut(1, function(){
     		$(".list-item").fadeIn(500);
     	});

     	var storage = JSON.parse(localStorage.getItem("favorites"));
     	for(var i=this.itemStart; i<this.itemEnd; i++) {
     		for(var x=0; x<storage.items.length; x++) {
     			if(parseInt(storage.items[x]) === i)
     				$(".list-item").eq(i-((this.page-1)*this.itemsToPage)).css("background", "#ffcc00");
     				
     		}
     	}

     	if(storage.enable) {
     		$(".list-item").css("background", "#ffcc00");
     	}
     };

     List.prototype._renderPagination = function() {
     	var pageItems = "";
     	var pages = Math.ceil(this.data.length/this.itemsToPage);
     	// first page
     	if(this.page === 1) {
     		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_PREVIOUS )[0].style.visibility = "hidden";
     	} else {
     		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_PREVIOUS )[0].style.visibility = "visible";
     	}

     	// last page
     	if(this.page === pages) {
     		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_NEXT )[0].style.visibility = "hidden";
     	} else {
     		this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_NEXT )[0].style.visibility = "visible";
     	}

     	if(this.page > 2) {
     		pageItems += '<div class="paging-pagenum" id="1">1</div>';
     		if(this.page > 3) {
     			pageItems += "...";
     		}
     	}

     	for( var x=1; x<=pages; x++) {
     		if(x-1 === this.page) {
     			pageItems += '<div class="paging-pagenum" id="'+x+'" >'+x+'</div>';
     		}

     		if(x === this.page) {
     			pageItems += '<div class="paging-selected" id="'+x+'">'+x+'</div>';
     		}

     		if(x+1 === this.page) {
     			pageItems += '<div class="paging-pagenum" id="'+x+'">'+x+'</div>';
     		}
     	}

     	if(this.page+1 < pages ) {
     		if(this.page+2 < pages) { pageItems += "..."; } 
     		pageItems += '<div class="paging-pagenum" id="'+pages+'">'+pages+'</div>';
     	}
     	this.rootElement.getElementsByClassName("paging-buttons")[0].innerHTML = pageItems;
     	
     	//Parent Listener for paging buttins
     	this.rootElement.querySelector("#paging-buttons").addEventListener("click", function (e){
     		if(!isNaN(parseInt(e.target.id))) {
     			this.changePage(parseInt(e.target.id));
     		}
     	}.bind(this), false);
     };

     List.prototype.changePage = function(operation) {	
     	switch(operation) {
     		case 'next': this.page = paginationHelper.nextPage(this.page, this.data.length, this.itemsToPage);break;
     		case 'previous': this.page = paginationHelper.previousPage(this.page);break;
     		default: this.page = paginationHelper.concretePage(operation);break;
     	}
     	this._render();
     };

     List.prototype.changeItemsToPage = function() {
     	this.itemsToPage = parseInt(this.rootElement.getElementsByClassName( CLASS_NAME_PAGING_ITEMS_TO_PAGE_SELECT )[0].value);
     	this.page = paginationHelper.maxPages(this.page, this.itemsToPage, this.data);
     	this._render();
     };

     List.prototype.itemsWriteSelect = function(pagingOptions, selectParentClass) {
     	var item = "";
     	for(var x=0; x<pagingOptions.length; x++) {
     		if(pagingOptions[x] == this.itemsToPage) {
     			item += "<option value="+pagingOptions[x]+" selected>"+pagingOptions[x]+"</option>";
     		} else {
     			item += "<option value="+pagingOptions[x]+" >"+pagingOptions[x]+"</option>";
     		}
     	}
     	this.rootElement.getElementsByClassName(selectParentClass)[0].innerHTML = item;
     	this.rootElement.getElementsByClassName(selectParentClass)[0].addEventListener("change", function(){this.changeItemsToPage()}.bind(this));
     };


     List.prototype._renderFavoriteListSettings = function() {
     	var storage = JSON.parse(localStorage.getItem("favorites"));
     	if(localStorage.getItem("favorites") === null) {
     		localStorage.setItem("favorites", JSON.stringify({enable: false, items: []}));
     	}
     	
     	this.rootElement.getElementsByClassName( CLASS_NAME_FAVORITES_ENABLE_BUTTON )[0].innerHTML = FavoriteHelper.enableButton( storage.enable );
     	

     	if(storage.enable) {
     		this.putFavoriteVideosToData();
     	} else {
     		this.data = this.allData;
     	}
     };

     List.prototype.changeFavoriteSettings = function(operation, itemId) {
     	var storage = JSON.parse(localStorage.getItem("favorites"));
     	var new_data = [];
     	if(operation === "enable_button") {
     		if(this.selectedCategory === "All") {
     		storage.enable = !storage.enable;
     		} else {
     			alert("mas zvolenu kategoriu !!!!");
     		}
     	}

     	if(operation === "add_to_favorites") {
     		storage.items = FavoriteHelper.addToFavorites(storage.items, parseInt(itemId));     		
     	}


     	localStorage.setItem("favorites", JSON.stringify(storage));
     	
     	this._render();
     	this._renderFavoriteListSettings();
     };


     List.prototype.putFavoriteVideosToData = function() {
     	var storage = JSON.parse(localStorage.getItem("favorites"));
     	console.log(storage.enable);
     	
     		this.data = FavoriteHelper.parseVideosByFavorites(storage.items, this.allData);
     
     		
     	
     	
     	console.log(this.data);
     }

     var list = new List(HTML_SCOPE, URL, PAGE, ITEM_TO_PAGE, CATEGORY, SELECTED_CATEGORY);

 }(window, document));