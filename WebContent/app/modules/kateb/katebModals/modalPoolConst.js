angular.module('katebModule').constant('modalPool', {
    forwardLetters: {
        templateUrl: 'app/modules/kateb/katebModals/forwardLettersModal/forwardLettersModal.html',
        controller: 'forwardLettersModalCtrl'
    },
    sendLetters: {
        templateUrl: 'app/modules/kateb/katebModals/sendLettersModal/sendLettersModal.html',
        size: 'lg',
        controller: 'sendLettersModalCtrl'
    },
    userAccessModal: {
        templateUrl: 'app/modules/kateb/katebModals/usersAccessModal/usersAccessModal.html',
        controller: 'usersAccessModalCtrl'
    }
});