angular.module('vtSearch').factory('vtSearchSrvc', function() {
	
	return{
		//TODO support advanced search query
		createSearchQuery : function(jsonQuery, searchableFieldInfo){
			return {
				restrictions: this.createSimpleSearchRestriction(jsonQuery,searchableFieldInfo),
				orders : jsonQuery.orders
			}
		},
		
		createSearchOrder : function(field, dsc){
			return{
				restrictions: [],
				orders: [this.createOrder(field,dsc)]
			}
		},

		createSingleSearchRestriction : function(type, field, query){
			return {
				restrictions: [this.processQuery(type, field, query)],
				orders : []
			}
		},

//		searchableFieldInfo = [{key,type}]
		createSimpleSearchRestriction : function(jsonQuery, searchableFieldInfo){
			var restriction = [];
			for ( var index = 0; index < searchableFieldInfo.length; index++) {
				var fieldSearch = this.createFieldSeach(jsonQuery, searchableFieldInfo[index]);
				if(fieldSearch!=null) {
                    if(!angular.isArray(fieldSearch))
                        restriction.push(fieldSearch);
                    else {
                        angular.forEach(fieldSearch, function (value) {
							restriction.push(value);
                        })
                    }
				}
			}
			
			return restriction;		
		},
		
		//TODO
		createCustomSearchRestriction: function(){
			var restriction = [];
			return restriction;
		},
		
		//TODO
		createInnerFieldRestriction : function(){
			
		},
		
		createOrder : function(field, dsc){
			return {
				field: field,
				dir: (dsc?'dsc':'asc')
			}
		},

		createFieldSeach : function(jsonQuery, fieldInfo){
			if(jsonQuery[fieldInfo.key]!=null || fieldInfo.type=='custom')
				return this.processQuery(fieldInfo.type, fieldInfo.key, jsonQuery[fieldInfo.key]);
			return null;	
		},
		
		processQuery: function (type, field, query) {
			var fieldSearch = null;
			switch (type) {
				case 'string':
					fieldSearch = this.processStringQuery(query);
					break;
				case 'date':
					fieldSearch = this.processDateQuery(query, field);
					// if(_.isArray(query) && query.length)
					// 	fieldSearch.field = field;
					break;
				case 'timestamp':
					fieldSearch = this.processDateQuery(query, field);
					// if(_.isArray(query) && query.length)
					// 	fieldSearch.field = field;
					break;
				case 'integer':
					fieldSearch = this.processIntegerQuery(query);
					break;
				case 'multiSelectReciever':
					fieldSearch = this.processMultiSelect(query, field);
					break;
				case 'dto':
					fieldSearch = this.processDtoQuery(query);
					break;
				case 'enum':
					fieldSearch = this.processEumQuery(query, field);
					break;
				case 'status':
					fieldSearch = this.processStatusQuery(query, field);
					break;
				case 'bool':
				case 'boolean':
					fieldSearch = this.processBooleanQuery(query);
					break;
				case 'custom':
					fieldSearch = this.processCustomQuery(query);
					break;
				case 'collection':
					fieldSearch = this.processCollectionQuery(query, field);
					break;
				case 'tagInput':
					fieldSearch = this.processTagInputQuery(query, field);
					break;
				case 'fastSearch':
					fieldSearch = this.processFastSearchQuery(query, field);
				default:
					break;
			}
			if(fieldSearch!=null && (type!='collection' && type!='enum')){
				fieldSearch.field = field;
			}
			if(type == 'tagInput'){
				if(fieldSearch)
					delete fieldSearch.field;
			}
			return fieldSearch;
		},

		processStringQuery : function(query){
			if(query!=""){
				if(query.indexOf(',')!=-1)
					return {type:'in',collection:query.split(',')};
				if(query.indexOf('=')==0)
					return {type:'eq',value:query.substr(1)};
				if(query.indexOf('!=')==0)
					return {type:'ne',value:query.substr(2)};
				
				return {type:'like',value:query}
			}
			return null;
		},
		processDateQuery: function (query, field) {
			if (!_.isArray(query)) {
				var dateList = query.split(',');
				if (dateList.length != 2 || (dateList[0] == '' && dateList[1] == ''))
					return null;
				if (dateList[0] == '') {
					dateList[1] = parseInt(dateList[1]) + 86399999;
					dateList[1] = dateList[1].toString();
					return {type:'le',value:parseInt(dateList[1])};
				}
				if(dateList[1]=='')
					return {type:'ge',value:parseInt(dateList[0])};

				if (dateList[1] && dateList[0]) {
					dateList[1] = parseInt(dateList[1]) + 86399999;
					dateList[1] = dateList[1].toString();
					return {type:'betw',value:parseInt(dateList[0]),value2:parseInt(dateList[1])}
				}
			}else{
				if(query.length){
					var restriction = {type: 'or', operands: []};
					query.forEach(function (date) {
						var dateList = date.split(',');
						var obj = {
							field: field,
							type: 'betw',
							value:parseInt(dateList[0]),
							value2:parseInt(dateList[1])
						};
						restriction.operands.push(obj);
					});
					return restriction;
				}
			}
		},
		//TODO support between query
		processIntegerQuery : function(query){
			if(query.indexOf(',')!=-1)
				return {type:'in',collection:query.split(',')}
			
			var possibleOperation = [{q:'=',type:'eq'},{q:'!=',type:'ne'},{q:'>',type:'lt'},{q:'>=',type:'le'},{q:'<',type:'gt'},{q:'<=',type:'ge'}];
			for ( var index = 0; index < possibleOperation.length; index++) {
				if(query.indexOf(possibleOperation[index].q)==0)
					return {type:possibleOperation[index].type,value:possibleOperation[index].substr(possibleOperation[index].q.length)}
			}
			
			return {type:'like',value:query}
		},
		//TODO processString
		processDtoQuery : function(query){
			
		},
		processMultiSelect : function(query, field){
			var obj = {
							field: field,
							type: 'eq',
							value: {
								"uid":query[0].uid
							}
			};
			return obj
		},
		//TODO support ne
		processEumQuery : function(query, field){
			if(query.length) {
				var items = {type: 'or', operands: []};
				query.forEach(function (item) {
					var obj = {
						field: field,
						type: 'eq',
						value: item.uid
					};
					items.operands.push(obj);
				});
				return items;
			} else {
				// If enum field is not hidden and is unset we return nothing
				if(query == '')
					return;
				return {field: field, type:'eq', value:{uid:query.uid}}
			}
		},
		processStatusQuery: function (query, field) {
			var EnumQuery = query.title;
			switch (query.title) {
				case 'در انتظار ثبت به عنوان نامه':
					EnumQuery = 'PENDING'
					break;
				case 'ابطال شده':
					EnumQuery = 'CANCELED'
					break;
				case 'ثبت شده به عنوان نامه':
					EnumQuery = 'REGISTERED'
					break;
				
				
			}
			var obj = {
				field: field,
						type: 'eq',
						value: EnumQuery
			}
			return obj;
		},
		processBooleanQuery : function(query){
			if(query != null)
				return {type:'eq',value:query}
			else
				return null;
		},

		processCustomQuery : function(query){
			return {type:'eq',value:query}
		},

		processCollectionQuery : function(query, field){
			if(query.length) {
				var items = {type: 'or', operands: []};
				query.forEach(function (item) {
					var obj = {
						field: field,
						type: 'eq',
						value: item.uid
					}
					items.operands.push(obj);
				});
				return items;
			}
		},

		processTagInputQuery : function(query, field){
			if(query.length) {
				var items = {type: 'or', operands: []};
				query.forEach(function (item) {
					var obj = {
						field: field,
						type: 'like',
						value: item
					}
					items.operands.push(obj);
				});
				return items;
			}
		},

        processFastSearchQuery: function (query, field) {
            if (query != "") {
                var restriction = [];
                angular.forEach(query.split(" "), function (value, key) {
                    restriction.push({type: field, value: value, field: field})
                });
                return restriction;
            }
        }


	}
});