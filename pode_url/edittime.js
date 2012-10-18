function GetPluginSettings()
{
	return {
		"name":			"URL",
		"id":			"URL",
		"description":	"Change the current URL displayed by the browser",
		"author":		"JP Deblonde",
		"help url":		"",
		"category":		"Web",
		"type":			"object",			// not in layout
		"rotatable":	false,
		"flags":		pf_singleglobal
	};
};

//////////////////////////////////////////////////////////////
// Conditions
//AddCondition(0, 0, "Cookies enabled", "Browser", "Cookies are enabled", "Browser has cookies enabled.", "CookiesEnabled");
//AddCondition(1, 0, "Is online", "Browser", "Is online", "Browser is online (i.e. not in an offline browsing mode).", "IsOnline");
//AddCondition(2, 0, "Java supported", "Browser", "Java is supported", "Browser supports java.", "HasJava");

//AddCondition(3, cf_trigger, "On went online", "Browser", "On went online", "Triggered when user is offline and a connection becomes available.", "OnOnline");
//AddCondition(4, cf_trigger, "On went offline", "Browser", "On went offline", "Triggered when user is online and the connection becomes unavailable.", "OnOffline");

//AddCondition(5, 0, "Is downloading update", "Offline cache", "Is downloading update", "True when the browser is running from the offline cache, but downloading an update in the background.", "IsDownloadingUpdate");
//AddCondition(6, cf_trigger, "On update ready", "Offline cache", "On update ready", "Triggered when an update has finished downloading.  You may want to prompt the user to reload the page.", "OnUpdateReady");

//////////////////////////////////////////////////////////////
// Actions
AddAnyTypeParam("Message", "Enter the message to display in the alert.", "\"\"");
AddAction(0, 0,	"Alert", "Window", "Alert {0}", "Pop up a message box with a message and an OK button.", "Alert");
AddAction(1, 0,	"Close", "Window", "Close", "Close the current browser window or tab.  The browser may prompt the user to confirm.", "Close");
AddAction(2, 0,	"Focus", "Window", "Focus", "Focus the current browser window or tab.", "Focus");
AddAction(3, 0,	"Blur", "Window", "Blur", "Blur (unfocus) the current browser window or tab.", "Blur");

AddAction(4, 0,	"Go back", "Navigation", "Go back", "Go to the previous page in browser history.", "GoBack");
AddAction(5, 0,	"Go forward", "Navigation", "Go forward", "Go to the next page in browser history.", "GoForward");
AddAction(6, 0,	"Go home", "Navigation", "Go home", "Go to the browser homepage.", "GoHome");

AddStringParam("URL", "Enter the full URL to navigate to.", "\"http://\"");
AddAction(7, 0,	"Go to URL", "Navigation", "Go to {0}", "Navigate to a URL.", "GoToURL");

AddStringParam("URL", "Enter the full URL to navigate to.", "\"http://\"");
AddStringParam("Tag", "A string to identify this window.  You can reuse an existing window by reusing its tag.", "\"NewWindow\"");
AddAction(8, 0,	"Open URL in new window", "Navigation", "Go to {0} in a new window (<i>{1}</i>)", "Open a new window and navigate to a URL.", "GoToURLWindow");

AddAction(9, 0, "Reload", "Navigation", "Reload", "Reload the current page.  Also updates if an 'On update ready' event has triggered.", "Reload");

//////////////////////////////////////////////////////////////
// Expressions
//AddExpression(3, ef_return_number, "Absolute mouse Y", "Cursor", "AbsoluteY", "Get the mouse cursor Y co-ordinate on the canvas.");
AddExpression(0, ef_return_string, "Get current URL", "Navigation", "URL", "Get the current browser URL.");
AddExpression(1, ef_return_string, "Get protocol", "Navigation", "Protocol", "Get the current protocol, e.g. http:.");
AddExpression(2, ef_return_string, "Get domain", "Navigation", "Domain", "Get the current domain, e.g. scirra.com.");
AddExpression(3, ef_return_string, "Get path name", "Navigation", "PathName", "Get the path relative to domain.");
AddExpression(4, ef_return_string, "Get hash", "Navigation", "Hash", "Get the hash from the URL, e.g. #myAnchor.");
AddExpression(5, ef_return_string, "Get referrer", "Navigation", "Referrer", "Get the referrer (the page that linked to this page).");

AddExpression(6, ef_return_string, "Get title", "Document", "Title", "Get the page title.");

AddExpression(7, ef_return_string, "Get name", "Browser", "Name", "Get the browser application name.");
AddExpression(8, ef_return_string, "Get version", "Browser", "Version", "Get the browser application version.");
AddExpression(9, ef_return_string, "Get language", "Browser", "Language", "Get the browser language.");
AddExpression(10, ef_return_string, "Get platform", "Browser", "Platform", "Get the browser platform (e.g. Windows, Mac).");
AddExpression(11, ef_return_string, "Get product", "Browser", "Product", "Get the browser product name (e.g. Gecko).");
AddExpression(12, ef_return_string, "Get vendor", "Browser", "Vendor", "Get the browser vendor.");
AddExpression(13, ef_return_string, "Get user agent", "Browser", "UserAgent", "Get the full browser user agent string.");

AddExpression(14, ef_return_string, "Get query string", "Navigation", "QueryString", "Get the full query string, including the ?.");

AddStringParam("name", "Query string parameter name.");
AddExpression(15, ef_return_string, "Get query string parameter", "Navigation", "QueryParam", "Get a query string parameter by name.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	];
	
// Called by IDE when a new object type is to be created
function CreateIDEObjectType()
{
	return new IDEObjectType();
}

// Class representing an object type in the IDE
function IDEObjectType()
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
}

// Called by IDE when a new object instance of this type is to be created
IDEObjectType.prototype.CreateInstance = function(instance)
{
	return new IDEInstance(instance, this);
}

// Class representing an individual instance of an object in the IDE
function IDEInstance(instance, type)
{
	assert2(this instanceof arguments.callee, "Constructor called as a function");
	
	// Save the constructor parameters
	this.instance = instance;
	this.type = type;
	
	// Set the default property values from the property table
	this.properties = {};
	
	for (var i = 0; i < property_list.length; i++)
		this.properties[property_list[i].name] = property_list[i].initial_value;
}

// Called by the IDE after all initialization on this instance has been completed
IDEInstance.prototype.OnCreate = function()
{
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
}
	
// Called by the IDE to draw this instance in the editor
IDEInstance.prototype.Draw = function(renderer)
{
}

// Called by the IDE when the renderer has been released (ie. editor closed)
// All handles to renderer-created resources (fonts, textures etc) must be dropped.
// Don't worry about releasing them - the renderer will free them - just null out references.
IDEInstance.prototype.OnRendererReleased = function()
{
}
