import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import openai
from secret import OPEN_AI_KEY

client = OpenAI(api_key=OPEN_AI_KEY)

app = Flask(__name__)
CORS(app)
# assistant = client.beta.assistants.create(
#   name="Math Tutor",
#   instructions="You are a personal math tutor. Write and run code to answer math questions.",
#   tools=[{"type": "code_interpreter"}],
#   model="gpt-4o",
#     assistant_id = k""
# )

THREAD = client.beta.threads.create()
CUSTOMER_SUPPORT_ID = "asst_tNzygYXafJFqQJATdQYoEefQ"
PRODUCT_INFO_ID = "asst_Tsjwb1LlBD3ElVP6Jbzsa6JY"


@app.route("/get-response", methods=["POST"])
def get_response(usr_msg):
    indata = request.json.get("input", "")

    if not indata:
        return "No message recieved"

    assistant_to_use = determine_assistant(usr_msg)
    response = customer_question(assistant_to_use)
    url = ""
    if assistant_to_use == PRODUCT_INFO_ID:
        url = generate_img("Genearate an image based about shoes")

    return jsonify({"response": response, "url": url})


def determine_assistant(msg: str):
    response = client.chat.completions.create(
        model="gpt-4",
        messages=[
            {
                "role": "user",
                "content": f"""
You are an AI assistant router. Based on the user's message, choose the correct assistant to handle the request:

- "refunds" → if the message is about returns, cancellations, or getting money back.
- "product_info" → if the message is about product details, availability, or specifications.

Respond only with one of: "refunds" or "product_info".

Message: "{msg}"
""",
            }
        ],
        tool_choice="auto",
        tools=[
            {
                "type": "function",
                "function": {
                    "name": "route_assistant",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "assistant": {
                                "type": "string",
                                "enum": ["refunds", "product_info"],
                            }
                        },
                        "required": ["assistant"],
                    },
                },
            }
        ],
    )

    args = response.choices[0].message.tool_calls[0].function.arguments
    return json.loads(args)["assistant"]


def generate_img(prompt: str):
    a = client.images.generate(model="dall-e-3", prompt=prompt, n=1, size="256x256")
    return a.data[0].url


if __name__ == "__main__":
    msg = "I'm not happy with my shoes, give me refund"
    # msg = "I'm not happy with my shoes, give me refund"
    # print(determine_assistant(msg))
    # exit(0)
    # get_response("I'm not happy with my shoes, give me refund")
    app.run(port="3002", debug=True)
