from __future__ import division
from flask import Flask, render_template, request, json, jsonify
from flask_json import FlaskJSON, json_response
import redis
from static.map_properties import get_game_props, get_tile_props
from utils.utils import save_map, save_properties

app = Flask(__name__)
jsonApp = FlaskJSON(app)
r = redis.Redis("localhost")

@app.route('/static/<path:path>')
def send_static(path):
    return send_from_directory('static', path)

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/load', methods=['POST'])
def load():
    # gid represents gameID
    gid = 1234
    return json.loads(r.get(gid))

@app.route('/update_one_tile', methods=['POST'])
def update_one_tile():
    hex = request.json
    # return jsonify({"response": json.dumps(request.json)})
    return jsonify(hex)

@app.route('/update_all_tiles', methods=['POST'])
def update_all_tiles():
    hex = request.json
    # return jsonify({"response": json.dumps(request.json)})
    return jsonify(hex)

@app.route('/update_properties', methods=['POST'])
def update_properties():
    hex = request.json
    map_id = "map:" + hex['map_id']
    hex['units_to_be_placed'] += 1
    save_properties(hex, map_id)
    # return jsonify({"response": json.dumps(request.json)})
    return jsonify(hex)

@app.route('/createMap', methods=['POST'])
def createMap():
    '''
    data = request.get_json(force=True)
    cols = int(data['cols'])
    rows = int(data['rows'])
    height = int(data['height'])
    '''
    properties = get_game_props(25)  # parameter is hexagon radius
    mapList = [[0 for x in range(properties['cols'])] for y in range(properties['rows'])]
    for col in range(0, properties['cols']):
        for row in range(0, properties['rows']):
            mapList[col][row] = get_tile_props(row, col)

    # save map_id to redis
    last_map_id = r.lindex("map_ids", 0)
    if last_map_id is not None:
        next_map_id = int(last_map_id) + 1
    else:
        next_map_id = 1
    r.lpush("map_ids", next_map_id)
    properties['map_id'] = next_map_id

    # save map data to redis
    map_id = "map:" + str(next_map_id)
    save_map(mapList, map_id)
    save_properties(properties, map_id)

    return json_response(map=mapList, props=properties)

@app.route('/authAction', methods=['POST'])
def authAction():
    # Check if map props coming in is equal to server (thus unaltered) and then perform action
    pass

if __name__ == "__main__":
    app.run(debug=True)
