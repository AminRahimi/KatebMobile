angular.module('cartableModule').controller('cartableDraftCtrl',
	function ($scope, $rootScope, $state, $modal, $sce, cartableKatebSrvc, homeSrvc, cartableSrvc,
		vtShowMessageSrvc, hotkeys, $timeout, katebSrvc, $q, $modal, configObj, $http, $window,appConst) {

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
			ckeditorInvalid: true,
			mode: 'view',
			type: 'OUTSIDE',
			editorType: 'Editor',
			draftUid: $state.params.draftUid,
			duplicateUid: $state.params.duplicateUid,
			replyFromUid: $state.params.replyFromUid,
			tabList: [],
			senderList: [],
			secretariatList: [],
			letterLayoutList: [],
			validationClicked: false,
			orgUid: $rootScope.currentUserOrg.uid,
			newOrganizationUid: $state.params.orgUid,
			draft: {
				canSign: false,
				canEdit: false,
				canMove: false,
				canParaph: false,
				deliveryTo: [],
				deliveryCc: [],
				deliveryBcc: [],
				attachments: [],
				paraphers: [],
				priority: 'Normal',
				officialDate: new Date()
			},
			isDraftLoaded: false,
			counter: 0,
			disableSendBtn: false,
			draftFileBody: "docx,doc,pdf,tiff,tif",
			templateUid: "",
			removeItem: "پیش نویس",
			isAdvancedMode: true,
			deleteItem: "",
			template: {},
			signerInfo: "",
			currentDate: new Date(),
			hasExternalArchives: configObj.externalArchives.length,
			vtFolderSelectorForm: "",
			lastCachedVisitedCartableFilterList: cartableSrvc.getLastCachedVisitedCartableFilterList($state.params.cartableUid + $state.params.filter),
			isNextDisabled: false,
			isPrevDisabled: false,
			isNextPrevFeaturePossible: true,
			isMobileView: homeSrvc.screenSizeDetector.isMobile(),
			confidentialityLevelList: Object.keys(appConst['confidentialityLevel']),
			priorityList: Object.keys(appConst['priority']),
		}

		var errorRequiredInputs = function () {
			vtShowMessageSrvc.showMassage('error', '', "لطفا فیلد های ضروری در زبانه های «اطلاعات نامه» و «نامه» را پر کنید");
		};

		var isCorrectLetterArchiveGanjeh = function () {
			if ($scope.Data.draft.externalArchive && $scope.Data.draft.externalArchive.type === 'GANJEH' &&
				(!$scope.Data.draft.externalArchive.folderUid || $scope.Data.draft.externalArchive.folderUid.length === 0)) {
				vtShowMessageSrvc.showMassage('error', 'خطا', 'در قسمت بایگانی نامه، گنجه انتخاب شده، ولی فولدری انتخاب نشده است.');
				return false;
			}

			return true;
		}

		var letterLayoutListPromise;

		$scope.Func = {
			getCkEditorData: function () {
				var ckeditorContent = $scope.Data.ckeditor.getData();
				ckeditorContent = ckeditorContent.replaceAll('<strong>', '<span style="font-weight: bold;">');
				ckeditorContent = ckeditorContent.replaceAll('</strong>', '</span>');
				return ckeditorContent;
			},
			getTabList: function () {
				$scope.Data.tabList = [{
					id: 0,
					title: 'اطلاعات نامه',
					hasError: function () {
						return $scope.form.$invalid;
					},
					uiSref: ''
				}, {
					id: 1,
					title: 'متن نامه',
					hasError: function () {
						return $scope.Data.ckeditorInvalid;
					},
					uiSref: ''
				}, {
					id: 2,
					title: 'ضمیمه',
					hasError: function () {
						return false;
					},
					uiSref: ''
				}, {
					id: 3,
					title: 'پیش نمایش',
					hasError: function () {
						return false;
					},
					uiSref: ''
				}, {
					id: 4,
					title: 'تاریخچه پیش نویس',
					hasError: function () {
						return false;
					},
					uiSref: ''
				}]
			},
			onTabClick: function (tab) {
				$scope.Data.selectedTab = tab;
				$scope.Func.deactiveTabs();
				tab.active = true;
				if ($scope.Data.selectedTab.id === 3) {
					$timeout(function () {
						if ($scope.form.$invalid)
							errorRequiredInputs();
						$scope.Func.getDraftPreview();
					}, 1000);
				}
				if ($scope.Data.selectedTab.id === 1) {
					var text = $scope.Func.getCkEditorData();
					if (text) {
						$scope.Data.ckeditor.setData(text)
					} else if ($scope.Data.draft.textBody) {
						$scope.Data.ckeditor.setData($scope.Data.draft.textBody)
					}
				}
			},
			deactiveTabs: function () {
				for (var int = 0; int < $scope.Data.tabList.length; int++) {
					$scope.Data.tabList[int].active = false;
				}
			},
			/** *************** Draft ************** */
			getDraft: function () {
				cartableKatebSrvc.getDraft($scope.Data.draftUid).then(function (response) {
					delete response.data.originalElement.creationDate;
					delete response.data.originalElement.modificationDate;
					delete response.data.originalElement.creatorUser;
					delete response.data.originalElement.modifierUser;
					delete response.data.originalElement.isEditorMode;
					delete response.data.originalElement.organization;
					//delete response.data.originalElement.letterUid;
					//delete response.data.originalElement.letterNumber;


					$scope.Data.draft = response.data.originalElement;
					$scope.Data.letterLayout = $scope.Data.draft.letterLayout;
					if (!response.data.otherOrganization)
						$scope.Data.newOrganizationUid = "CURRENT";
					else
						$scope.Data.newOrganizationUid = response.data.organization.uid;
					$scope.Func.getletterLayoutList();
					$scope.Func.getsecretariatList();
					$scope.Func.getSenderList();

					if ($scope.Data.draft.requestResponseDate) {
						$scope.Data.responseNeeded = true;
					} else {
						$scope.Data.responseNeeded = false;
					}
					$timeout(function () {
						$scope.Func.initiateLetterLayout();
						$scope.Func.initiateSecretariat();
						$scope.Func.initiateSender();
						$scope.Func.initiateActor();
					}, 300);
					if ($scope.Data.draft.bodyType == 'Editor') {
						// $timeout(function () {
						$scope.Data.editorType = 'Editor';
						$scope.Data.ckeditor.setData($scope.Data.draft.textBody);
						// }, 0);
					} else {
						// $timeout(function () {
						$scope.Data.editorType = 'File';
						// }, 0);
					}
					$scope.Data.draft.deliveryTo.forEach(function (item) {
						if (item.type == "THROUGH_SECRETARIAT") {
							$scope.Data.counter = 1;
						}
					});

					if ($scope.Data.draft.deliveryBcc) {
						$scope.Data.draft.deliveryBcc.forEach(function (item) {
							if (item.type == "THROUGH_SECRETARIAT") {
								$scope.Data.counter = 1;
							}
						});
					}

					if ($scope.Data.draft.deliveryCc) {
						$scope.Data.draft.deliveryCc.forEach(function (item) {
							if (item.type == "THROUGH_SECRETARIAT") {
								$scope.Data.counter = 1;
							}
						});
					}

					if ($state.params.duplicateUid) {
						$scope.Data.mode = 'add';
					} else {
						$scope.Data.mode = 'view';
					}
					$scope.Data.deleteItem = response.data.originalElement;
					$scope.Data.isDraftLoaded = true;
				});
			},
			onEditClick: function () {
				let draft = $scope.Data.draft;
				if (draft.paraphers && draft.paraphers.length > 0) {
					katebSrvc.notificationModal('onEditDraft').then(function (result) {
						if (result === 'ok') {
							$scope.Func.editDraft();
						}
					});
				} else {
					$scope.Func.editDraft();
				}
			},
			editDraft: function () {
				$scope.Data.mode = 'edit';
				if ($scope.Data.draft.textBody) {
					$scope.Data.ckeditor.setData($scope.Data.draft.textBody)
				}
				if ($scope.Data.draft.cachedPdf) {
					delete $scope.Data.draft.cachedPdf;
				}
				if ($scope.Data.draft.paraphPdf) {
					delete $scope.Data.draft.paraphPdf;
				}
				if ($scope.Data.draft.deliveryCc)
					$scope.Func.setAttribute($scope.Data.draft.deliveryCc, 'descEditMode', true);

				if ($scope.Data.draft.deliveryBcc)
					$scope.Func.setAttribute($scope.Data.draft.deliveryBcc, 'descEditMode', true);

				$scope.Func.onSelectSender();
				if (_.isObject($scope.Data.draft.letterLayout) && letterLayoutListPromise) {
					letterLayoutListPromise.then(function () {
						$scope.Data.letterLayout = _.find($scope.Data.letterLayoutList, { uid: $scope.Data.draft.letterLayout.uid });
					});
				}
			},
			onSaveClick: function () {

				if (!$scope.Func.getFormValidationObj().isValid) {
					$scope.Data.validationClicked = true;
					errorRequiredInputs();
					return false;
				}

				if (!isCorrectLetterArchiveGanjeh()) {
					return;
				}
				if ($scope.Apis && $scope.Apis.schemaFormApi) {
					$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
				}

				$scope.Data.draft.textBody = $scope.Func.getSendingTextBody();

				$timeout(function () {
					$scope.Data.isSaving = true;
					cartableKatebSrvc.saveDraft($scope.Func.removeExtraFields($scope.Data.draft, true), $scope.Data.newOrganizationUid).then(function (response) {
						$scope.Data.draft.uid = response.data.uid;
						$state.go('base.home.cartable.draft', { draftUid: $scope.Data.draft.uid, orgUid: null, duplicateUid: null });
						$scope.Data.isSaving = false;
						//$scope.Data.mode = 'view';
					}, function (err) {
						$scope.Data.isSaving = false;
					});
				}, 0);

			},
			onUpdateClick: function () {

				if (!$scope.Func.getFormValidationObj().isValid) {
					$scope.Data.validationClicked = true;
					errorRequiredInputs();
					return false;
				}


				if (!$scope.Data.responseNeeded) {
					$scope.Data.draft.requestResponseDate = null;
				}
				if (!isCorrectLetterArchiveGanjeh()) {
					return;
				}
				if ($scope.Apis && $scope.Apis.schemaFormApi) {
					$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
				}

				$scope.Data.isSaving = true;

				$scope.Data.draft.textBody = $scope.Func.getSendingTextBody();

				cartableKatebSrvc.updateDraft($scope.Func.removeExtraFields($scope.Data.draft, true), $scope.Data.newOrganizationUid).then(function (res) {
					$scope.Data.isSaving = false;
					if (!$scope.Data.draftUid) {
						$state.go('base.home.cartable.draft', ({ draftUid: res.data.uid, replyFromUid: null, orgUid: null, duplicateUid: null }));
					} else {
						$timeout(function () {
							$scope.Func.getDraft();
						}, 0);
					}
				}, function (err) {
					$scope.Data.isSaving = false;
				});
			},
			onDeleteClick: function () {
				cartableKatebSrvc.deleteDraft($scope.Data.draft.uid).then(function (res) {
					cartableSrvc.publishTo("updateCartableMenu");
					$state.go('base.home.cartable.cartableList');
				});
			},

			setPreviewText: function () {
				return 'files/a.html?mode=view&fcode=' + $scope.Data.draft.paraphPdf + '&contentType=text/html';
			},
			/**
			 *@return {{isValid:boolean}}
			 */
			getFormValidationObj: function () {
				let validationObj = { isValid: true };

				if ($scope.Data.editorType == "Editor" && ($scope.Data.mode === 'add' || $scope.Data.mode === 'edit') && $scope.Data.ckeditorInvalid) {
					validationObj.isValid = false;
				}


				if ($scope.form.$invalid) {
					validationObj.isValid = false;
				}

				return validationObj
			},
			isActionButtonDisabled: function (actionType) {
				if (!$scope.Data.validationClicked) return false;

				switch (actionType) {
					case 'SAVE':
						return !$scope.Func.getFormValidationObj().isValid || $scope.Data.isSaving;
						break;
					default:
						return !$scope.Func.getFormValidationObj().isValid;
						break;
				}
			},
			getSendingTextBody: function () {
				if ($scope.Data.mode == 'view') {
					return $scope.Data.draft.textBody;
				}
				return $scope.Func.getCkEditorData();
			},
			signature: function () {
				if ($scope.Data.draft.paraphPdf) {
					$scope.pdfUrl = $scope.Func.setPreviewText();
					$scope.controller.vtPDF.pdfUrl = $scope.pdfUrl;
					$scope.Data.pdfHash = $scope.Data.draft.paraphPdf;
					$scope.backMode = $scope.Data.mode;
					$scope.Data.mode = 'signature';
					$scope.Data.validationClicked = false;

					var draftCp = angular.copy($scope.Data.draft);
					draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
					$scope.Func.getSigner(draftCp, draftCp.uid);
					return;
				}
				if (!$scope.Func.getFormValidationObj().isValid) {
					$scope.Data.validationClicked = true;
					errorRequiredInputs();
					return false;
				}
				// generate pdf by draft
				if ($scope.Data.editorType == 'Editor')
					$scope.Data.draft.textBody = $scope.Func.getSendingTextBody();
				var draftCp = angular.copy($scope.Data.draft);
				delete draftCp.read;
				delete draftCp.canEdit;
				delete draftCp.canSign;
				delete draftCp.canMove;
				delete draftCp.canParaph;
				delete draftCp.state;
				delete draftCp.cachedPdf;
				delete draftCp.paraphPdf;
				delete draftCp.otherOrganization;
				$scope.pdfUrl = '';
				draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
				cartableKatebSrvc.getLetterPdf($scope.Func.removeExtraFields(draftCp, false)).then(function (response) {
					$scope.pdfUrl = 'api/org/current/letter_draft/pdf/' + response.data.hash;
					$scope.controller.vtPDF.pdfUrl = $scope.pdfUrl;
					$scope.Data.pdfHash = response.data.hash;
					$scope.backMode = $scope.Data.mode;
					$scope.Data.mode = 'signature';
					$scope.Data.validationClicked = false;
					$scope.Func.getSigner(draftCp);
				});
			},
			onSignatureClick: function () {
				if (!isCorrectLetterArchiveGanjeh()) {
					return;
				}

				if ($scope.Data.draft.hasParapher) {
					katebSrvc.notificationModal('onSignatureDraft').then(function (result) {
						if (result === 'ok') {
							$scope.Func.signature();
						}
					});
				} else {
					$scope.Func.signature();
				}
			},
			// TODO remove extra code and implement better better
			onParaphClick: function () {
				if (!isCorrectLetterArchiveGanjeh()) {
					return;
				}

				if ($scope.Data.draft.paraphPdf) {
					$scope.pdfUrl = 'files/a.html?mode=view&fcode=' + $scope.Data.draft.paraphPdf + '&contentType=text/html';
					$scope.controller.vtPDF.pdfUrl = $scope.pdfUrl;
					$scope.Data.pdfHash = $scope.Data.draft.paraphPdf;
					$scope.backMode = $scope.Data.mode;
					$scope.Data.mode = 'paraph';
					$scope.Data.validationClicked = false;

					var draftCp = angular.copy($scope.Data.draft);
					draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
					$scope.Func.getParapher(draftCp, draftCp.uid);

					return;
				}

				if (!$scope.Func.getFormValidationObj().isValid) {
					$scope.Data.validationClicked = true;
					errorRequiredInputs();
					return false;
				}

				$scope.Data.draft.textBody = $scope.Func.getSendingTextBody();
				var draftCp = angular.copy($scope.Data.draft);
				delete draftCp.read;
				delete draftCp.canEdit;
				delete draftCp.canSign;
				delete draftCp.canMove;
				delete draftCp.canParaph;
				delete draftCp.state;
				delete draftCp.cachedPdf;
				delete draftCp.paraphPdf;
				delete draftCp.otherOrganization;
				$scope.pdfUrl = '';
				draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
				cartableKatebSrvc.getLetterPdf($scope.Func.removeExtraFields(draftCp, false)).then(function (response) {
					$timeout(function () {
						$scope.Data.mode = 'paraph';
					}, 1000);
					$scope.pdfUrl = 'api/org/current/letter_draft/pdf/' + response.data.hash;
					$scope.controller.vtPDF.pdfUrl = $scope.pdfUrl;
					$scope.Data.pdfHash = response.data.hash;
					$scope.backMode = $scope.Data.mode;
					$scope.Data.validationClicked = false;
					$scope.Func.getParapher(draftCp);
				});
			},
			onSendClick: function () {
				if (!_.isObject($scope.controller.vtPDF.signCoords)) return

				$scope.Data.disableSendBtn = true;
				$scope.Data.draft.signatureXPosition = $scope.controller.vtPDF.signCoords.x;
				$scope.Data.draft.signatureYPosition = $scope.controller.vtPDF.signCoords.y;
				$scope.Data.draft.signatureWidth = $scope.controller.vtPDF.signCoords.width;
				$scope.Data.draft.signatureHeight = $scope.controller.vtPDF.signCoords.height;
				$scope.Data.draft.signatureFontSize = $scope.controller.vtPDF.signFontSizeFloat;
				//$scope.Data.draft.signatureRotate = $scope.controller.vtPDF.signCoords.rotate;
				$scope.Data.draft.signaturePageNumber = $scope.controller.vtPDF.signCoords.pageNum;


				if ($scope.Apis && $scope.Apis.schemaFormApi) {
					$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
				}


				var draftCp = angular.copy($scope.Func.removeExtraFields($scope.Data.draft, true));
				delete draftCp.read;
				delete draftCp.canEdit;
				delete draftCp.canSign;
				delete draftCp.canMove;
				delete draftCp.canParaph;
				delete draftCp.state;
				delete draftCp.cachedPdf;
				delete draftCp.paraphPdf;

				draftCp.draftUid = $scope.Data.draft.uid;
				draftCp.bodyHash = $scope.Data.pdfHash;
				if ($scope.Data.draft.textBody != null) {
					draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
				}
				cartableKatebSrvc.sendDraft(draftCp, $scope.Data.newOrganizationUid).then(function (response) {
					vtShowMessageSrvc.showMassage('success', 'نامه شماره ' + response.data.internalNumber, 'نامه با موفقیت ثبت شد.');
					cartableSrvc.publishTo("updateCartableMenu");;
					$state.go('base.home.cartable.cartableList');
				}, function (response) {
					if (response.status === 403 && response.data.key && response.data.key === 'ganjeh_token_expired') {
						// TODO call -> letterAttachmentCtrl.Func.onEnterToGanjehClick();
						if ($scope.Apis.vtFolderSelector && angular.isFunction($scope.Apis.vtFolderSelector.openEnterToGanjeh)) {

							$scope.Apis.vtFolderSelector.openEnterToGanjeh();
						}
					}
					$scope.Data.disableSendBtn = false;
				});
			},
			// TODO remove extra code
			onSendParaphClick: function () {
				if (_.isObject($scope.controller.vtPDF.signCoords)) {
					if ($scope.controller.vtPDF.maxCharError) {
						return;
					}
					$scope.Data.disableSendBtn = true;
					$scope.Data.draft.signatureXPosition = $scope.controller.vtPDF.signCoords.x;
					$scope.Data.draft.signatureYPosition = $scope.controller.vtPDF.signCoords.y;
					$scope.Data.draft.signatureWidth = $scope.controller.vtPDF.signCoords.width;
					$scope.Data.draft.signatureHeight = $scope.controller.vtPDF.signCoords.height;
					$scope.Data.draft.signatureFontSize = $scope.controller.vtPDF.signFontSizeFloat;
					//$scope.Data.draft.signatureRotate = $scope.controller.vtPDF.signCoords.rotate;
					$scope.Data.draft.signaturePageNumber = $scope.controller.vtPDF.signCoords.pageNum;
					$scope.Data.draft.signatureHtml = $scope.controller.vtPDF.signText;


					if ($scope.Apis && $scope.Apis.schemaFormApi) {
						$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
					}


					var draftCp = angular.copy($scope.Func.removeExtraFields($scope.Data.draft, true));
					delete draftCp.read;
					delete draftCp.canEdit;
					delete draftCp.canSign;
					delete draftCp.canMove;
					delete draftCp.canParaph;
					delete draftCp.state;
					delete draftCp.cachedPdf;
					delete draftCp.paraphPdf;

					draftCp.draftUid = $scope.Data.draft.uid;
					draftCp.bodyHash = $scope.Data.pdfHash;
					draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
					cartableKatebSrvc.sendParaph(draftCp, $scope.Data.newOrganizationUid).then(function (response) {
						vtShowMessageSrvc.showMassage('success', ' شماره ' + response.data.number, 'پاراف با موفقیت ثبت شد.');
						cartableSrvc.publishTo("updateCartableMenu");;
						$state.go('base.home.cartable.cartableList');
					}, function () {
						$scope.Data.disableSendBtn = false;
					});
				}
			},
			onTransferClick: function () {

				if (!$scope.Func.getFormValidationObj().isValid) {
					$scope.Data.validationClicked = true;
					errorRequiredInputs();
					return false;
				}

				if (!isCorrectLetterArchiveGanjeh()) {
					return;
				}
				if ($scope.Apis && $scope.Apis.schemaFormApi) {
					$scope.Apis.schemaFormApi.prepareLetterFormTypeForSave();
				}

				$scope.Data.draft.textBody = $scope.Func.getSendingTextBody();

				var modalInstance = $modal.open({
					templateUrl: 'app/modules/cartable/draft/transferModal.html',
					controller: 'transferModalCtrl',
					size: 'md',
					resolve: {
						isExternal: function () {
							if ($scope.Data.newOrganizationUid === 'CURRENT') {
								return false;
							} else if ($scope.Data.mode === 'add' || ($scope.Data.mode === 'edit' && $state.params.orgUid)) {
								return $state.params.orgUid === 'EXTERNAL'
							} else {
								return $scope.Data.draft.otherOrganization;// @TODO hashemi
								//return $scope.Data.newOrganizationUid !== $scope.Data.orgUid;
							}
						}
					}
				});
				modalInstance.result.then(function (data) {

					$timeout(function () {
						cartableKatebSrvc.transferDraft($scope.Data.draft, data.selectedUser.uid, data.text, $scope.Data.newOrganizationUid).then(function () {
							$state.go('base.home.cartable.cartableList');
						})
					}, 1000);
				});
				$scope.Data.validationClicked = false;
			},
			onBackToEditClick: function () {
				$scope.Data.mode = $scope.backMode;
			},
			onReturnClick: function () {
				if (!_.isEmpty($scope.Func.getLastSearchQuery()))
					cartableKatebSrvc.setSearchMode(true);
				if ($scope.Data.mode === 'edit') {
					katebSrvc.notificationModal('onExitDraft').then(function (result) {
						if (result === 'ok') {
							$state.go('base.home.cartable.cartableList');
						}
					});
				} else {
					$state.go('base.home.cartable.cartableList');
				}
			},
			OnReclaimClick: function () {
				cartableKatebSrvc.reclaimDraft($scope.Data.draft.uid).then(function (response) {
					$scope.Data.draft = response.data.originalElement;
					$scope.Data.letterLayout = $scope.Data.draft.letterLayout;
				});
			},
			paramsToObject: function (entries) {
				const result = {};
				for (const [key, value] of entries) {
					result[key] = value;
				}
				return result;
			},
			generateDraftPdf: function (printDowloadQueryParams) {
				var deffered = $q.defer();


				if (printDowloadQueryParams instanceof URLSearchParams) {
					// convert URLSearchParams to key val object
					printDowloadQueryParams = $scope.Func.paramsToObject(printDowloadQueryParams.entries());
				}

				if ($scope.Data.draft.paraphPdf) {
					let pdfUrl = 'files/a.html?mode=view&fcode=' + $scope.Data.draft.paraphPdf + '&contentType=text/html';

					localStorage.setItem("pdfUrl", window.location.protocol + "//" + window.location.host + window.location.pathname + pdfUrl);
					deffered.resolve({ pdfUrl: pdfUrl });
				} else {
					if ($scope.Func.getCkEditorData()) {
						$scope.Data.draft.textBody = $scope.Func.getCkEditorData();
					}
					var draftCp = angular.copy($scope.Data.draft);
					delete draftCp.read;
					delete draftCp.canEdit;
					delete draftCp.canSign;
					delete draftCp.canMove;
					delete draftCp.canParaph;
					delete draftCp.state;
					delete draftCp.letterUid;
					delete draftCp.letterNumber;
					delete draftCp.cachedPdf;
					delete draftCp.paraphPdf;
					delete draftCp.letterOfficialDate;

					draftCp.textBody = $scope.Func.correctLetterTextBody(draftCp.textBody);
					cartableKatebSrvc.getLetterPdf($scope.Func.removeExtraFields(draftCp, false), printDowloadQueryParams).then(function (response) {
						let pdfUrl = 'api/org/current/letter_draft/pdf/' + response.data.hash;
						localStorage.setItem("pdfUrl", window.location.protocol + "//" + window.location.host + window.location.pathname + pdfUrl);
						deffered.resolve({ pdfUrl: pdfUrl });

					});
				}
				return deffered.promise;
			},
			getDraftPreview: function () {
				$scope.pdfUrl = '';
				$scope.Func.generateDraftPdf().then(function (pdfData) {
					$scope.pdfUrl = pdfData.pdfUrl;
				});
			},
			/** *************** Draft ************** */

			onEditorTypeChange: function (type) {
				$scope.Data.draft.bodyType = type;
			},
			getletterLayoutList: function () {
				$scope.Data.letterLayoutList = [];
				letterLayoutListPromise = cartableKatebSrvc.getLetterLayoutList($scope.Data.newOrganizationUid).then(function (response) {
					for (var int = 0; int < response.data.originalElement.length; int++) {
						$scope.Data.letterLayoutList.push(response.data.originalElement[int]);
					}
					// FIXME:implement single source of truth for enabled layout list
					$scope.Data.letterLayoutEnabledList = $scope.Data.letterLayoutList.filter(layout=>layout.enabled);
					return response;
				});
			},
			onSelectLetterLayout: function (letterLayout) {
				$scope.Data.letterLayout = letterLayout;
				$scope.Data.draft.letterLayout = {
					uid: $scope.Data.letterLayout.uid,
					title: $scope.Data.letterLayout.name
				};
			},
			initiateLetterLayout: function () {
				$scope.Data.letterLayout = null;
				if (!_.isEmpty($scope.Data.draft.letterLayout) && letterLayoutListPromise) {
					letterLayoutListPromise.then(function () {
						var letterLayout = _.find($scope.Data.letterLayoutList, { uid: $scope.Data.draft.letterLayout.uid });
						if (letterLayout) {
							letterLayout.isFetched = true;
							$scope.Func.onSelectLetterLayout(letterLayout);
						}
					});
				}
			},
			getsecretariatList: function () {
				// cartableKatebSrvc.getSecretariatList($scope.Data.orgUid).then(function (response) {
				cartableKatebSrvc.getSecretariatList($scope.Data.newOrganizationUid).then(function (response) {
					for (var int = 0; int < response.data.originalElement.length; int++) {
						$scope.Data.secretariatList.push(response.data.originalElement[int]);
					}
					if ($scope.Data.secretariatList.length)
						$scope.Func.onSelectSecretariat($scope.Data.secretariatList[0]);
				});
			},
			onSelectSecretariat: function (secretariat) {
				$scope.Data.secretariat = secretariat;
				$scope.Data.draft.secretariat = {
					uid: $scope.Data.secretariat.uid,
					title: $scope.Data.secretariat.title
				};
			},
			initiateSecretariat: function () {
				$scope.Data.secretariat = null;
				if ($scope.Data.draft.secretariat) {
					for (var int = 0; int < $scope.Data.secretariatList.length; int++) {
						if ($scope.Data.secretariatList[int].uid == $scope.Data.draft.secretariat.uid) {
							$scope.Data.secretariat = $scope.Data.secretariatList[int];
							break;
						}
					}
					$scope.Data.draft.deliveryTo.forEach(function (item) {
						if (item.type == "THROUGH_SECRETARIAT") {
							$scope.Data.counter = 1;
						}
					});
				}
			},
			removeExtraFields: function (data, shouldChange) {
				var result = angular.copy(data);
				if (result.deliveryCc) {
					angular.forEach(result.deliveryCc, function (cc) {
						if (cc.descEditMode) {
							delete cc.descEditMode
						}
					});
				}
				if (result.deliveryBcc) {
					angular.forEach(result.deliveryBcc, function (bcc) {
						if (bcc.descEditMode) {
							delete bcc.descEditMode
						}
					});
				}
				if (result.textBodyHashcode && $state.params.duplicateUid) {
					delete result.textBodyHashcode;
				}


				if (result.bodyType === 'File') {
					delete result.textBody;
				} else {
					//body type is Editor(CKEditor)
					delete result.fileBody;
					delete result.webEditFileUid
				}


				if (shouldChange) {
					$scope.Data.draft = angular.copy(result);
				}
				return result;
			},

			onSelectReceiver: function (item, model) {
				if (!$scope.Data.counter)
					$scope.Data.counter = 0;
				$scope.Func.onSelectSender(item, model);
				if (item.type == 'THROUGH_SECRETARIAT')
					$scope.Data.counter = $scope.Data.counter + 1;
			},
			onRemoveReceiver: function (item) {
				if (item.type == 'THROUGH_SECRETARIAT')
					$scope.Data.counter = $scope.Data.counter - 1;
			},

			getSenderList: function () {
				// cartableKatebSrvc.getSenderList().then(function (response) {
				cartableKatebSrvc.getSenderList($scope.Data.newOrganizationUid).then(function (response) {
					for (var int = 0; int < response.data.originalElement.length; int++) {
						$scope.Data.senderList.push(response.data.originalElement[int]);
					}
				});
			},
			onSelectSender: function (item, model) {
				var draft = angular.copy($scope.Data.draft);
				cartableKatebSrvc.checkSignatureAccess($scope.Func.removeExtraFields($scope.Data.draft, false)).then(function (res) {
					$scope.Data.draft.canEdit = res.data.canEdit;
					$scope.Data.draft.canSign = res.data.canSign;
					$scope.Data.draft.canMove = res.data.canMove;
					$scope.Data.draft.canParaph = res.data.canParaph;
					$scope.Data.draft.hasParapher = res.data.hasParapher;
					$scope.Data.draft.messages = res.data.messages;
					/*angular.forEach(res.data.messages, function (message) {
						vtShowMessageSrvc.showMassage('warning', '', message);
					});*/
				});
			},
			// onRemoveSenderClick: function (item) {
			// 	if (item == "sender") {
			// 		$scope.Data.draft.sender = null;
			// 	} else if (item == "actor") {
			// 		$scope.Data.draft.actor = null;
			// 	} else if (item == "topicCategory") {
			// 		$scope.Data.topicCategory = null;
			// 	} else if(item == "layout")
			// 	{
			// 		$scope.Data.letterLayout = null;
			// 	}
			// },
			initiateSender: function () {
				$scope.Data.sender = null;
				if (_.isObject($scope.Data.draft.sender)) {
					for (var int = 0; int < $scope.Data.senderList.length; int++) {
						if ($scope.Data.senderList[int].uid == $scope.Data.draft.sender.uid) {
							$scope.Data.sender = $scope.Data.senderList[int];
							// $scope.Func.onSelectSender($scope.Data.sender, $scope.Data.sender);
							break;
						}
					}
				}
			},
			initiateActor: function () {
				$scope.Data.actor = null;
				if (_.isObject($scope.Data.draft.actor)) {
					for (var int = 0; int < $scope.Data.senderList.length; int++) {
						if ($scope.Data.senderList[int].uid == $scope.Data.draft.actor.uid) {
							$scope.Data.actor = $scope.Data.senderList[int];
							//$scope.Func.onSelectSender($scope.Data.actor, $scope.Data.actor);
							break;
						}
					}
				}
			},
			onSelectItemInMultiselect: function (item) {
				if (item.type === 'THROUGH_SECRETARIAT') {
					$scope.Data.counter += 1;
				}
			},
			onRemoveItemInMultiselect: function (item) {
				if (item.type === 'THROUGH_SECRETARIAT') {
					$scope.Data.counter -= 1;
				}
			},
			onResetClick: function () {
				$scope.Data.draft = {
					canSign: false,
					canEdit: false,
					canMove: false,
					canParaph: false,
					uid: $scope.Data.draft.uid,
					deliveryTo: [],
					deliveryCc: [],
					deliveryBcc: [],
					paraphers: [],
					officialDate: new Date()
				};
				$scope.Data.responseNeeded = false;
				$scope.Data.letterLayout = null;
				$scope.Data.secretariat = null;
			},
			trustAsHtml: function (string) {
				return $sce.trustAsHtml(string);
			},

			onSelectTemplateClick: function () {
				var modalInstance = $modal.open({
					templateUrl: 'app/modules/kateb/templateModal/templateModal.html',
					controller: 'templateModalCtrl',
					size: 'lg',
					backdrop: 'static',
					keyboard: false,
					resolve: {
						orgUid: function () {
							return $scope.Data.newOrganizationUid;
						}
					}
				});
				modalInstance.result.then(function (res) {
					$scope.Data.newOrganizationUid = res.orgUid;
					$scope.Func.setLetterTemplate(res.selectedTemplate.uid);

					$scope.Func.getletterLayoutList();
					$scope.Func.getsecretariatList();
					$scope.Func.getSenderList();
				});
			},
			setLetterTemplate: function (templateUid) {
				$scope.Data.templateUid = templateUid;
				var initTemplate = function (template) {
					$scope.Data.template = template;
					$scope.Data.draft = template.data;
					$scope.Data.draft.otherOrganization = $scope.Data.newOrganizationUid !== 'CURRENT';
					$scope.Data.letterLayout = $scope.Data.draft.letterLayout;

					if (!$scope.Data.draft.attachments) {
						$scope.Data.draft.attachments = [];
					}
					if ($scope.Data.draft.requestResponseDate) {
						$scope.Data.responseNeeded = true;
					} else {
						$scope.Data.responseNeeded = false;
					}
					if ($scope.Data.draft.bodyType === 'Editor') {
						$scope.Data.editorType = 'Editor';
						$scope.Data.draft.bodyType = 'Editor';
						$scope.Data.ckeditor.setData($scope.Data.draft.textBody);
					} else {
						$scope.Data.editorType = 'File';
						$scope.Data.draft.bodyType = 'File';
					}
					if ($scope.Data.draft.deliveryTo) {
						$scope.Data.draft.deliveryTo.forEach(function (item) {
							if (item.type == "THROUGH_SECRETARIAT") {
								$scope.Data.counter = 1;
							}
						});
					}
					if ($scope.Data.draft.deliveryBcc) {
						$scope.Data.draft.deliveryBcc.forEach(function (item) {
							if (item.type == "THROUGH_SECRETARIAT") {
								$scope.Data.counter = 1;
							}
						});
					}
					if ($scope.Data.draft.deliveryCc) {
						$scope.Data.draft.deliveryCc.forEach(function (item) {
							if (item.type == "THROUGH_SECRETARIAT") {
								$scope.Data.counter = 1;
							}
							// item.descEditMode = true;
						});
						$scope.Func.setAttribute($scope.Data.draft.deliveryCc, 'descEditMode', true);
					}
					if ($scope.Data.draft.deliveryBcc)
						$scope.Func.setAttribute($scope.Data.draft.deliveryBcc, 'descEditMode', true);

					$scope.Func.initiateLetterLayout();
					$scope.Func.initiateSecretariat();
					$scope.Func.initiateSender();
					$scope.Func.initiateActor();
					if ($scope.Data.replyFromUid) {
						$scope.Func.getReplyFromData();
					}
				}
				if (templateUid == 'clientTemplate') {
					var clientTemplate = {
						"uid": "clientTemplate",
						"name": "قالب خالی",
						"data": {
							"deliveryTo": [],
							"deliveryCc": [],
							"deliveryBcc": [],
							"attachments": [],
							"paraphers": [],
							"priority": "Normal",
							"secretariat": null,
							"sender": null,
							"subject": "",
							"letterLayout": null,
							"fileBody": {},
							"textBody": "",
							"bodyType": "Editor",
							"requestResponseDate": null
						},
						"enabled": true,
						"thumnail": null
					}
					initTemplate(clientTemplate)
				} else {
					cartableKatebSrvc.getTemplate(templateUid).then(function (res) {
						initTemplate(res.data);
						$scope.Func.onSelectSender();
					});
				}
			},
			savePrivateLetterTemplate: function (typeOfSave) {
				var draftCp = angular.copy($scope.Func.removeExtraFields($scope.Data.draft, true));
				delete draftCp.uid;
				draftCp.textBody = $scope.Func.getCkEditorData();
				var data = {
					name: $scope.Data.userDefinedTemplateName,
					thumnail: $scope.Data.userDefinedTemplateThumnail,
					data: draftCp
				}
				if (typeOfSave == 'add') {
					cartableKatebSrvc.savePrivateLetterTemplate(data).then(function (res) {
						katebSrvc.showNotification('templateSaved');
					});
				} else {
					cartableKatebSrvc.updatePrivateLetterTemplate(data, $scope.Data.templateUid, $scope.Data.template.type, $scope.Data.orgUid).then(function (res) {
						katebSrvc.showNotification('templateSaved');
					});
				}
			},
			savePublicLetterTemplate: function () {
				var draftCp = angular.copy($scope.Func.removeExtraFields($scope.Data.draft, true));
				draftCp.textBody = $scope.Func.getCkEditorData();
				delete draftCp.uid;
				var data = {
					name: $scope.Data.userDefinedTemplateName,
					thumnail: $scope.Data.userDefinedTemplateThumnail,
					data: draftCp
				}
				cartableKatebSrvc.savePublicLetterTemplate(data, $scope.Data.orgUid).then(function (res) {
					katebSrvc.showNotification('templateSavedp');
				});
			},
			correctLetterTextBody: function (textBody) {

				if (!textBody) {
					return
				}
				var textbodyCopy = angular.copy(textBody);

				/*textbodyCopy = textbodyCopy.replace('{{موضوع}}', "<span class='kateb_template_subject'></span>");
				textbodyCopy = textbodyCopy.replace('{{فرستنده}}', "<span class='kateb_template_sender'></span>");
				textbodyCopy = textbodyCopy.replace('{{گیرندگان}}', "<span class='kateb_template_delivery_to'></span>");
				textbodyCopy = textbodyCopy.replace('{{گیرنده}}', "<span class='kateb_template_delivery_to1'></span>");
				textbodyCopy = textbodyCopy.replace('{{رونوشت}}', "<span class='kateb_template_delivery_cc'></span>");
				textbodyCopy = textbodyCopy.replace('{{رونوشت پنهان}}', "<span class='kateb_template_delivery_bcc'></span>");*/


				textbodyCopy = textbodyCopy.replace(/style="font-family:b titr"/g, 'class="kateb_font_titr"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b titr;"/g, 'class="kateb_font_titr"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b nazanin"/g, 'class="kateb_font_nazanin"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b nazanin;"/g, 'class="kateb_font_nazanin"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b koodak"/g, 'class="kateb_font_koodak"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b koodak;"/g, 'class="kateb_font_koodak"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b zar"/g, 'class="kateb_font_zar"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b zar;"/g, 'class="kateb_font_zar"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b yagut"/g, 'class="kateb_font_yagut"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b yagut;"/g, 'class="kateb_font_yagut"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b lotus"/g, 'class="kateb_font_lotus"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:b lotus;"/g, 'class="kateb_font_lotus"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:'IRANYekan';"/g, 'class="kateb_font_IRANYekan"');
				textbodyCopy = textbodyCopy.replace(/style="font-family:'IRANSansX';"/g, 'class="kateb_font_IRANSansX"');


				var textBodyCp = $(angular.copy(textbodyCopy));
				var addItemsToTemplate = function (items, type) {
					if (!items) {
						return "";
					}
					newTemplate = "";
					switch (type) {
						case "to1":
							if (items[0]) {
								newTemplate += items[0].title;
							}
							return newTemplate;
							break;
						case "to":
							newTemplate += "";
							break;
						case "cc":
							newTemplate += "رونوشت ها:";
							break;
						case "bcc":
							newTemplate += "رونوشت های پنهان:";
							break;
						default:
							newTemplate += "";
							break;
					}
					newTemplate += "<span>";
					items.forEach(function (item) {
						if (item) {
							newTemplate += "<br/><span class='kateb_template_delivery_item_" + type + " delivery_" + type + " delivery_" + item.uid + "'>&#9744; " + item.title + "";
							newTemplate += (item.description ? (" " + item.description) : "") + "</span>";
						}
					});
					newTemplate += "</span>";
					return newTemplate;
				};

				/*textBodyCp.find(".kateb_template_subject").html($scope.Data.draft.subject);
				textBodyCp.find(".kateb_template_sender").html($scope.Data.draft.sender?$scope.Data.draft.sender.title:"");
				textBodyCp.find(".kateb_template_delivery_to1").html(addItemsToTemplate($scope.Data.draft.deliveryTo,"to1"));
				textBodyCp.find(".kateb_template_delivery_to").html(addItemsToTemplate($scope.Data.draft.deliveryTo,"to"));
				textBodyCp.find(".kateb_template_delivery_cc").html(addItemsToTemplate($scope.Data.draft.deliveryCc,"cc"));
				textBodyCp.find(".kateb_template_delivery_bcc").html(addItemsToTemplate($scope.Data.draft.deliveryBcc,"bcc"));*/

				var textBodyOutput = "";
				for (var i = 0; i < textBodyCp.length; i++) {
					textBodyOutput += textBodyCp[i].outerHTML ? textBodyCp[i].outerHTML : "";
				}
				return textBodyOutput;
				// return textBodyCp.prop('outerHTML');
			},
			getReplyFromData: function () {
				$scope.Data.editorType = 'File'
				cartableKatebSrvc.getLpa($scope.Data.replyFromUid).then(function (res) {
					// $scope.Data.replyFromData = res.data.originalElement.letter;
					// console.log($scope.Data.replyFromData);
					$scope.Data.draft.subject = "پاسخ به نامه با موضوع: ".concat(res.data.originalElement.letter.subject);
					// $scope.Data.draft.deliveryTo =  res.data.originalElement.letter.deliveryTo;
					$scope.Data.draft.attachments.push({
						letterBody: {
							title: res.data.originalElement.letter.subject,
							uid: res.data.originalElement.letter.uid
						},
						relationTypeKey: "Turn",
						type: "LETTER"
					});
					$scope.Data.mode = 'edit';
				});
			},
			exchangeDelete: {
				closeModalConfirm: function (resp) {
					if (resp) {
						$scope.Func.onDeleteClick();
					}
				}
			},
			setPdfUrl: function (model) {
				// var fileUrl = secretariatSrvc.getFileURLForViewByFile({name:'letterPdf.html', hash:model.hash});
				// var encodedUrl =  encodeURIComponent("/Kateb/files/letterPdf.html?mode=view&fcode=" + model.hash + "&contentType=text/html");
				$scope.Data.pdfUrl = "app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/files/letterPdf.html?mode=view&fcode=" + model.hash + "&contentType=text/html");
			},
			getPdfUrl: function (src) {
				return $sce.trustAsResourceUrl("app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent("/Kateb/".concat(src)));
			},
			getLastSearchQuery: function () {
				return cartableKatebSrvc.getLastSearchQuery();
			},
			setAttribute: function (obj, att, val) {
				obj.forEach(function (item) {
					item[att] = val;
				});
			},
			onGetNextLetterClick: function () {

				var currentDraftIndexObj = $scope.Func.calcIndexOfDraftInCachedList($state.params.draftUid);

				if (currentDraftIndexObj.index < 0 || currentDraftIndexObj.isLast) {
					return;
				}


				$state.go('base.home.cartable.draft', { draftUid: $scope.Data.lastCachedVisitedCartableFilterList[currentDraftIndexObj.index + 1].uid });

				// FIXME: remove this function (getTask) if not used!

				// cartableSrvc.getTask('next').then(function (res) {
				// 	$state.go('home.cartable.draft', { draftUid: res.data.originalElement[0].uid });
				// });

			},
			onGetPreviousLetterClick: function () {

				var currentDraftIndexObj = $scope.Func.calcIndexOfDraftInCachedList($state.params.draftUid);

				if (currentDraftIndexObj.index < 0 || currentDraftIndexObj.isFirst) {
					return;
				}


				$state.go('base.home.cartable.draft', { draftUid: $scope.Data.lastCachedVisitedCartableFilterList[currentDraftIndexObj.index - 1].uid });

				// FIXME: remove this function (getTask) if not used!

				// cartableSrvc.getTask('previous').then(function (res) {
				// 	$state.go('home.cartable.draft', { draftUid: res.data.originalElement[0].uid });
				// });
			},
			// return {index,isLast,isFirst}
			calcIndexOfDraftInCachedList: function (draftUid) {
				if (!$scope.Data.lastCachedVisitedCartableFilterList && !angular.isArray($scope.Data.lastCachedVisitedCartableFilterList)) {
					return {
						index: -1
					}
				}

				var draftIndex = $scope.Data.lastCachedVisitedCartableFilterList.findIndex((draft) => draft.uid === $state.params.draftUid);

				return {
					index: draftIndex,
					isLast: draftIndex >= ($scope.Data.lastCachedVisitedCartableFilterList.length - 1),
					isFirst: draftIndex <= 0
				}

			},
			getSigner: function (draftCp, draftCpUid) {
				cartableKatebSrvc.getSigner($scope.Func.removeExtraFields(draftCp, false), draftCpUid).then(function (res) {
					$scope.Data.signerInfo = res.data;
				});
			},
			getParapher: function (draftCp, draftCpUid) {
				cartableKatebSrvc.getParapher($scope.Func.removeExtraFields(draftCp, false), draftCpUid).then(function (res) {
					$scope.Data.signerInfo = res.data;
				});
			},
			onEditDocxWhitSystemEdit: function () {
				let draft = $scope.Data.draft;
				if (!draft.letterLayout || !draft.letterLayout.uid) {
					return
				}
				if (draft.webEditFileUid || (draft.fileBody && draft.fileBody.name && draft.fileBody.name.split('.').pop() === 'docx')) {
					// edit prev docx
					$scope.Func.SystemEdit();
				} else {
					// edit default temp docx
					cartableKatebSrvc.getDraftDocxTemplate(draft.letterLayout.uid).then(
						function (res) {
							draft.fileBody = {
								'name': res.data.name,
								'hash': res.data.hash,
								'size': res.data.size
							}
							$scope.Func.SystemEdit();
						}
					);
				}
			},
			removeFileBodyCallBack: function () {
				let draft = $scope.Data.draft;
				if (draft.webEditFileUid) {
					$scope.Func.deleteWebEditFile(draft);
					draft.webEditFileUid = null;
				}
			},
			deleteWebEditFile: function (draft) {
				cartableKatebSrvc.deleteWebEditFile(draft.webEditFileUid)
			},
			SystemEdit: function () {
				let draft = $scope.Data.draft;
				let parentThis = this;
				$http.get('http://localhost:45458/').then(function () {
					var url = configObj.config.server.protocol + '://' + configObj.config.server.host;
					if (configObj.config.server.port) {
						url = url + ':' + configObj.config.server.port;
					}
					if (configObj.config.server.contextPath) {
						url = url + '/' + configObj.config.server.contextPath;
					}
					url = url + '/static/webedit.html';

					let fileBody = draft.fileBody;

					let webEditFile;
					if (draft.webEditFileUid) {
						webEditFile = cartableKatebSrvc.getWebEditFile(draft.webEditFileUid);
					} else {
						webEditFile = cartableKatebSrvc.createWebEditFile(fileBody);
					}

					webEditFile.then(
						function (res) {
							const webEditFileUid = res.data.uid;
							$scope.Data.draft.webEditFileUid = webEditFileUid
							$window.open('oauth/authorize?response_type=code&client_id=webedit&state=' + webEditFileUid + '&redirect_uri=' + url, '_blank', 'location=yes,height=400,width=400,scrollbars=yes,status=yes');
						}
					)

				}, function () {
					$modal.open({
						template: '<div class="modal-header">\n' +
							'    <i class="flaticon-cancel pull-left" ng-click="Func.onClose()" style="cursor: pointer;"></i>\n' +
							'    <h5 class="modal-title">نرم افزار ویرایشگر فعال نیست</h5>\n' +
							'</div>\n' +
							'<div class="modal-body">\n' +
							'    <div class="row">\n' +
							'        <div class="col-sm-12">\n' +
							'            <p>لطفا نرم افزار ویرایشگر را اجرا کنید. در صورتی که نرم افزار ویرایشگر بر روی سیستم شما نصب نمی باشد، فایل نرم افزار را دانلود کنید و پس از نصب و راه اندازی، دوباره تلاش نمایید.</p>\n' +
							'        </div>\n' +
							'    </div>\n' +
							'    <div class="row">\n' +
							'        <div class="col-sm-4 text-center">\n' +
							'           <a href="./app/webedit/SaadWebEdit.exe" target="_blank">\n' +
							'               <img src="app/assets/img/windows.png" height="60">\n' +
							'               <div>دانلود نرم افزار ویندوز</div>\n' +
							'           </a>\n' +
							'        </div>\n' +
							'    </div>\n' +
							'    <div class="row">\n' +
							'        <div class="col-sm-12 text-center" style="margin-top: 20px;">\n' +
							'            <button type="button" ng-click="Func.onRetry()" class="btn btn-primary">تلاش دوباره</button>\n' +
							'        </div>\n' +
							'    </div>\n' +
							'</div>',
						controller: function ($scope, $modalInstance) {
							$scope.Func = {
								onRetry: function () {
									parentThis.SystemEdit();
									$modalInstance.close();
								},
								onClose: function () {
									$modalInstance.close();
								}
							}
						},
					});
				});
			},
			setCKEditorValidation: function () {

				if ($scope.Func.getCkEditorData() == "") {
					$timeout(function () { $scope.Data.ckeditorInvalid = true; }, 1);
				} else {
					$timeout(function () { $scope.Data.ckeditorInvalid = false; }, 1);
				}
				return $scope.Data.ckeditorInvalid;
			},
			setNextPrevDisablity: function () {
				var indexObjInCachedList = $scope.Func.calcIndexOfDraftInCachedList($state.params.draftUid);
				$scope.Data.isNextDisabled = indexObjInCachedList.index < 0 || indexObjInCachedList.isLast;
				$scope.Data.isPrevDisabled = indexObjInCachedList.index < 0 || indexObjInCachedList.isFirst;

				if ($scope.Data.isNextDisabled && $scope.Data.isPrevDisabled) {
					$scope.Data.isNextPrevFeaturePossible = false;
				}
			}


		};

		$scope.controller = {
			paraphMultiselect: {
				onSelect: function () {
					$scope.Func.onSelectSender();
				},
				onRemove: function () {
					$scope.Func.onSelectSender();
				}
			},
			draftHistoryListController: {
				headers: [
					{ key: 'modifierUser.title' },
					{ key: 'description', strSize: 60, hasTooltip: true },
					{ key: 'modificationDate', type: "date", format: "jDD-jMMMM-jYYYY   HH:mm" },
					{
						key: 'action', label: "متن پیش‌نویس", type: 'action', icon: 'fa fa-file-pdf-o fa-2x', showCondition: true, valueShouldHave: 'modificationDate', action: function (item, event, index) {
							var link = $scope.Func.getPdfUrl('api/org/current/letter_draft/history/' + $scope.Data.draftUid + '/pdf/' + index);
							window.open(link, '_blank');
						}
					}
				],
				getList: function (start, pageLen) {
					return cartableKatebSrvc.getDraftHistory($scope.Data.draftUid, start, pageLen);
				},
				onListItemSelect: function () { }
			},
			vtPDF: {
				canSign: true,
				pdfUrl: ""
			},

			multiselectRecieverSearch: cartableKatebSrvc.getPuaList,
		}

		$scope.Apis = {
			vtFolderSelector: {}
		}

		var Run = function () {
			$scope.Data.letterState = cartableSrvc.getCurrentTaskState();

			$scope.Func.getTabList();
			// Thease two function calls have moved to templateModalInstance result because of setting orgUid in the modal
			// $scope.Func.getletterLayoutList();
			// $scope.Func.getsecretariatList();
			// $scope.Func.getSenderList();
			if ($state.params.duplicateUid) {
				$scope.Data.draftUid = $state.params.duplicateUid;
			}

			$scope.Func.onTabClick($scope.Data.tabList[0]);


			CKEditor5.editorClassic.ClassicEditor.create(document.querySelector('#editor1'),
				angular.module('app').ckeditorConfig).then(function (editor) {
					$scope.Data.ckeditor = editor;
					if ($scope.Data.draft && $scope.Data.draft.textBody) {
						$scope.Data.ckeditor.setData($scope.Data.draft.textBody);
					}

					if ($scope.Data.draftUid) {
						$timeout(function () {
							$scope.Func.getDraft();
						}, 0);
					} else {
						$scope.Data.mode = 'add';
						$scope.Func.onSelectTemplateClick();
						$('#draftTemplateId').bind('click', function (e) {
							e.stopPropagation();
						});
					}

					editor.model.document.on('change', () => {
						$scope.Func.setCKEditorValidation();
					});


					// $scope.Data.ckeditor.setData($scope.Data.draft.textBody);
				});


			$scope.Func.setNextPrevDisablity()

		}

		Run();


		// ***** hotKeys *****//

		hotkeys.bindTo($scope)
			.add({
				combo: 'alt+i',
				allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
				callback: function () {
					$scope.Func.onEditClick()
				}
			})
			.add({
				combo: 'alt+o',
				allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
				callback: function () {
					$scope.Func.onSignatureClick()
				}
			})
			.add({
				combo: 'alt+p',
				allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
				callback: function () {
					$scope.Func.onTransferClick()
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
			// .add({
			// 	      combo: 'esc',
			// 	      allowIn: ['INPUT', 'SELECT', 'TEXTAREA'],
			// 	      callback: function(){
			// 	      	$scope.Func.onResetClick()
			// 	      }
			// })
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
