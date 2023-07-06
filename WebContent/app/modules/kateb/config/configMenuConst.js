var kateb = kateb || {};
kateb.getKatebConfigMenuConst = function () {
    return {
        MANAGEMENTS: {
            title: "مدیریت",
            uiSref: "home.management",
            feature: "SEE_MANAGEMENT_TAB",
            order: 1,
            /*childItems: [{
                title: "سازمان‌ها",
                uiSref: "home.management.organization",
                feature: "MANAGEMENT_ORGANIZATION"
            }, {
                title: "نقش‌ها",
                uiSref: "home.management.userrole",
                feature: "MANAGEMENT_ROLE"
            }, {
                title: "وقایع",
                uiSref: "home.management.eventLog",
                feature: "eventLog_access"
            }, {
                title: "تاریخچه عناصر",
                uiSref: "home.management.objectLog",
                feature: "eventLog_access"
            }, {
                title: "قالب نامه بین سازمانی",
                uiSref: "home.management.globallettertemplate",
                feature: "MANAGEMENT_GLOBAL_LETTER_TEMPLATE"
            }],
            submenuItems: [{
                title: "کاربران",
                uiSref: "home.management.user",
                feature: "MANAGEMENT_USER"
            }, {
                title: "دبیرخانه",
                uiSref: "home.management.secretariat",
                feature: "MANAGEMENT_SECRETARIAT"
            }, {
                title: "دفتر اندیکاتور",
                uiSref: "home.management.indicatorbook",
                feature: "MANAGEMENT_INDICATOR_BOOK"
            }, {
                title: "سمت‌های داخلی",
                uiSref: "home.management.position",
                feature: "MANAGEMENT_POSITION"
            }, {
                title: "گروه",
                uiSref: "home.management.group",
                feature: "MANAGEMENT_PUBLIC_GROUP"
            }, {
                title: "سربرگ نامه",
                uiSref: "home.management.letterlayout",
                feature: "MANAGEMENT_LETTER_LAYOUT"
            }, {
                title: "قالب نامه",
                uiSref: "home.management.lettertemplate",
                feature: "MANAGEMENT_PUBLIC_LETTER_TEMPLATE"
            }, {
                title: "قالب نامه وارده",
                uiSref: "home.management.incomingLettertemplate",
                feature: "MANAGEMENT_INCOMMING_LETTER_TEMPLATE"
            },
                {
                    title: "هامش",
                    uiSref: "home.management.hameshhotkey",
                    feature: "MANAGEMENT_PUBLIC_HAMESH_HOTKEY"
                }, {
                    title: "برچسب",
                    uiSref: "home.management.tag",
                    feature: "MANAGEMENT_PUBLIC_TAG"
                }, {
                    title: "سازمان‌های مرتبط",
                    uiSref: "home.management.externalorganization",
                    feature: "MANAGEMENT_EXTERNAL_ORGANIZATION"
                }, {
                    title: "تنظیمات عمومی سازمان",
                    uiSref: "home.management.publicsetting",
                    feature: "MANAGEMENT_PUBLIC_SETTING"
                }, {
                    title: "فرآیند",
                    uiSref: 'home.management.process',
                    feature: "MANAGEMENT_VIRA_PROCESS_MODEL" //TODO what could be ?
                }, {
                    title: "واحد سازمانی",
                    uiSref: "home.management.department",
                    feature: "MANAGEMENT_DEPARTMENT"
                },{
                    title: "اخبار و اعلانات",
                    uiSref: "home.management.newsList",
                    feature: "MANAGEMENT_NEWS"
                },{
                    title: "قوانین مکاتبات",
                    uiSref: "home.management.rule",
                    feature: "MANAGEMENT_LETTER_RULE"
                }]*/
        },
        SETTING: {
            title: "تنظیمات",
            uiSref: "home.setting",
            feature: "*",
            hide: true,
            order: 2,
            childItems: [{
                title: "تنظیمات عمومی",
                uiSref: "home.setting.privatesetting",
                feature: "privatesetting"
            }, {
                title: "هامش‌های شخصی",
                uiSref: "home.setting.hameshhotkey",
                feature: "*"
            }, {
                title: "برچسب‌های شخصی",
                uiSref: "home.setting.tag",
                feature: "*"
            }, {
                title: "گروه‌های شخصی",
                uiSref: "home.setting.group",
                feature: "*"
            }, {
                title: "تفویض اختیارات",
                uiSref: "home.setting.conferment",
                feature: "MANAGEMENT_CONFERMENT"
            }, {
                title: "قالب",
                uiSref: "home.setting.template",
                feature: "*"
            }, {
                title: 'کارتابل هوشمند',
                uiSref: 'home.setting.intelcartable',
                feature: '*'
            }
            ]
        },

        SECRETARIAT: {
            title: "دبیرخانه",
            uiSref: "home.secretariat",
            feature: "SEE_SECRETARIAT_TAB",
            order: 4,
            sideMenuItems: [
                {
                    title: 'نامه‌های آماده صدور',
                    uiSref: 'home.secretariat.issuedList',
                    key: "ISSUED",
                    feature: '*'
                },
               {
                   title: 'پیش نویس نامه‌های وارده',
                   uiSref: 'home.secretariat.incomingList',
                   key: "INCOMMING",
                   feature: '*'
               },
                {
                    title: 'پیشنویس‌ نامه‌های وارده بین سازمانی',
                    uiSref: 'home.secretariat.unapprovedIncomming',
                    key: "INCOMMING_OTHER_ORG",
                    feature: '*'
                    // feature: 'ACCESS_HEAD_FEATURES'
                },
                {
                    title: 'همه نامه های وارده',
                    uiSref: 'home.secretariat.incommingLetterList',
                    feature: '*'
                },
                {
                    title: 'همه نامه های صادره',
                    uiSref: 'home.secretariat.issuedLetterList',
                    feature: '*'
                },
//                {
//                    title: 'همه نامه های سازمان',
//                    uiSref: 'home.secretariat.orgLetterList',
//                    feature: '*'
//                },
                /*{
                    title: 'پیش نویس نامه‌های تایید نشده',
                    uiSref: 'home.secretariat.unapprovedIncomming',
                    key: "DRAFT",
                    feature: 'ACCESS_HEAD_FEATURES'
                },*/
                {
                    title: 'نامه های برگشت خورده',
                    uiSref: 'home.secretariat.returnedLetters',
                    key: "RETURNED",
                    feature: '*'
                },
                {
                    title: 'نامه های برگشت زده',
                    uiSref: 'home.secretariat.rejectedLetters',
                    feature: '*'
                },
                {
                    title: 'شماره رزورهای اولیه',
                    uiSref: "home.secretariat.reserveList",
                    feature: 'MANAGEMENT_RESERVED_LETTER_NUMBER'
                },
                {
                    title: 'پیگیری نامه ارباب رجوع',
                    uiSref: "home.secretariat.followupCustomerLetter",
                    feature: 'TRACK_ORGANIZATION_LETTER_DRAFTS'
                }
            ]
        },
        CARTABLE: {
            title: "مکاتبات",
            uiSref: "home.cartable",
            feature: "SEE_CARTABLE_TAB",
            order: 5
        },
        PROCESS: {
            title: "فرآیند",
            uiSref: "home.process",
            feature: "SEE_PROCESS_TAB",
            order: 6
        },
        REPORT: {
            title: "گزارش",
            uiSref: "home.report",
            feature: "SEE_REPORT_ORG_LETTER",
            order: 6,
            childItems: [
                // {
                //     title: "گزارش دسترسی به همه نامه های کاربران سازمان ها",
                //     uiSref: "home.report.accessAllLettersForOrgUsers",
                //     feature: "SEE_REPORT_ALL_USERS_ALL_LETTER_ACCESS"
                // },
                {
                title: "تعداد نامه های وارده و صادره سازمان",
                uiSref: "home.report.incomingIssuedLetter",
                feature: "*"
            }, {
                    title: "گزارش دسترسی به همه نامه ها",
                    uiSref: "home.report.accessAllLetters",
                    feature: "SEE_REPORT_ORGANIZATION_USERS_ALL_LETTER_ACCESS"
             } ,{
                title: "گزارش مکاتبات افراد سازمان",
                uiSref: "home.report.incomingIssuedUserLetter",
                feature: "*"
            }, {
                title: "نامه های دبیرخانه",
                uiSref: "home.report.letterSecretary",
                feature: "SEE_REPORT_SECRETARY_LETTER"
            }, {
                 title: "مکاتبات واحد",
                 uiSref: "home.report.correspondenceUnit",
                 feature: "*"
            }, {
                    title: "گزارش فرآیندها",
                    uiSref: "home.report.process",
                    feature: "SEE_REPORT_PROCESS"
             }
            ]
        },
        NEWS: {
            title:"اعلانات",
            uiSref: "home.newsList",
            feature: "*",
            order: 6

        }
    };
};
