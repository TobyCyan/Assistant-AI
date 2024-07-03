import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import nltk
# nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

import tensorflow as tf
import tflearn as tfl
tf.compat.v1.disable_eager_execution()
import numpy as np
import random
import json
import pickle
from flask import Flask, request, jsonify, render_template, url_for
from flask_cors import CORS


file = open('behavior.json')
behavior_data = json.load(file)

app = Flask(__name__)
CORS(app)

@app.route('/')
def home():
    return render_template('index.html')

with open("behavior.json") as file:
        data = json.load(file)


@app.route('/api/get_medium_script')
def get_medium_script():
    script = url_for('static', filename='js/medium.js', _external=True)
    return jsonify({'script': script})


def tokenize_and_stem_string(string: str):
    punctuations = '.?!,'
    result = nltk.word_tokenize(string)
    result = [stemmer.stem(s.lower()) for s in result if s not in punctuations]
    return result


def stem_tokenized_list(list: list):
    punctuations = '.?!,'
    result = [stemmer.stem(s.lower()) for s in list if s not in punctuations]
    return result


def prepare_training_input_and_output():
    input_words = []
    behavior_types = []
    tokenized_patterns = []
    patterns_type_map = []

    for behavior in data['behavior']:
        for pattern in behavior['pattern']:
            words = nltk.word_tokenize(pattern)
            input_words.extend(words)
            tokenized_patterns.append(words)
            patterns_type_map.append(behavior['type'])

        if behavior['type'] not in behavior_types:
            behavior_types.append(behavior['type'])

    input_words = stem_tokenized_list(input_words)
    input_words = sorted(list(set(input_words)))

    print('inputWords: ' + str(input_words))

    training = []
    output = []
    output_map = [0 for _ in range(len(behavior_types))]

    for index, tokenizedPattern in enumerate(tokenized_patterns):
        bag = []

        pattern = set(stem_tokenized_list(tokenizedPattern))

        print('pattern: ' + str(pattern))
        for word in input_words:
            if word in pattern:
                bag.append(1)
                print(word)
            else:
                bag.append(0)
        
        pattern_type = patterns_type_map[index]
        output_behavior_type_index = behavior_types.index(pattern_type)

        output_temp = output_map[:]
        output_temp[output_behavior_type_index] = 1
        output.append(output_temp)

        training.append(bag)


    training = np.array(training)
    output = np.array(output)

    return training, output, input_words, behavior_types



def train_model_and_load(model_name: str, training_data, output_data):
    input_size = len(training_data[0])
    output_size = len(output_data[0])
    network = tfl.input_data(shape=[None, input_size])
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, output_size, activation='softmax')
    network = tfl.regression(network)

    model = tfl.DNN(network=network)
    model.fit(training_data, output_data, n_epoch=1000, batch_size=0, show_metric=True)
    model.save(model_name)
    model.load(model_name)
    return model


def load_model(model_name: str, training_data, output_data):
    input_size = len(training_data[0])
    output_size = len(output_data[0])
    network = tfl.input_data(shape=[None, input_size])
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, output_size, activation='softmax')
    network = tfl.regression(network)

    model = tfl.DNN(network=network)

    try:
        model.load(model_file=model_name)
        print('Model Loaded: ' + model_name)
        return model
    
    except Exception as e:
        print('Exception: ' + str(e))


def create_input_from_prompt(prompt, input_words):
    n = len(input_words)
    tokenized_prompt = tokenize_and_stem_string(prompt)

    input_map = [0 for _ in range(n)]

    for word in tokenized_prompt:
        if word in input_words:
            index = input_words.index(word)
            input_map[index] = 1
    input = []
    input.append(input_map)

    return np.array(input)


def predict_behavior_type_from_prompt(prompt, model):
    prompt_input = create_input_from_prompt(prompt, input_words)
    
    output = model.predict(prompt_input)
    output_type_index = np.argmax(output[0])
    
    return behavior_types[output_type_index]

@app.route('/startchat', methods=['POST'])
def start_chat():
    data = request.get_json()
    print(data)
    chatText = data['input']
    model_name = data['model']

    quit_prompt = ['q', 'bye', 'quit', 'leave', 'stop']

    if chatText.lower() in quit_prompt:
        return jsonify({'response': 'Goodbye!'})
    
    model = load_model(model_name, training, output)
    prompt_behavior_type = predict_behavior_type_from_prompt(chatText, model)

    index = behavior_types.index(prompt_behavior_type)
    behaviorTypeArr = behavior_data['behavior'][index]

    responseArr = behaviorTypeArr['response']
    rand = random.random()
    response = responseArr[int(rand * (len(responseArr) - 1))]

    if prompt_behavior_type == 'Weather':
        return jsonify({'response': response, 'code_name': 'Weather', 'type': prompt_behavior_type})
    
    return jsonify({'response': response, 'type': prompt_behavior_type})
    
training, output, input_words, behavior_types = prepare_training_input_and_output()

@app.route('/retrain')
def retrain():
    model = train_model_and_load('model.tflearn', training, output)
    return jsonify({'message': 'Retrain Successful!'}), 200

@app.route('/behaviorarray')
def behavior_array():
    file = open('behavior.json')
    behavior_data = json.load(file)

    return jsonify({'dataArray': behavior_data})


if __name__ == "__main__":
    app.run(debug=True, port=5500)









