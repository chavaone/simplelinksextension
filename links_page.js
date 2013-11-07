
Handlebars.registerHelper("formatDate", function(date) {
  var date_obj = new Date (date || 0);
  if (! date) {
  	return "";
  } else if (new Date().toDateString() === date_obj.toDateString()) {
  	return moment(date_obj).format("hh:mm a");
  } else {
  	moment.lang("gl");
  	return moment(date_obj).format("DD [de] MMMM [as] hh:mm a");
  }
});

chrome.runtime.onMessage.addListener(function (message, sender, callback) {
	var context = message || {links:[]};
	context.links = context.links.reverse();
	document.getElementById("links").innerHTML = Handlebars.templates.list_template(context);
});