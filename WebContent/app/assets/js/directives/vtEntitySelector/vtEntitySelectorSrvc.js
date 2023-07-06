angular.module('vtEntitySelector').factory('vtEntitySelectorSrvc', [ 'Restangular', '$q', '$modal', function(Restangular, $q, $modal) {
	var mapOfEntityTypeByKey = {};
	return {
		openEntityInfoModal : function(entityModel, entityTypeKey) {
			var modalInstance = $modal.open({
				templateUrl : 'app/assets/js/directives/vtEntitySelector/viewEntityModalTemplate.html',
				controller : 'vtEntitySelector.viewEntityModalCtrl',
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
		},
		openAddNewEntityModal : function(entityTypeKey) {
			var modalInstance = $modal.open({
				templateUrl : 'app/assets/js/directives/vtEntitySelector/addEntityModalTemplate.html',
				controller : 'vtEntitySelector.addEntityModalCtrl',
				windowClass : 'modalLarge',
				backdrop : 'static',
				size : 'lg',
				resolve : {
					entityTypeKey : function() {
						return entityTypeKey;
					}
				}

			});
			return modalInstance.result;
		},
		
		
		getEntityTypeList : function() {
			return Restangular.all('entity_type/items').getList();
		},
		addEntityType : function(data) {
			return Restangular.all('entity_type/items').post(data);
		},
		updateEntityType : function(data) {
			var key = data.entityKey;
			return Restangular.all('entity_type/items/' + key).post(data);
		},
		getEntityTypeChild : function(entityKey) {
			return Restangular.one('entity_type/items', entityKey).get({
				includeInheritedFields : false
			});
		},

		restoreEntity : function(entityKey, entity) {
			var _entity = angular.copy(entity);
			_entity.isDeleted = false;
			var _topics = [];
			angular.forEach(_entity.topics, function(_topic) {
				_topics.push(_topic._uid);
			})
			_entity.topics = _topics;
			return Restangular.all('entity/' + entityKey + '/items/' + _entity._uid).post(_entity);
		},
		addRequiredBoolToViewGroups : function(schema) {
			var propertyKeyListHasRequired = [];
			_.filter(schema.jsonSchema.properties, function(property, keyName) {
				if (property.required) {
					propertyKeyListHasRequired.push(keyName);
					return true;
				} else {
					return false;
				}

			});

			angular.forEach(schema.jsonSchema.viewGroups, function(viewGroup) {
				angular.forEach(propertyKeyListHasRequired, function(propertyKeyHasRequired) {
					if (_.contains(viewGroup.members, propertyKeyHasRequired)) {
						viewGroup.hasRequierd = true;
					}
				})

			});

			return schema;
		},
		getEntityType : function(entityKey) {

			var deferred = $q.defer();
			var that = this;

			var entityType = this.getCachedEntityTypeByKey(entityKey);
			if (!angular.isObject(entityType)) {
				Restangular.one('entity_type/items', entityKey).get().then(function(response) {

					var schema = that.addRequiredBoolToViewGroups(response.data);
					schema.jsonSchema.extents.list = _.reject(schema.jsonSchema.extents.list, function(prop) {
						return prop == "isDeleted";
					});
					// that.cacheEntityType(response.data);
					that.cacheEntityType(schema);
					deferred.resolve(response);
				});
			} else {
				deferred.resolve({
					data : entityType
				});
			}
			;

			return deferred.promise;
		},
		getEntityPagedList : function(entityKey, pageNum, pageSize) {
			return Restangular.all('entity/' + entityKey + '/items').getList({
				pageNum : pageNum,
				pageSize : pageSize,
				extent : 'full'
			});
		},
//		getEntityPagedListByTopicUid : function(entityKey, currentTopicUid, pageNum, pageSize, showDeleted) {
//			// if(entityKey=="person"){
//			// return Restangular.all('entity/' + entityKey +
//			// '/items').getList({
//			// pageNum : pageNum,
//			// pageSize : pageSize
//			// });
//			// }
//			return Restangular.all('entity/' + entityKey + '/items').getList({
//				pageNum : pageNum,
//				pageSize : pageSize,
//				topicUid : currentTopicUid,
//				extent : 'list',
//				showDeleted : showDeleted
//			});
//		},
		getEntity : function(entityKey, uid) {
			return Restangular.one('entity/' + entityKey + '/items', uid).get({
				extent : 'full'
			});
		},
		updateEntity : function(entityKey, uid, data) {
			var correctedData = this.correctEntityData(data);
			return Restangular.one('entity/' + entityKey + '/items', uid).post('', correctedData);
		},
		addEntity : function(entityKey, data) {
			var correctedData = this.correctEntityData(data);

			return Restangular.all('entity/' + entityKey + '/items').post(correctedData);
		},
		getIntersectionEntityList : function(entity, entityKey, showDeleted) {
			return Restangular.all('entity/search').post(this.correctEntityData(entity), {
				entityKey : entityKey,
				extent : 'full',
				crossSearch : true,
				showDeleted : showDeleted
			});
		},
		getMapOfEntityTypeByKey : function() {
			return mapOfEntityTypeByKey;
		},
		getCachedEntityTypeByKey : function(key) {
			return mapOfEntityTypeByKey[key];
		},
		cacheEntityType : function(entityType) {
			mapOfEntityTypeByKey[entityType.entityKey] = entityType;
		},
		searchEntity : function(query, entityKey) {
			return Restangular.all('entity/search').getList({
				query : query,
				entityKey : entityKey,
				extent : 'list'
			});
		},
		correctEntityData : function(entityData) {
			entityData = angular.copy(entityData);
			for (filedName in entityData) {
				if (entityData[filedName]) {
					if (entityData[filedName].getTime) {
						entityData[filedName] = entityData[filedName].getTime();
					}

					if (entityData[filedName].push) {
						for (var i = 0; i < entityData[filedName].length; i++) {
							if (entityData[filedName][i]._uid) {
								entityData[filedName][i] = entityData[filedName][i]._uid;
							}
						}
					} else {
						if (entityData[filedName]._uid) {
							entityData[filedName] = entityData[filedName]._uid;
						}
					}
				}
			}
			return entityData;
		},
		getEntityDiff : function(entityUid, fromDate, toDate, pageNum, pageSize) {
			return Restangular.one('entity/diff', entityUid).get({
				fromDate : fromDate,
				toDate : toDate,
				pageNum : pageNum,
				pageSize : pageSize,
			});
		},
		updateInfo : function(entityKey, uid, data) {
			return Restangular.all('entity/update_info/' + entityKey + '/' + uid).post();
		},
		getTags : function(query) {
			return Restangular.all('tag/search?query=' + query).getList();
		}

	};
} ]);