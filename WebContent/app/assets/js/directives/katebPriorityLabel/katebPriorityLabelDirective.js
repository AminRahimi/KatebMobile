angular.module("katebPriorityLabel",[]).directive('katebPriorityLabel',
   
    function () {
        return {
            restrict: 'EA',
            templateUrl: 'app/assets/js/directives/katebPriorityLabel/katebPriorityLabel.html',
            scope: {
                priority:"=",
                value:"@"
            },
            controller: function ($scope) {

                const prioriyClassNameMap = {
                    Normal:'kateb-label--default-light',
                    Unknown:'kateb-label--default-light',
                    Critical:'kateb-label--warning-light',
                    Blocker:'kateb-label--warning-deep',
                    Immediate:'kateb-label--danger',
                }

                $scope.Data = {
                    prioriyClassNameMap :prioriyClassNameMap 
                };

                $scope.Func = {
                  
                };
                
                
                var Run = function () {

                 

                }

                Run();
            }
        }
    });
