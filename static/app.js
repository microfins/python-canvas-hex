var GLOBALS = {
    "DEBUG": true,
    "gameState": "new",
    "gameID": 1,
};


var hex = {};
hex.init = function(props, map, reload) {
    console.log("Initializing new game...");
    //Set all passed properties to hex object
    for (var k in props){
        if (props.hasOwnProperty(k)) {
             hex[k] = props[k];
        }
    }
    this.gameProps = {};
    this.log = [];
    if (reload == false){
        this.canvas = document.getElementById("HexCanvas");
        this.canvas.addEventListener("mousedown", this.clickEvent.bind(this), false);
    }
    this.ctx = null;
    this.canvas.width  = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
    this.hexes = map;
    this.ctx = this.canvas.getContext('2d');
    
    /*
    Set Size of main div to size of canvas
    $('#primary-panel').css('height', (hex.height * hex.rows)+hex.height*2);
    hex.canvas.style.width='100%';
    hex.canvas.style.height='100%';
    */

    //Draw base grid, then draw overlaid items on top
    this.drawHexGrid(this.rows, this.cols);
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