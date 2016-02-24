from flask import Flask, render_template, request, jsonify
import redis

app = Flask(__name__)
r = redis.Redis("localhost")

@app.route("/")
def main():
    return render_template('index.html')

@app.route('/save',methods=['POST'])
def save():
    if request.method == "POST":
        r.set("test", request.json)
        result = eval(r.get("test"))
        return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)