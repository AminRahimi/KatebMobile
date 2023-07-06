angular.module('BMG', [])
.filter('BMG', function() {
	return function(fileSize) {
		if (Math.round(fileSize / 1073741824) != 0) {
			return parseFloat(fileSize / 1073741824).toFixed(1) + " گیگابایت"
		} else if (Math.round(fileSize / 1048576) != 0) {
			return parseFloat(fileSize / 1048576).toFixed(1) + " مگابایت"
		} else if (Math.round(fileSize / 1024) != 0) {
			return parseFloat(fileSize / 1024).toFixed(1) + " کیلوبایت"
		} else {
			return fileSize + " بایت"
		}
	}
}).filter('EnBMG', function() {
    return function(fileSize) {
        if(fileSize > 0) {
            if (Math.round(fileSize / 1073741824) != 0) {
                return (parseFloat(fileSize / 1073741824).toFixed(1) % 1) ? parseFloat(fileSize / 1073741824).toFixed(1) + "GB" : Math.round(fileSize / 1073741824) + "GB"
            } else if (Math.round(fileSize / 1048576) != 0) {
                return (parseFloat(fileSize / 1048576).toFixed(1) % 1) ? parseFloat(fileSize / 1048576).toFixed(1) + "MB" : Math.round(fileSize / 1048576) + "MB"
            } else if (Math.round(fileSize / 1024) != 0) {
                return (parseFloat(fileSize / 1024).toFixed(1) % 1) ? parseFloat(fileSize / 1024).toFixed(1) + "KB" : Math.round(fileSize / 1024) + "KB"
            } else {
                return fileSize + "B"
            }
        } else {
            return 0;
        }
    }
}).filter('EnBMGHTML', function() {
    return function(fileSize) {
        if (Math.round(fileSize / 1073741824) != 0) {
            return parseFloat(fileSize / 1073741824).toFixed(1) + "<small>GB</small>"
        } else if (Math.round(fileSize / 1048576) != 0) {
            return parseFloat(fileSize / 1048576).toFixed(1) + "<small>MB</small>"
        } else if (Math.round(fileSize / 1024) != 0) {
            return parseFloat(fileSize / 1024).toFixed(1) + "<small>KB</small>"
        } else {
            return fileSize + "<small>B</small>"
        }
    }
});
