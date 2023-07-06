angular.module('schemaForm').factory('entitySelectorSrvc', [ 'Restangular', '$q','$modal', function(Restangular, $q,$modal) {
	return {
		openEntityInfoModal:function(entityModel,entityTypeKey){
			var modalInstance = $modal.open({
				templateUrl : 'app/lib/vtSchemaDirective/components/entitySelector/partials/entityViewModalTemplate.html',
				controller : 'viewEntityModalCtrl',
				windowClass : 'modal-XLarge',
				backdrop : 'static',
				resolve : {
					entity : function() {
						return entityModel;
					},
					entityTypeKey : function() {
						return entityTypeKey;
					}
				}
			});
			return modalInstance.result;
		}
		
	};
} ]);