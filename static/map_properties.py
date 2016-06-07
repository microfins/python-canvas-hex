import math
import random

def get_game_props(radius):
    gameProps = {
        'rows': 10,
        'cols': 10,
        'radius': radius,
        'height': round(math.sqrt(3) * radius),
        'width': round(2 * radius),
        'side': round((3.0 / 2.0) * radius),
        'players': [{'name': 'bo_knows', 'color': 'blue'},
                    {'name': 'jwhiletwo', 'color': 'green'},
                    {'name': 'spencer', 'color': 'yellow'}],
        'turn': {
            'player': None,
            'phase': None
        },
        'clickState': None,
        'neighbors': [],
        'loggedIn': {
            'username': 'bo_knows',
            'email': 'lawrence.boland@gmail.com',
        },
        'unitCnt': 0,
        'unitsToBePlaced': 0,
        'fortifies': {
            'used': 0,
            'remaining': 0
        },
        'attacking': {
            'attX': None,
            'attY': None,
            'defX': None,
            'defY': None
        },
        'selected': {
            'col': None,
            'row': None
        },
        'cards': {
            'held': {},
            'remaining': {}
        }
    }
    return gameProps

def get_tile_props(row, col):
    terrains = ['grassland', 'water', 'mountains']
    terrainColor = {'grassland': 'green', 'water': 'blue', 'mountains': 'brown'}
    players = [{'name': 'bo_knows', 'color': 'pink'},
            {'name': 'jwhiletwo', 'color': 'red'},
            {'name': 'spencer', 'color': 'yellow'}]
    currentTerrain = random.choice(terrains)
    currentPlayer = random.choice(players)
    tile = {
        "h": False,
        "row": row,
        "col": col,
        "x": None,
        "y": None,
        "t": currentTerrain,
        "tc": terrainColor[str(currentTerrain)],
        "txt": str(col) + "," + str(row),
        "bor": {
            "n": None,
            "s": None,
            "nw": None,
            "sw": None,
            "ne": None,
            "se": None
        },
        "own": currentPlayer['name'],
        "ownc": currentPlayer['color'],
        "u": None,
    }
    return tile
