paper.install(window);
// Keep global references to both tools, so the HTML
// links below can access them.
var pen, square;
var colour = '#000000';
var fill = false;
var width = 5;



function receive_json(json){}
window.onload = function() {
    paper.setup('myCanvas');

    var path;

    //run this at every onMouseUp to send this to the server
    function send() {
        let json = path.exportJSON([true, 5]);//number is float precision
        //send json to server
    }

    function receive(json) {
        json = "[\"Path\",{\"applyMatrix\":true,\"segments\":[[431,319],[431,85],[968,85],[968,319]],\"closed\":true,\"strokeColor\":[0,0,0]}]";
        let p = new Path();
        p.importJSON(json);
    }
    receive_json = receive;

    //run this at every onMouseDown as all tools should need this
    function set_path(path) {
        path.strokeColor = colour;
        path.strokeWidth = width;
        path.strokeCap = 'round';
        if(fill) path.fillColor = colour;
    }

    pen = new Tool();
    pen.onMouseDown = function(event) {
        path = new Path();
        set_path(path);
        path.add(event.point);
    }

    pen.onMouseDrag = function(event) {
        path.add(event.point);
    }

    pen.onMouseUp = function(event) {
        path.simplify();
        send();
    }

    square = new Tool();
    square.minDistance = 2;
    let start_point, xpositive, ypositive;
    square.onMouseDown = function(event) {
        path = new Path.Rectangle(event.point, new Size(1,1));
        set_path(path);
        start_point = event.point;
        xpositive = true;
        ypositive = true;
    }

    square.onMouseDrag = function(event) {
        let x = (event.point.x - start_point.x)/path.bounds.width;
        let y = (event.point.y - start_point.y)/path.bounds.height;
        if(!xpositive) x = -x;
        if(!ypositive) y = -y;
        xpositive = (event.point.x - start_point.x) >= 0;
        ypositive = (event.point.y - start_point.y) >= 0;
        if(x != 0 && y != 0) {
            path.scale(x,y, start_point);
        }
    }

    square.onMouseUp = send;

    circle = new Tool();
    circle.minDistance = 2;
    circle.onMouseDown = function(event) {
        path = new Path.Ellipse(event.point, new Size(1,1));
        set_path(path);
        start_point = event.point;
        xpositive = true;
        ypositive = true;
    }

    circle.onMouseDrag = function(event) {
        let x = (event.point.x - start_point.x)/path.bounds.width;
        let y = (event.point.y - start_point.y)/path.bounds.height;
        if(!xpositive) x = -x;
        if(!ypositive) y = -y;
        xpositive = (event.point.x - start_point.x) >= 0;
        ypositive = (event.point.y - start_point.y) >= 0;
        if(x != 0 && y != 0) {
            path.scale(x,y, start_point);
        }
    }

    circle.onMouseUp = send;
}