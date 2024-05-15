import time
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from Astra_AI import AstraAI

app = Flask(__name__)
CORS(app)

@app.route('/', methods=["GET", "POST"])
def home():
    try:
        if request.method == "GET":
            return render_template('index.html')

        if request.method == "POST":
            AI = AstraAI()
            reqObjects = request.get_json()
            text = reqObjects['message']

            print(text)

            start = time.time()
            response = AI.process_query_text(text)
            end = time.time()

            print(response)

            print("The time", end - start)

            response=response + "" "<br><br> The time: " + str(end - start)

            return jsonify({'response': response})
    except Exception as e:
        return render_template('index.html')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port="80")
