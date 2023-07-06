angular.module('newsModule').controller("userListModalCtrl",function ($scope,newsSrvc,$modalInstance,newsUid){
$scope.Data={
    userList: '',
};
$scope.Func={
close:function(){
    $modalInstance.close();
}
};
var Run =function (){
    newsSrvc.getUserList(newsUid).then(function (res){
        $scope.Data.userList=res.data.originalElement;
    });
};
Run();
});