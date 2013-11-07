
chrome.runtime.onMessage.addListener(function (message, sender, callback) {
	var context = message || {links:[]};
	document.getElementById("links").innerHTML = Handlebars.templates.list_template(context);
});