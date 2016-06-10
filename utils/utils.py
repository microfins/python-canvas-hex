import redis
import math
from flask import json, jsonify


r = redis.Redis("localhost")

def save_tile(map_id, map_tile):
    r.hmset(map_id, get_redis_rowcol_name(map_tile['row'], map_tile['col']), json.dumps(map_tile))
    resp = jsonify({"message": "saved"})
    resp.status_code = 201
    return resp

def save_map(map_array, map_id):
    pipe = r.pipeline()
    for col in range(0, len(map_array)):
        for row in range(0, len(map_array[col])):
            pipe.hset(map_id, get_redis_rowcol_name(map_array[col][row]['row'], map_array[col][row]['col']), json.dumps(map_array[col][row]))
    pipe.execute()
    resp = jsonify({"message": "saved"})
    resp.status_code = 201
    return resp

def get_redis_rowcol_name(row, col):
    return "row:" + str(row) + ":" + "col:" + str(col)

def calc_placeable_units(map_array, username):
    units = 0
    for col in range(0, len(map_array)):
        for row in range(0, len(map_array[col])):
            if map_array[col][row].owner == username:
                units += 1
    return int(math.floor(units/3))