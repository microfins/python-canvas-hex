function Tile(ctx, row, col, radius, img) {
    this.pattern = ctx.createPattern(img, "repeat");
    row_col = hex.rowcolToXY(row, col)
    this.x = row_col.x;
    this.y = row_col.y;
    this.radius = radius;
}

Tile.prototype.render = function(ctx) {
	this.Xcenter = this.x + (hex.properties.width / 2),
    this.Ycenter = this.y + (hex.properties.height / 2);
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 2;

    ctx.beginPath();
    ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0)); 
    for (var i = 1; i <= numberOfSides;i += 1) {
        ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    ctx.fill();
    ctx.closePath();
    ctx.stroke();   
}