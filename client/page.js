var page = {};

page.element = function (selector, parent) {
	return (parent || document).querySelector(selector);
};
		
page.elements = function (selector, parent) {
	return (parent || document).querySelectorAll(selector);
};