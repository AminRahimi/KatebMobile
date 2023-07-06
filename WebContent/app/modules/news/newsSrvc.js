angular.module('newsModule').factory('newsSrvc', ['$rootScope', 'Restangular', function ($rootScope, Restangular) {
    var orgUID, URL;

    return {
        setOrgUid: function (uid) {
            orgUID = uid;
            URL = '/org/' + uid + '/news/items';
        },
        getUserList:function (uid){
            return Restangular.all('/news/public/items/'+ uid +'/readers').getList();
        },
        getManagementNewsList: function (start, len) {
            return Restangular.all(URL).getList({
                start: start,
                len: len,
                extent: "full"
            });
        },
        getPublicNewsList: function (start, len, tags) {
            return Restangular.all('/news/public/items').getList({
                tag: tags,
                start: start,
                len: len
            });
        },
        findOneNews: function (uid) {
            return Restangular.one('news/public/items/' + uid).get();
        },
        saveNews: function (data) {
            return Restangular.all(URL).post(data);
        },
        updateNews: function (data) {
            return Restangular.all(URL + '/' + data.uid).post(data);
        },
        deleteNews: function (newsUid) {
            return Restangular.all('news/items/' + newsUid).remove();
        },
        getFileURL: function (hash) {
            return 'files/?mode=download&fcode=' + hash;
        },
        getNewsList: function (start, len) {
            return Restangular.all("news/public/items").getList({
                start: start,
                len: len,
                extent: "full",
                tag: orgUID
            });
        },
        searchNews: function(query, start, len){
            return Restangular.all(URL).customPOST(query,'',
                {start:start,len:len,extent:'full'},{'X-HTTP-Method-Override':'GET'});
        },
    }

}]);
