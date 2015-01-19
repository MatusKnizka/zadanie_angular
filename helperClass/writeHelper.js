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
			var spanText;

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
					spanText = document.createTextNode(categories[i]);	
				} else {
					spanText = document.createTextNode(categories[i]+", ");	
				}

				span.appendChild(spanText);
				out.appendChild(span);
			}
			return out;
		}, 

		itemMin: function(page, media, itemsAll, itemsToPage) {
			if(media == 'mobile') {
				return 0;
			} else {
				return (page-1)*itemsToPage;
			}
		},

		itemMax: function(page, media, itemsAll, itemsToPage) {
			if(page == undefined) {
				return itemsToPage;
			}

			if(media === 'mobile') {
				return page*itemsOnPage;
			} else {	
				if((itemsAll-((page-1)*itemsToPage)) <= itemsToPage) {
					return itemsAll;
				} else {
					return page*itemsToPage;
				}
			}
		}
	};
// END