var restProj =  restProj || {};
restProj.checkmark = function() {
	return function(input) {
		return input ? '\u2713' : '\u2718';
	};
};