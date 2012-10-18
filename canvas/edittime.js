function GetPluginSettings() //r7
{
	return {
		"name":			"Canvas",
		"id":			"c2canvas",
		"version":		"1.6",					// (float in x.y format) Behavior version - C2 shows compatibility warnings based on this
		"description":	"Drawing canvas from CC.",
		"author":		"R0J0hound",
		"help url":		"http://www.scirra.com",
		"category":		"General",
		"type":			"world",			// appears in layout
		"rotatable":	true,
		"flags":		pf_texture | pf_position_aces | pf_size_aces | pf_angle_aces | pf_appearance_aces | pf_tiling | pf_zorder_aces
	};
};

AddObjectParam("Object", "Select the object to test for a collision with.");
AddCondition(0, cf_fake_trigger | cf_static, "On collision with another object", "Collisions", "On collision with {0}", "Triggered when the object collides with another object.", "OnCollision");

AddObjectParam("Object", "Select the object to test for overlap with.");
AddCondition(1, 0, "Is overlapping another object", "Collisions", "Is overlapping {0}", "Test if the object is overlapping another object.", "IsOverlapping");

// Conditions, actions and expressions
AddComboParamOption("(none)");
AddComboParamOption("Additive");
AddComboParamOption("XOR");
AddComboParamOption("Copy");
AddComboParamOption("Destination over");
AddComboParamOption("Source in");
AddComboParamOption("Destination in");
AddComboParamOption("Source out");
AddComboParamOption("Destination out");
AddComboParamOption("Source atop");
AddComboParamOption("Destination atop");
AddComboParam("Effect", "Choose the new effect for this object.");
AddAction(1, 0, "Set effect", "Appearance", "Set effect to <i>{0}</i>", "Set the rendering effect of this object.", "SetEffect");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(2, 0, "Draw Point", "Canvas", "Draw point ({0},{1}) with color {2}", "Draws a point on the canvas.", "DrawPoint");

AddNumberParam("width", "canvas width", "0");
AddNumberParam("height", "canvas height", "0");
AddAction(3, 0, "Resize canvas", "Canvas", "Resize canvas to ({0},{1})", "Resizes the canvas.", "ResizeCanvas");


AddObjectParam("object", "Object to paste.");
AddAction(4, 0, "Paste Object", "Canvas", "Paste Object {0} into canvas", "Pastes objects into the canvas.", "PasteObject");

AddLayerParam("Layer", "The layer name or number to paste.");
AddAction(21, 0, "Paste Layer", "Canvas", "Paste Layer {0} into canvas", "Pastes layer into the canvas.", "PasteLayer");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddNumberParam("width", "box width", "0");
AddNumberParam("height", "box height", "0");
AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(5, 0, "Draw Box", "Canvas", "Draw box (({0},{1}),({2},{3})) with color {4}", "Draws a filled box.", "DrawBox");

AddNumberParam("x1", "x start position on canvas", "0");
AddNumberParam("y1", "y start position on canvas", "0");
AddNumberParam("x2", "x end position on canvas", "0");
AddNumberParam("y2", "y end position on canvas", "0");
AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddAction(6, 0, "Draw Line", "Canvas", "Draw line from ({0},{1}) to ({2},{3}) with color {4} and line width {5}", "Draws a line.", "DrawLine");

AddAction(7, 0, "Clear Canvas", "Canvas", "Clear canvas", "Clears the canvas to transparent.", "ClearCanvas");

AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(8, 0, "Fill canvas with color", "Canvas", "Fill canvas with color {0}", "Fills the entire canvas with a color.", "FillColor");

AddComboParamOption("hoizontal");
AddComboParamOption("vertical");
AddComboParamOption("diagonal_down_right");
AddComboParamOption("diagonal_down_left");
AddComboParamOption("radial");
AddComboParam("gradient_style", "Choose the gradient style.");
AddStringParam("color1", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddStringParam("color2", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(19, 0, "Fill canvas with gradient", "Canvas", "Fill canvas with {0} gradient with colors {1} to {2}", "Fills the canvas with a gradient.", "fillGradient");

AddNumberParam("x", "x center on the canvas", "0");
AddNumberParam("y", "y center on the canvas", "0");
AddNumberParam("radius", "Radius of circle.", "0");
AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddAction(20, 0, "Draw Circle", "Canvas", "Draw circle from center ({0},{1}), with radius {2}, color {3} and line width {4}", "Draw a circle.", "drawCircle");

AddAction(9, 0, "Begin Path", "Path", "Begin path", "This clears the current path and stars a new one.", "beginPath");

AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddNumberParam("line_width", "Width of line", "1.0");
AddAction(10, 0, "Draw Path", "Path", "Draw path with color {0} and line width {1}", "Draws along the current path.", "drawPath");

AddComboParamOption("butt");
AddComboParamOption("round");
AddComboParamOption("square");
AddComboParam("line_cap", "Choose the style for ends.");
AddComboParamOption("round");
AddComboParamOption("bevel");
AddComboParamOption("miter");
AddComboParam("line_joint", "Choose the style for joints.");
AddAction(18, 0, "Set Line Settings", "Path", "Set Line Settings: Cap style {0}, Joint style {1}", "Sets the cap and joint settings of the path.", "setLineSettings");

AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(11, 0, "Fill Path", "Path", "Fill path with color {0}", "Fills the area inside the current path with a color.", "fillPath");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddAction(12, 0, "Move To", "Path", "Move pen to ({0}, {1})", "Moves the current ploting position.", "moveTo");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddAction(13, 0, "Line To", "Path", "Line to ({0}, {1})", "Line to.", "lineTo");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddNumberParam("radius", "Radius of arc", "0");
AddNumberParam("start_angle", "Start angle.", "0");
AddNumberParam("end_angle", "End angle.", "0");
AddComboParamOption("clockwise");
AddComboParamOption("anticlockwise");
AddComboParam("arc_direction", "Direction to draw arc.");
AddAction(14, 0, "Arc", "Path", "Arc from center ({0},{1}), with radius {2} from angle {3} to {4} {5}", "Arc Path.", "arc");

AddNumberParam("cp1x", "x Control point 1", "0");
AddNumberParam("cp1y", "y Control point 1", "0");
AddNumberParam("cp2x", "x Control point 2", "0");
AddNumberParam("cp2y", "y Control point 2", "0");
AddNumberParam("x", "x end position on canvas", "0");
AddNumberParam("y", "y end position on canvas", "0");
AddAction(15, 0, "Bezier Curve To", "Path", "Bezier curve with control points ({0},{1}),({2},{3}) and endpoint ({4},{5})", "Bezier Curve.", "bezierCurveTo");

AddNumberParam("cpx", "x Control point", "0");
AddNumberParam("cpy", "y Control point", "0");
AddNumberParam("x", "x end position on canvas", "0");
AddNumberParam("y", "y end position on canvas", "0");
AddAction(16, 0, "Quadratic Curve To", "Path", "Quadratic curve with control point ({0},{1}) and endpoint ({2},{3})", "Quadratic Curve.", "quadraticCurveTo");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddNumberParam("width", "box width", "0");
AddNumberParam("height", "box height", "0");
AddAction(17, 0, "Rectangle path", "Path", "Rectangle path (({0},{1}),({2},{3}))", "This sets up a Rectangle path", "rectPath");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddStringParam("color", "Use color name, hex \"#FFA500\", \"rgb(0-255,0-255,0-255)\", \"rgba(0-255,0-255,0-255,0-1)\", \"hsl(0-360,0-100%,0-100%)\", or \"hsla(0-360,0-100%,0-100%,0-1)\" ", "\"black\"");
AddAction(22, 0, "Floodfill canvas with color", "Canvas", "Fill canvas with color {2} at ({0},{1})", "Floodfill the canvas with a color.", "FloodFill");

AddNumberParam("x", "x position on canvas", "0");
AddNumberParam("y", "y position on canvas", "0");
AddExpression(1, ef_return_string, "get rgba at", "canvas", "rgbaAt", "This gives the rgba color at a given position on the canvas.");

AddExpression(2, ef_return_string, "get image url", "canvas", "imageUrl", "This returns a temporary url to the image on the canvas.");

AddExpression(3, ef_return_string, "get as JSON (experimental)", "canvas", "AsJSON", "This returns a JSON array of the canvas.");

ACESDone();

// Property grid properties for this plugin
var property_list = [
	new cr.Property(ept_link,	"Image",				"Edit",		"Click to edit the object's image.", "firstonly"),
	new cr.Property(ept_combo,	"Initial visibility",	"Visible",	"Choose whether the object is visible when the layout starts.", "Visible|Invisible"),
	new cr.Property(ept_combo,	"Effect",				"(none)",	"Choose an effect for this object.  (This does not preview in the layout, only when you run.)", "(none)|Additive|XOR|Copy|Destination over|Source in|Destination in|Source out|Destination out|Source atop|Destination atop"),
	new cr.Property(ept_combo,	"Hotspot",				"Top-left",	"Choose the location of the hot spot in the object.", "Top-left|Top|Top-right|Left|Center|Right|Bottom-left|Bottom|Bottom-right")
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
	return new IDEInstance(instance);
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
		
	// Plugin-specific variables
	this.just_inserted = false;
}

IDEInstance.prototype.OnCreate = function()
{

	switch (this.properties["Hotspot"])
	{
    case "Top-left" :
      this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
    case "Top" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
    case "Top-right" :
      this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
    case "Left" :
      this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
    case "Center" :
      this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
    case "Right" :
      this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
    case "Bottom-left" :
      this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
    case "Bottom" :
      this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
    case "Bottom-right" :
		  this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
	}
}

IDEInstance.prototype.OnInserted = function()
{
	this.just_inserted = true;
}

IDEInstance.prototype.OnDoubleClicked = function()
{
	this.instance.EditTexture();
}

// Called by the IDE after a property has been changed
IDEInstance.prototype.OnPropertyChanged = function(property_name)
{
	// Edit image link
	if (property_name === "Image")
	{
		this.instance.EditTexture();
	}
	else if (property_name === "Hotspot")
	{
    switch (this.properties["Hotspot"])
    {
      case "Top-left" :
        this.instance.SetHotspot(new cr.vector2(0, 0));
      break;
      case "Top" :
        this.instance.SetHotspot(new cr.vector2(0.5, 0));
      break;
      case "Top-right" :
        this.instance.SetHotspot(new cr.vector2(1, 0));
      break;
      case "Left" :
        this.instance.SetHotspot(new cr.vector2(0, 0.5));
      break;
      case "Center" :
        this.instance.SetHotspot(new cr.vector2(0.5, 0.5));
      break;
      case "Right" :
        this.instance.SetHotspot(new cr.vector2(1, 0.5));
      break;
      case "Bottom-left" :
        this.instance.SetHotspot(new cr.vector2(0, 1));
      break;
      case "Bottom" :
        this.instance.SetHotspot(new cr.vector2(0.5, 1));
      break;
      case "Bottom-right" :
        this.instance.SetHotspot(new cr.vector2(1, 1));
      break;
    }
	}
}

IDEInstance.prototype.OnRendererInit = function(renderer)
{
	renderer.LoadTexture(this.instance.GetTexture());
}
	
// Called to draw self in the editor
IDEInstance.prototype.Draw = function(renderer)
{
	var texture = this.instance.GetTexture();
	renderer.SetTexture(this.instance.GetTexture());
	
	// First draw after insert: use 2x the size of the texture so user can see four tiles.
	// Done after SetTexture so the file is loaded and dimensions known, preventing
	// the file being loaded twice.
	//if (this.just_inserted)
	//{
	//	this.just_inserted = false;
	//	var sz = texture.GetImageSize();
	//	this.instance.SetSize(new cr.vector2(sz.x, sz.y));
	//	RefreshPropertyGrid();		// show new size
	//}
	
	// Calculate tiling
	// This ignores cards without NPOT texture support but... meh.  Tiling by repeated quads is a massive headache.
	//var texsize = texture.GetImageSize();
	//var objsize = this.instance.GetSize();
	//var uv = new cr.rect(0, 0, objsize.x / texsize.x, objsize.y / texsize.y);
	
	//renderer.EnableTiling(false);
	var q=this.instance.GetBoundingQuad();
	renderer.Quad(q, this.instance.GetOpacity());
	renderer.Outline(q, cr.RGB(0,0,0))
	//renderer.EnableTiling(false);
}

IDEInstance.prototype.OnRendererReleased = function(renderer)
{
	renderer.ReleaseTexture(this.instance.GetTexture());
}