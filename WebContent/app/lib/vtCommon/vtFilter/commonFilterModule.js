var restProj =  restProj || {};
angular.module('commonFiltersModule', [])
.filter('checkmark', restProj.checkmark )
.filter('FaToEnNumberArray',restProj.faToEnNumberArray )
.filter('EnToFaNumber', restProj.enToFaNumber )
.filter('EnToFaButton', restProj.enToFaButton )
.filter('jalaliDatePast', restProj.jalaliDatePast )
.filter('jalaliDate', restProj.jalaliDate )
.filter('jalaliDateJustDate', restProj.jalaliDateJustDate )
.filter('slice', restProj.slice )
.filter('splitString', restProj.splitString)
.filter('FaToEnAndYeKe', restProj.faToEnAndYeKe);
    