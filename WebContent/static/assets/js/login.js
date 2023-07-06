	 var checkDocumentState = setInterval(function() {
		if (document.readyState !== "complete")
			return;
		clearInterval(checkDocumentState);
		browserInfo = browserDetect()

		if (browserInfo.name == "IE")
		    showErrorPage("IE");
		else if (typeof angular === "undefined")
			showErrorPage("AngularJS");
		

	}, 100);
	
	var showErrorPage = function(errorType){
	     window.location.href = "error-browser.html?errorType="+errorType;
	}

	var browserDetect = function() {
		var info = {
			name : null,
			version : -1
		}
		var ua = navigator.userAgent, tem, M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if (/trident/i.test(M[1])) {
			tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
			//return 'IE '+(tem[1] || '');
			info.name = "IE";
			info.version = tem[1] || '';
		}
		if (M[1] === 'Chrome') {
			tem = ua.match(/\bOPR\/(\d+)/)
			if (tem != null) {
				info.name = "Opera";
				info.version = tem[1] || '';
				info.version = tem[1] || '';
			}
			//return 'Opera '+tem[1];
		}
		M = M[2] ? [ M[1], M[2] ] : [ navigator.appName, navigator.appVersion, '-?' ];
		if ((tem = ua.match(/version\/(\d+)/i)) != null) {
			M.splice(1, 1, tem[1]);
		}
		//return M.join(' ');
		if (info.name == null) {
			info.name = M[0];
			info.version = M[1] || '';
		}
		return info;
	}

