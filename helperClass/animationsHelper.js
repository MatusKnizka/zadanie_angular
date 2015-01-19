// ANIMATION FUNCTIONS
var animationsHelper = {
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