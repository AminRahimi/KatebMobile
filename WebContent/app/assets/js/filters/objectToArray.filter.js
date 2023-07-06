angular.module("objectToArray",[])
    .filter("objectToArray", function () {
        return function (obj) {
            var result = [];
            angular.forEach(obj, function(value, key) {
                result.push({'key':key, 'value':value});
            });
            return result;
        }
    });