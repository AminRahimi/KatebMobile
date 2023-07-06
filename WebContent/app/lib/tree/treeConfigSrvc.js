angular.module('treeModule').factory('treeConfigSrvc', function(Restangular, $q) {

	var childrenKey = null;
	var fieldsKey = [];
	return{

		getRendererAddress: function(){
			return "app/lib/tree/treeItemRenderer.html";
		},

		/* ********************** children key ********************** */
		setChildrenKey: function(key){
			childrenKey = key;
		},
		getChildrenKey: function(){
			return (childrenKey?childrenKey:'child_nodes');
		},

		/* ********************** field key list ********************** */
		setFieldsKey: function(_fieldsKey){
			fieldsKey = _fieldsKey;
		},
		addToFieldsKey: function(fieldKey){
			fieldsKey.push(fieldKey);
		},
		removeFormFieldsKey: function(fieldKey_or_key){
			var key = (fieldKey_or_key.key?fieldKey_or_key.key:fieldKey_or_key);
			for (var i = fieldsKey.length - 1; i >= 0; i--) {
				if(fieldsKey[i].key == key){
					fieldsKey.splice(i, 1);
					break;
				}
			}
		},
		getFieldsKey: function(){
			return fieldsKey;
		},
		getFieldsKeyByKey: function(key){
			for (var i = fieldsKey.length - 1; i >= 0; i--) {
				if(fieldsKey[i].key == key){
					return fieldsKey[i]
				}
			}
		}

	}
	
});