var restProj =  restProj || {};
restProj.jalaliDate = function() {
	return function(inputDate, format) {
		var date = moment(parseInt(inputDate));
		if (!!!date._i) {
			return "";
		}
		return date.fromNow() + " " + date.format(format);
	}
};