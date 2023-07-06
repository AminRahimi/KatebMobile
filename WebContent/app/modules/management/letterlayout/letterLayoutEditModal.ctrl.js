angular
  .module("letterlayoutModule")
  .controller("letterLayoutEditModalCtrl", function($scope, $modalInstance) {
    // $modalInstance.close(selected);
    $scope.Data = {};

    $scope.Func = {
      doDraggable: function() {
		const position = { x: 0, y: 0 };
		

        interact(".draggable").draggable({
          listeners: {
            start(event) {
              console.log(event.type, event.target);
            },
            move(event) {
              position.x += event.dx;
              position.y += event.dy;

              event.target.style.transform = `translate(${position.x}px, ${position.y}px)`;
            }
          },
          modifiers: [
            interact.modifiers.restrictRect({
              restriction: "parent"
            })
          ]
        });
      }
    };

    var Run = function() {
		setTimeout(() => {
			
			$scope.Func.doDraggable();
		}, 2000);
    };

    Run();
  });
