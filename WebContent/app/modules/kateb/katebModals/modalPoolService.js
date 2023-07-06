angular.module('katebModule').factory('modalPoolSrvc', function (modalPool,$modal) {
    return {
        showModal : function (name, data, options) {
            if (!name) throw new Error("name of modal should be provided.");
            modalPool[name]['resolve'] = {
                data: function () {
                    return data || {};
                }
            };
            if(options) return $modal.open(angular.extend(modalPool[name],options ||{})).result;
            return $modal.open(modalPool[name]).result;
        }
    }
});