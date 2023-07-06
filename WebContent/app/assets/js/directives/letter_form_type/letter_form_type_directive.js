angular
  .module("letterFormTypeDirectiveModule", [])
  .directive("letterFormType", function ($q, $timeout, letterFormTypeSrvc) {
    return {
      restrict: "E",
      templateUrl:
        "app/assets/js/directives/letter_form_type/letter_form_type.html",
      scope: {
        ngModel: "=",
        mode: "=",
        apis: "=",
        letter: "=",
        orgUid: "=",
        cssClass: "@",
        cssClassSelectorType: "@",
        cssClassSelectorTypeLabel: '@',
        cssClassSelectorTypeInput: '@',
      },
      require: ["form"],
      controller: function ($scope) {
        $scope.Data = {
          formLetterTypeDataModel: {},
        };

        $scope.Func = {
          removeLetterFormType: function () {
            $scope.Data.selectedLetterFormType = $scope.ngModel = undefined;
            $scope.Data.schema = undefined;
            $scope.Data.formLetterTypeDataModel = {};
          },
          getLetterFormTypeList: function () {
            var deffered = $q.defer();
            if (!$scope.Data.letterFormTypeList) {
              letterFormTypeSrvc.setOrgUid($scope.orgUid || $scope.letter.organization.uid);
              letterFormTypeSrvc
                .getletterFormTypeList(0, 200)
                .then(function (res) {
                  $scope.Data.letterFormTypeList = res.data;
                  deffered.resolve($scope.Data.letterFormTypeList);
                });
            } else {
              deffered.resolve($scope.Data.letterFormTypeList);
            }

            return deffered.promise;
          },
          onChangeLetterFormType: function () {
            if (
              $scope.Data.selectedLetterFormType &&
              $scope.Data.selectedLetterFormType.entityType
            ) {
              $scope.ngModel = $scope.Data.selectedLetterFormType;
              $scope.Data.schema = JSON.parse(
                $scope.Data.selectedLetterFormType.entityType.schema
              );
              $scope.Data.formLetterTypeDataModel = {};
            }
          },
          getLetterFormTypeListForSelect: function () {
            return _.filter(
              $scope.Data.letterFormTypeList,
              function (letterFromType) {
                return letterFromType.enabled;
              }
            );
          },
          initSelectedLetterFormType: function () {
            if (
              $scope.letter.forms &&
              $scope.letter.forms.length > 0 &&
              $scope.letter.forms[0].letterFormType
            ) {
              $scope.Func.getLetterFormTypeList().then(function (res) {
                $scope.Data.selectedLetterFormType = _.find(
                  $scope.Data.letterFormTypeList,
                  function (formType) {
                    return (
                      formType.uid === $scope.letter.forms[0].letterFormType.uid
                    );
                  }
                );

                $scope.Func.onChangeLetterFormType();
                $timeout(function () {
                  $scope.Data.formLetterTypeDataModel =
                    $scope.apis.schemaFormApi.correctDataModelForForm(
                      $scope.Data.schema,
                      $scope.letter.forms[0].content || {}
                    );
                }, 500);
              });
            }
          },
        };

        $scope.apis.schemaFormApi = {
          prepareLetterFormTypeForSave: function () {
            if (
              $scope.Data.selectedLetterFormType &&
              $scope.Data.selectedLetterFormType.uid
            ) {
              $scope.letter.forms = [
                {
                  letterFormType: {
                    uid: $scope.Data.selectedLetterFormType.uid,
                  },
                  content: $scope.apis.schemaFormApi.correctModel(
                    $scope.Data.schema,
                    $scope.Data.formLetterTypeDataModel
                  ),
                },
              ];
            } else if ($scope.letter) {
              $scope.letter.forms = undefined;
            }
          },
        };

        var Run = function () {
          if ($scope.letter) {
            $scope.Func.initSelectedLetterFormType();
          }

          $scope.cssClass =
            $scope.cssClass === undefined ? "col-sm-6" : $scope.cssClass;
        };

        Run();
      },
    };
  });
