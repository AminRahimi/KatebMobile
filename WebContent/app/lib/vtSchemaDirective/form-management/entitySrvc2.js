angular.module('schemaForm').factory('entitySrvc', [ 'Restangular', '$q','$location', function(restangularService,  $q,$location) {
	var mapOfEntityTypeByKey = {};
	var webSocket;
	return {
		getEntityTypeList : function() {
			return restangularService.all('entity_type/items').getList();
		},
		addEntityType : function(data) {
			return restangularService.all('entity_type/items').post(data);
		},
		updateEntityType : function(data) {
			var key = data.entityKey;
			return restangularService.all('entity_type/items/' + key).post(data);
		},
		getEntityTypeChild : function(entityKey) {
			return restangularService.one('entity_type/items', entityKey).get({
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
			return restangularService.all('entity/' + entityKey + '/items/' + _entity._uid).post(_entity);
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
		correctEntityTypeSchemaForDesign:function(entityTypeSchema){
			angular.forEach(entityTypeSchema.jsonSchema.staticSections, function(_propVal, _prpKey) {
				angular.forEach(entityTypeSchema.jsonSchema.viewGroups, function(_viewGroup,indexOfViewGroup) {
					angular.forEach(_viewGroup.members, function(_member, indexOfMember) {
						if (_member ==  _prpKey) {
							entityTypeSchema.jsonSchema.viewGroups[indexOfViewGroup].members[indexOfMember] = _prpKey.replace("#","");
						}
					});
				});
			});
			angular.forEach(entityTypeSchema.jsonSchema.staticSections, function(_propVal, _prpKey) {
				entityTypeSchema.jsonSchema.staticSections[_prpKey.replace("#","")] = angular.copy(entityTypeSchema.jsonSchema.staticSections[_prpKey]);
				delete  entityTypeSchema.jsonSchema.staticSections[_prpKey];
			});
			
			
			delete entityTypeSchema.originalElement;
			return entityTypeSchema;
		},
		getEntityType : function(entityKey) {	
			var _this = this;			
			return restangularService.one('entity_type/items', entityKey).get().then(function(response) {
				response.data.jsonSchema = response.data.schema;
				var schema = _this.addRequiredBoolToViewGroups(response.data);
				schema.jsonSchema.extents.list = _.reject(schema.jsonSchema.extents.list, function(prop) {
					return prop == "isDeleted";
				});
				var _entityType = _this.correctEntityTypeSchemaForDesign(schema);
				return {data:_entityType};
			});
		},
		getEntityPagedList : function(entityKey, pageNum, pageSize) {
			return restangularService.all('entity/' + entityKey + '/items').getList({
				pageNum : pageNum,
				pageSize : pageSize,
				extent : 'full'
			});
		},
		getEntityPagedListByTopicUid : function(entityKey, currentTopicUid, pageNum, pageSize, showDeleted) {
			// if(entityKey=="person"){
			// return restangularService.all('entity/' + entityKey +
			// '/items').getList({
			// pageNum : pageNum,
			// pageSize : pageSize
			// });
			// }
			return restangularService.all('entity/' + entityKey + '/items').getList({
				pageNum : pageNum,
				pageSize : pageSize,
				topicUid : currentTopicUid,
				extent : 'list',
				showDeleted : showDeleted
			});
		},
		getEntity : function(entityKey, uid) {
			return restangularService.one('entity/' + entityKey + '/items', uid).get({
				extent : 'full'
			});
		},
		updateEntity : function(entityKey, uid, data) {
			var correctedData = this.correctEntityData(data);
			return restangularService.one('entity/' + entityKey + '/items', uid).post('', correctedData);
		},
		addEntity : function(entityKey, data) {
			var correctedData = this.correctEntityData(data);

			return restangularService.all('entity/' + entityKey + '/items').post(correctedData);
		},
		getIntersectionEntityList : function(entity, entityKey, showDeleted) {
			return restangularService.all('entity/search').post(this.correctEntityData(entity), {
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
			return restangularService.all('entity/search').getList({
				query : query,
				entityKey : entityKey,
				extent : 'list'
			});
		},
		deleteEntity : function(entityKey, entityUid, entityData) {
			return restangularService.one('entity/' + entityKey + '/items', entityUid).remove();
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
			return restangularService.one('entity/diff', entityUid).get({
				fromDate : fromDate,
				toDate : toDate,
				pageNum : pageNum,
				pageSize : pageSize,
			});
		},
		updateInfo : function(entityKey, uid, data) {
			return restangularService.all('entity/update_info/' + entityKey + '/' + uid).post();
		},
		getTags : function(query) {
			return restangularService.all('tag/search?query=' + query).getList();
		},
		openSocketSetIsModifying : function(entityUID,onmessageFn) {
			
			var protPortDomain=$location.protocol() + "://" + $location.host() + ":" + $location.port();
			
			var afterProtPortDomain= $location.absUrl().replace($location.path(),"").replace("#","").replace(protPortDomain,"");
			
			// var deerred = $q.defer();
			// var messages = document.getElementById("messages");

			// Ensures only one connection is open at a time
			if (webSocket !== undefined && webSocket.readyState !== WebSocket.CLOSED) {
				// writeResponse("WebSocket is already opened.");
				/*
				 * deerred.resolve({ isOpen : true });
				 */
				return 
			}
			// Create a new instance of the websocket
			webSocket = new WebSocket("ws://"+$location.host()+":"+$location.port()+ afterProtPortDomain +"concurrentEdit/" + entityUID);

			/**
			 * Binds functions to the listeners for the websocket.
			 */
			webSocket.onopen = function(event) {
				// For reasons I can't determine, onopen gets called twice
				// and the first time event.data is undefined.
				// Leave a comment if you know the answer.
				if (event.data === undefined)
					return;

				// writeResponse('onopen: ' + event.data);
				// deerred.resolve(event.data);
			};

			webSocket.onmessage = function(event) {
				// writeResponse('onmessage: ' + event.data);
				// deerred.resolve(event.data);
				onmessageFn(event.data);
			};

			webSocket.onclose = function(event) {
				// writeResponse("Connection closed");
			};

			/**
			 * Sends the value of the text input to the server
			 */
			function send() {
				var text = document.getElementById("messageinput").value;
				// webSocket.send(text);
			}

			function closeSocket() {
				webSocket.close();
			}

			function writeResponse(text) {
				// messages.innerHTML += "<br/>" + text;
				// console.log(text);
			}
			// return deerred.promise;
		},
		closeSocket:function(){
			if(webSocket){
				webSocket.close();
			}
		}
	};
} ]);