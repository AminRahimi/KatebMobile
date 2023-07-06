moment.loadPersian();

angular.module('vtUtils', [])
    .factory('vtUtilsSrvc', function vtUtilsSrvc() {
        function toTitleCase(str) {
            return str.replace(/\w\S*/g, function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            });
        }
        return {
            mergeLists: function(list1, list2, namespaceList1, namespaceList2, compareFn, columnSchemaList1, columnSchemaList2) {
                var items = [];
                var attrnamesOfListItem1 = [];
                for (var attrname in list1[0]) {
                    attrnamesOfListItem1.push(attrname)
                }
                var unionObject = _.pick(list2[0], attrnamesOfListItem1);
                var unionAttrnames = [];
                for (var attrname in unionObject) {
                    unionAttrnames.push(attrname)
                }
                _.each(list1, function(item1) {
                    item = _.find(list2, function(item2) {
                        return compareFn(item1, item2)
                    });
                    _.each(unionAttrnames, function(attrname) {
                        if (item1[attrname]) {
                            item1[namespaceList1 + toTitleCase(attrname)] = item1[attrname];
                            delete item1[attrname];
                        } else if (item[attrname]) {
                            item[namespaceList2 + toTitleCase(attrname)] = item[attrname];
                            delete item[attrname];
                        }
                    });
                    items.push(_.extend(item1, item));
                });
                var fields = columnSchemaList1;
                _.each(columnSchemaList2, function(h) {
                    fields.push(h);
                });
                var obj = {
                    items: items,
                    fields: fields,
                    totalCount: items.length
                }
                return obj;
            },
        };
    });
    