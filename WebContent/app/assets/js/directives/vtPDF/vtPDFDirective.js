angular.module('vtPDF', []).directive("vtPdf", function() {
	var uniqueId = 1;
	return {
		restrict : 'AE',
		templateUrl : "app/assets/js/directives/vtPDF/vtPDFDirectiveTemplate.html",
		scope : {
			controlFn : '=',
		},
		controller : function($scope, $timeout, $http) {


			
			$scope.Data = {
				pdfContainerId : 'vtpdf-container' + uniqueId++,
				pdfViewerUrl : "app/lib/pdf.js/web/viewer.html?file=",
				PDFObject: null,
				supportsPDFs: 'loading',
				isLoading: true,
			};
			$scope.Func = {
				getBlobUrlFromPdfUrl: function(){
					return $http({
						url: $scope.controlFn.pdfUrl,
						method: "GET",
						responseType: "blob"
					}).then(function(res) {
						var blob = res.data.slice(0, res.data.size, "application/pdf");
						return URL.createObjectURL(blob);
					});
				},
			};
			$timeout(function() {
				if(!$scope.controlFn.isLargeSizeError) {
					$scope.Data.supportsPDFs = PDFObject.supportsPDFs;
					if ($scope.Data.supportsPDFs) {
						if ($scope.controlFn.isBlob) {
							$scope.Data.pdfViewerUrl = $scope.controlFn.pdfUrl;
							$timeout(function() {
								$scope.Data.PDFObject = new PDFObject.embed($scope.Data.pdfViewerUrl, "#"+$scope.Data.pdfContainerId);
								$scope.Data.isLoading = false;
							}, 1);
						} else {
							$scope.Func.getBlobUrlFromPdfUrl().then(function(res) {
								$scope.Data.isLoading = false;
								$scope.Data.pdfViewerUrl = res;
								$scope.Data.PDFObject = new PDFObject.embed($scope.Data.pdfViewerUrl, "#"+$scope.Data.pdfContainerId);
							});
						}
					} else {
						$scope.Data.isLoading = false;
						if ($scope.controlFn.isBlob) {
							$scope.Data.pdfViewerUrl = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent($scope.controlFn.pdfUrl)
						} else {
							$scope.Data.pdfViewerUrl = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/" + $scope.controlFn.pdfUrl);
						}
					}
				} else {
					$scope.Data.isLoading = false;
				}
			}, 1);

		},

		link : function(scope, element, attrs, ctrls) {

		}
	};
});
