angular.module('letterFormTypeModule', []);
angular.module('letterFormTypeModule').factory('letterFormTypeSrvc', function (Restangular) {

	var ORG = '';

	var correctFields= function (response) {
		if (!response.data.fields || !response.data.fields.length) {
			response.data.fields = [{
				sortable: false,
				type: "comp",
				key: "entityType",
				fields: [{
					sortable: false,
					type: "string",
					label: "کلید انگلیسی",
					key: "key"
				}, {
					sortable: false,
					type: "string",
					label: "نام",
					key: "name"
				}]
			}];

		}

		return response;
	}

	return {
		setOrgUid: function (orgUid) {
			ORG = 'org/' + orgUid;
		},
		getletterFormTypeList: function (start, len) {
			return Restangular.all(ORG + '/letter_form_type/items').getList({
				start: start,
				len: len,
				extent: 'full'
			}).then(function (response) {
				response = correctFields(response);
				return response

			});
		},
		getletterFormType: function (uid, isRaw) {
			return Restangular.one(ORG + '/letter_form_type/items', uid).get({
				raw: isRaw
			});
		},
		correctForSend: function (obj) {
			delete obj.originalElement;
			if (angular.isString(obj.schema)) {
				obj.schema = JSON.parse(obj.schema);
				obj.schema.title = obj.name;
				obj.schema.key = obj.key;
			}
			obj.schema = JSON.stringify(obj.schema);

			return obj;
		},
		deleteletterFormType: function (uid) {
			return Restangular.one(ORG + '/letter_form_type/items/' + uid).remove();
		},
		update: function (obj, uid, enabled) {
			obj = this.correctForSend(obj);
			var sendingObj = {
				entityType: obj,
				enabled: enabled || false,
				name: obj.name,
				uid: uid,
			};
			return Restangular.all(ORG + '/letter_form_type/items/' + uid).post(sendingObj);
		},
		add: function (obj, enabled, name) {
			obj = this.correctForSend(obj);
			var sendingObj = {
				entityType: obj,
				enabled: enabled || false,
				name: name
			};
			return Restangular.all(ORG + '/letter_form_type/items').post(sendingObj);
		},
		search: function (query, start, len) {
			return Restangular.all(ORG + '/letter_form_type/items').customPOST(query, '',
				{ start: start, len: len, extent: 'full' }, { 'X-HTTP-Method-Override': 'GET' }).then(function (response) {
				response = correctFields(response);
				return response

			});
		}
	}

});