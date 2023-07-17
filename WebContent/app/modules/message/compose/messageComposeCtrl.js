angular.module('messageModule').controller('messageComposeCtrl', function($scope, messageSrvc, $state) {

	$scope.Data = {
		recievers: [],
		recieversSelected: [],
		attachments: [],
		messageInfo: "",
		composeForm: "",
		validationClicked: false
	};

	$scope.Func = {
		getRecievers: function () {
			messageSrvc.getRecievers().then(function (response) {
				$scope.Data.recievers = response.data;
			});
		},
		onSendMessagesClick: function () {
			if ($scope.Data.composeForm.$valid) {
				$scope.Data.messageInfo.content = $scope.Data.ckeditor.getData();
				$scope.Data.messageInfo.attachments = _.map($scope.Data.attachments, function (item) {
					var tmp = {hash: item.hash};
					return tmp;
				});
				messageSrvc.sendMessage($scope.Data.messageInfo).then(function (response) {
					$state.go("base.home.message.inbox");
				});
			} else {
				$scope.Data.validationClicked = true;
			}
		},
		onOpenFileDialogClick: function () {
			$scope.Controller.attachment.openFileBrowse();
		}
	}

	$scope.Controller = {
		attachment: {}
	}

	var Run = function () {
		// $scope.Data.ckeditor = CKEDITOR.replace('editor1', {
		// 	height: 300
		// });

		CKEditor5.editorClassic.ClassicEditor.create(
			document.querySelector( '#editor1' ),
			angular.module('app').ckeditorConfig).then(function(editor){
			$scope.Data.ckeditor = editor;
		});
		$scope.Func.getRecievers();
	}

	Run();
});
