var app = angular.module("list", []);

app.factory('load', ['$http', function($http) {
	return $http.get('http://academy.tutoky.com/api/json.php');
}]);

app.controller('items', ['$scope', 'load', function($scope, load) {
	this.page = 1;
	this.itemsToPage = 12;

	load.success(function(data) {
		$scope.data = data;
		$scope.pages = Pagination.numOfPages($scope.data.length, this.itemsToPage, this.page);
	}.bind(this));



	this.getItemMax = function() {
		return this.page * this.itemsToPage;
	}

	this.getItemMin = function() {
		if (this.page * this.itemsToPage < $scope.data.length) {
			return -this.itemsToPage;
		}
		return (this.page - 1) * this.itemsToPage - $scope.data.length;
	}

	this.nextPage = function() {
		if ($scope.data.length > this.getItemMax()) {
			this.page++;
		}
	}

	this.toPage = function(page) {
		this.page = page;
	}

	this.previousPage = function() {
		if (this.page > 1) {
			this.page--;
		}
	}

	this.getImage = function(image) {
		if (image == "") {
			return "no-image";
		}
		return image;
	}

	this.getTime = function(timestamp) {
		return DateTimeHelper.timestampParse(timestamp);
	}
}]);