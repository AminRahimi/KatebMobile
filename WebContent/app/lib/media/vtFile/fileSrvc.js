angular.module("vtFile").factory("fileSrvc",['Restangular', function(Restangular) {
	
	var createDownloadLink = function(hash, name, id){
		if(!name)name="";
		if(id)
			return 'files/' + name + '?mode=download&fcode=' + hash + '&fid=' + id;
		else
			return 'files/' + name + '?mode=download&fcode=' + hash;
	}
	var createViewLink = function(hash, name, id){
		if(!name)name="";
		if(id)
			return 'files/' + name + '?mode=view&fcode=' + hash + '&fid=' + id;
		else
			return 'files/' + name + '?mode=view&fcode=' + hash;
	}
	
	return {
		getFileURLForDownload: function(hash, name, id) {
			return createDownloadLink(hash, name, id);
		},
		getFileURLForDownloadByFile: function(file){
			return createDownloadLink(file.hash, file.name, file.id);
		},
		getFileURLForView: function(hash, name, id) {
			return createViewLink(hash, name, id);
		},
		getFileURLForViewByFile: function(file){
			return createViewLink(file.hash, file.name, file.id);
		},
		
		downloadFile: function(file){
			var link = document.createElement('a');
			link.href = createDownloadLink(file.hash, file.name, file.id);
			link.style.visibility = "hidden";
			document.body.appendChild(link);
			link.click();
		},
		
		//Deprecated. use getFileURLForView
		getImageSrc: function(hash){
			return 'files/?mode=view&fcode=' + hash;
		}
		
	}
}]);