function checkpass() {
	var pass = document.getElementById('newPassword');
	var repass = document.getElementById('rePassword');
	var message = document.getElementById('alarm');

	if (pass.value == repass.value) {
		$("#input-repass").css({
			"border" : "2px solid #3c763d"
		});
		$(message).css({
			"visibility" : "hidden"
		});
		$("#savebtn").removeAttr("disabled");
	} else {
		$("#input-repass").css({
			"border" : "2px solid #a94442"
		});
		$(message).css({
			"visibility" : "visible"
		});
		$("#savebtn").attr({
			"disabled" : "disabled"
		});
	}

}
$(document).ready(function() {
	$("#cancelbtn").click(function() {
		window.location = "/Sanjeh/#/day/time"
	});
	$("#savebtn").click(function() {
		$.post("../api/user/signup", {
			username : $("#username").val(),
			name : $("#name").val(),
			// password : md5($("#newPassword").val())
			password : $("#newPassword").val()
		}, function(result) {

		}).fail(function(result) {
			for (var i = 0; i < result.responseJSON.messages.length; i++) {

				$.notify(result.responseJSON.messages[i].text, {
					position : "top center",
					className : result.responseJSON.messages[i].type.toLowerCase()
				});
			}
		}).done(function(result) {
			for (var i = 0; i < result.messages.length; i++) {

				$.notify(result.messages[i].text, {
					position : "top center",
					className : result.messages[i].type.toLowerCase()
				});

				setTimeout(function() {
					window.location = "/Sanjeh/static/login.html"
				}, 900)
			}
		});

	});

});