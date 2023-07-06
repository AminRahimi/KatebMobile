angular.module('schemaForm').factory('entitySrvc', function( Restangular, $q, $location) {
	var mapOfEntityTypeByKey = {};
	var webSocket;
	return {
		getEntityTypeList : function(pageNum, pageSize) {
			return Restangular.all('entity_type/items').getList({startItemIndex:(((pageNum-1)*pageSize)+1), pageSize:pageSize});
		},
		addEntityType : function(data) {
			return Restangular.all('entity_type/items').post(data);
		},
		updateEntityType : function(data) {
			var _data =  angular.copy(data)
			var key = _data.key;
			delete  _data.key;
			return Restangular.all('entity_type/items/' + key).post(_data);
		},
		getEntityTypeChild : function(entityKey,isRaw) {
			return Restangular.one('entity_type/items', entityKey).get({
				includeInheritedFields : false,
				raw:isRaw
			}).then(function(response){
				response.data.jsonSchema= JSON.parse(response.data.schema); 
				return response
			});
		},

		restoreEntity : function(entityKey, entity) {
			var _entity = angular.copy(entity);
			_entity.isDeleted = false;
			var _topics = [];
			angular.forEach(_entity["@topicable"], function(_topic) {
				_topics.push(_topic._uid);
			})
			_entity["@topicable"] = _topics;
			return Restangular.all('entity/' + entityKey + '/items/' + _entity._uid + "/undelete").post();
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
		getEntityType : function(entityKey,isRaw) {
			
			var deferred = $q.defer();
			var that = this;

			var entityType = this.getCachedEntityTypeByKey(entityKey + isRaw?"isVT005Raw":"");
			if (!angular.isObject(entityType)) {
				Restangular.one('entity_type/items', entityKey).get({raw:isRaw}).then(function(response) {

					
					response.data.jsonSchema= JSON.parse(response.data.schema); 
					response.data.originalElement.jsonSchema= JSON.parse(response.data.schema); 
					var schema = that.addRequiredBoolToViewGroups(response.data);
					schema.jsonSchema.extents.list = _.reject(schema.jsonSchema.extents.list, function(prop) {
						return prop == "isDeleted";
					});
					// that.cacheEntityType(response.data);
					that.cacheEntityType(angular.copy(schema),isRaw);
					deferred.resolve(response);
				});
			} else {
				deferred.resolve({
					data : angular.copy(entityType)
				});
			}
			;

			return deferred.promise;
		},
		getEntityPagedList : function(entityKey, pageNum, pageSize) {
			return Restangular.all('entity/' + entityKey + '/items').getList({
				startItemIndex : ((pageNum -1) * pageSize ) + 1,
				pageSize : pageSize,
				extent : 'full'
			});
		},
		getAllEntityPagedList : function(entityKey, pageNum, pageSize, showDeleted,sortedColumn ,order) {
			return Restangular.all('entity/' + entityKey + '/items').getList({
				startItemIndex : ((pageNum -1) * pageSize ) + 1,
				pageSize : pageSize,
				extent : 'list',
				showDeleted : showDeleted,
				sortedColumn:sortedColumn,
				order:order
			});
		},
		
		getEntityPagedListByTopicUid : function(entityKey, currentTopicUid, pageNum, pageSize, showDeleted,sortedColumn ,order) {
			return Restangular.all('entity/' + entityKey + '/topic/'+currentTopicUid).getList({
				startItemIndex : ((pageNum -1) * pageSize ) + 1,
				pageSize : pageSize,
				extent : 'list',
				showDeleted : showDeleted,
				sortedColumn:sortedColumn,
				order:order
			});
		},
		getEntity : function(entityKey, uid) {
			return Restangular.one('entity/' + entityKey + '/items', uid).get({
				extent : 'full'
			});
		},
		updateEntity : function(entityKey, uid, data) {
// var correctedData = this.correctEntityData(data);
			return Restangular.one('entity/' + entityKey + '/items', uid).post('', data);
		},
		deleteEntity : function(entityKey, entityUid, entityData) {
			var _entityData = angular.copy(entityData);
			var deerred = $q.defer();
			var that = this;
			return Restangular.one('entity/' + entityKey + '/items', entityUid).remove({},{"Content-Type":"application/json;charset=UTF-8"});
		},

		addEntity : function(entityKey, data) {
// var correctedData = this.correctEntityData(data);

			return Restangular.all('entity/' + entityKey + '/items').post(data);
		},
		getIntersectionEntityList : function(entity, entityKey, showDeleted) {
// return
// Restangular.all('entity/cdm-search').post(this.correctEntityData(entity),
// {
// entityKey : entityKey,
// showDeleted : showDeleted
// });
			
			return Restangular.all('entity/'+ entityKey +'/cross_search').post(entity, {
				showDeleted : showDeleted
			});
		},
		getMapOfEntityTypeByKey : function() {
			return mapOfEntityTypeByKey;
		},
		getCachedEntityTypeByKey : function(key) {
			return mapOfEntityTypeByKey[key];
		},
		cacheEntityType : function(entityType,isRaw) {
			mapOfEntityTypeByKey[entityType.entityKey + isRaw?"isVT005Raw":""] = entityType;
		},
		removeEntityTypeFromCache:function(key){
			delete mapOfEntityTypeByKey[key];
		},
		searchEntity : function(query, entityKey,showDeleted,pageNum,pageSize,sortedColumn ,order) {
			return Restangular.all('entity/search').getList({
				query : query,
				entityKey : entityKey,
				extent : 'list',
				pageNum : pageNum,
				pageSize : pageSize,
				sortedColumn:sortedColumn,
				order:order,
				showDeleted:showDeleted
			});
		},
// correctEntityData : function(entityData) {
// entityData = angular.copy(entityData);
// for (filedName in entityData) {
// if (entityData[filedName]) {
// if (entityData[filedName].getTime) {
// entityData[filedName] = entityData[filedName].getTime();
// }
//
// if (entityData[filedName].push) {
// for (var i = 0; i < entityData[filedName].length; i++) {
// if (entityData[filedName][i]._uid) {
// entityData[filedName][i] = entityData[filedName][i]._uid;
// }
// }
// } else {
// if (entityData[filedName]._uid) {
// entityData[filedName] = entityData[filedName]._uid;
// }
// }
// }
// }
// return entityData;
// },
		getEntityDiff : function(entityUid, fromDate, toDate, pageNum, pageSize,userUid) {
			return Restangular.one('entity/' + entityUid + "/diff").get({
				fromDate : fromDate,
				toDate : toDate,
				pageNum : pageNum,
				pageSize : pageSize,
				userUid : userUid
			});
		},
		getEntityStateFromDiffID:function(entityUid,diffUID){
			return Restangular.one('entity/' + entityUid + "/diff/" +diffUID +"/state" ).get();
		},
		restoreEntityFromDiffUID:function(entityUid,diffUID){
			return Restangular.all('entity/' + entityUid + "/diff/" +diffUID +"/restore" ).post();
		},
		updateInfo : function(entityKey, uid, data) {
			return Restangular.all('entity/update_info/' + entityKey + '/' + uid).post();
		},
		getTags : function(query) {
			return Restangular.all('tag/search?query=' + query).getList();
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
			}
			// return deerred.promise;
		},
		closeSocket:function(){
			if(webSocket){
				webSocket.close();
			}
		},
		Popup: function(data) {
			// var mywindow = window.open('', 'my div',
			// 'height=400,width=600',true);
			var mywindow = window.open("", "_blank", "toolbar=yes, scrollbars=yes, resizable=yes, top=500, left=500, width=1100, height=700");
			mywindow.document.write(' <!DOCTYPE html><html><head><title>موجودیت</title>');
			// mywindow.document.write('<link
			// href="assets/css/tree.css" rel="stylesheet"
			// media="print , screen" />');
			mywindow.document.write('<meta charset="utf-8">');
			mywindow.document.write('<meta http-equiv="cache-control" content="max-age=0" />');
			mywindow.document.write('<meta http-equiv="cache-control" content="no-cache" />');
			mywindow.document.write('<meta http-equiv="expires" content="0" />');
			mywindow.document.write('<meta http-equiv="expires" content="Tue, 01 Jan 1980 1:00:00 GMT" />');
			mywindow.document.write('<meta http-equiv="pragma" content="no-cache" />');
			mywindow.document.write('<style type="text/css">fieldset{width:100%};.col-xs-12,.col-sm-12,.col-md-12,.col-lg-12 {' + '  width: 100%;float:right;' + '   }' + ' 	.col-xs-11,.col-sm-11,.col-md-11,.col-lg-11 {' + ' 		    width: 91.66666667%;float:right;' + ' 	  }' + ' .col-xs-10,.col-sm-10,.col-md-10,.col-lg-10 {' + '     width: 83.33333333%;float:right;' + '   }' + ' 	.col-xs-9,.col-sm-9,.col-md-9,.col-lg-9 {' + '     width: 75%;float:right;' + '   }' + ' .col-xs-8,.col-sm-8,.col-md-8,.col-lg-8 {' + '    width: 66.66666667%;float:right;' + '  }' + ' .col-xs-7,.col-sm-7,.col-md-7,.col-lg-7 {' + '     width: 58.33333333%;float:right;' + '   }' + ' 	.col-xs-6,.col-sm-6,.col-md-6,.col-lg-6 {' + '   width: 50%;float:right;' + '   }' + ' .col-xs-5,.col-sm-5,.col-md-5,.col-lg-5 {'
					+ '    width: 41.66666667%;float:right;' + '   }' + '.col-xs-4,.col-sm-4,.col-md-4,.col-lg-4 {' + ' 	    width: 33.33333333%;float:right;' + '  }' + ' .col-xs-3,.col-sm-3,.col-md-3,.col-lg-3 {' + '     width: 25%;float:right;' + '   }' + ' .col-xs-2,.col-sm-2,.col-md-2,.col-lg-2 {' + '     width: 16.66666667%;float:right;' + '   }' + ' .col-xs-1,.col-sm-1,.col-md-1,.col-lg-1 {' + '   width: 8.33333333%;float:right;' + '  }@charset "UTF-8";[ng\:cloak],[ng-cloak],[data-ng-cloak],[x-ng-cloak],.ng-cloak,.x-ng-cloak,.ng-hide{display:none !important;}ng\:form{display:block;}.ng-animate-block-transitions{transition:0s all!important;-webkit-transition:0s all!important;}.ng-hide-add-active,.ng-hide-remove{display:block!important;}</style>');
			mywindow.document.write('<link href="assets/theme/css/bootstrap-yeti.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('<link rel="shortcut icon" href="assets/ico/bolgrafo-152-82303.png" media="print , screen" />');
			mywindow.document.write('						<link rel="stylesheet" href="assets/theme/css/bootstrap-yeti.css"  media="print , screen" />');
			mywindow.document.write('<link rel="stylesheet" href="bower_components/AngularJS-Toaster/toaster.css"  media="print , screen" />');
			mywindow.document.write('<link rel="stylesheet" href="bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.min.css"  media="print , screen" />');
			mywindow.document.write('<link rel="stylesheet" href="bower_components/angular-hotkeys/build/hotkeys.min.css"  media="print , screen" />');
			mywindow.document.write('<link rel="stylesheet" href="bower_components/angular-material/angular-material.css" media="print , screen" />');
			mywindow.document.write('	<link rel="stylesheet" href="bower_components/jquery-ui/themes/smoothness/jquery-ui.css" media="print , screen" />');

			mywindow.document.write('	<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.min.css" media="print , screen" />');
			mywindow.document.write('	<link rel="stylesheet" href="bower_components/ng-tags-input/ng-tags-input.bootstrap.min.css" media="print , screen" />');
			mywindow.document.write('	<link rel="stylesheet" href="assets/css/tagInput.css" media="print , screen" />');

			mywindow.document.write('	<link href="assets/css/base.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/offcanvas.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/loadingDialog.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/navs.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/tree.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/breadcrumb.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/table.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/table-fixedHeader.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/dynamicHeight.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('	<link href="assets/css/recentlyUsedTopic.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/gridRow.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/topicStatistics.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/bootstrap-filestyle.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/popover.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/animations.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/animate.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('<link href="assets/css/datepicker.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/schemaForm.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="assets/css/animationForEntityPage.css" rel="stylesheet"  media="print , screen" />');
			mywindow.document.write('<link href="bower_components/bootstrap-rtl/dist/css/bootstrap-rtl.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('<link href="assets/css/base.css" rel="stylesheet" media="print , screen" />');
			mywindow.document.write('<script src="bower_components/jquery/dist/jquery.js"></script>');
			mywindow.document.write('<script src="bower_components/jquery-ui/jquery-ui.js"></script>');
			mywindow.document.write('<script src="bower_components/angular/angular.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-animate/angular-animate.js"></script>');
			mywindow.document.write('<script src="bower_components/AngularJS-Toaster/toaster.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-ui-router/release/angular-ui-router.js"></script>');
			mywindow.document.write('<script src="bower_components/lodash/dist/lodash.compat.js"></script>');
			mywindow.document.write('<script src="bower_components/restangular/dist/restangular.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-ui-bootstrap-bower/ui-bootstrap-tpls.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-hotkeys/build/hotkeys.min.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-ui-utils/ui-utils.js"></script>');
			mywindow.document.write('<script src="bower_components/bootstrap-filestyle/src/bootstrap-filestyle.js"></script>');
			mywindow.document.write('<script src="bower_components/ng-file-upload/angular-file-upload.js"></script>');
			mywindow.document.write('<script src="bower_components/bootstrap/dist/js/bootstrap.js"></script>');
			mywindow.document.write('<script src="bower_components/angular-ui-sortable/sortable.js"></script>');
			mywindow.document.write('<script src="bower_components/ng-tags-input/ng-tags-input.min.js"></script>');

			mywindow.document.write('<script src="static/lib/moment/moment.js"></script>');
			mywindow.document.write('<script src="static/lib/moment/moment-jalaali/moment-jalaali-min.js"></script>');
			mywindow.document.write('<script src="config/stateConfig.js"></script>');
			mywindow.document.write('<script src="common/filters/IPFilter.js"></script>');
			mywindow.document.write('<script src="common/filters/emptyValueLabelFilter.js"></script>');
			mywindow.document.write('<script src="config/menuConfig.js"></script>');
			mywindow.document.write('<script src="config/routeConfig.js"></script>');
			mywindow.document.write('<script src="config/baseRequestConfig.js"></script>');
			mywindow.document.write('<script src="config/ConfigConst.js"></script>');
			mywindow.document.write('<script src="config/config.js"></script>');
			mywindow.document.write('<script src="common/test/vtMockRestangular.js"></script>');
			mywindow.document.write('<script src="common/filters/EnToFaNumberFilter.js"></script>');
			mywindow.document.write('<script src="common/filters/stringFilter.js"></script>');
			mywindow.document.write('<script src="common/filters/sliceFilter.js"></script>');
			mywindow.document.write('<script src="assets/js/angular-ui-bootstrap-datepicker/persiandate.js"></script>');
			mywindow.document.write('<script src="assets/js/angular-ui-bootstrap-datepicker/persian-datepicker-tpls.js"></script>');
			mywindow.document.write('<script src="app.js"></script>');
			mywindow.document.write('<script src="management/user/services/UserResource.js"></script>');
			mywindow.document.write('<script src="management/log/services/logResource.js"></script>');
			mywindow.document.write('<script src="management/role/services/roleResource.js"></script>');
			mywindow.document.write('<script src="management/service/softwareSrvc.js"></script>');
			mywindow.document.write('<script src="management/role/services/featureResource.js"></script>');
			mywindow.document.write('<script src="management/baseSelector/services/baseSelectSrvc.js"></script>');
			mywindow.document.write('<script src="home/services/homeSrvc.js"></script>');
			mywindow.document.write('<script src="entity/entityType/services/entitySrvc.js"></script>');
			mywindow.document.write('<script src="navBar/navBrowserSrvc.js"></script>');
			mywindow.document.write('<script src="search/services/searchSrvc.js"></script>');
			mywindow.document.write('<script src="assets/js/topicSelector/topicSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/entitySelector/entitySelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/multiEntitySelector/multiEntitySelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/multiTopicSelector/multiTopicSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/optionSelector/optionSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/multiText/multiTextDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/multiTextarea/multiTextareaDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/fileSelector/fileSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/imageSelector/imageSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/imageSelector/imageModalCtrl.js"></script>');
			mywindow.document.write('<script src="assets/js/multiFileSelector/multiFileSelectorDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/bigText/bigTextDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/bigText/bigTextModalCtrl.js"></script>');
			mywindow.document.write('<script src="assets/js/integer/integerDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/attachFile/attachFileDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/autoCompleteTagInput/autoCompleteTagInputDirective.js"></script>');
			mywindow.document.write('<script src="assets/js/tree/viraTreeModule.js"></script>');
			mywindow.document.write('<script src="assets/js/tree/treeModalCtrl.js"></script>');
			mywindow.document.write('<script src="assets/js/tree/treeNodeModalCtrl.js"></script>');
			mywindow.document.write('<script src="assets/js/tree/viraTreeSrvc.js"></script>');
			mywindow.document.write('<script src="assets/js/tree/viraTreeDirective.js"></script>');
			mywindow.document.write('<script src="home/controllers/homeCtrl.js"></script>');
			mywindow.document.write('<script src="management/user/controllers/UserManagementCtrl.js"></script>');
			mywindow.document.write('<script src="management/role/controllers/roleManagementCtrl.js"></script>');
			mywindow.document.write('<script src="management/baseSelector/controllers/baseSelectorCtrl.js"></script>');
			mywindow.document.write('<script src="management/baseSelector/controllers/optionViewCtrl.js"></script>');
			mywindow.document.write('<script src="management/entityType/controllers/entityTypeManagementCtrl.js"></script>');
			mywindow.document.write('<script src="management/entityType/controllers/formViewCtrl.js"></script>');
			mywindow.document.write('<script src="management/log/controllers/logManagementCtrl.js"></script>');
			mywindow.document.write('<script src="entity/entityType/controllers/entityTypeInfoCtrl.js"></script>');
			mywindow.document.write('<script src="entity/entityType/controllers/entityTypeCtrl.js"></script>');
			mywindow.document.write('<script src="entity/entityType/controllers/advancedSearchEntityCtrl.js"></script>');
			mywindow.document.write('<script src="entity/entityType/controllers/intersectionCtrl.js"></script>');
			mywindow.document.write('<script src="management/controllers/managementCtrl.js"></script>');
			mywindow.document.write('<script src="topic/controllers/topicManagementCtrl.js"></script>');
			mywindow.document.write('<script src="search/controllers/searchCtrl.js"></script>');
			mywindow.document.write('<script src="hotKeys/controllers/hotKeysCtrl.js"></script>');
			mywindow.document.write('<script src="search/controllers/schemaPopup.js"></script>');
			mywindow.document.write('<script src="entity/controllers/entityCtrl.js"></script>');
			mywindow.document.write('<script src="navBar/navBrowserCtrl.js"></script>');
			mywindow.document.write('<script src="report/controllers/reportCtrl.js"></script>');
			mywindow.document.write('<script src="report/controllers/reportListModalCtrl.js"></script>');
			mywindow.document.write('<script src="home/HomeModule.js"></script>');
			mywindow.document.write('<script src="navBar/navBarModule.js"></script>');
			mywindow.document.write('<script src="report/ReportModule.js"></script>');
			mywindow.document.write('<script src="search/SearchModule.js"></script>');
			mywindow.document.write('<script src="hotKeys/hotKeysModule.js"></script>');
			mywindow.document.write('<script src="assets/js/ocLazyLoad.min.js"></script>');
			mywindow.document.write('<script src="assets/js/schema-form/schema-form.js"></script>');

			mywindow.document.write('</head><body class="printPreviewBody" >');
			mywindow.document.write('<div><span class="col-sm-5"></span><button type="button" style="width:120px" class="btn btn-primary no-print" onclick="window.print();">چاپ</button></div>' + '<fieldset style="height: 0px; display: block; z-index: 100;"></fieldset>');

			// var data=$(data).find(".hidden").remove();
			/*
			 * data = $("<div></div>").append(data);
			 * data.find(".hidden").remove()
			 */

			mywindow.document.write(data); //
			mywindow.document.write('<div class="col-sm-6"><div style="color:grey;float:right;font-family:DroidNaskh-Regular.ttf;">' + $rootScope.username + '</div>' + '<div style="color:grey;text-align:right">' + ' &nbsp &nbsp &nbsp &nbsp &nbsp ' + moment(Date.now()).format(' HH:mm jYYYY/jM/jD ') + '</div></div>');
			mywindow.document.write('<div class="col-sm-6"><div class="pull-left" style="color:grey;float:right;font-family:DroidNaskh-Regular.ttf;">' + $state.params.entityUid + '</div>');

			mywindow.document.write('</body></html>');

			mywindow.document.close();
			// mywindow.print();
			/*
			 * $timeout(function() { mywindow.print(); }, 1000);
			 */

			// mywindow.close();
			
			return true;
		}
	};
} );