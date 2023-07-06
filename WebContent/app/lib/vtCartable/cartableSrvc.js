angular.module("vtCartable", ['vtCartableGrid', 'cartableSearch']).factory('cartableSrvc', [ 'Restangular', '$q', '$rootScope', '$state', 'vtShowMessageSrvc', 'cartableNotificationHandlerConst',
/**
 * @memberOf vtCartable
 * @ngdoc service
 * @name cartableSrvc
 * @param {service} Restangular <a target="_blank" href="https://github.com/mgonto/restangular"> AngularJS service to handle Rest API Restful Resources properly and easily</a>
 * @param {service} $q angular service
 * @param {object} $rootScope angular global object
 * @description
 * cartable service for handling resources
 */
function(Restangular, $q, $rootScope, $state, vtShowMessageSrvc, cartableNotificationHandlerConst) {

    this.OnCheckedItemCb = undefined;
    this.selectedItems = [];
    var updateMenu = function () {};
    var that = this;
    this.cartableState = {
        visibleHeaders: [],
        taskType: "",
        filter: {},
        currentPage: 1
    };
    this.currentPage = 1;
	this.menuCB = undefined;
    var registeredSearchQueries = {};
    var registeredFilterSearchQueries = {};
    var registeredShowFilterSearchQueries = {};
    var subscribers = {};
    var currentTaskState = {};
    var searchState = {};
	var registeredFilterArchiveSearchQueries = {};
	var registeredShowFilterArchiveSearchQueries = {};

    var SEC = function(secUid){
        return 'sec/'+secUid;
    }
	return {
        current: 1,
        /**
         * @memberOf cartableSrvc
         * @method getCartableList
         */
		/* ******* cartable ******** */
		getCartableList : function(){
			var query = "";
			if($state.current.name.indexOf("home.cartable") != -1){
				query += "?menu=draft&menu=letter&menu=user-letter-archive";
			}else if($state.current.name.indexOf("home.process") != -1){
				query += "?menu=bpmsTask&menu=bpmsProcessInstance";
			}
			var t=new Date().getTime();
			return Restangular.all('cartable/oprator/items/'+query+'&t='+t).getList();
		},

        getSenderList: function(orgUid, externalOrgUid){
            return Restangular.all('/org/' + externalOrgUid + '/pua/externals').getList({len:-1});
        },

        saveIssued: function(secUid, data){
            uid = data.uid;
            return Restangular.all(SEC(secUid) + '/issued/user/send/?uid='+ uid).post(data);
        },

        getExternalOrganizationList: function(orgUid){
            return Restangular.all('organization/externals').getList({len:-1});
        },
        readTask: function (taskType, uid) {
            return Restangular.all('cartable/task/' + taskType + '/read/' + uid).post();
        },
        unreadTask: function (taskType, uid) {
            return Restangular.all('cartable/task/' + taskType + '/unread/' + uid).post();
        },
		/**
         * @memberOf cartableSrvc
         * @method getTaskFilter
         * @param {string} uid uid of task
         */
		/* ******* TaskFilter ******** */
		getTaskFilter : function(uid, taskType) {
			return Restangular.one('cartable/taskfilter/' + taskType + '/items/' + uid).get();
		},
        /**
         * @memberOf cartableSrvc
         * @method saveTaskFilter
         * @param {object} data task object
         */
		saveTaskFilter : function(data, taskType, uid) {
			return Restangular.all('cartable/taskfilter/' + taskType + '/items/'+uid).post(data);
		},
        /**
         * @memberOf cartableSrvc
         * @method updateTaskFilter
         * @param {object} data task object
         */
		updateTaskFilter : function(data, taskType) {
			var uid = data.uid;
			delete data.uid;
			return Restangular.all('cartable/taskfilter/' + taskType + '/items/' + uid).post(data);
		},
        /**
         * @memberOf cartableSrvc
         * @method deleteTaskFilter
         * @param {string} uid uid of task
         */
		deleteTaskFilter : function(uid, taskType) {
			return Restangular.one('cartable/taskfilter/' + taskType + '/items/' + uid).remove();
		},
        /**
         * @memberOf cartableSrvc
         * @method getTaskList
         * @param {integer} startPage
         * @param {integer} pageLen
         */

		/* ******* Task ******** */
        getTaskList: function (taskType, startPage, pageLen) {
			return Restangular.all('cartable/task/' + taskType + '/user/items').getList({start:startPage, len:1, extent:"full"});
		},
        /**
         * @memberOf cartableSrvc
         * @method searchTask
         * @param {string} query
         * @param {integer} startPage
         * @param {integer} pageLen
         */
        searchTask: function (taskType, query, startPage, pageLen) {
			var queryCorrect = angular.copy(query);
			if (queryCorrect.orders) {
                angular.forEach(queryCorrect.orders, function (item) {
					if (item.field == "content.forwarder.title") {
						item.field = "content.forwarderTitle";
					}
					if (item.field == "content.initiation.sender.title") {
						item.field = "content.senderTitle";
					}
					if (item.field == "sender.title") {
						item.field = "senderTitle";
                    }
                    if (item.field == "content.isForwarded") {
						item.field = "isForwarded";
					}
				});
			}
			this.registerSearchState({taskType: taskType, query: query});
			return Restangular.all('cartable/task/' + taskType + '/user/items').customPOST(queryCorrect,'',
					{start:startPage, len:pageLen, extent:"brief"},{'X-HTTP-Method-Override':'GET'});
		},

		registerMenuCB: function(cb) {
			this.menuCB = cb;
		},
		refreshCartableMenu: function() {
			this.menuCB();
		},

        registerCurrentTaskState: function (att, val) {
			currentTaskState[att] = val;
            if (!isNaN(currentTaskState.page) && !isNaN(currentTaskState.len) && !isNaN(currentTaskState.index))
                currentTaskState.totalIndex = ((currentTaskState.page - 1) * currentTaskState.len) + currentTaskState.index;
        },

		getCurrentTaskState: function () {
            return currentTaskState;
        },

        registerSearchState: function (state) {
			searchState = state;
        },

		getTask: function (type) {
			switch (type) {
				case 'next':
                    currentTaskState.totalIndex++;
                    break;
				case 'previous':
                    currentTaskState.totalIndex--;
					break;
			}
            return this.searchTask(searchState.taskType, searchState.query, currentTaskState.totalIndex, 1);
        },

		//************ template ************//
		saveAsFilter: function (taskType, data) {
			return Restangular.all('cartable/taskfilter/'+taskType+'/items').post(data);
		},
		renameFilter: function (taskType, data, uid) {
			return Restangular.all('cartable/taskfilter/'+taskType+'/items/'+uid).post(data);
		},
		removeFilter: function (taskType, uid) {
			return Restangular.one('cartable/taskfilter/'+taskType+'/items/'+uid).remove();
		},

        //************ search query ************//
		registerSearchQuery: function (key, query) {
			registeredSearchQueries[key] = angular.copy(query);
        },
        getRegisteredSearchQuery: function (key) {
			if (registeredSearchQueries[key])
				return angular.copy(registeredSearchQueries[key]);
			return {}

        },

		//************ filter search query ************//
		registerFilterSearchQuery: function (key, query) {
			registeredFilterSearchQueries[key] = angular.copy(query);
		},
		getRegisterFilterSearchQuery: function (key) {
			if (registeredFilterSearchQueries[key])
				return angular.copy(registeredFilterSearchQueries[key]);
			return undefined;
		},
		registerFilterArchiveSearchQuery: function (key, query) {
			registeredFilterArchiveSearchQueries[key] = angular.copy(query);
		},
		getRegisterFilterArchiveSearchQuery: function (key) {
			if (registeredFilterArchiveSearchQueries[key])
				return angular.copy(registeredFilterArchiveSearchQueries[key]);
			return undefined;
		},

		//************ show filter search query ************//
		registerShowFilterSearchQuery: function (key, query) {
            registeredShowFilterSearchQueries[key] = angular.copy(query);
		},
		getRegisterShowFilterSearchQuery: function (key) {
            if (registeredShowFilterSearchQueries[key]) {
				return angular.copy(registeredShowFilterSearchQueries[key]);
			}
			return undefined;
		},
		registerShowFilterArchiveSearchQuery: function (key, query) {
			registeredShowFilterArchiveSearchQueries[key] = angular.copy(query);
		},
		getRegisterShowFilterArchiveSearchQuery: function (key) {
			if (registeredShowFilterArchiveSearchQueries[key]) {
				return angular.copy(registeredShowFilterArchiveSearchQueries[key]);
			}
			return undefined;
		},

        //***************** CARTABLE ACTIONBAR **************//
        setCartableState: function (states) {
            that.cartableState = angular.copy(states);
        },
        getCartableState: function () {
            return that.cartableState;
        },
        setCurrentPage: function (pageNum) {
            that.currentPage = pageNum;
        },
        getCurrentPage: function () {
            return that.currentPage;
        },

        // mediator between cartableListDirective and cartableCtrl
        registerOnCheckedItemCb: function (cb) {
            this.OnCheckedItemCb = cb;
        },
        onCartableListItemChecked: function (checkedItem, isChecked) {
            if(_.isFunction(this.OnCheckedItemCb)){
                this.OnCheckedItemCb(checkedItem, isChecked);
            }
        },
		setSelectedItems: function (_selectedItems) {
			this.selectedItems = _selectedItems;
		},
		getSelectedItems: function () {
			if (!this.selectedItems) {
                this.selectedItems = [];
			}
            return this.selectedItems;
		},

        //***************** cartableMenuListSubscriber **************//
        publishTo: function (key, filter) {
            if (subscribers[key]) {
                filter ? subscribers[key](filter) : subscribers[key]();
            }
        },
        subscribeOn: function (key, observable) {
            subscribers[key] = observable;
        },

        // UpdateMenu
		setMenuUpdater: function (menu) {
            updateMenu = menu;
        },
        updateMenu: function () {
            updateMenu();
        },

        showNotification: function(notificationKey){
            var notification = cartableNotificationHandlerConst()[notificationKey];
            vtShowMessageSrvc.showMassage(notification.type, notification.title?notification.title:'', notification.message);
        },
        cacheLastVisitedCartableFilterList: function(cartableFilterUid,listItems){
            localStorage.setItem(cartableFilterUid,JSON.stringify(listItems));
        },
        getLastCachedVisitedCartableFilterList: function(cartableFilterUid){
            return JSON.parse(localStorage.getItem(cartableFilterUid));
        },
        getActionButtons: function(taskType){

			const actionButtons= {
				draft:[],
				letter:['close','tag','archive','reply','user-archive','follow','un-follow'],
				'user-letter-archive':['close','user-un-archive']
			}

			return actionButtons[taskType]

		},
        getLetterDraftFeatures: function(taskType){
            const features= {
				draft:{},
				letter:{
                    'tree-respond':true,
                    'forward':true,
                    'send':true,
                    'archive':true
                },
				'user-letter-archive':{},
			}
            return features[taskType]
        }
	}

} ]);