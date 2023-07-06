angular.module('app.directive', []).directive("pageNavigation",function($http){
        return {
	      restrict: 'A',
	      templateUrl: 'common/directives/pageNavigation/pageNavigation.html',
	      replace : true,
	      scope: {
			service    : '=' ,
			pageLength     : '=' ,
			startLocation  : '=' ,
			endLocation    : '='
	      },
		  /************************  CONTROLLER  **************************************/
		  controller : function($scope, $element, $attrs) {

		    /**********************************************************************/
			/*                                                                    */
			/*                      Variable Block                                */
	        /*                                                                    */
			/**********************************************************************/
			
		    $scope.Navigation={
			    Start:0,
			    End:0,
				Length:0
			};
		    $scope.pageNumber="";
			
			/**********************************************************************/
			/*                                                                    */
			/*                      Code Block                                    */
	        /*                                                                    */
			/**********************************************************************/
			
			// chack id digit or press enter
			$scope.checkPressBetween=function(ev,callback){
		       if (ev.which==13  &&  $scope.pageNumber!="")
			      callback($scope.pageNumber);
			   var isDigit=$scope.pageNumber.match(/^([1-9]\d*)$/);
			   if(isDigit!=null){
			     var digit=parseInt($scope.pageNumber);
				 console.log(digit);
			     $scope.pageNumber=(digit<=$scope.Navigation.Length)?(digit):"";
			   }else{
			     $scope.pageNumber="";
			   }
	        };
			
			$scope.changePage=function(pageCount){
			   $scope.pageNumber=pageCount;
			   $scope.startLocation=(pageCount-1)*parseInt($scope.pagesOffset);
			   $scope.endLocation=Math.min($scope.startLocation+parseInt($scope.pagesOffset),parseInt($scope.pageLength));
			};
			
			$scope.goToPage=function($event,type){
			  switch(type){
			    case "first":
				   $scope.changePage(1);
				   break;
				case "previus":
				   $scope.changePage((parseInt($scope.pageNumber)-1)>0?(parseInt($scope.pageNumber)-1):($scope.Navigation.Length));
				   break;
				case "next":
				   $scope.changePage(Math.max((parseInt($scope.pageNumber)+1)%(parseInt($scope.Navigation.Length)+1),1));
				   break;
				case "last":
				   $scope.changePage($scope.Navigation.Length);
				   break;
				default:
				   break;
			  }
			}
			
			/**********************************************************************/
			/*                                                                    */
			/*                      Watch Block                                   */
	        /*                                                                    */
			/**********************************************************************/
			$scope.$watch("pageLength",function(newValue,oldValue){
	          if(newValue==0){
			    $scope.Navigation.Start=0;
			    $scope.Navigation.End=0;
              }else{
			    $scope.Navigation.Length=Math.ceil(parseInt(newValue)/parseInt($scope.pagesOffset));
			    $scope.Navigation.Start=0;
	            $scope.Navigation.End= $scope.Navigation.Length;
				$scope.pageNumber=1;
				$scope.changePage($scope.pageNumber);
              }				
     		  return newValue;
	        },true);
			
			
		  },
		  /******************************  LINK   *******************************************/
		  link: function (scope, element, attrs) {
	    	 
	      }
	    };
	});