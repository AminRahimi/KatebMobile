    angular.module("bottomSheet", []).directive('bottomSheet', function() {
    return {
		restrict : 'EA',
		templateUrl : 'app/assets/js/directives/bottomSheet/bottomSheet.html',
		scope : {
		},
        controller : function($scope,$element,$timeout,bottomSheetSrvc ) {
            $scope.controller="emptyCtrl"
            $scope.templateUrl="app/assets/js/directives/bottomSheet/bottomSheet.empty.html"


            // Copyright (c) 2022 Ivan Teplov


            const sheet = $($element).find("#saad-buttom-sheet")[0];
            const sheetContents = sheet.querySelector(".contents")
            const draggableArea = sheet.querySelector(".draggable-area")

            let sheetHeight // in vh

            const setSheetHeight = (value) => {
                sheetHeight = Math.max(0, Math.min(100, value))
                sheetContents.style.height = `${sheetHeight}vh`

                if (sheetHeight === 100) {
                    sheetContents.classList.add("fullscreen")
                } else {
                    sheetContents.classList.remove("fullscreen")
                }
            }

            const setIsSheetShown = (value) => {
                sheet.setAttribute("aria-hidden", String(!value))
            }

            

            // Hide the sheet when clicking the 'close' button
            // sheet.querySelector(".close-sheet").addEventListener("click", () => {
            //     setIsSheetShown(false)
            // })

            // Hide the sheet when clicking the background
            sheet.querySelector(".overlay").addEventListener("click", () => {
                setIsSheetShown(false)
            })

            const touchPosition = (event) =>
                event.touches ? event.touches[0] : event

            let dragPosition

            const onDragStart = (event) => {
                dragPosition = touchPosition(event).pageY
                sheetContents.classList.add("not-selectable")
                draggableArea.style.cursor = document.body.style.cursor = "grabbing";
                event.preventDefault();
            }

            const onDragMove = (event) => {
                if (dragPosition === undefined) return

                const y = touchPosition(event).pageY
                const deltaY = dragPosition - y
                const deltaHeight = deltaY / window.innerHeight * 100

                setSheetHeight(sheetHeight + deltaHeight)
                dragPosition = y
            }

            const onDragEnd = () => {
            dragPosition = undefined
            sheetContents.classList.remove("not-selectable")
            draggableArea.style.cursor = document.body.style.cursor = ""

            if (sheetHeight < 25) {
                setIsSheetShown(false)
            } else if (sheetHeight > 75) {
                setSheetHeight(100)
            } else {
                setSheetHeight(50)
            }
            }

            draggableArea.addEventListener("mousedown", onDragStart)
            draggableArea.addEventListener("touchstart", onDragStart)

            window.addEventListener("mousemove", onDragMove)
            window.addEventListener("touchmove", onDragMove)

            window.addEventListener("mouseup", onDragEnd)
            window.addEventListener("touchend", onDragEnd)







            $scope.Data = {
                
            };
            $scope.Func = {
                openSheet : function(controller,templateUrl,inputObject){
                    bottomSheetSrvc.setInputObject(inputObject);
                    $scope.controller = controller || $scope.controller;
                    $scope.templateUrl = templateUrl || $scope.templateUrl;
                    $scope.isContentLoad = false;
                    $timeout(()=>{
                        setSheetHeight(Math.min(50, 720 / window.innerHeight * 100));
                        setIsSheetShown(true);
                        $scope.isContentLoad = true;
                    });
                }
            };
            var Run = function () {
                bottomSheetSrvc.setOpenFunction($scope.Func.openSheet);
            };
            Run();


        }
    };
});


angular.module("bottomSheet").directive('saadDynamicDirective', function($compile, $templateRequest) {
    return {
		restrict : 'EA',
		scope : {
            ctrl:"@",
            templateUrl:"@"
		},
        controller : function($scope,$element ) {
        
        },
        link : function(scope, element, attrs) {

            scope.$watchGroup(['ctrl','templateUrl'],()=>{
                $templateRequest(scope.templateUrl).then(function(html) {
                    template = html;
                    element.html(`<div ng-controller="${scope.ctrl}" class="tw-h-full">${template}</div>`);
    
                    return $compile(element.contents())(scope);
    
                });
            });

            

        }
    };
});

angular.module("bottomSheet").factory('bottomSheetSrvc',function(){

    let inputObject;
    let open;

    let bottomSheetSrvc = {
        setOpenFunction(fn){
            open = fn;
        },
        open(controller,templateUrl,inputObject){
            return open(controller,templateUrl,inputObject);
        },
        setInputObject(_inputObject){
            inputObject = _inputObject;
        },
        getInputObject(){
            return inputObject;
        },
    }
    return bottomSheetSrvc;

});
angular.module("bottomSheet").controller('emptyCtrl',function(bottomSheetSrvc){
});

