angular.module('secretariatModule').controller('secretariatRejectedCtrl',
		function($scope, $rootScope, $timeout, $state, $modal, secretariatSrvc, fileSrvc, katebSrvc, vtShowMessageSrvc, hotkeys) {



///////////////////////////////////FIXME rahimi
			$scope.doAoutoSizeInput = function () {
				$timeout(function () {

					$('.auto-size-input').on('keydown', function (e) {

						$("#hidden_span").html("");
						$("#hidden_span").append("<p>" + $(this).val() + "</p>");

						var hidden_span_scroll_width = $("#hidden_span")[0].scrollWidth + 120;

						if (hidden_span_scroll_width > 100 || hidden_span_scroll_width < 600) {
							$(this).css("width", hidden_span_scroll_width);
						}

					});
				}, 1);
			}
			/////////////////////////////////////


			$scope.Data = {
				mode: 'view',
				tabList: [],
				indicatorBookList: [],
				senderList: [],
				organizationSenderList: [],
				secUid: $state.params.secUid,
				orgUid: $rootScope.currentUserOrg.uid,
				incUid: $state.params.incUid,
				tmpUid: $state.params.tmpUid,
				letter: {
					deliveryTo: [],
					deliveryCc: [],
					deliveryBcc: [],
					tags: [],
					attachments: [],
					receivingStyle: 'COURIER',
					originalityType: 'Orginal',
					officialDate: new Date(),
					pageSize: 'A4',
					requestResponseDate: ""
				},
				sendClicked: false
			}
			$scope.Func = {
				getTabList: function () {
					$scope.Data.tabList = [{
						id: 0,
						title: 'اطلاعات نامه',
						uiSref: ''
					}, {
						id: 1,
						title: 'نامه',
						uiSref: ''
					}/*, {
						id: 2,
						title: 'ضمیمه',
						uiSref: ''
					}*/]
				},
				onTabClick: function (tab) {
					$scope.Data.selectedTab = tab;
					$scope.Func.deactiveTabs();
					tab.active = true;
				},
				deactiveTabs: function () {
					for (var int = 0; int < $scope.Data.tabList.length; int++) {
						$scope.Data.tabList[int].active = false;
					}
				},
				doSomeOnServerFormInfo: function (response) {
					$scope.Data.letter = response;
					if ($scope.Data.letter.body)
						$scope.loadPdfFn($scope.Data.letter.body);
					// if(_.isObject($scope.Data.letter.sender)){
					// 	$scope.Data.letter.sender = $scope.Data.letter.sender;
					// }
					var temp = $scope.Data.letter.sender;
					$timeout(function () {
						$scope.Func.initiateIndicatorBook();
						$scope.Func.initiateTopicCategory();
						if (_.isObject($scope.Data.letter.externalOrganizationSender)) {
							$scope.Func.onSelectOrganizationSender('', $scope.Data.externalOrganizationSender);
						}
						$scope.Data.letter.sender = temp;
					}, 500);
					if (!$scope.Data.letter.officialDate) {
						$scope.Data.letter.officialDate = new Date();
					}
				},
				getIncomingLetter: function () {
					secretariatSrvc.getIncoming($scope.Data.secUid, $scope.Data.incUid).then(function (response) {
						$scope.Func.doSomeOnServerFormInfo(response.data.originalElement);
						$scope.Data.mode = 'view';
					});
				},
				// onEditClick: function () {
				// 	$scope.Data.mode = 'edit';
				// },
				// onSaveClick: function () {
				// 	if ($scope.form.$invalid) {
				// 		$scope.Data.validationClicked = true;
				// 	} else {
				// 		if (_.isObject($scope.Data.scanedFile)) {
				// 			$scope.Data.letter.body = $scope.Data.scanedFile;
				// 		}
				// 		if ($scope.Data.tmpUid) {
				// 			$scope.Data.letter.type = "FromSecretariatManually";
				// 		}
                //
				// 		secretariatSrvc.saveIncoming($scope.Data.secUid, $scope.Func.removeExtraFields($scope.Data.letter, true)).then(function () {
				// 			$state.go('base.home.secretariat.incomingList', {secUid: $scope.Data.secUid});
				// 			$scope.Data.validationClicked = false;
				// 		});
				// 	}
                //
				// },
				// onUpdateClick: function () {
				// 	if ($scope.form.$invalid) {
				// 		$scope.Data.validationClicked = true;
				// 	} else {
				// 		if (_.isObject($scope.Data.scanedFile)) {
				// 			$scope.Data.letter.body = $scope.Data.scanedFile;
				// 		}
				// 		var sendData = $scope.Func.removeExtraFields($scope.Data.letter, true);
				// 		secretariatSrvc.updateIncoming($scope.Data.secUid, sendData).then(function () {
				// 			$scope.Data.mode = 'view';
				// 			$scope.Data.validationClicked = false;
				// 		});
				// 	}
                //
				// },
				// onSendClick: function () {
				// 	if ($scope.form.$invalid) {
				// 		$scope.Data.validationClicked = true;
				// 	} else {
				// 		if (_.isObject($scope.Data.scanedFile)) {
				// 			$scope.Data.letter.body = $scope.Data.scanedFile;
				// 		}
				// 		var sendData = $scope.Func.removeExtraFields($scope.Data.letter, true);
				// 		$scope.Data.sendClicked = true;
				// 		if ($scope.Data.tmpUid) {
				// 			sendData.type = "FromSecretariatManually";
				// 		}
				// 		sendDataCp = angular.copy(sendData);
				// 		secretariatSrvc.sendIncoming($scope.Data.secUid, sendDataCp).then(function (response) {
				// 			vtShowMessageSrvc.showMassage('success', 'نامه شماره ' + response.data.internalNumber, 'نامه با موفقیت ثبت شد.', 20000);
				// 			$scope.Data.sendClicked = false;
				// 			$scope.Data.validationClicked = false;
				// 			$scope.Func.onReturnClick();
				// 		});
				// 	}
                //
				// },
				onReturnClick: function () {
					$state.go('base.home.secretariat.rejectedLetters', {secUid: $scope.Data.secUid});
				},
				// onResetClick: function () {
				// 	$scope.Data.letter = {
				// 		deliveryTo: [],
				// 		deliveryCc: [],
				// 		deliveryBcc: [],
				// 		tags: []
				// 	};
				// 	$scope.Data.indicatorBook = null;
				// 	$scope.Data.sender = null;
				// 	$scope.Data.responseNeeded = null;
				// },
				// onDeleteClick: function () {
				// 	secretariatSrvc.deleteIncoming($scope.Data.secUid, $scope.Data.incUid).then(function (res) {
				// 		$scope.Func.onReturnClick();
				// 	});
				// },


				getTagList: function () {
					secretariatSrvc.getPublicTagList($scope.Data.orgUid).then(function (response) {
						$scope.Data.tagList = response.data.originalElement;
					});
				},
				searchTagList: function (query, type) {
					if (query.length > 1) {
						secretariatSrvc.searchPublicTagList($scope.Data.orgUid, query).then(function (response) {
							$scope.Data.tagList = response.data.originalElement;
						});
					}
				},
				getIndicatorBookList: function () {
					secretariatSrvc.getIndicatorBookList($scope.Data.secUid).then(function (response) {
						for (var int = 0; int < response.data.originalElement.length; int++) {
							$scope.Data.indicatorBookList.push(response.data.originalElement[int]);
						}
						if ($scope.Data.indicatorBookList.length)
							$scope.Func.onSelectIndicatorBook($scope.Data.indicatorBookList[0]);
					});
				},
				onSelectIndicatorBook: function (indicatorBook) {
					$scope.Data.indicatorBook = indicatorBook;
					$scope.Data.letter.indicatorBook = {
						uid: $scope.Data.indicatorBook.uid,
						title: $scope.Data.indicatorBook.title
					};
				},
				initiateIndicatorBook: function () {
					$scope.Data.indicatorBook = null;
					if ($scope.Data.letter.indicatorBook) {
						for (var int = 0; int < $scope.Data.indicatorBookList.length; int++) {
							if ($scope.Data.indicatorBookList[int].uid == $scope.Data.letter.indicatorBook.uid) {
								$scope.Data.indicatorBook = $scope.Data.indicatorBookList[int];
								break;
							}
						}
					}
				},

				onSelectTopicCategory: function (topicCategory) {
					$scope.Data.topicCategory = topicCategory;
					$scope.Data.letter.topicCategory = {
						uid: $scope.Data.topicCategory.uid,
						title: $scope.Data.topicCategory.title
					};
					$scope.Data.letter.subject = $scope.Data.topicCategory.title;
					$timeout(function () {
						$('.auto-size-input').keydown();
					}, 100);
				},
				initiateTopicCategory: function () {
					$scope.Data.topicCategory = null;
					if ($scope.Data.letter.topicCategory && $scope.Data.tagList) {
						for (var int = 0; int < $scope.Data.tagList.length; int++) {
							if ($scope.Data.tagList[int].uid == $scope.Data.letter.topicCategory.uid) {
								$scope.Data.topicCategory = $scope.Data.tagList[int];
								break;
							}
						}
					}
				},

				getOrganizationSenderList: function () {
					secretariatSrvc.getExternalOrganizationSecretariatList($scope.Data.orgUid).then(function (response) {
						for (var int = 0; int < response.data.originalElement.length; int++) {
							$scope.Data.organizationSenderList.push(response.data.originalElement[int]);
						}
					});
				},
				onSelectOrganizationSender: function (item, model) {
					$scope.Func.getSenderList(model.uid);
				},

				getSenderList: function (externalOrgUid) {
					secretariatSrvc.getSenderSecretariatList($scope.Data.orgUid, externalOrgUid).then(function (response) {
						$scope.Data.senderList = [];
						for (var int = 0; int < response.data.originalElement.length; int++) {
							$scope.Data.senderList.push(response.data.originalElement[int]);
						}
					});
				},
				getUiSelectData: function (data) {
					$scope.Data.uiSelectData = data;
					$scope.Data.letter.sender = {title: data.search};
				},
				onSelectSender: function (item, model) {
					// $scope.Data.uiSelectData.search = '';
					// $scope.Data.letter.sender = model;
				},
				onRemoveSenderClick: function (item) {
					if (item == "sender") {
						$scope.Data.draft.sender = null;
					} else if (item == "actor") {
						$scope.Data.draft.actor = null;
					} else if (item == "topicCategory") {
						$scope.Data.topicCategory = null;
					}
				},
				searchLetterByExternalnumber: function (externalNumber) {
					if (externalNumber && externalNumber.length >= 2) {
						secretariatSrvc.searchLetterByExternalnumber(externalNumber).then(function (res) {
							if (res.data.originalElement.length) {
								$scope.Data.duplicateList = res.data.originalElement;
							}
						});
					}
				},
				onDuplicateClick: function (letter) {
					var url = $state.href('base.home.cartable.orgLetter', {letterUid: letter.uid});
					window.open(url, '_blank');
				},
				removeExtraFields: function (data, shouldChange) {
					var result = angular.copy(data);
					delete result.externalOrganiationSender;
					delete result.creationDate;
					delete result.modificationDate;
					delete result.creatorUser;
					delete result.creatorSecretariat;
					delete result.creatorOrganization;
					delete result.state;
					delete result.deleted;
					if (!result.type) {
						result.type = "FromSecretariatManually";
					}
					if (result.tags) {
						angular.forEach(result.tags, function (value, key) {
							delete value.name;
							delete value.parent;
						})
					}
					if(result.deliveryCc) {
						angular.forEach(result.deliveryCc, function (cc) {
							if(cc.descEditMode) {
								delete cc.descEditMode
							}
						});
					}
					if(result.deliveryBcc) {
						angular.forEach(result.deliveryBcc, function (bcc) {
							if(bcc.descEditMode) {
								delete bcc.descEditMode
							}
						});
					}
					if(shouldChange) {
						$scope.Data.letter.deliveryCc = result.deliveryCc;
						$scope.Data.letter.deliveryBcc = result.deliveryBcc;
					}
					return result;
				},
				//savePrivateLetterTemplate: function () {
				//	var draftCp = angular.copy($scope.Data.letter);
				//	delete draftCp.uid;
				//	draftCp.textBody = $scope.Data.ckeditor.getData();
				//	var data = {
				//		name: $scope.Data.userDefinedTemplateName,
				//		data: draftCp
				//	}
				//	cartableKatebSrvc.savePrivateLetterTemplate(data).then(function (res) {
				//		katebSrvc.showNotification('templateSaved');
				//	});
				//},
				savePublicLetterTemplate: function () {
					var draftCp = angular.copy($scope.Func.removeExtraFields($scope.Data.letter, false));
					//draftCp.textBody = $scope.Data.ckeditor.getData();
					delete draftCp.uid;
					delete draftCp.officialDate;
					var data = {
						name: $scope.Data.userDefinedTemplateName,
						data: draftCp
					}
					if ($scope.Data.tmpUid) {
						data.data.type = "FromSecretariatManually";
					}
					katebSrvc.savePublicLetterTemplate(data, $scope.Data.orgUid).then(function (res) {
						katebSrvc.showNotification('templateSaved');
					});
				},
				getGetIncommingLetterTemplate: function (uid) {
					return secretariatSrvc.getGetIncommingLetterTemplate(uid).then(function (response) {
						response.data.data.officialDate = null;
						$scope.Func.doSomeOnServerFormInfo(response.data.data);
					});
				},
				// onSendBackDescriptionClick: function () {
				// 	secretariatSrvc.descriptionDropdownSrvc($scope.Data.letter.dispatchToOtherOrgRefrence.uid, $scope.descriptionBack).then(function (res) {
				// 		$scope.descriptionBack = "";
				// 		// $scope.sendSucceded = true;
				// 		// $(".successMessage").fadeIn();
				// 		// $timeout(function () {
				// 		// 	$(".successMessage").fadeOut();
				// 		// }, 3000);
                 //        vtShowMessageSrvc.showMassage('success', '', 'با موفقیت ارسال شد.');
                 //        $scope.Func.onReturnClick();
				// 	});
				// }
			}

			$scope.controller = {
				scanner: {
					onFileScanned: function (hashNameObj) {
						$scope.controller.letterBody.setPdfUrl(hashNameObj);
					}
				},
				letterBody: {},

				multiselectRecieverSearch: function (query) {
					return secretariatSrvc.getpositionUserAssignemtsList({secretariat: false, query: query});
				},
				multiselectRecieverSearchTags: function (query) {
					return secretariatSrvc.searchPublicTagList($scope.Data.orgUid, query);
				}
			}

			var Run = function () {
                $scope.Func.getTabList();
				$scope.Func.getIndicatorBookList();
				$scope.Func.getOrganizationSenderList();
				// $scope.Func.getTagList();
				$scope.Func.onTabClick($scope.Data.tabList[0]);

				if ($scope.Data.incUid)
					$scope.Func.getIncomingLetter();
				else
					$scope.Data.mode = 'add';

				if ($scope.Data.tmpUid && $scope.Data.tmpUid != "emptyTemplate") {
					$scope.Func.getGetIncommingLetterTemplate($scope.Data.tmpUid);
				}


				$scope.controller.scanner.onScanClick = function () {
					$scope.controller.letterBody.setPdfUrl(undefined);
				}
				$('#draftTemplateId').bind('click', function (e) {
					e.stopPropagation();
				});
				$('#backDropDown').bind('click', function(e) {
					e.stopPropagation();
				});
			}

			Run();

			//***** hotKeys *****//

			hotkeys.bindTo($scope)
				.add({
					combo: 'alt+i',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onEditClick()
					}
				})
				.add({
					combo: 'alt+ctrl+s',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onSaveClick()
					}
				})
				.add({
					combo: 'alt+u',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onUpdateClick()
					}
				})
				.add({
					combo: 'esc',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onResetClick()
					}
				})
				.add({
					combo: 'alt+r',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onDeleteClick()
					}
				})
				.add({
					combo: 'alt+c',
					allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
					callback: function () {
						$scope.Func.onSendClick()
					}
				});
		});
