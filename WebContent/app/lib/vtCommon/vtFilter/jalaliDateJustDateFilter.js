var restProj =  restProj || {};
restProj.jalaliDateJustDate =  function() {
	return function(inputDate, format) {
		var date = moment(parseInt(inputDate));
		if (!!!date._i) {
			return "";
		}
		return date.format(format);
	}
};