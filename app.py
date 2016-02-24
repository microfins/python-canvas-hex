from flask import Flask, render_template, request, json, jsonify
from flask_json import FlaskJSON, JsonError, json_response, as_json
import redis, random, urllib2

app = Flask(__name__)
json = FlaskJSON(app)
r = redis.Redis("localhost")

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/save',methods=['POST'])
def save():
    if request.method == "POST":
        r.set("test", pickle.dumps(request.json))
        result = pickle.loads(r.get("test"))
        return jsonify(result)

@app.route('/createMap',methods=['POST'])
def createMap():
    data = request.get_json(force=True)
    cols = int(data['cols'])
    rows = int(data['rows'])
    height = int(data['height'])
    mapList = []
    mapProps = {}
    terrains = ['grassland', 'mountains', 'water', 'tundra']
    colors = {
        "tundra": "white",
        "grassland": "green",
        "water": "blue",
        "mountains": "brown"
    }
    for col in range(0, cols):
        mapList.append([])
        for row in range(0, rows):
            currentTerrain = random.choice(terrains)
            mapList[col].append({
                "h": False,
                "row": row,
                "col": col,
                "x": None,
                "y": None,
                "t": currentTerrain,
                "tc": colors[currentTerrain],
                "txt": str(col) + "," + str(row),
                "bor": {
                    "n": None,
                    "s": None,
                    "nw": None,
                    "sw": None,
                    "ne": None,
                    "se": None
                },
                "own": None,
                "u": None,
            })

    return json_response(map=mapList, props=mapProps)

if __name__ == "__main__":
    app.run(debug=True)