describe('process management controller unit test', function () {
    var ctrl,
        scope = {},
        state
        ;
    beforeEach(module("processManagementModule"));
    beforeEach(inject(function ($controller) {
        ctrl = $controller('processManagementCtrl', {$scope: scope});
    }));
    it('should define processManagementCtrl', function () {
        var file = {
            hash: "aaaa",
            name: "test.pdf"
        }
        expect(scope.Func.getFileHash(file)).toBe("aaaa");
    })
});