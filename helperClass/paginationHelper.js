

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

	maxPages: function(page, itemsToPage, data) {
		if(page >= data.length/itemsToPage) {
			page = Math.ceil(data.length/itemsToPage);
		}
		return page;
	}
};