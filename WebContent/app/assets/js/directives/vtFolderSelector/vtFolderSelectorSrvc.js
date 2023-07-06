angular.module('vtFolderSelector').factory("vtFolderSelectorSrvc", function (Restangular) {

    return {
        getRootFolder: function () {
            return Restangular.one("ganjeh/nodes").get();
        },
        getChildernOfFolder: function (parentUid, isSearch, start, len) {
            return Restangular.one("ganjeh/nodes?parent_uid=" + parentUid).get({
                start: start,
                len: len
            }).then(function (res) {
                if (isSearch) {
                    res = {
                        data: {
                            children: res.data
                        }
                    }
                }
                return res;
            });
        },
        checkUserIsLoginToGanjeh: function () {
            return Restangular.one("ganjeh/check_login").get();
        },
        searchFolder: function (searchFolder) {
            return Restangular.all("ganjeh/search?query=" + searchFolder).getList();
        }
    };

});