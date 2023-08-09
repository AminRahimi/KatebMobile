var kateb = kateb || {};
kateb.getKatebConfigMenuConst = function () {
    return {
        MANAGEMENTS: {
            title: "مدیریت",
            uiSref: "base.home.management",
            feature: "SEE_MANAGEMENT_TAB",
            order: 1
        },
        SETTING: {
            title: "تنظیمات",
            uiSref: "base.home.setting",
            feature: "*",
            hide: true,
            order: 2,
            childItems: [{
                title: "تنظیمات عمومی",
                uiSref: "base.home.setting.privatesetting",
                feature: "privatesetting"
            }, {
                title: "هامش‌های شخصی",
                uiSref: "base.home.setting.hameshhotkey",
                feature: "*"
            }, {
                title: "برچسب‌های شخصی",
                uiSref: "base.home.setting.tag",
                feature: "*"
            }, {
                title: "گروه‌های شخصی",
                uiSref: "base.home.setting.group",
                feature: "*"
            }, {
                title: "تفویض اختیارات",
                uiSref: "base.home.setting.conferment",
                feature: "MANAGEMENT_CONFERMENT"
            }, {
                title: "قالب",
                uiSref: "base.home.setting.template",
                feature: "*"
            }, {
                title: 'کارتابل هوشمند',
                uiSref: 'base.home.setting.intelcartable',
                feature: '*'
            }
            ]
        },

        SECRETARIAT: {
            title: "دبیرخانه",
            uiSref: "base.home.secretariat",
            feature: "SEE_SECRETARIAT_TAB",
            order: 4,
            sideMenuItems: [
                {
                    title: 'نامه‌های آماده صدور',
                    uiSref: 'base.home.secretariat.issuedList',
                    key: "ISSUED",
                    feature: '*'
                },
               {
                   title: 'پیش نویس نامه‌های وارده',
                   uiSref: 'base.home.secretariat.incomingList',
                   key: "INCOMMING",
                   feature: '*'
               },
                {
                    title: 'پیشنویس‌ نامه‌های وارده بین سازمانی',
                    uiSref: 'base.home.secretariat.unapprovedIncomming',
                    key: "INCOMMING_OTHER_ORG",
                    feature: '*'
                    // feature: 'ACCESS_HEAD_FEATURES'
                },
                {
                    title: 'همه نامه های وارده',
                    uiSref: 'base.home.secretariat.incommingLetterList',
                    feature: '*'
                },
                {
                    title: 'همه نامه های صادره',
                    uiSref: 'base.home.secretariat.issuedLetterList',
                    feature: '*'
                },
//                {
//                    title: 'همه نامه های سازمان',
//                    uiSref: 'base.home.secretariat.orgLetterList',
//                    feature: '*'
//                },
                /*{
                    title: 'پیش نویس نامه‌های تایید نشده',
                    uiSref: 'base.home.secretariat.unapprovedIncomming',
                    key: "DRAFT",
                    feature: 'ACCESS_HEAD_FEATURES'
                },*/
                {
                    title: 'نامه های برگشت خورده',
                    uiSref: 'base.home.secretariat.returnedLetters',
                    key: "RETURNED",
                    feature: '*'
                },
                {
                    title: 'نامه های برگشت زده',
                    uiSref: 'base.home.secretariat.rejectedLetters',
                    feature: '*'
                },
                {
                    title: 'شماره رزورهای اولیه',
                    uiSref: "base.home.secretariat.reserveList",
                    feature: 'MANAGEMENT_RESERVED_LETTER_NUMBER'
                },
                {
                    title: 'پیگیری نامه ارباب رجوع',
                    uiSref: "base.home.secretariat.followupCustomerLetter",
                    feature: 'TRACK_ORGANIZATION_LETTER_DRAFTS'
                }
            ]
        },
        CARTABLE: {
            title: "مکاتبات",
            uiSref: "base.home.cartable",
            feature: "SEE_CARTABLE_TAB",
            order: 5
        },
        PROCESS: {
            title: "فرآیند",
            uiSref: "base.home.process",
            feature: "SEE_PROCESS_TAB",
            order: 6
        },
        REPORT: {
            title: "گزارش",
            uiSref: "base.home.report",
            feature: "SEE_REPORT_ORG_LETTER",
            order: 6,
            childItems: [
                // {
                //     title: "گزارش دسترسی به همه نامه های کاربران سازمان ها",
                //     uiSref: "base.home.report.accessAllLettersForOrgUsers",
                //     feature: "SEE_REPORT_ALL_USERS_ALL_LETTER_ACCESS"
                // },
                {
                title: "تعداد نامه های وارده و صادره سازمان",
                uiSref: "base.home.report.incomingIssuedLetter",
                feature: "*"
            }, {
                    title: "گزارش دسترسی به همه نامه ها",
                    uiSref: "base.home.report.accessAllLetters",
                    feature: "SEE_REPORT_ORGANIZATION_USERS_ALL_LETTER_ACCESS"
             } ,{
                title: "گزارش مکاتبات افراد سازمان",
                uiSref: "base.home.report.incomingIssuedUserLetter",
                feature: "*"
            }, {
                title: "نامه های دبیرخانه",
                uiSref: "base.home.report.letterSecretary",
                feature: "SEE_REPORT_SECRETARY_LETTER"
            }, {
                 title: "مکاتبات واحد",
                 uiSref: "base.home.report.correspondenceUnit",
                 feature: "*"
            }, {
                    title: "گزارش فرآیندها",
                    uiSref: "base.home.report.process",
                    feature: "SEE_REPORT_PROCESS"
             }
            ]
        },
        NEWS: {
            title:"اعلانات",
            uiSref: "base.home.newsList",
            feature: "*",
            order: 6

        }
    };
};
