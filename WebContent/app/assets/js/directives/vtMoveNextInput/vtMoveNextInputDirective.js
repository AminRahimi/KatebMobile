angular.module('vtMoveNextInput', []).directive("vtMoveNextInput", function () {

    return {
        restrict: "A",
        link: function ($scope, element) {
            element.on("input", function (e) {
                if (element.val().length == element.attr("maxlength")) {
                    var $nextElement = element.parent('.' + element.attr("parentClass")).next().find('input');
                    if ($nextElement.length) {
                        $nextElement[0].focus();
                    }
                }
            });
        }
    }

});