var changeText = function(elem,changeVal){
   if (elem.textContent){
      elem.textContent = changeVal;
   }else{
      elem.innerText = changeVal;
   }
};

var checkPageReady = setInterval(function() {
		if (document.readyState !== "complete")
			return;
		clearInterval(checkPageReady);
        var errorType = ( window.location.href.split("=").length == 1 ? "" : window.location.href.split("=")[1] );
        var title = "";
        switch(errorType){
	       case  "JS" :
              title      = "امکان اجرای javascript در مرورگر شما وجود ندارد در صورت غیر فعال کردن موتور javascript آنرا فعال کرده و در صورت قدیمی بودن نسخه مورورگرتان آنرا به روز رسانی کرده و مججدا وارد سایت شوید";
		      break;
	       case "AngularJS":
               title      = "امکان اجرای این صفحه در مرورگر شما وجود ندارد  لطفا یا از مرورگر جدیدتری استفاده کنید و یا  مرورگر را به روز رسانی کرده و مجددا وارد سایت شوید";
	           break;
		    case  "IE":
               title      = "امکان اجرای این صفحه در مرورگر شما وجود ندارد متاسفانه مرورگر اینترنت اکسپلورر امکان استفاده از کلیه قابلیت های این سایت را ندارد لطفا از یک مرورگر دیگر استفاده کرده و مجددا وارد سایت شوید";
		       break;
		   default:
               title      = "امکان اجرای این صفحه در مرورگر شما وجود ندارد مرورگر خود را به روز کرده و دوباره وارد سایت شوید";
		   break;
       }
       changeText(document.getElementById('username_input'),title );
		
}, 100);
	 

