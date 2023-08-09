angular.module('appFilter').constant('appConst', {
	state: {
		current: "جاری",
		sent: "فرستاده شده",
		deleted: "حذف شده",
	},
	licenceType: {
		'Copy': 'کپی',
		'Orginal': 'اصل',
		'CopyAsOrginal': 'کپی برابر با اصل'
	},
	letterRecivingType: {
		'Post': 'پست',
		'Fax': 'فکس',
		'Courier': 'پیک'
	},
	attachmentType: {
		'Turn': 'عطف',
		'Follow': 'پیرو',
		'Appendix': 'پیوست',
		'Relation': 'ارتباط'
	},
	attachSourceType:{
		'COMPUTER':'فایل از کامپیوتر',
		'SCAN':'فایل از نرم افزار اسکن',
		'GANJEH':'فایل از گنجه',
		'LETTER':'نامه'
	},
	priority: {
		'Normal': 'عادی',
		'Critical': 'فوری',
		'Blocker': 'خیلی فوری',
		'Immediate': 'آنی',
		'Unknown': 'نامشخص'
	},
	letterIncommingPriority: {
		'Normal': 'عادی',
		'Critical': 'فوری',
		'Blocker': 'خیلی فوری',
	},
	draftState: {
		'INITIAL': 'در حال ویرایش ',
		'SENT': 'امضا شده',
		'DELETE': 'حذف شده'
	},
	letterType: {
		'Inside': 'داخلی',
		'Incomming': 'وارده',
		'Issued': 'صادره'

	},
	letterType2: {
		'lc': 'همه نامه ها ',
		'lpa': 'نامه های کارتابلی',
		'draft': ' نامه های پیشنویس'

	},
	confidentialityLevel: {
		'Unclassified': 'طبقه بندی نشده',
		'Restricted': 'محرمانه',
		'Confidential': 'فوق محرمانه',
		'Secret': 'سری',
		'Top_secret': 'فوق سری'
	},
	typeKey: {
		'SECRETARIAT_HEAD': 'مسئول دبیرخانه',
		'SECRETARIAT_POSITION': 'دبیر دبیرخانه',
		'SECURITY_HEAD': 'حراست',
		'ASSISTANT': 'معاون',
		'MANAGEMENT': 'مدیر عامل',
		'INSPECTION': 'بازرسی',
		'ADMINISTRATIVE': 'مدیر امور اداری',
		'EXPERT': 'کارشناس',
		'shahrdar': 'شهردار',
		'ghaemmagham': 'قائم‌مقام شهردار',
		'moshaver': 'مشاور',
		'modirkoledareh': 'مدیر کل اداره‌',
		'modirherasat': 'مدیر حراست',
		'modirbazresi': 'مدیر بازرسی',
		'modirhastehgozinesh': 'مدیر هسته گزینش',
		'modirkol': 'مدیر کل',
		'raeesedareh': 'رئیس اداره',
		'modirmantagheh': 'مدیر منطقه',
		'moavenmali': 'معاون اداری و مالی',
		'moavenomrani': 'معاون عمرانی',
		'raeesnavahi': 'رئیس نواحی',
		'modirsazman': 'مدیرعامل سازمان'
	},
	news: {
		'CREATED': 'ایجاد شده',
		'EXPIRED': 'منقضی شده',
		'PUBLISHED': 'انتشار یافته',
	},
	rules: {
		'INGROUP-ALL-TO-ALL': 'ارسال همه به همه',
		'INGROUP-ANY-TO-ANY': 'ارسال هیچ به هیچ',
		'BETWEENGROUPS-ALL-TO-ALL': 'ارسال همه به همه',
		'BETWEENGROUPS-ANY-TO-ANY': 'ارسال هیچ به هیچ',
		'BETWEENGROUPS-ALL-TO-ALL-ONEWAY': 'ارسال گروه اول به گروه دوم',
		'REALTIONAL-SIBLING': 'ارسال به هم سطح',
		'REALTIONAL-PARENT_CHILDS': 'ارسال یک سطح به بالادست و زیردست',
		'REALTIONAL-PARENT-TO-ALL-GRANDCHILD': 'ارسال بالادست به همه زیردستان'
	},
	systemTag: {
		'InternalLetters': 'نامه های درون سازمانی',
		'Ownershipdocument': 'اسناد مالکیت و شناسایی',
		'bonyad': 'بنیاد ایثارگران،جانبازان و شهد',
		'inquiry': 'استعلامات برون سازمانی',
		'payankar': 'پایانکار',
		'mafasa': 'مفاصا حساب',
		'shahrdari': 'نامه های دستور شهردار',
		'DetailedDesign': 'طرح تفصیلی',
		'Commission100': 'کمیسیون ماده 100',
		'review': 'بازدید',
		'estealam': 'استعلامات اصناف',
		'destructiveApartment': 'آپارتمان تخریبی',
		'Amlak': 'املاک',
		'renovationBills': 'فیش های پرداختی و محاسبه عوارض',
		'Sooratmajles':'صورت مجلس',
		'EnsheabFish':'فیش انشعاب',
		'licence': 'صدور پروانه',
		'commitments': 'تعهدات مالک',
		'others': 'متفرقه',
		'deletedPapers': 'اوراق حذف شده',
		'BlackList': 'لیست سیاه',
		'otherCommisions':'مابقی کمیسیون ها',
		'voluntary': 'اخطاریه ها',
		'financialpaper':'اسناد مالی',
		'Dastor': 'دستور نقشه',
		'SimaOrg': 'سازمان سیما و منظر',
		'NamaDocuments':'مدارک نمای مصوب',
		'Commisionmatter77': 'کمیسیون ماده 77',
		'Samesh': 'کمیسیون بند 20 (سامش)',
		'orgInfraction': 'تخلفات ساختمانی',
		'tavafoghat': 'کمیسیون توافقات',
		'siyanat': 'صیانت از املاک شهرداری',
		
	},
	systemTagSimaManzar: {
		'simamanzar': 'سازمان سیما و منظر'
	},
	reservedLetterNumberStatus: {
		'PENDING': 'در انتظار ثبت به عنوان نامه',
		'REGISTERED': 'ثبت شده به عنوان نامه',
		'CANCELED':'ابطال شده'
	},
	intelCartable: {
		'SUBJECT': 'موضوع نامه',
		'LETTER_NUMBER': 'شماره نامه',
		'BODY': 'متن نامه',
		'PRIORITY': 'فوریت نامه',
		'CONFIDENTIALITY_LEVEL': 'سطح محرمانگی',
		'SENDER': 'فرستنده',
		'CONTAINS': 'شامل',
		'EQUALS': 'برابر است با',
		'ENDS_WITH': 'خاتمه با',
		'STARTS_WITH': 'شروع با',
		'SEND_TO_ARCHIVE': 'انتقال نامه به بایگانی',
		'ADD_NEED_TO_TRACK': 'انتقال نامه به نیاز به پیگیری',
		'FORWARD_TO_ANOTHER_POSITION': 'ارجاع نامه',
		'ADD_TAG': 'برچسب',


	}


}).filter('appEnum', function(appConst) {
	const upperize = obj =>
		Object.keys(obj).reduce((acc, k) => {
			acc[k.toUpperCase()] = obj[k];
			return acc;
		}, {});

	var aggregatedConst = {};
	var appConstUpperCase = {};
	for (val in appConst) {
		angular.extend(aggregatedConst, upperize(appConst[val]));
		appConstUpperCase[val] = upperize(appConst[val]);
	}

	const translate = (key,filterName)=>{
		if(!key || !angular.isString(key) ) return key
		let _keyUpperCase = key.toUpperCase();
		if(filterName){
			return (appConstUpperCase[filterName] && appConstUpperCase[filterName][_keyUpperCase])  || key
		}else{
			return aggregatedConst[_keyUpperCase] || key;
		}
	}

	return function(input,filterName) {
		if(!input || (angular.isObject(input) && !angular.isArray(input)) ) return 
		


		if(angular.isArray(input)){
			return input.map(item=>translate(item,filterName))
		}
		
		return translate(input,filterName);

	}

});
