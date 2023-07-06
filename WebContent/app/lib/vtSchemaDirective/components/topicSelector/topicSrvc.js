angular.module('topicSelector').factory('topicSrvc', function(Restangular, Restangular, $q) {
	var topicSrvc = {};
	var currentTopicDefer;
	topicSrvc = {
		addNode : function(topicName, topicId, topicSecretLevel) {
			if (topicId) {
				return Restangular.all('topic_tree').post("", {
					name : topicName,
					parentId : topicId,
					secretLevel : topicSecretLevel
				});
			} else {
				return Restangular.all('topic_tree').post("", {
					name : topicName,
					secretLevel : topicSecretLevel
				});
			}
		},
		editNode : function(topicId, topicName, topicSecretLevel, parentTopic) {
			return Restangular.all('topic_tree/' + topicId).post("", {
				name : topicName,
				secretLevel : topicSecretLevel,
				parentTopic : parentTopic
			});
		},
		changeIndexOfNode : function(topicId, indexInParent) {
			return Restangular.all('topic_tree/' + topicId).post("", {
				indexInParent : indexInParent
			});
		},
		setNewParentForNode : function(topicId, topicName, newParentId) {
			return Restangular.all('topic_tree/' + topicId).post("", {
				parentTopic : newParentId,
				name : topicName
			});
		},
		deleteNode : function(topicId) {
			return Restangular.one('topic_tree', topicId).remove({}, {
				"Content-Type" : "application/json;charset=UTF-8"
			});
		},
		getTopicTree : function(topicId, showDeleted) {
			return Restangular.one('topic_tree', topicId).get({
				showDeleted : showDeleted
			}).then(function(response) {
				// if (!!!topicId) {
				response.data.isRoot = true;
				// }
				return response;
			});
		},
		getTopicTreeChilds : function(topicId, showDeleted) {
			return Restangular.one('topic_child', topicId).get({
				showDeleted : showDeleted
			});
		},
		search : function(query) {
			return Restangular.all('topic_search').getList({
				query : query
			});
		},
		getCurrentTopicId : function() {
			if (currentTopicDefer && !currentTopicDefer.isResolved) {
				return currentTopicDefer.promise;
			} else {

				currentTopicDefer = $q.defer();
				currentTopicDefer.isResolved = false;
				Restangular.one('user/current_topic').get().then(function(response) {
					currentTopicDefer.isResolved = true;
					currentTopicDefer.resolve(response);
				});
				return currentTopicDefer.promise;
			}
		},
		setCurrentTopic : function(topicId) {
			return Restangular.one('user/current_topic', topicId).post();
		},
		getRecentlyUsedTopics : function() {
			return Restangular.all('user/recently_used_topic').getList();
		},
		getTopicAnalysis : function(topicId) {
			return Restangular.one('topic_analysis', topicId).get();
		},
		getFullTree : function(isWithStats, uid, showDeleted) {
			var queryParams = isWithStats ? "withStats=" + isWithStats + "&" : "";
			queryParams += uid ? "rootUid=" + uid : "";

			return Restangular.one('topic_tree/full_tree?' + queryParams).get({
				showDeleted : showDeleted
			});
		},
		copyNode : function(topicId, newParentId) {
			return Restangular.all('topic_tree/copy_tree').post("", {
				destUid : newParentId,
				sourceUid : topicId
			});
		}
	};

	return topicSrvc;

} );