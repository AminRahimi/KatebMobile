angular.module('vtAttachment', []).directive('vtAttachment', function(vtShowMessageSrvc, $filter) {
	return {
		restrict : 'EA',
		templateUrl : 'app/lib/vtAttachment/vtAttachment.html',
		scope : {
			api : "=",
			model : "=",
			isEditMode : "=",
			maxSize: "=" //Maximum total size in bytes: number
		},
		controller : function($scope, $element, Upload, $timeout, vtAttachmentSrvc) {

			var createDownloadLink = function(hash, name, id) {
				if (!name)
					name = "";
				if (id)
					return 'files/' + name + '?mode=download&fcode=' + hash + '&fid=' + id;
				else
					return 'files/' + name + '?mode=download&fcode=' + hash;
			}

			$scope.Data = {
				isShowSelectedDownload: false
			};

			$scope.Func = {
				getDownloadLink : function(attachment) {
					return 'files/?mode=download&fcode=' + attachment.hash;
				},
				checkFileType : function(file) {
					var type;
					if (file.indexOf('.pdf')!==-1) {
						type = 'pdf';
					} else if (file.indexOf('.doc')!==-1) {
						type = 'doc';
					} else if (file.indexOf('.xls')!==-1) {
						type = 'xls'
					} else if (file.indexOf('.jpg')!==-1 || file.indexOf('.png')!==-1) {
						type = 'img';
					} else if (file.indexOf('.mp4')!==-1 || file.indexOf('.mp3')!==-1 || file.indexOf('.wav')!==-1 || file.indexOf('.wma')!==-1 || file.indexOf('.ogg')!==-1 || file.indexOf('.amr')!==-1 || file.indexOf('.mid')!==-1) {
						type = 'mp3';
					} else {
						type = 'none';
					}
					return type;
				},
				uploadFile : function(files) {
					if (files && files.length) {
                        if ($scope.Func.isReachedMaxSize(files)) {
                            angular.forEach(files, function (file) {
                                var obj = {
                                    name: file.name,
                                    file: file,
                                    active: false,
                                    progressPercentage: 0,
                                    progressActive: true,
                                    uploadingNgFileObj: {}
                                }
                                $scope.model ? $scope.model.push(obj) : $scope.model = [obj];

                                (function (_obj) {
                                    _obj.uploadingNgFileObj = Upload.upload({
                                        url: 'api/files/upload',
                                        file: _obj.file
                                    }).progress(function (evt) {
                                        _.defer(function () {
                                            $scope.$apply(_obj.progressPercentage = parseInt(100.0 * evt.loaded / evt.total));
                                        });
                                    }).success(function (data, status, headers, config) {
                                        _obj.hash = data[0].hash;
                                        $timeout(function () {
                                            _obj.progressActive = false;
                                        }, 1);
                                    }).error(function (r) {
                                        $timeout(function () {
                                            _obj.progressActive = false;
                                        }, 1);
                                    });
                                })(obj);
                            })
                        } else {
                        	var errorText = $filter('EnToFaNumber')( 'مجموع حجم فایل های ضمیمه نمیتواند بیشتر از ' + $scope.maxSize / (1024*1024) + ' مگابایت باشد.');
                            vtShowMessageSrvc.showMassage('error', '', errorText, 3000);
                        }
                    }

                },
				onRemoveAttachmentClick : function(event, index, attachment) {
					if (attachment.uploadingNgFileObj) {
						attachment.uploadingNgFileObj.abort();
					}
					$scope.model.splice(index, 1);
				},
				onDownloadAllFilesClick: function () {
					var fileSelected = angular.copy($scope.model);
					fileSelected = _.map(fileSelected, function (item) {
						return item.hash;
					});
					vtAttachmentSrvc.downloadFiles(fileSelected);
				},
				onDownloadSelectedFilesClick: function () {
					var fileSelected = angular.copy($scope.model);
					fileSelected = _.filter(fileSelected, function (item) {
						return item.active;
					});
					fileSelected = _.map(fileSelected, function (item) {
						return item.hash;
					});
					vtAttachmentSrvc.downloadFiles(fileSelected);
				},
				checkFileSelected: function () {
					var isSelected = false;
					for (var i = 0; i < $scope.model.length; i++) {
						if ($scope.model[i].active) {
							isSelected = true;
							break;
						}
					}
					if (isSelected) {
						$scope.Data.isShowSelectedDownload = true;
					} else {
						$scope.Data.isShowSelectedDownload = false;
					}
				},
                isReachedMaxSize: function (files) {
					if ($scope.maxSize) {
                        var totalSize = 0;

                        if ($scope.model && $scope.model.length) {
                            angular.forEach($scope.model, function (file) {
                                totalSize += file.file.size;
                            });
                        }

                        if (files && files.length) {
                            angular.forEach(files, function (_file) {
                                totalSize += _file.size;
                            });
                        }
                        return totalSize <= $scope.maxSize;
                    }
                    return true;
                }
			};

			var Run = function() {
				$scope.api.openFileBrowse = function(files) {
					var event = new $.Event("click");
					$($element).find('.fake-uploader-btn').trigger(event);
				};
				$scope.api.downloadAttachments = function(hash, name, id) {
					var link = document.createElement("a");
					link.setAttribute("href", createDownloadLink(hash, name, id));
					link.setAttribute("download", "FileName");
					link.style = "visibility:hidden";
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);
				};
				$scope.api.removeAttachments = function() {
					$scope.model = [];
				};
			};

			Run();

		}
	}
})
.factory('vtAttachmentSrvc', function (Restangular, katebSrvc) {
	return {
		downloadFiles: function (files) {
			var query = "";
			if(files) {
				files.forEach(function(file) {
					query += "hash=" + file + "&"; 
				});
				katebSrvc.downloadByLink("api/file/compress/zip?" + query);
			}
			// return Restangular.one('file/compress/zip').get({"hash": files});
		}
	}
});