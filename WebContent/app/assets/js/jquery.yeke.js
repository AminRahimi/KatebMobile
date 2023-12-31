// <![CDATA[
function substituteCharInFireFox(charCode, e) {
    var keyEvt = document.createEvent("KeyboardEvent");
    keyEvt.initKeyEvent("keypress", true, true, null, false, false, false, false, 0, charCode);
    e.target.dispatchEvent(keyEvt);
    e.preventDefault();
}

function substituteCharInChrome(charCode, e) {
    //it does not work yet! /*$.browser.webkit*/
    //https://bugs.webkit.org/show_bug.cgi?id=16735
    var keyEvt = document.createEvent("KeyboardEvent");
    keyEvt.initKeyboardEvent("keypress", true, true, null, false, false, false, false, 0, charCode);
    e.target.dispatchEvent(keyEvt);
    e.preventDefault();
}

function insertAtCaret(myValue, e) {
    var obj = e.target;
    var startPos = obj.selectionStart;
    var endPos = obj.selectionEnd;
    var scrollTop = obj.scrollTop;
    obj.value = obj.value.substring(0, startPos) + myValue + obj.value.substring(endPos, obj.value.length);
    obj.focus();
    obj.selectionStart = startPos + myValue.length;
    obj.selectionEnd = startPos + myValue.length;
    obj.scrollTop = scrollTop;
    e.preventDefault();
}

$(document).ready(function () {
    var arabicYeCharCode = 1610;
    var persianYeCharCode = 1740;
    var arabicKeCharCode = 1603;
    var persianKeCharCode = 1705;

    $(document).keypress(function (e) {
        var keyCode = e.keyCode ? e.keyCode : e.which;
        if ($.browser.msie) {
            switch (keyCode) {
                case arabicYeCharCode:
                    event.keyCode = persianYeCharCode;
                    break;
                case arabicKeCharCode:
                    event.keyCode = persianKeCharCode;
                    break;
            }
            // if(keyCode > 1775 && keyCode < 1786)
            //     event.keyCode = keyCode - 1728;
        }
//        else if ($.browser.mozilla) {
//            switch (keyCode) {
//                case arabicYeCharCode:
//                    substituteCharInFireFox(persianYeCharCode, e);
//                    break;
//                case arabicKeCharCode:
//                    substituteCharInFireFox(persianKeCharCode, e);
//                    break;
//            }
//        }
        else {
            switch (keyCode) {
                case arabicYeCharCode:
                    insertAtCaret(String.fromCharCode(persianYeCharCode), e);
                    break;
                case arabicKeCharCode:
                    insertAtCaret(String.fromCharCode(persianKeCharCode), e);
                    break;
            }
            // if(keyCode > 1775 && keyCode < 1786)
            //     insertAtCaret(String.fromCharCode(keyCode - 1728), e);
        }
    });

    // $('input,textarea').bind('paste', function (e) {
    //     var el = $(this);
    //     //we need to wait about 100ms for the paste value to actually change the val()
    //     setTimeout(function () {
    //         var text = $(el).val();
    //         text = text.replace(new RegExp(String.fromCharCode(arabicYeCharCode), "g"), String.fromCharCode(persianYeCharCode));
    //         text = text.replace(new RegExp(String.fromCharCode(arabicKeCharCode), "g"), String.fromCharCode(persianKeCharCode));
    //         text = text.replace(new RegExp("۱g"), "1");
    //         text = text.replace(new RegExp("۲g"), "2");
    //         text = text.replace(new RegExp("۳g"), "3");
    //         text = text.replace(new RegExp("۴g"), "4");
    //         text = text.replace(new RegExp("۵g"), "5");
    //         text = text.replace(new RegExp("۶g"), "6");
    //         text = text.replace(new RegExp("۷g"), "7");
    //         text = text.replace(new RegExp("۸g"), "8");
    //         text = text.replace(new RegExp("۹g"), "9");
    //         text = text.replace(new RegExp("۰g"), "0");
    //
    //         $(el).val(text);
    //     }, 100);
    // });
});
// ]]>