
$(document).ready(function() {
	var $itemDiv = $('#auction-items');
	
	function getAuctionItems() {
		$.get("/users/getAllItems",
			function(items) {
				console.log("after getting all items");
				//console.log(items);
				for (var i = 0; i < items.length; i++) {
					var imageURL = items[i].image;
					var title = items[i].title;
					var price = items[i].price;
					var seller = items[i].user;
					var endDate = new Date(items[i].endDate);
					var month = endDate.getMonth() + 1;
					var day = endDate.getDate();
					var year = endDate.getFullYear();
					var $minPrice = $('#js-minPrice').val();
					var $maxPrice = $('#js-maxPrice').val();
					
					if (price >= $minPrice && price <= $maxPrice) {
						var contentString = "";
						contentString += "<figure class='filteredItems'>";
						contentString += "<img class=\"thumb\" src=\"" + imageURL + "\" alt=\"\">";
						contentString += "<figcaption>" + title + " $" + price.toFixed(2) + "</figcaption>"
						contentString += "<figcaption>" + seller + " " + month + "-" + day + "-" + year + "</figcaption>"
						contentString += "</figure>"
						$itemDiv.before(contentString);
					}					
				}
			});
		}

$('#seeItems').on('click', function() {
		$('.filteredItems').remove();
		getAuctionItems();
	});
		
});