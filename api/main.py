from flask import Flask, request

app = Flask(__name__)


@app.route("/get-response", methods=["POST"])
def get_response():
    indata = request.json.get("message", "")
    response = handle_message(indata)
    return response


def handle_message(msg):
    # Placeholder logic
    end = "Hello! :D"
    return f"Response to: {msg} \n" + end


if __name__ == "__main__":
    app.run(port="3002", debug=True)
