angular.module('vtNgCropper', []).directive("vtNgCropper", function() {

	return {
		restrict : 'AE',
		templateUrl : 'app/lib/media/vtNgCropper/vtNgCropper.html',
		scope : {
			controlFn: "=",
			cropper:"=",
		},
		controller : function($scope, $element, $attrs, $injector, $q) {
			var $image = $('.img-container > img'),
	        $dataX = $('#dataX'),
	        $dataY = $('#dataY'),
	        $dataHeight = $('#dataHeight'),
	        $dataWidth = $('#dataWidth'),
	        $dataRotate = $('#dataRotate'),
	        options = {
	          aspectRatio: $scope.controlFn.aspectRatio || (336 / 200),
	          strict: false,
	          preview: '.img-preview',
	          crop: function (data) {
	            $dataX.val(Math.round(data.x));
	            $dataY.val(Math.round(data.y));
	            $dataHeight.val(Math.round(data.height));
	            $dataWidth.val(Math.round(data.width));
	            $dataRotate.val(Math.round(data.rotate));
	          }
	        };
			$image.attr("src",$scope.controlFn.src);
	    $image.on({
	      'build.cropper': function (e) {
	      },
	      'built.cropper': function (e) {
	      },
	      'dragstart.cropper': function (e) {
	      },
	      'dragmove.cropper': function (e) {
	      },
	      'dragend.cropper': function (e) {
	      },
	      'zoomin.cropper': function (e) {
	      },
	      'zoomout.cropper': function (e) {
	      }
	    }).cropper(options);
	    
	    
		    var URL = window.URL || window.webkitURL;
			if ($scope.controlFn.file && /^image\/\w+$/.test($scope.controlFn.file.type)) {
		       blobURL = URL.createObjectURL($scope.controlFn.file);
		       $image.one('built.cropper', function () {
		         URL.revokeObjectURL(blobURL); // Revoke when load complete
		       }).cropper('reset').cropper('replace', blobURL);
		     } 
				
				 $(document.body).on('click', '[data-method]', function () {
				      var data = $(this).data(),
				          $target,
				          result;
	
				      if (data.method) {
				        data = $.extend({}, data); // Clone a new one
	
				        if (typeof data.target !== 'undefined') {
				          $target = $(data.target);
	
				          if (typeof data.option === 'undefined') {
				            try {
				              data.option = JSON.parse($target.val());
				            } catch (e) {
				            }
				          }
				        }
	
				        result = $image.cropper(data.method, data.option);
	
				        if (data.method === 'getCroppedCanvas') {
				          $('#getCroppedCanvasModal').modal().find('.modal-body').html(result);
				        }
	
				        if ($.isPlainObject(result) && $target) {
				          try {
				            $target.val(JSON.stringify(result));
				          } catch (e) {
				          }
				        }
	
				      }
				    }).on('keydown', function (e) {
	
				      switch (e.which) {
				        case 37:
				          e.preventDefault();
				          $image.cropper('move', -1, 0);
				          break;
	
				        case 38:
				          e.preventDefault();
				          $image.cropper('move', 0, -1);
				          break;
	
				        case 39:
				          e.preventDefault();
				          $image.cropper('move', 1, 0);
				          break;
	
				        case 40:
				          e.preventDefault();
				          $image.cropper('move', 0, 1);
				          break;
				      }
	
				    });
				var dataURItoBlob= function(dataURI) {
					    // convert base64/URLEncoded data component to raw binary data held in a string
					    var byteString;
					    if (dataURI.split(',')[0].indexOf('base64') >= 0)
					        byteString = atob(dataURI.split(',')[1]);
					    else
					        byteString = unescape(dataURI.split(',')[1]);
	
					    // separate out the mime component
					    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
	
					    // write the bytes of the string to a typed array
					    var ia = new Uint8Array(byteString.length);
					    for (var i = 0; i < byteString.length; i++) {
					        ia[i] = byteString.charCodeAt(i);
					    }
	
					    return new Blob([ia], {type:mimeString});
					};
				 $scope.controlFn.getImage=function(){
					 var canv=$image.cropper("getCroppedCanvas");
					 var blob=dataURItoBlob(canv.toDataURL());
					 blob.lastModifiedDate = new Date();
					 blob.name = '111';
					 return blob;
					};
				
		},
		link : function(scope, element, attrs, ctrls) {

		}
	};
});