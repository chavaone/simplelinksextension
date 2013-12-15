(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['list_template'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, helperMissing=helpers.helperMissing, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n    <li class=\"url_item\">\n		<a href=\""
    + escapeExpression(((stack1 = (depth0 && depth0.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" target=\"_blank\">"
    + escapeExpression(((stack1 = (depth0 && depth0.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n		<span class=\"date\">(";
  options = {hash:{},data:data};
  buffer += escapeExpression(((stack1 = helpers.formatDate || (depth0 && depth0.formatDate)),stack1 ? stack1.call(depth0, (depth0 && depth0.date), options) : helperMissing.call(depth0, "formatDate", (depth0 && depth0.date), options)))
    + ")</span>\n        <a href=\"https://twitter.com/share?text=Bótalle unha ollada a "
    + escapeExpression(((stack1 = (depth0 && depth0.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " en "
    + escapeExpression(((stack1 = (depth0 && depth0.url)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\" class=\"icon-twitter share-link\" target=\"_blank\"></a>\n        <ul>\n        	";
  stack2 = helpers.each.call(depth0, (depth0 && depth0.keywords), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        </ul>\n        <p class=\"description\">"
    + escapeExpression(((stack1 = (depth0 && depth0.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</p>\n    </li>";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "";
  buffer += "\n        	<li class=\"keyword\">\n        		"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\n        	</li>\n        	";
  return buffer;
  }

  buffer += "<ul>\n";
  stack1 = helpers.each.call(depth0, (depth0 && depth0.links), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>";
  return buffer;
  });
})();
