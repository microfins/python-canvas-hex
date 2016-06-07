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
            hex.drawHex(hex.rowcolToXY(j, i).x, hex.rowcolToXY(j, i).y, hex.hexes[i][j].tc, hex.hexes[i][j].txt, hex.hexes[i][j].ownc, false);
        }
    }

    //overlay items
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            if (hex.hexes[i][j].h == true) {
                hex.drawHex(hex.rowcolToXY(j, i).x, hex.rowcolToXY(j, i).y, hex.hexes[i][j].tc, hex.hexes[i][j].txt, hex.hexes[i][j].ownc, true);                }
        }
    }
}
hex.drawHex = function(x0, y0, fillColor, hexText, hextTextColor, highlight) {
    if (highlight == true) {
        hex.ctx.strokeStyle = "#00F2FF";
        hex.ctx.lineWidth = 4;
    } else {
        hex.ctx.strokeStyle = "#000";
        hex.ctx.lineWidth = 2;
    }

    hex.ctx.beginPath();
    hex.ctx.moveTo(x0 + hex.width - hex.side, y0);
    hex.ctx.lineTo(x0 + hex.side, y0);
    hex.ctx.lineTo(x0 + hex.width, y0 + (hex.height / 2));
    hex.ctx.lineTo(x0 + hex.side, y0 + hex.height);
    hex.ctx.lineTo(x0 + hex.width - hex.side, y0 + hex.height);
    hex.ctx.lineTo(x0, y0 + (hex.height / 2));
    if (highlight == true) {}
    if (fillColor && highlight == false) {
        hex.ctx.fillStyle = fillColor;
        hex.ctx.fill();
    }
    hex.ctx.closePath();
    hex.ctx.stroke();


    //Draw Circle
    hex.ctx.beginPath();
    hex.ctx.arc(x0 + (hex.width/2), y0 + (hex.height/2), (hex.height/4), 0, 2 * Math.PI, false);
    hex.ctx.fillStyle = hextTextColor;
    hex.ctx.fill();
    hex.ctx.stroke();

    //hex.ctx.lineWidth = 1;
    //hex.ctx.strokeStyle = '#000000';
    if (hexText) {
        //Print number of units
        hex.ctx.textAlign="center"; 
        hex.ctx.textBaseline = "middle";
        hex.ctx.font = 'bold '+ (25/2.25) +'pt Arial';
        //Code for contrasting text with background color
        /*var clr = getContrastYIQ(map.dataUnits[tile.row][tile.column].color); //contrast against player color 
        var clr = getContrastYIQ(fillColor); //contrast against land color (fillColor)
        hex.ctx.fillStyle = clr;
        */
        hex.ctx.fillStyle = "#000000";
        hex.ctx.fillText("3", x0 + (hex.width / 2) , y0 + (hex.height / 2));

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
