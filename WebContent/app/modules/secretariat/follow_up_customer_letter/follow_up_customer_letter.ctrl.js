angular
  .module("secretariatModule")
  .controller(
    "followupCustomerLetterCtrl",
    function ($scope, $state, $modal, $timeout, secretariatSrvc, appConst) {
      ($scope.Data = {
        secUid: $state.params.secUid,
        searchMode: "none",
        wasSearched: false,
      }),
        ($scope.Func = {
          onIssuedClick: function (issued) {
            $scope.Func.setLastPage(
              $scope.Controller.listController.currentPage
            );
            $state.go("base.home.secretariat.issuedLetter", {
              secUid: $scope.Data.secUid,
              incUid: issued.uid,
              letterUid: issued.letter.uid,
            });
          },

          onChangeSearchModeClick: function (mode) {
            $scope.Data.searchMode = mode;
          },
          onSearchClick: function (lastPage) {
            $scope.Func.setLastSearchQuery(
              $scope.Controller.searchController.searchQuery
            );
            $scope.Func.onChangeSearchModeClick("quick");
            $scope.Controller.listController.searchQuery =
              $scope.Controller.searchController.searchQuery;
            $scope.Controller.listController.searchableFieldInfo =
              $scope.Controller.searchController.searchableFieldInfo;
            if ($scope.Controller.listController.searchQuery.date) {
              $scope.Controller.listController.searchQuery.fromDate =
                $scope.Controller.listController.searchQuery.date.split(",")[0];
              $scope.Controller.listController.searchQuery.toDate =
                $scope.Controller.listController.searchQuery.date.split(",")[1];
              delete $scope.Controller.listController.searchQuery.date;
            }
            var fn = function (start, pageLen) {
              return secretariatSrvc
                .searchsearchFollowupCustomerLetterListQueryParam(
                  $scope.Data.secUid,
                  start,
                  pageLen,
                  $scope.Controller.listController.searchQuery
                )
                .then(function (res) {
                  res.data.fields = undefined;

                  return res;
                });
            };
            $scope.Controller.listController.getList = fn;
            $timeout(function () {
              if (lastPage) $scope.Controller.listController.goToPage(lastPage);
              else $scope.Controller.listController.refreshList(false);
            }, 1);
            $scope.Func.setSearchMode(false);
            $scope.Data.wasSearched = false;
          },
          onExitSearchModeClick: function () {
            $scope.Func.onChangeSearchModeClick("none");
            $scope.Controller.searchController.searchQuery = {};
            $scope.Func.setLastSearchQuery(
              $scope.Controller.searchController.searchQuery
            );
            // $scope.Controller.listController.getList = function(start, pageLen){
            // 	return secretariatSrvc.searchsearchIssuedLetterListQueryParam($scope.Data.secUid, start, pageLen);
            // };
            $scope.Controller.listController.getList = null;
            $scope.Controller.listController.listItems.length = 0;
            $scope.Controller.listController.exitSearchMode();
          },
          setSearchMode: function (mode) {
            secretariatSrvc.setSearchMode(mode);
          },
          getSearchMode: function () {
            return secretariatSrvc.getSearchMode();
          },
          setLastSearchQuery: function (query) {
            secretariatSrvc.setLastSearchQuery(query);
          },
          getLastSearchQuery: function () {
            return secretariatSrvc.getLastSearchQuery();
          },
          setLastPage: function (pageNum) {
            secretariatSrvc.setLastPage(pageNum);
          },
          getLastPage: function () {
            return secretariatSrvc.getLastPage();
          },
        });

      $scope.Controller = {
        listController: {
          headers: [
            { key: "number", label: "شماره پیش‌نویس" },
            { key: "subject", label: "موضوع" },
            { key: "sender.title", label: "امضا کننده" },
            { key: "state", label: "وضعیت", type: "enum", width: '100px' },
            {
              key: "state",
              label: "جزئیات",
              type: "action",
              icon: "glyphicon glyphicon-info-sign",
              // showConditionArr: true,
              // valueShouldHave: "highlight",
              action: function (item, event) {
                event.stopPropagation();
                event.preventDefault();
                var modalInstance = $modal.open({
                  template: `
                  <style>
                    #followupCustomerLetterModal .row {
                      margin: 15px 0;
                    }
                  </style>
						<div class="modal-body" id="followupCustomerLetterModal">
							<div class="row">
								<label class="col-sm-4">وضعیت</label>
								<div class="col-sm-8">{{ Data.stateFarsi }}</div>
							</div>
							<div class="row">
								<label class="col-sm-4">آخرین ویرایش کننده</label>
								<div class="col-sm-8">{{ Data.modifierUser.title }}</div>
							</div>
              <div class="row">
                <label class="col-sm-4">تاریخ انتقال</label>
                <div class="col-sm-8">{{ Data.lastMoveDate|tehranDate:'jYYYY/jMM/jDD - HH:mm:ss' | EnToFaNumber }}</div>
              </div>
						</div>
					`,
                  controller: function ($scope, item, appConst) {
                    $scope.Data = item;
                    $scope.Data.stateFarsi = appConst.draftState[$scope.Data.state];
                  },
                  size: "",
                  resolve: {
                    item: function () {
                      return item;
                    },
                  },
                });
                modalInstance.result.then(function (selectedItem) {});
              },
            },
          ],
          getList: undefined,
          onListItemSelect: undefined,
          searchFunction: function (query, start, len) {
            return secretariatSrvc.searchFollowupCustomerLetterList(
              $scope.Data.secUid,
              query,
              start,
              len
            );
          },
          isDisableInit: true,
        },
        searchController: {
          advanced: false,
          searchableFieldInfo: [
            { key: "number", label: "شماره پیش‌نویس", type: "string" },
            { key: "subject", label: "موضوع پیش‌نویس", type: "string" },
            {
              key: "date",
              label: "تاریخ ایجاد پیش‌نویس",
              type: "date",
              format: "jDD-jMMMM-jYYYY",
            },
          ],
          onSearchClick: $scope.Func.onSearchClick,
          onExitSearchModeClick: $scope.Func.onExitSearchModeClick,
        },
      };

      var Run = function () {
        $scope.Data.wasSearched = $scope.Func.getSearchMode();
        $scope.Data.currentPage = $scope.Func.getLastPage();

        if (!$scope.Data.wasSearched) {
          $timeout(function () {
            $scope.Controller.listController.goToPage($scope.Data.currentPage);
          }, 1);
        } else {
          $scope.Controller.searchController.searchQuery =
            $scope.Func.getLastSearchQuery();
          $timeout(function () {
            $scope.Func.onSearchClick($scope.Data.currentPage);
          }, 1);
        }
      };

      Run();
    }
  );
