/* Validated with JSLint, http://www.jslint.com */


////////////////////////////////////////////////////////////////////////////////
//
// Delaunay Triangulation Code, by Joshua Bell
//
// Inspired by: http://www.codeguru.com/cpp/data/mfc_database/misc/article.php/c8901/
//
// This work is hereby released into the Public Domain. To view a copy of the public 
// domain dedication, visit http://creativecommons.org/licenses/publicdomain/ or send 
// a letter to Creative Commons, 171 Second Street, Suite 300, San Francisco, 
// California, 94105, USA.
//
////////////////////////////////////////////////////////////////////////////////

/*
var EPSILON = 1.0e-6;

//------------------------------------------------------------
// Vertex class
//------------------------------------------------------------

function Vertex( x, y )
{
	this.x = x;
	this.y = y;
	
} // Vertex

//------------------------------------------------------------
// Triangle class
//------------------------------------------------------------

function Triangle( v0, v1, v2 )
{
	this.v0 = v0;
	this.v1 = v1;
	this.v2 = v2;

	this.CalcCircumcircle();
	
} // Triangle

Triangle.prototype.CalcCircumcircle = function()
{
	// From: http://www.exaflop.org/docs/cgafaq/cga1.html

	var A = this.v1.x - this.v0.x; 
	var B = this.v1.y - this.v0.y; 
	var C = this.v2.x - this.v0.x; 
	var D = this.v2.y - this.v0.y; 

	var E = A*(this.v0.x + this.v1.x) + B*(this.v0.y + this.v1.y); 
	var F = C*(this.v0.x + this.v2.x) + D*(this.v0.y + this.v2.y); 

	var G = 2.0*(A*(this.v2.y - this.v1.y)-B*(this.v2.x - this.v1.x)); 
	
	var dx, dy;
	
	if( Math.abs(G) < EPSILON )
	{
		// Collinear - find extremes and use the midpoint

		function max3( a, b, c ) { return ( a >= b && a >= c ) ? a : ( b >= a && b >= c ) ? b : c; }
		function min3( a, b, c ) { return ( a <= b && a <= c ) ? a : ( b <= a && b <= c ) ? b : c; }

		var minx = min3( this.v0.x, this.v1.x, this.v2.x );
		var miny = min3( this.v0.y, this.v1.y, this.v2.y );
		var maxx = max3( this.v0.x, this.v1.x, this.v2.x );
		var maxy = max3( this.v0.y, this.v1.y, this.v2.y );

		this.center = new Vertex( ( minx + maxx ) / 2, ( miny + maxy ) / 2 );

		dx = this.center.x - minx;
		dy = this.center.y - miny;
	}
	else
	{
		var cx = (D*E - B*F) / G; 
		var cy = (A*F - C*E) / G;

		this.center = new Vertex( cx, cy );

		dx = this.center.x - this.v0.x;
		dy = this.center.y - this.v0.y;
	}

	this.radius_squared = dx * dx + dy * dy;
	this.radius = Math.sqrt( this.radius_squared );
}; // CalcCircumcircle

Triangle.prototype.InCircumcircle = function( v )
{
	var dx = this.center.x - v.x;
	var dy = this.center.y - v.y;
	var dist_squared = dx * dx + dy * dy;

	return ( dist_squared <= this.radius_squared );
	
}; // InCircumcircle


//------------------------------------------------------------
// Edge class
//------------------------------------------------------------

function Edge( v0, v1 )
{
	this.v0 = v0;
	this.v1 = v1;
	
} // Edge


//------------------------------------------------------------
// Triangulate
//
// Perform the Delaunay Triangulation of a set of vertices.
//
// vertices: Array of Vertex objects
//
// returns: Array of Triangles
//------------------------------------------------------------
function Triangulate( vertices )
{
	var triangles = [];

	//
	// First, create a "supertriangle" that bounds all vertices
	//
	var st = CreateBoundingTriangle( vertices );

	triangles.push( st );

	//
	// Next, begin the triangulation one vertex at a time
	//
	var i;
	for( i in vertices )
	{
		// NOTE: This is O(n^2) - can be optimized by sorting vertices
		// along the x-axis and only considering triangles that have 
		// potentially overlapping circumcircles

		var vertex = vertices[i];
		AddVertex( vertex, triangles );
	}

	//
	// Remove triangles that shared edges with "supertriangle"
	//
	for( i in triangles )
	{
		var triangle = triangles[i];

		if( triangle.v0 == st.v0 || triangle.v0 == st.v1 || triangle.v0 == st.v2 ||
			triangle.v1 == st.v0 || triangle.v1 == st.v1 || triangle.v1 == st.v2 ||
			triangle.v2 == st.v0 || triangle.v2 == st.v1 || triangle.v2 == st.v2 )
		{
			delete triangles[i];
		}
	}

	return triangles;
	
} // Triangulate


// Internal: create a triangle that bounds the given vertices, with room to spare
function CreateBoundingTriangle( vertices )
{
	// NOTE: There's a bit of a heuristic here. If the bounding triangle 
	// is too large and you see overflow/underflow errors. If it is too small 
	// you end up with a non-convex hull.
	
	var minx, miny, maxx, maxy;
	for( var i in vertices )
	{
		var vertex = vertices[i];
		if( minx === undefined || vertex.x < minx ) { minx = vertex.x; }
		if( miny === undefined || vertex.y < miny ) { miny = vertex.y; }
		if( maxx === undefined || vertex.x > maxx ) { maxx = vertex.x; }
		if( maxy === undefined || vertex.y > maxy ) { maxy = vertex.y; }
	}

	var dx = ( maxx - minx ) * 10;
	var dy = ( maxy - miny ) * 10;
	
	var stv0 = new Vertex( parseFloat(minx) - dx,   parseFloat(miny) - dy*3 );
	var stv1 = new Vertex( parseFloat(minx) - dx,   parseFloat(maxy) + dy   );
	var stv2 = new Vertex( parseFloat(maxx) + dx*3, parseFloat(maxy) + dy   );

	return new Triangle( stv0, stv1, stv2 );
	
} // CreateBoundingTriangle


// Internal: update triangulation with a vertex 
function AddVertex( vertex, triangles )
{
	var edges = [];
	
	// Remove triangles with circumcircles containing the vertex
	var i;
	for( i in triangles )
	{
		var triangle = triangles[i];

		if( triangle.InCircumcircle( vertex ) )
		{
			edges.push( new Edge( triangle.v0, triangle.v1 ) );
			edges.push( new Edge( triangle.v1, triangle.v2 ) );
			edges.push( new Edge( triangle.v2, triangle.v0 ) );

			delete triangles[i];
		}
	}

	edges = UniqueEdges( edges );

	// Create new triangles from the unique edges and new vertex
	for( i in edges )
	{
		var edge = edges[i];

		triangles.push( new Triangle( edge.v0, edge.v1, vertex ) );
	}	
} // AddVertex


// Internal: remove duplicate edges from an array
function UniqueEdges( edges )
{
	// TODO: This is O(n^2), make it O(n) with a hash or some such
	var uniqueEdges = [];
	for( var i in edges )
	{
		var edge1 = edges[i];
		var unique = true;

		for( var j in edges )
		{
			if( i != j )
			{
				var edge2 = edges[j];

				if( ( edge1.v0 == edge2.v0 && edge1.v1 == edge2.v1 ) ||
					( edge1.v0 == edge2.v1 && edge1.v1 == edge2.v0 ) )
				{
					unique = false;
					break;
				}
			}
		}
		
		if( unique )
		{
			uniqueEdges.push( edge1 );
		}
	}

	return uniqueEdges;
	
} // UniqueEdges



*/
function Triangle(a, b, c,ID) {

		//
		this.ID = ID;
		//

        /*this.a = Math.floor(a);
        this.b = Math.floor(b);
        this.c = Math.floor(c);*/
		this.a = a;
        this.b = b;
        this.c = c;
		
		/*function setA(_a){
			this.a = _a;
		}
		function setB(_b){
			this.b = _b;
		}
		function setC(_c){
			this.c = _c;
		}*/

        var A = b.x - a.x,
            B = b.y - a.y,
            C = c.x - a.x,
            D = c.y - a.y,
            E = A * (a.x + b.x) + B * (a.y + b.y),
            F = C * (a.x + c.x) + D * (a.y + c.y),
            G = 2 * (A * (c.y - b.y) - B * (c.x - b.x)),
            minx, miny, dx, dy;
  
        /* If the points of the triangle are collinear, then just find the
         * extremes and use the midpoint as the center of the circumcircle. */
        if(Math.abs(G) < 0.000001) {
          minx = Math.min(a.x, b.x, c.x);
          miny = Math.min(a.y, b.y, c.y);
          dx   = (Math.max(a.x, b.x, c.x) - minx) * 0.5;
          dy   = (Math.max(a.y, b.y, c.y) - miny) * 0.5;

          this.x = minx + dx;
          this.y = miny + dy;
          this.r = dx * dx + dy * dy;
        }

        else {
          this.x = (D*E - B*F) / G;
          this.y = (A*F - C*E) / G;
          dx = this.x - a.x;
          dy = this.y - a.y;
          this.r = dx * dx + dy * dy;
        }
      }

      function byX(a, b) {
        return b.x - a.x;
		//return b.y - a.y;
      }

      function dedup(edges) {
        var j = edges.length,
            a, b, i, m, n;

        outer: while(j) {
          b = edges[--j];
          a = edges[--j];
          i = j;
          while(i) {
            n = edges[--i];
            m = edges[--i];
            if((a === m && b === n) || (a === n && b === m)) {
              edges.splice(j, 2);
              edges.splice(i, 2);
              j -= 2;
              continue outer;
            }
          }
        }
      }

      function triangulate(vertices) {
        /* Bail if there aren't enough vertices to form any triangles. */
        if(vertices.length < 3)
          return [];

        /* Ensure the vertex array is in order of descending X coordinate
         * (which is needed to ensure a subquadratic runtime), and then find
         * the bounding box around the points. */
		 //comment to keep triangles in order
        vertices.sort(byX);
		

        var i    = vertices.length - 1,
            xmin = vertices[i].x,
            xmax = vertices[0].x,
            ymin = vertices[i].y,
            ymax = ymin;

        while(i--) {
          if(vertices[i].y < ymin) ymin = vertices[i].y;
          if(vertices[i].y > ymax) ymax = vertices[i].y;
        }

        /* Find a supertriangle, which is a triangle that surrounds all the
         * vertices. This is used like something of a sentinel value to remove
         * cases in the main algorithm, and is removed before we return any
         * results.
         * 
         * Once found, put it in the "open" list. (The "open" list is for
         * triangles who may still need to be considered; the "closed" list is
         * for triangles which do not.) */
		 var _id = 0;
        var dx     = xmax - xmin,
            dy     = ymax - ymin,
            dmax   = (dx > dy) ? dx : dy,
            xmid   = (xmax + xmin) * 0.5,
            ymid   = (ymax + ymin) * 0.5,
            open   = [
              new Triangle(
                {x: xmid - 20 * dmax, y: ymid -      dmax, __sentinel: true, ID: _id++},
                {x: xmid            , y: ymid + 20 * dmax, __sentinel: true, ID: _id++},
                {x: xmid + 20 * dmax, y: ymid -      dmax, __sentinel: true, ID: _id++}
              )
            ],
            closed = [],
            edges = [],
            j, a, b;

        /* Incrementally add each vertex to the mesh. */
        i = vertices.length;
        while(i--) {
          /* For each open triangle, check to see if the current point is
           * inside it's circumcircle. If it is, remove the triangle and add
           * it's edges to an edge list. */
          edges.length = 0;
          j = open.length;
          while(j--) {
            /* If this point is to the right of this triangle's circumcircle,
             * then this triangle should never get checked again. Remove it
             * from the open list, add it to the closed list, and skip. */
            dx = vertices[i].x - open[j].x;
            if(dx > 0 && dx * dx > open[j].r) {
              closed.push(open[j]);
              open.splice(j, 1);
              continue;
            }

            /* If not, skip this triangle. */
            dy = vertices[i].y - open[j].y;
            if(dx * dx + dy * dy > open[j].r)
              continue;

            /* Remove the triangle and add it's edges to the edge list. */
            edges.push(
              open[j].a, open[j].b,
              open[j].b, open[j].c,
              open[j].c, open[j].a
            )
            open.splice(j, 1);
          }

          /* Remove any doubled edges. */
          dedup(edges);

          /* Add a new triangle for each edge. */
          j = edges.length;
		  var _id=0;
          while(j) {
            b = edges[--j];
            a = edges[--j];
            open.push(new Triangle(a, b, vertices[i],_id++));
          }
        }

        /* Copy any remaining open triangles to the closed list, and then
         * remove any triangles that share a vertex with the supertriangle. */
        Array.prototype.push.apply(closed, open);

        i = closed.length;
        while(i--)
          if(closed[i].a.__sentinel ||
             closed[i].b.__sentinel ||
             closed[i].c.__sentinel)
            closed.splice(i, 1);

        /* Yay, we're done! */
        return closed;
      }

      /*var canvas = document.getElementById("canvas"),
          ctx = canvas.getContext("2d"),
          i = 2048,
          vertices = new Array(i),
          x, y

      while(i) {
        do {
          x = Math.random() - 0.5
          y = Math.random() - 0.5
        } while(x * x + y * y > 0.25)

        x = (x * 0.96875 + 0.5) * canvas.width
        y = (y * 0.96875 + 0.5) * canvas.height

        vertices[--i] = {x: x, y: y}
      }

      console.time("triangulate")
      var triangles = triangulate(vertices)
      console.timeEnd("triangulate")

      i = triangles.length
      while(i)
        triangles[--i].draw(ctx)*/
	function byID(a, b) {
        return b.ID - a.ID;
     }