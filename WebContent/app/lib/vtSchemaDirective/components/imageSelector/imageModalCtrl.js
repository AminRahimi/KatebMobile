angular.module("imageSelect").controller('imageModalCtrl', function($rootScope, $scope, $modalInstance, toaster, image, directiveElement, $timeout) {
	$scope.image = image;
	$scope.cancel = function() {
		$modalInstance.dismiss('cancel');
	};

	function getImageSize(img, callback) {
		img = $(img);

		var wait = setInterval(function() {
			var w = img.width(), h = img.height();

			if (w && h) {
				done(w, h);
			}
		}, 0);

		var onLoad;
		img.on('load', onLoad = function() {
			done(img.width(), img.height());
		});

		var isDone = false;
		function done() {
			if (isDone) {
				return;
			}
			isDone = true;

			clearInterval(wait);
			img.off('load', onLoad);

			callback.apply(this, arguments);
		}
	}

	var slider = document.getElementById('range');
	$timeout(function() {
		getImageSize($(".fakeForGetDems"), function(imgWidth, imgHeight) {
			var windowHeight = $(window).height() - 60;
			var windowWwidth = $(window).width();
			
			var modalWidth = windowWwidth -50;
			var modalHeight = windowHeight - 50;
			
			
			if (imgHeight > modalHeight && imgWidth < modalWidth) {
				$(".imageOnModal").height(modalHeight - 20);
				
			} else if (imgWidth > modalWidth && imgHeight < modalHeight) {
				$(".imageOnModal").width(modalWidth -20);
			} else if (imgWidth > modalWidth && imgHeight > modalHeight) {
				var widthRet = imgWidth / modalWidth;
				var heightRet = imgHeight / modalHeight;
				if (widthRet > heightRet) {
					$(".imageOnModal").width(modalWidth - 20);
				} else {
					$(".imageOnModal").height(modalHeight - 20);
				}
			} else if (imgWidth < modalWidth && imgHeight < modalHeight) {
				if (imgWidth * 2 < (modalWidth -20) && imgHeight * 2 < (modalHeight-20)) {
					$(".imageOnModal").width(imgWidth * 2);
					$(".imageOnModal").height(imgHeight * 2);
				}
			}
			$(".imageModalCnt .modal-dialog").width(modalWidth);
			$(".imageModalCnt .modal-dialog").height(modalHeight);
			var slider = document.getElementById('range');

			noUiSlider.create(slider, {
				start : 50,
				connect : "lower",
				step : 5,
				pips : { // Show a scale with the slider
					mode : 'steps',
					density : 2
				},
				range : {
					min : 0,
					max : 100
				}
			});
			var origWidth = $(".imageOnModal").width();
			var origHeight = $(".imageOnModal").height();
			slider.noUiSlider.on('update', function(a, b, c) {
				if(c==50){
					$(".imageOnModal").width(origWidth);
					$(".imageOnModal").height(origHeight);
				}else{
					
					$(".imageOnModal").width((c / 100) * 3 * origWidth);
					$(".imageOnModal").height((c / 100) * 3 * origHeight);
				}
			});
		});
	}, 1);

	$scope.onZoominClick = function() {
		var slider = document.getElementById('range');
		if (parseInt(slider.noUiSlider.get()) <= 95) {
			slider.noUiSlider.set(parseInt(slider.noUiSlider.get()) + 5);

		}
	}

	$scope.onZoomoutClick = function() {
		var slider = document.getElementById('range');
		if (parseInt(slider.noUiSlider.get()) >= 5) {
			slider.noUiSlider.set(parseInt(slider.noUiSlider.get()) - 5);
		}
	}

	$scope.onDownloadClick = function() {
		$("<iframe style='display:none;' src='" + $scope.image.downloadLink + "'></iframe>").appendTo("body");
	}

});