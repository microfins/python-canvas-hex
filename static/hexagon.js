hex.clearMap = function(){
    hex.hexes = [];
}
hex.rowcolToXY = function(row, col){
    var offsetColumn = (col % 2 == 0) ? false : true;
    if (!offsetColumn) {
        x = (col * hex.properties.side) + hex.base.canvasOriginX;
        y = (row * hex.properties.height) + hex.base.canvasOriginY;
    } else {
        x = col * hex.properties.side + hex.base.canvasOriginX;
        y = (row * hex.properties.height) + hex.base.canvasOriginY + (hex.properties.height * 0.5);
    }

    return {"x": x, "y": y}
}



hex.drawHexGrid = function(rows, cols) {
    hex.base.canvasOriginX = hex.base.canvas.getBoundingClientRect().left;
    hex.base.canvasOriginY = hex.base.canvas.getBoundingClientRect().top;
    //function handler() {if (!--count) start()}

    //Load images into memory for use
    hex.properties.terrain_images.forEach(function(url) {
      var img = new Image;
      //img.onload = handler;
      img.src = url.url;
    });

    //base grid
    for (var i = 0; i < cols; i++) {
        for (var j = 0; j < rows; j++) {
            hexObj = {
                    "x": hex.rowcolToXY(j, i).x,
                    "y": hex.rowcolToXY(j, i).y,
                    "fillColor": hex.hexes[i][j].tc,
                    "txt": hex.hexes[i][j].txt,
                    "ownc": hex.hexes[i][j].ownc,
                    "highlight": hex.hexes[i][j].h,
                }
                if (hex.hexes[i][j].t == "water"){
                    image_num = 0;
                }else{
                    image_num = 1;
                }
                hex.tiles.push(new Tile(hex.base.ctx, j, i, hex.properties.radius, hex.terrain_images[hex.hexes[i][j].t])); 
        }
    }

    function start(){
        hex.tiles.forEach(function(tile) { tile.render(hex.base.ctx) });
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

    var numberOfSides = 6,
    size = hex.properties.radius,
    Xcenter = hexObj.x + (hex.properties.width / 2),
    Ycenter = hexObj.y + (hex.properties.height / 2);

    var img = new Image();
    if (hexObj.t == "grassland"){
        img.src = "/static/grass.jpg";
    }else{
        img.src = "/static/mountain.jpg";
    }


    var pattern = context.createPattern(img, "repeat");
    context.fillStyle = pattern;
    context.beginPath();
    context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0)); 
    for (var i = 1; i <= numberOfSides;i += 1) {
        context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    context.fill();
    context.closePath();
    context.stroke();   

    if (hexObj.txt) {
        //Print number of units
        hex.top.ctx.textAlign="center"; 
        hex.top.ctx.textBaseline = "middle";
        hex.top.ctx.font = 'bold '+ (25/2.25) +'pt Arial';
        //Code for contrasting text with background color
        var clr = hex.getContrastYIQ(hexObj.fillColor); //contrast against land color (fillColor)
        hex.top.ctx.fillStyle = clr;
        hex.top.ctx.fillText("3", hexObj.x + (hex.properties.width / 2) , hexObj.y + (hex.properties.height / 2));
    }
}

hex.drawHexBorders = function(context, hexObj) {
    if (hexObj.highlight == true) {
        context.strokeStyle = "#00F2FF";
        context.lineWidth = 4;
    } else {
        context.strokeStyle = "#000";
        context.lineWidth = 2;
    }
    var numberOfSides = 6,
    size = hex.properties.radius,
    Xcenter = hexObj.x + (hex.properties.width / 2),
    Ycenter = hexObj.y + (hex.properties.height / 2);
    context.beginPath();
    context.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0)); 
    for (var i = 1; i <= numberOfSides;i += 1) {
        context.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    context.closePath();
    context.stroke();   
}
hex.draw = function() {
    hex.base.canvas.width = hex.base.canvas.width; //clear canvas
    hex.top.canvas.width = hex.top.canvas.width; //clear canvas
    hex.drawHexGrid(hex.properties.rows, hex.properties.cols);
}

hex.getRelativeCanvasOffset = function() {
    var x = 0,
        y = 0;
    var layoutElement = hex.base.canvas;
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
    var offSet = hex.base.canvas.getBoundingClientRect();
    mouseX -= offSet.left;
    mouseY -= offSet.top;

    var column = Math.floor((mouseX) / hex.properties.side);
    var row = Math.floor(column % 2 == 0 ? Math.floor((mouseY) / hex.properties.height) : Math.floor(((mouseY + (hex.properties.height * 0.5)) / hex.properties.height)) - 1);

    //Test if on left side of frame            
    if (mouseX > (column * hex.properties.side) && mouseX < (column * hex.properties.side) + hex.properties.width - hex.properties.side) {
        //Now test which of the two triangles we are in 
        //Top left triangle points
        var p1 = new Object();
        p1.x = column * hex.properties.side;
        p1.y = column % 2 == 0 ? row * hex.properties.height : (row * hex.properties.height) + (hex.properties.height / 2);

        var p2 = new Object();
        p2.x = p1.x;
        p2.y = p1.y + (hex.properties.height / 2);

        var p3 = new Object();
        p3.x = p1.x + hex.properties.width - hex.properties.side;
        p3.y = p1.y;

        var mousePoint = new Object();
        mousePoint.x = mouseX;
        mousePoint.y = mouseY;

        if (hex.isPointInTriangle(mousePoint, p1, p2, p3)) {
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
        p5.y = p4.y + (hex.properties.height / 2);

        var p6 = new Object();
        p6.x = p5.x + (hex.properties.width - hex.properties.side);
        p6.y = p5.y;

        if (hex.isPointInTriangle(mousePoint, p4, p5, p6)) {
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
    b1 = hex.sign(pt, v1, v2) < 0.0;
    b2 = hex.sign(pt, v2, v3) < 0.0;
    b3 = hex.sign(pt, v3, v1) < 0.0;
    return ((b1 == b2) && (b2 == b3));
}
hex.sign = function(p1, p2, p3) {
    return (p1.x - p3.x) * (p2.y - p3.y) - (p2.x - p3.x) * (p1.y - p3.y);
}
hex.clickEvent = function(e) {
    var mouseX = e.pageX - window.pageXOffset;
    var mouseY = e.pageY - window.pageYOffset;
    var localX = mouseX - hex.base.canvasOriginX;
    var localY = mouseY - hex.base.canvasOriginY;
    var tile = hex.getSelectedTile(localX, localY);
    if (GLOBALS.DEBUG == true) {
        console.log(hex.hexes[tile.row][tile.col]);
    }
    if (tile.row < hex.properties.rows && tile.row >= 0 && tile.col < hex.properties.cols && tile.col >= 0) {
        hex.hexes[tile.col][tile.row].h = hex.hexes[tile.col][tile.row].h ? false : true;
        hex.draw();
        //send click to server
        $.ajax({
            type: 'POST',
            url: '/update_properties',
            data: JSON.stringify(hex.properties),
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            success: function(response) {
                console.log(response);
                hex.properties = response;
            },
            error: function(error) {
                console.log(error);
            }
        });
    } else {
        console.log("Click out of range");
    }
}
hex.tintImage = function(context, img_path, hexObj){
    // create offscreen buffer, 
    buffer = document.createElement('canvas');
    if (typeof window.G_vmlCanvasManager!="undefined") { 
        G_vmlCanvasManager.initElement(buffer);
        var bx = buffer.getContext('2d');
    }else{
        var bx = buffer.getContext('2d');
    };

    fg = new Image();
    fg.src = img_path;
    buffer.width = this.width;
    buffer.height = this.height;

    // fill offscreen buffer with the tint color
    bx.fillStyle = hexObj.ownc;
    bx.fillRect(0,0,this.width,this.height);

    // destination atop makes a result with an alpha channel identical to fg, but with all pixels retaining their original color *as far as I can tell*
    bx.globalCompositeOperation = "destination-atop";
    bx.drawImage(fg,0,0);

    // to tint the image, draw it first
    x.drawImage(fg,0,0);

    //then set the global alpha to the amound that you want to tint it, and draw the buffer directly on top of it.
    x.globalAlpha = 0.5;
    x.drawImage(buffer,0,0);
    
}
