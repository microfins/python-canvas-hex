var GLOBALS = {
    "DEBUG": true,
    "gameState": "new",
    "gameID": 1,
};


var hex = {
    "properties": {},
    "tiles": []
};
hex.init = function(props, map, reload) {
    console.log("Initializing new game...");
    //Set all passed properties to hex object
    for (var k in props){
        if (props.hasOwnProperty(k)) {
             hex.properties[k] = props[k];
        }
    }
    hex.canvas_layers = [
    'base',
    'top'
    ]
    for (var i = 0; i < hex.canvas_layers.length; i++){
        hex[hex.canvas_layers[i]] = {};
        hex[hex.canvas_layers[i]].canvas = document.getElementById(hex.canvas_layers[i]);
        hex[hex.canvas_layers[i]].canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
        hex[hex.canvas_layers[i]].ctx = null;
        hex[hex.canvas_layers[i]].canvas.width  = hex[hex.canvas_layers[i]].canvas.offsetWidth;
        hex[hex.canvas_layers[i]].canvas.height = hex[hex.canvas_layers[i]].canvas.offsetHeight;
        hex[hex.canvas_layers[i]].canvas.width  = hex[hex.canvas_layers[i]].canvas.offsetWidth;
        hex[hex.canvas_layers[i]].canvas.height = hex[hex.canvas_layers[i]].canvas.offsetHeight;
        hex[hex.canvas_layers[i]].ctx = hex[hex.canvas_layers[i]].canvas.getContext('2d');
    }
    this.log = [];
    /*
    if (reload == false){
        this.canvas = document.getElementById("baseLayer");
        this.layer2.canvas = document.getElementById("layer2");         
        this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
        hex.layer2.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
    }
*/
    document.getElementById('top').onmousedown = function(){
        return false;
    };
    this.hexes = map;


    
    /*
    Set Size of main div to size of canvas
    $('#primary-panel').css('height', (hex.height * hex.rows)+hex.height*2);
    hex.canvas.style.width='100%';
    hex.canvas.style.height='100%';
    */

    //Draw base grid, then draw overlaid items on top
    hex.drawHexGrid(hex.properties.rows, hex.properties.cols);
}

hex.saveData = function(param, map) {
    if (param == "saveAll"){
        var save = {
            param: "saveAll",
            data: JSON.stringify(map)
        };
        $.ajax({
            type: "POST",
            url: "save.php",
            data: save,
            dataType: 'JSON',
            success: function(data) {
                if(data == "Success"){
                    console.log("Connected to db.");
                }
            }
        })
    }
} 

hex.startTurn = function() {

}
hex.endTurn = function() {

}
hex.singleAttack = function() {

}
hex.continuousAttack = function() {

}
hex.fortifyUnits = function(){

}
hex.transferUnits = function() {

}
//Initial Map Creation
$.ajax({
    type: 'POST',
    url: '/createMap',
    contentType: "application/json; charset=utf-8",
    success: function(response) {
        hex.init(response.props, response.map, false);
    },
    error: function(error) {
        console.log(error);
    }
});