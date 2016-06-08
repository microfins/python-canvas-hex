hex.clearMap = function(){
    this.hexes = [];
}
hex.rowcolToXY = function(row, col){
    var offsetColumn = (col % 2 == 0) ? false : true;
    if (!offsetColumn) {
        x = (col * hex.side) + hex.canvasOriginX;
        y = (row * hex.height) + hex.canvasOriginY;
    } else {
        x = col * hex.side + hex.canvasOriginX;
        y = (row * hex.height) + hex.canvasOriginY + (hex.height * 0.5);
    }

    return {"x": x, "y": y}
}
hex.drawHexGrid = function(rows, cols) {
    hex.canvasOriginX = hex.canvas.getBoundingClientRect().left;
    hex.canvasOriginY = hex.canvas.getBoundingClientRect().top;

    //base grid
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            hexObj = {
                    "x": hex.rowcolToXY(j, i).x,
                    "y": hex.rowcolToXY(j, i).y,
                    "fillColor": hex.hexes[i][j].tc,
                    "txt": hex.hexes[i][j].txt,
                    "ownc": hex.hexes[i][j].ownc,
                    "highlight": false,
                    "innerHex": false
                }
                hex.drawHex(hex.ctx, hexObj); 
        }
    }

    //overlay items
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (hex.hexes[i][j].h == true) {
                hexObj = {
                    "x": hex.rowcolToXY(j, i).x,
                    "y": hex.rowcolToXY(j, i).y,
                    "fillColor": hex.hexes[i][j].tc,
                    "txt": hex.hexes[i][j].txt,
                    "ownc": hex.hexes[i][j].ownc,
                    "highlight": true,
                    "innerHex": false
                }
                hex.drawHex(hex.ctx, hexObj);               }
        }
    }
}

hex.drawHex = function(context, hexObj) {
    if (hexObj.highlight == true) {
        context.strokeStyle = "#00F2FF";
        context.lineWidth = 4;
    } else {
        context.strokeStyle = "#000";
        context.lineWidth = 2;
    }
    var tile = hex.getSelectedTile(hexObj.x + hex.width - hex.side, hexObj.y);
    var numberOfSides = 6,
    size = hex.radius,
    Xcenter = hexObj.x + (hex.width / 2),
    Ycenter = hexObj.y + (hex.height / 2);
    context.beginPath();
    context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          
    for (var i = 1; i <= numberOfSides;i += 1) {
        context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    context.fillStyle = hexObj.fillColor;
    context.fill();
    context.closePath();
    context.stroke();

    if (hexObj.txt) {
        //Print number of units
        context.textAlign="center"; 
        context.textBaseline = "middle";
        context.font = 'bold '+ (25/2.25) +'pt Arial';
        //Code for contrasting text with background color
        var clr = hex.getContrastYIQ(hexObj.fillColor); //contrast against land color (fillColor)
        context.fillStyle = clr;
        context.fillText("3", hexObj.x + (hex.width / 2) , hexObj.y + (hex.height / 2));

    }
}

hex.drawHexBorders = function() {

}
hex.draw = function() {
    hex.canvas.width = hex.canvas.width; //clear canvas
    hex.drawHexGrid(hex.rows, hex.cols);
}

hex.getRelativeCanvasOffset = function() {
    var x = 0,
        y = 0;
    var layoutElement = this.canvas;
    if (layoutElement.offsetParent) {
        do {
            x += layoutElement.offsetLeft;
            y += layoutElement.offsetTop;
        } while (layoutElement = layoutElement.offsetParent);
        return {
            x: x,
            y: y
        };
    }
}

hex.getSelectedTile = function(mouseX, mouseY) {
    var offSet = this.canvas.getBoundingClientRect();
    mouseX -= offSet.left;
    mouseY -= offSet.top;

    var column = Math.floor((mouseX) / this.side);
    var row = Math.floor(column % 2 == 0 ? Math.floor((mouseY) / this.height) : Math.floor(((mouseY + (this.height * 0.5)) / this.height)) - 1);

    //Test if on left side of frame            
    if (mouseX > (column * this.side) && mouseX < (column * this.side) + this.width - this.side) {
        //Now test which of the two triangles we are in 
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * this.side;
        p1.y = column % 2 == 0 ? row * this.height : (row * this.height) + (this.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (this.height / 2);

        var p3 = new Object();
        p3.x = p1.x + this.width - this.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (this.isPointInTriangle(mousePoint, p1, p2, p3)) {
            column--;
            if (column % 2 != 0) {
                row--;
            }
        }

        //Bottom left triangle points
        var p4 = new Object();
        p4 = p2;

        var p5 = new Object();
        p5.x = p4.x;
        p5.y = p4.y + (this.height / 2);

        var p6 = new Object();
        p6.x = p5.x + (this.width - this.side);
        p6.y = p5.y;

        if (this.isPointInTriangle(mousePoint, p4, p5, p6)) {
            column--;

            if (column % 2 == 0) {
                row++;
            }
        }
    }
    return {
        row: row,
        col: column
    };
}
hex.isPointInTriangle = function(pt, v1, v2, v3) {
    var b1, b2, b3;
    b1 = this.sign(pt, v1, v2) < 0.0;
    b2 = this.sign(pt, v2, v3) < 0.0;
    b3 = this.sign(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}
hex.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
hex.clickEvent = function(e) {
    var mouseX = e.pageX - window.pageXOffset;
    var mouseY = e.pageY - window.pageYOffset;
    var localX = mouseX - this.canvasOriginX;
    var localY = mouseY - this.canvasOriginY;
    var tile = this.getSelectedTile(localX, localY);
    if (GLOBALS.DEBUG == true) {
        console.log(this.hexes[tile.row][tile.col]);
    }
    if (tile.row < this.rows && tile.row >= 0 && tile.col < this.cols && tile.col >= 0) {
        this.hexes[tile.col][tile.row].h = this.hexes[tile.col][tile.row].h ? false : true;
        this.draw();
    } else {
        console.log("Click out of range");
    }
}
