angular.module("letterlayoutModule").directive("letterLayoutVisualAttributeSetter", function ($parse) {
  return {
    restrict: "E",
    // replace: true,
    templateUrl: "app/modules/management/letterlayout/letterLayoutVisualAttributeSetter/letterLayoutVisualAttributeSetter.html",
    scope: {
      imageUrl: "@",
      api: "=",
      layoutAttributePositionsObj: "=",
    },

    compile: function (element, attrs) {
      // var modelAccessor = $parse(attrs.ngModel);

      //   var html = "<img></img>";
      //   var newElem = $(html);
      //   fs;
      //   newElem.attr("src", attrs.src);
      //   element.replaceWith(newElem);

      return function (scope, element, attrs, controller) {
        const $scope = scope;
        const PARENT_ELEMENT = $(element);
        const DATE_ELEMENT = PARENT_ELEMENT.find(".draggable-date");
        const NUMBER_ELEMENT = PARENT_ELEMENT.find(".draggable-number");
        const ATTACHMENT_ELEMENT = PARENT_ELEMENT.find(".draggable-attachment");
        const POSTSCRIPT_ELEMENT = PARENT_ELEMENT.find(".draggable-postscript");
        const RIGHT_MARGIN_ELEMENT = PARENT_ELEMENT.find(".draggable.margin.right-margin");
        const LEFT_MARGIN_ELEMENT = PARENT_ELEMENT.find(".draggable.margin.left-margin");
        const TOP_MARGIN_ELEMENT = PARENT_ELEMENT.find(".draggable.margin.top-margin");
        const BOTTOM_MARGIN_ELEMENT = PARENT_ELEMENT.find(".draggable.margin.bottom-margin");

        const MARGIN_LEFT_POSSIBLE_AREA = PARENT_ELEMENT.find(".margin-left-possible-area");
        const MARGIN_RIGHT_POSSIBLE_AREA = PARENT_ELEMENT.find(".margin-right-possible-area");
        const MARGIN_TOP_POSSIBLE_AREA = PARENT_ELEMENT.find(".margin-top-possible-area");
        const MARGIN_BOTTOM_POSSIBLE_AREA = PARENT_ELEMENT.find(".margin-bottom-possible-area");


        const PositionElementMap = {
          date: DATE_ELEMENT,
          number: NUMBER_ELEMENT,
          attachment: ATTACHMENT_ELEMENT,
          postscript: POSTSCRIPT_ELEMENT,
          marginTop: TOP_MARGIN_ELEMENT,
          marginBottom: BOTTOM_MARGIN_ELEMENT,
          marginLeft: LEFT_MARGIN_ELEMENT,
          marginRight: RIGHT_MARGIN_ELEMENT,
        };

        const GetPositionByElement = function (element) {
          const positionObj = element.position();

          if (positionObj == null) return;

          //correct position of right side of element from left
          positionObj.left += element.outerWidth();
          // positionObj.top += element.outerHeight();

          return positionObj;
        };

        $scope.Data = {
          imageUrl: $scope.imageUrl,
          layoutAttributePositionsObj: $scope.layoutAttributePositionsObj,
        };

        $scope.Func = {
          getPositions: function () {
            const LAYOUT_OFFSET_HEIGHT = PARENT_ELEMENT.outerHeight();
            const LAYOUT_OFFSET_WIDTH = PARENT_ELEMENT.outerWidth();

            const PositionsObj = _.reduce(
              PositionElementMap,
              function (positionsObj, element, attributeName) {
                const attributePosition = GetPositionByElement(element);
                if (attributePosition == null) return positionsObj;
                if (attributePosition.left == null) return positionsObj;
                if (attributePosition.top == null) return positionsObj;

                positionsObj[attributeName] = {};

                if (attributeName == "marginRight") {
                  const PositionRight = LAYOUT_OFFSET_WIDTH - attributePosition.left;
                  positionsObj[attributeName].right = Math.round((PositionRight / LAYOUT_OFFSET_WIDTH) * 100);
                  return positionsObj;
                }
                if (attributeName == "marginBottom") {
                  const PositionBottom = LAYOUT_OFFSET_HEIGHT - attributePosition.top;
                  positionsObj[attributeName].bottom = Math.round((PositionBottom / LAYOUT_OFFSET_HEIGHT) * 100);
                  return positionsObj;
                }

                positionsObj[attributeName].left = Math.round((attributePosition.left / LAYOUT_OFFSET_WIDTH) * 100);
                positionsObj[attributeName].top = Math.round((attributePosition.top / LAYOUT_OFFSET_HEIGHT) * 100);

                if(attributeName == "marginLeft"){
                  delete positionsObj[attributeName].top;
                }
                if(attributeName == "marginTop"){
                  delete positionsObj[attributeName].left;
                }

                return positionsObj;
              },
              {}
            );

            return PositionsObj;
          },
          setInitialPositions: function (layoutAttributePositions) {
            const LAYOUT_OFFSET_WIDTH = PARENT_ELEMENT.outerWidth();

            const SetPosition = function (layoutAttributePositionObj, element ) {
              angular.forEach(layoutAttributePositionObj, function (amount, layoutAttributePositionName) {
                if(element[0]==null) return;
                var subtractedAmount = 0;
                if(layoutAttributePositionName=='left'){
                  subtractedAmount = element.outerWidth();
                  element[0].style[layoutAttributePositionName] = Math.round(LAYOUT_OFFSET_WIDTH*amount/100) - subtractedAmount + "px";
                }else{
                  element[0].style[layoutAttributePositionName] = amount + "%";

                }
                
                
              });
            };

            angular.forEach(layoutAttributePositions, function (layoutAttributePositionObj, attributeName) {
              var element = PositionElementMap[attributeName];
              SetPosition(layoutAttributePositionObj, element);
            });
          },
          doDraggable: function () {
            const MoveDraggableFunction = function (event) {
              event.target.style.left = $(event.target).position().left + event.dx + "px";
              event.target.style.top = $(event.target).position().top + event.dy + "px";
              event.target.style.right = "";
            };

            const doInteractDraggable = function (element,restriction,restOptions) {
              interact(element).draggable(
                Object.assign(
                  {
                    listeners: {
                      start(event) {
                        //   console.log(event.type, event.target);
                      },
                      move(event) {
                        MoveDraggableFunction(event);
                      },
                    },
                    modifiers: [
                      interact.modifiers.restrictRect({
                        restriction: restriction,
                      }),
                    ],
                  },
                  restOptions
                )
              );
            }

            const doInteractDraggableByList = function (elementList,restriction, restOptions) {
              angular.forEach(elementList,function (element) {
                doInteractDraggable(element,restriction,restOptions)
              })
            };

            doInteractDraggableByList([DATE_ELEMENT[0], NUMBER_ELEMENT[0], ATTACHMENT_ELEMENT[0], POSTSCRIPT_ELEMENT[0]],'parent');

            doInteractDraggable(TOP_MARGIN_ELEMENT[0], MARGIN_TOP_POSSIBLE_AREA[0], { lockAxis: "y" });
            doInteractDraggable(BOTTOM_MARGIN_ELEMENT[0], MARGIN_BOTTOM_POSSIBLE_AREA[0] , { lockAxis: "y" });
            doInteractDraggable(LEFT_MARGIN_ELEMENT[0],MARGIN_LEFT_POSSIBLE_AREA[0], { lockAxis: "x" });
            doInteractDraggable(RIGHT_MARGIN_ELEMENT[0],MARGIN_RIGHT_POSSIBLE_AREA[0], { lockAxis: "x" });
          },
          setApi : function (params) {
            $scope.api.getPositions = $scope.Func.getPositions;
          }
        };

        var Run = function () {
          //FIXME do it after image loaded
          $scope.Func.setApi();
          setTimeout(() => {

          $scope.Func.doDraggable();
          
          $scope.Func.setInitialPositions($scope.Data.layoutAttributePositionsObj);
          }, 300);
        };

        Run();
      };
    },
  };
});
