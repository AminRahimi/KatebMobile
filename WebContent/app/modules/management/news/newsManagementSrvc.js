angular.module('newsModule').factory('newsManagementSrvc', ['Restangular', '$q', '$timeout', 'Upload', function (Restangular, $q, $timeout, Upload) {
    return {
        openFileSelectorModalAndUploadFile : function($scope,uniqeId,onFileUploadingFn) {
            var defer = $q.defer();

            var event = new $.Event("click");
            $("#"+uniqeId).trigger(event);
            $scope.onFileSelect = function(files) {

                if (files && files.length) {

                    var file = files[0];
                    var obj = {
                        name : file.name,
                        file : file,
                        active : false,
                        progressPercentage : 0,
                        progressActive : true,
                        uploadingNgFileObj : {}
                    };
                    (function(_obj,_onFileUploadingFn) {
                        _obj.uploadingNgFileObj = Upload.upload({
                            url : 'api/files/upload',
                            file : _obj.file
                        }).progress(function(evt) {
                            _.defer(function() {
                                $scope.$apply(_obj.progressPercentage = parseInt(100.0 * evt.loaded / evt.total));
                            });
                        }).success(function(data, status, headers, config) {
                            _obj.hash = data[0].hash;
                            defer.resolve(_obj);
                            $timeout(function() {
                                _obj.progressActive = false;

                            }, 1);
                        }).error(function(r) {
                            $timeout(function() {
                                _obj.progressActive = false;
                                defer.reject(_obj);
                            }, 1);
                        });
                        _onFileUploadingFn(_obj);
                    })(obj,onFileUploadingFn);


                }

            };

            return defer.promise;
        }
    }
}]);