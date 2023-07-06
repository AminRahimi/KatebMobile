angular.module('cartableModule').factory('cartableKatebSrvc', function(Restangular, $rootScope) {

	this.orgLetterStateData = undefined;
	this.searchQuery = undefined;
	var that = this;
	this.currentPage = 1;
	this.orgLetterState = {};
	var searchMode = false;
	var lastSearchQuery = {};
    var lastPage = 1;
	this.field = "";
	var currentLetterState = {};
	var searchState = {};
    var SEC = function(secUid){
        return 'sec/'+secUid;
    }
	this.searchArchiveQuery = undefined;
	var lastArchiveSearchQuery = {};
	var currentArchiveLetterState = {};
	var archiveSearchState = {};
	var archivelastPage = 1;
	this.archiveLetterState = {};
	var searchArchiveMode = false;

	return {
		saveDraft: function(data, orgUid) {
			return Restangular.all('org/' + orgUid + '/letter_draft/items').post(data);
		},
		getDraft: function(uid) {
			return Restangular.one('org/current/letter_draft/items/' + uid).get();
		},
		reclaimDraft: function (uid) {
			return Restangular.all('org/current/letter_draft/items/' + uid + '/reclaim').post();
		},
		updateDraft: function(data, orgUid) {
			var uid = data.uid;
			if(uid){
				return Restangular.all('org/current/letter_draft/items/' + uid).post(data);
			}else{
				return Restangular.all('org/' + orgUid + '/letter_draft/items/').post(data);
			}
		},
		deleteDraft: function(uid) {
			return Restangular.one('org/current/letter_draft/items/' + uid).remove();
		},
		sendDraft: function(data, orgUid) {
			return Restangular.all('org/' + orgUid + '/letter_draft/send').post(data);
		},
		sendParaph: function(data, orgUid) {
			return Restangular.all('org/' + orgUid + '/letter_draft/paraph').post(data);
		},
		transferDraft: function(draft, userUid, text, orgUid) {
            var text_encode = encodeURIComponent(text);
            return Restangular.all('org/' + orgUid + '/letter_draft/move_to/' + userUid + '?text=' + text_encode).post(draft);
		},
		getLetterPdf: function(data,printDowloadQueryParams) {
			return Restangular.all('org/current/letter_draft/pdf').post(data,printDowloadQueryParams);
		},
		getDraftDocxTemplate: function(letterLayoutUid) {
			return Restangular.one('org/current/letter_layout/' + letterLayoutUid + '/template/docx').get();
		},
		getWebEditFile: function(webEditFileUid) {
			return Restangular.one('webedit/' + webEditFileUid).get();
		},
		deleteWebEditFile: function(webEditFileUid) {
			return Restangular.one('webedit/' + webEditFileUid).remove();
		},
		createWebEditFile: function(file) {
			return Restangular.all('webedit').post(file);
		},
		getPrintLog: function (uid) {
			return 	 Restangular.all('letter/print_log/'+ uid).getList();
		},
		checkSignatureAccess: function(draft){
			delete draft.canEdit;
			delete draft.canSign;
			delete draft.canMove;
			delete draft.canParaph;
			delete draft.read;
			delete draft.state;
			delete draft.cachedPdf;
			delete draft.paraphPdf;
			
			return Restangular.all('org/current/letter_draft/authorized_to_sign').post(draft);
		},
		getDraftHistory: function (draftUid, start, len) {
        	return Restangular.all('org/current/letter_draft/history/'+draftUid).getList({start:start,len:len,extent:'full'});
        },

		/* ***************************************************************************** */
		getOrgLetterList: function(orgUid, start, len) {
            var params = this.getQuery();
			var query = "";
			query = {start: start, len: len, extent: 'listLoad'};
			if (params) {
				var dir = params.asc ? "asc" : "des";
				var searchable = "";
				if (params.key == "internalNumber") searchable = "sortNumber";
				if (params.key == "subject") searchable = "sortSubject";
				if (params.key == "officialDate") searchable = "sortDate";
				if (params.key == "dirType") searchable = "sortDir";
				if (params.key == "edited") searchable = "edited";
				if (params.key == "initiation.sender.title") searchable = "sortSender";
				return Restangular.all('/org/' + orgUid + '/all_letters?' + searchable + '=' + dir).getList(query);
			} else {
				return Restangular.all('/org/' + orgUid + '/all_letters').getList(query);
			}
		},
		searchOrgLetterListQueryParam: function(orgUid, start, len, params, isNewSearch){
			//var query = _.assign({start:start,len:len,extent:'list',sortNumber: 'asc'}, params);
			var query = _.assign({start:start,len:len,extent:'listLoad'}, params);
			if (query.quickSearch) {
				query.quickSearch = query.quickSearch.split(' ');
			}
			var params = this.getQuery();
			if (params) {
                var dir = params.asc ? "asc" : "des";
				var searchable = "";
				if (params.key == "internalNumber") searchable = "sortNumber";
				if (params.key == "subject") searchable = "sortSubject";
				if (params.key == "officialDate") searchable = "sortDate";
				if (params.key == "dirType") searchable = "sortDir";
				if (params.key == "edited") searchable = "edited";
				if (params.key == "initiation.sender.title") searchable = "sortSender";

                this.registerSearchState({orgUid: orgUid, query: query});
                if (isNewSearch) {
                    return Restangular.all('/org/' + orgUid + '/all_letters_original?' + searchable + '=' + dir).getList(query);
				} else {
                    return Restangular.all('/org/' + orgUid + '/all_letters?' + searchable + '=' + dir).getList(query);
				}
			} else {
                this.registerSearchState({orgUid: orgUid, query: query});
                if (isNewSearch) {
                    return Restangular.one('/org/' + orgUid +'/all_letters_original?sortDate=des').get(query);
				} else {
                    return Restangular.one('/org/' + orgUid +'/all_letters?sortDate=des').get(query);
				}
			}
		},
		searchOrgLetterList: function(orgUid, query, start, len){
            return Restangular.all('/org/' + orgUid +'/all_letters').customPOST(query,'',
					{start:start,len:len,extent:'list'},{'X-HTTP-Method-Override':'GET'});
		},
        registerCurrentLetterState: function (att, val) {
            currentLetterState[att] = val;
            if (!isNaN(currentLetterState.page) && !isNaN(currentLetterState.len) && !isNaN(currentLetterState.index))
                currentLetterState.totalIndex = ((currentLetterState.page - 1) * currentLetterState.len) + currentLetterState.index;
        },

        getCurrentLetterState: function () {
            return currentLetterState;
        },

        registerSearchState: function (state) {
            searchState = state;
        },

        getNextLetter: function (type) {
            switch (type) {
                case 'next':
                    currentLetterState.totalIndex++;
                    break;
                case 'previous':
                    currentLetterState.totalIndex--;
                    break;
            }
            _.assign(searchState.query, {start: currentLetterState.totalIndex, len: 1});
            return this.searchOrgLetterListQueryParam(searchState.orgUid, currentLetterState.totalIndex, 1, searchState.query);
        },

//********* search Query ********//
		setSearchQeury: function(data, pagination){
			if(data) {
				if(this.searchQuery) {
					this.searchQuery.letterNumber = data.number;
					this.searchQuery.sender = data.sender;
					this.searchQuery.subject = data.subject;
					this.searchQuery.externalNumber = data.externalNumber;
				} else{
					this.searchQuery = {
						letterNumber: data.number,
						sender: data.sender,
						subject: data.subject,
						externalNumber: data.externalNumber
					}
				}
			}
			if(pagination) {
				if(this.searchQuery) {
					this.searchQuery.pagination = pagination;
				} else {
					this.searchQuery = {
						pagination: pagination
					}
				}
			}
		},
		getSearchQeury: function(){
			return this.searchQuery;
		},
		resetSearchQuery: function () {
			this.searchQuery = undefined;
		},

		setLastSearchQuery: function (query) {
			lastSearchQuery = query;
        },
		getLastSearchQuery: function () {
            return lastSearchQuery;
        },

		setArchiveSearchQeury: function(data, pagination){
			if(data) {
				if(this.searchArchiveQuery) {
					this.searchArchiveQuery.letterNumber = data.number;
					this.searchArchiveQuery.sender = data.sender;
					this.searchArchiveQuery.subject = data.subject;
					this.searchArchiveQuery.externalNumber = data.externalNumber;
				} else{
					this.searchArchiveQuery = {
						letterNumber: data.number,
						sender: data.sender,
						subject: data.subject,
						externalNumber: data.externalNumber
					}
				}
			}
			if(pagination) {
				if(this.searchArchiveQuery) {
					this.searchArchiveQuery.pagination = pagination;
				} else {
					this.searchArchiveQuery = {
						pagination: pagination
					}
				}
			}
		},
		getArchiveSearchQeury: function(){
			return this.searchArchiveQuery;
		},
		resetArchiveSearchQuery: function () {
			this.searchArchiveQuery = undefined;
		},
		setArchiveLastSearchQuery: function (query) {
			lastArchiveSearchQuery = query;
		},
		getArchiveLastSearchQuery: function () {
			return lastArchiveSearchQuery;
		},

		/* ************************************** LETTER *************************************** */
		getLpa: function(uid) {
			return Restangular.one(`letter/lpa/${uid}`).get();
		},
		getLetter: function(uid) {
			return Restangular.one(`letter/items/${uid}`).get();
		},
        sendForward: function (uid, data) {
            return Restangular.all('letter/forward/' + uid).post(data);
        },
		forwardLetterToMultiple: function (lpauid, data) {
			return Restangular.all('letter/forward/'+lpauid).post(data);
		},
        sendLetterToMultiple: function (secUid, lpauid, data) {
            return Restangular.all(SEC(secUid) + '/issued/user/send/'+lpauid).post(data);
        },
        getLetterForwardTree: function (letterUid, param) {
        	var query = letterUid;
        	if(param){
        		query += param;
        	}
        	return Restangular.one('letter/forward_tree/'+ query).get();
        },
        getLetterForwardTreeBrief: function (letterUid, param) {
            var query = letterUid;
            if(param){
                query += param;
            }
            return Restangular.one('letter/forward_brief_tree/'+ query).get();
        },
        getDetailLetterForwardTree: function (uid) {
            return Restangular.one('letter/brief_lpa/'+ uid).get();
        },
        forwardComment: function (uid, respond) {
        	var query = 'letter/respond/'+uid+'?respond='+respond;
        	return Restangular.all(query).post();
        },
		getRelatedLettereList: function (letterUid, type) {
			return Restangular.all('letter/related/'+letterUid).getList({type: type});
		},
		archiveLetter: function (uidList) {
			return Restangular.all('letter/archive?description=').post(uidList);
        },
		addToUserArchive: function (uidList) {
			return Restangular.all('user_letter_archive/items').post(uidList);
		},
		removeFromUserArchive: function (uidList){
			return Restangular.all('user_letter_archive/items/unarchive').post(uidList);
		},

        /* ***************************************************************************** */
        getOrgLetter: function(uid){
			return Restangular.one('/letter/items/' + uid).get();
		},

		/* ***************************************************************************** */
		getPuaList: function(orgUid, targerOrganization, query){
			// return Restangular.all('/letter_deliveres').getList({showExternalPosition: true, query: query});
			//return Restangular.all('/org/' + orgUid + '/letter_deliveres').getList({showExternalPosition: true, query: query});
			return Restangular.all('/org/' + orgUid + '/letter_deliveres').getList({targetOrganization: targerOrganization, showExternalPosition: true, query: query , len:20});
		},
		getPuaListSEPFalse: function(query){
			return Restangular.all('/org/current/letter_deliveres').getList({showExternalPosition: false, showOrgPosition: true, query: query, len:20});
		},
		getPuaListAllForwardable: function(orgUid, query){
			return Restangular.all('/org/' + orgUid + '/position/actives?=').getList({query: query});
		},
		getPuaListAllPosition: function (query) {
			return Restangular.all('user/my_puas').getList({query: query});
		},
		getLetterLayoutList: function(orgUid){
			return Restangular.all('/org/'+orgUid+'/letter_layout/items').getList({extent:'full'});
		},
		getSecretariatList: function(orgUid){
//			return Restangular.all('/org/'+orgUid+'/secretariat/items').getList();
// 			return Restangular.all('/secretariat/actives').getList();
            return Restangular.all('/org/'+orgUid+'/secretariat/actives').getList();
		},
		getSenderList: function(orgUid){
			// return Restangular.all('/letter_initiation/senders').getList();
			return Restangular.all('/org/' + orgUid + '/letter_initiation/senders').getList();
		},
		getUserList: function(orgUid){
			return Restangular.all('/org/'+ orgUid + '/user/actives').getList();
		},
		createPrintDownloadSearchParams: function (queryParams,isPrintMode){
			var pdfSearchParams=new URLSearchParams();

			pdfSearchParams.append('signature',queryParams.isPrintWithSignature);
			pdfSearchParams.append('header',queryParams.isPrintWithHeader);
			pdfSearchParams.append('indicatorNumber',queryParams.indecatorNumber);
			pdfSearchParams.append('delivery_cc',queryParams.deliverycc);
			pdfSearchParams.append('delivery_bcc',queryParams.deliverybcc);
			pdfSearchParams.append('paraphers',queryParams.paraphers);
			pdfSearchParams.append('showQRCode',queryParams.showQRCode);
			if(isPrintMode){
				pdfSearchParams.append('print','true');
			}else{
				//is download mode
				pdfSearchParams.append('download','true');
			}

			if(queryParams.deliveryCopy!=null && queryParams.deliveryCopy.length > 0) {
				for(var i=0, max = queryParams.deliveryCopy.length; i < max; i++) {
					pdfSearchParams.append('delivery_item',queryParams.deliveryCopy[i]);
				}
			}
			return pdfSearchParams;
		},
		//queryParams is instance of URLSearchParams
		getGeneratedPdfUrlWithSearchParams: function(inputConfig,pdfSearchParams){

			var pathname = this.getGeneratedPdfUrl(inputConfig);
			//check if pdfUrl is URL object
			if(typeof pdfUrl =='object'){
				pathname = pdfUrl.pathname;
			}


			return pathname + '?' + pdfSearchParams.toString();
		},
		openPDFModal:function(pdfUrlWithSearchParams){
			window.open("app/lib/pdf.js/web/viewer.html?file=" + encodeURIComponent(pdfUrlWithSearchParams));
		},
		/**
		 * Retrieve the url of generated pdf (draft or letter pdf)
		 * @param {Object} inputConfig {isDraft:undefined|true|false,letterUid:undefined|string}
		 */
		getGeneratedPdfUrl: function (inputConfig) {
			if(inputConfig.isDraft){
				return new URL(localStorage.getItem('pdfUrl'));
			}
			return "/Kateb/api/letter/pdf/"+inputConfig.letterUid;
		},
		getParapherList: function () {
            return Restangular.all('user/paraphers').getList({len: -1});
        },
//******** TEMPLATE **********//
		//TODO: remove this tow service
		getLetterTemplateList: function(orgUid){
			return Restangular.all('/org/'+orgUid+'/letter_template/items/').getList();
		},
		getLetterTemplate: function(orgUid, templateId){
			return Restangular.one('/org/'+orgUid+'/letter_template/items/'+templateId).get();
		},

		getTemplate: function (letterTemplateUid) {
			return Restangular.one('letter_template/items/'+letterTemplateUid).get();
		},
		savePrivateLetterTemplate: function (data) {
			return Restangular.all('private_letter_template/items').post(data);
		},
		updatePrivateLetterTemplate: function (data, templateUid, typeOfTemplate, orgUid) {
			if (typeOfTemplate == "public") {
				return Restangular.all('/org/' + orgUid + '/public_letter_template/items/' + templateUid).post(data);
			} else {
				return Restangular.all('private_letter_template/items/' + templateUid).post(data);
			}
		},
		savePublicLetterTemplate: function (data, orgUID) {
			return Restangular.all('org/'+orgUID+'/public_letter_template/items').post(data);
		},

		getFullhameshhotkeyList: function(){
			return Restangular.all('hamesh_hotkey/actives').getList({extent:"full"});
		},

		removeTag: function (data) {
			return Restangular.one('letter').post('remove_tags',data);
		},
		getGroupMember: function (uid) {
			return Restangular.one('group/items/' + uid).get();
		},


		setOrgLetterState: function (state) {
			this.orgLetterState = state;
		},
		getOrgLetterState: function () {
			return this.orgLetterState;
		},
		resetOrgLetterState: function () {
			this.orgLetterState = undefined;
		},

		getEvents: function (uid, query) {
			if (query) {
				return Restangular.all('letter/log/' + uid + '?type=' + query).getList();
			} else {
				return Restangular.all('letter/log/' + uid).getList();
			}
		},

		getFullname: function (username) {
			return Restangular.all('org/current/user/items').customPOST({"restrictions":[{"type":"eq","value":username,"field":"username"}]},'',
				{},{'X-HTTP-Method-Override':'GET'});
		},
//*****************Search Mode*****************
        setSearchMode: function (mode) {
			searchMode = mode;
        },
        getSearchMode: function () {
            return searchMode;
        },

		setQuery: function (field) {
			this.field = field;
		},
		getQuery: function () {
			return this.field;
		},


        setLastPage: function (pageNum) {
            lastPage = pageNum;
        },
        getLastPage: function () {
            return lastPage;
        },

		follow : function(data) {
			return Restangular.all('letter/add_tags').post(data);
		},
		unFollow : function(data) {
			return Restangular.all('letter/remove_tags').post(data);
		},
		getSigner: function(data, uid) {
			return Restangular.all('org/current/letter_draft/sign_info').post(data, {
				type: "sign",
				uid: uid
			});
		},
		getParapher: function(data, uid) {
			return Restangular.all('org/current/letter_draft/sign_info').post(data, {
				type: 'paraph',
				uid: uid
			});
		},
		getIndicatorBookList: function() {
			return Restangular.all('sec/current/indicator_book/for_letters').getList({len: -1});
		},
		saveFolderChosen: function (letterUid, folder) {
			return Restangular.all('letter/external_archive/' + letterUid).post(folder);
		},
		getArchiveLetterList: function (orgUid, start, len) {
			var params = this.getQuery();
			var query = "";
			query = {start: start, len: len, extent: 'list'};
			if (params) {
				var dir = params.asc ? "asc" : "des";
				var searchable = "";
				if (params.key == "internalNumber") searchable = "sortNumber";
				if (params.key == "subject") searchable = "sortSubject";
				if (params.key == "officialDate") searchable = "sortDate";
				if (params.key == "dirType") searchable = "sortDir";
				if (params.key == "initiation.sender.title") searchable = "sortSender";
				return Restangular.all('/archive/org/current/all_letters?' + searchable + '=' + dir).getList(query);
			} else {
				return Restangular.all('/archive/org/current/all_letters').getList(query);
			}
		},
		searchArchiveLetterList: function(orgUid, query, start, len){
			return Restangular.all('/archive/org/current/all_letters').customPOST(query,'',
				{start:start,len:len,extent:'list'},{'X-HTTP-Method-Override':'GET'});
		},
		searchArchiveLetterListQueryParam: function(orgUid, start, len, params, isNewSearch){
			var query = _.assign({start:start,len:len,extent:'list'}, params);
			if (query.quickSearch) {
				query.quickSearch = query.quickSearch.split(' ');
			}
			var params = this.getQuery();
			if (params) {
				var dir = params.asc ? "asc" : "des";
				var searchable = "";
				if (params.key == "internalNumber") searchable = "sortNumber";
				if (params.key == "subject") searchable = "sortSubject";
				if (params.key == "officialDate") searchable = "sortDate";
				if (params.key == "dirType") searchable = "sortDir";
				if (params.key == "initiation.sender.title") searchable = "sortSender";

				this.registerArchiveSearchState({orgUid: orgUid, query: query});
				if (isNewSearch) {
					return Restangular.all('/archive/org/current/all_letters?' + searchable + '=' + dir).getList(query);
				} else {
					return Restangular.all('/archive/org/current/all_letters?' + searchable + '=' + dir).getList(query);
				}
			} else {
				this.registerArchiveSearchState({orgUid: orgUid, query: query});
				if (isNewSearch) {
					return Restangular.one('/archive/org/current/all_letters').get(query);
				} else {
					return Restangular.one('/archive/org/current/all_letters').get(query);
				}
			}
		},
		getArchiveLetter: function(uid){
			return Restangular.one('/archive/org/current/items/' + uid).get();
		},
		registerCurrentArchiveLetterState: function (att, val) {
			currentArchiveLetterState[att] = val;
			if (!isNaN(currentArchiveLetterState.page) && !isNaN(currentArchiveLetterState.len) && !isNaN(currentArchiveLetterState.index))
				currentArchiveLetterState.totalIndex = ((currentArchiveLetterState.page - 1) * currentArchiveLetterState.len) + currentArchiveLetterState.index;
		},

		getCurrentArchiveLetterState: function () {
			return currentArchiveLetterState;
		},
		registerArchiveSearchState: function (state) {
			archiveSearchState = state;
		},
		getNextArchiveLetter: function (type) {
			switch (type) {
				case 'next':
					currentArchiveLetterState.totalIndex++;
					break;
				case 'previous':
					currentArchiveLetterState.totalIndex--;
					break;
			}
			_.assign(archiveSearchState.query, {start: currentArchiveLetterState.totalIndex, len: 1});
			return this.searchArchiveLetterListQueryParam(archiveSearchState.orgUid, currentArchiveLetterState.totalIndex, 1, archiveSearchState.query);
		},
		setArchiveLastPage: function (pageNum) {
			archivelastPage = pageNum;
		},
		getArchiveLastPage: function () {
			return archivelastPage;
		},
		setArchiveLetterState: function (state) {
			this.archiveLetterState = state;
		},
		getArchiveLetterState: function () {
			return this.archiveLetterState;
		},
		resetArchiveLetterState: function () {
			this.archiveLetterState = undefined;
		},
		setArchiveSearchMode: function (mode) {
			searchArchiveMode = mode;
		},
		getArchiveSearchMode: function () {
			return searchArchiveMode;
		},
		getArchivedLetterList: function (letterUid) {
			return Restangular.all('letter/external_archives/' + letterUid).getList();
		},
		duplicateDraft: function (orgUid, draftUid) {
			return Restangular.one('org/'+orgUid+'/letter_draft/'+draftUid+'/duplicate').get();
		},
		
	}
});
