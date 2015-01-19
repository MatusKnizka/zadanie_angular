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

var Pagination = {
	numOfPages: function(dataLength, itemsToPage, actualPage) {
		var pages = [];
		for(var x = 1; x<=Math.ceil(dataLength / itemsToPage); x++) {

			pages.push(x);
		}
		
		return pages;
	}
}