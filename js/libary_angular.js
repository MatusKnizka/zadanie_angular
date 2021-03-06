var json = angular.module("json", []);
json.factory('load', ['$http', function($http) {
	return $http.get('http://academy.tutoky.com/api/json.php');
}]);

json.controller('main', ['$scope', 'load', function($scope, load) { 
	if(localStorage.getItem("favorites") === null) {
		localStorage.setItem("favorites", "[]")
	}
	$scope.page = 1;
	$scope.itemsToPage = 12;
	$scope.category = 'All';
	$scope.listOfItemsToPage = [8,12,16,20];
	$scope.favorites = JSON.parse(localStorage.getItem("favorites"));	
	$scope.showConfigPanel = false;

	load.success(function(data) {
		$scope.allData = this.getIdToVideos(data);
		$scope.favoriteList = this.selectList($scope.allData);
		$scope.render();
	}.bind(this));

	$scope.render = function() {
		$scope.data = this.parseVideos($scope.category, $scope.allData);
		$scope.pages = this.numOfPages($scope.data.length, $scope.itemsToPage);
		$scope.page = this.maxPages($scope.page, $scope.itemsToPage, $scope.data);
	}.bind(this);

	this.getIdToVideos = function(data) {
		for(var x = 0; x < data.length; x++) {
			data[x].id = x;
		}
		console.log(data);
		return data;
	}

	this.parseVideos = function(parseBy, allData) {
		var output = [];
		if(parseBy !== "All") {
			if(parseBy === "Favorites") {
				for(var x = 0; x < $scope.favorites.length; x++) {
					output.push(allData[$scope.favorites[x]]);
				}
				return output;
			}

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
	};

	this.maxPages = function(page, itemsToPage, data) {
		if(page >= data.length/itemsToPage) {
			page = Math.ceil(data.length/itemsToPage);
		}
		return page;
	};

	this.numOfPages = function(dataLength, itemsToPage) {
		pages = [];
		for(var x = 1; x <= Math.ceil(dataLength/itemsToPage); x++) {
			pages.push(x);
		}
		return pages;
	};

	this.selectList = function(jsonData) {
		var categories = ['All', 'Favorites'];
		var control = 0;
		if(jsonData === undefined) {
			return categories;
		}
		for(x=0; x<jsonData.length; x++) {
			for(i=0; i<jsonData[x].categories.length; i++) {
				for(j=0; j<categories.length; j++) {
					if(jsonData[x].categories[i] !== categories[j]) {
						control = 1;
					} else {
						control = 0;
						break;
					}
				}	
				if(control === 1) {
					categories.push(jsonData[x].categories[i]);
					control = 0;
				}
			}
		}
		return categories;
	};
}]);

var list = angular.module("list", ['json']);

list.controller('configPanel', ['$scope', function($scope){
	this.configPanelButton = function() {
		$scope.$parent.showConfigPanel = !$scope.$parent.showConfigPanel;
	}
}]);

list.controller('favorites', ['$scope', function($scope){
	$scope.$watch('itemsToPage', function() {
		$scope.$parent.itemsToPage = $scope.itemsToPage;
		$scope.render();
	});

	$scope.$watch('category', function() {
		$scope.$parent.category = $scope.category;
		$scope.render();
	});
}]);

list.controller('pagination', ['$scope', function($scope) {
	this.toPage = function(page) {
		$scope.$parent.page = page;
	};
}]);

list.controller('items', ['$scope', function($scope) {
	this.setCategory = function(category) {
		$scope.$parent.category = category;
		$scope.render();
	};

	this.getItemMin = function() {
		if ($scope.page * $scope.itemsToPage < $scope.data.length) {
			return -$scope.$parent.itemsToPage;
		}
		return ($scope.page - 1) * $scope.itemsToPage - $scope.data.length;
	};

	this.getTime = function(timestamp) {
		var date = new Date(parseInt(timestamp));
		days_array = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
		months_array = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
		return days_array[date.getDay()]+", "+date.getDate()+" "+months_array[date.getMonth()]+" "+date.getFullYear();
	};

	this.getFavoriteImage = function(itemId) {
		console.log(itemId);
		var style = {};
		style.background = 'url(image/favorites.png)';
		style.width = '30px';
		style.height = '30px';
		style['background-size'] = 'cover';
		for(var x = 0; x<$scope.favorites.length; x++) {
			if($scope.favorites[x] === itemId) {
				style['background-position'] = 'right';
				return style;
			} 
		}
		style['background-position'] = 'left';
		return style;
	};

	this.manageFavorites = function(itemId) {
		for(var x = 0; x<$scope.favorites.length; x++) {
			if($scope.favorites[x] === itemId) {
				$scope.$parent.favorites.splice(x, 1);
				localStorage.setItem("favorites", JSON.stringify($scope.favorites));
				return false;
			}
		}
		$scope.$parent.favorites.push(itemId);
		localStorage.setItem("favorites", JSON.stringify($scope.favorites));
	};
}]);

var App = angular.module('App', ['json', 'list']);