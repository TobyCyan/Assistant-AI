import os

os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import nltk
nltk.download('punkt')
from nltk.stem.lancaster import LancasterStemmer
stemmer = LancasterStemmer()

import tensorflow as tf
import tflearn as tfl
tf.compat.v1.disable_eager_execution()
import numpy as np
import random
import json
from flask import Flask, request, jsonify, render_template
from flask_cors import CORS

model_in_use = 'model.mei_v1'
model = None

file = open('behavior.json')
behavior_data = json.load(file)

app = Flask(__name__)
CORS(app)

with open("behavior.json") as file:
        data = json.load(file)


def tokenize_and_stem_string(string: str):
    '''
    Tokenizes the given string and stem it, excluding any punctuations in the tokenized string.
    Parameters
    ----------
    string: str
        The string to tokenize and stem.

    Returns
    -------
    The result list that includes the stemmed tokens of the tokenized string without any punctuations.
    '''
    punctuations = '.?!,'
    result = nltk.word_tokenize(string)
    result = [stemmer.stem(s.lower()) for s in result if s not in punctuations]
    return result


def stem_tokenized_list(list: list):
    '''
    Stems the already tokenized string, excluding any punctuations in the tokenized string.
    Parameters
    ----------
    list: list
        The tokenized string to stem.

    Returns
    -------
    The result list that includes the stemmed tokens of the tokenized string without any punctuations.
    '''
    punctuations = '.?!,'
    result = [stemmer.stem(s.lower()) for s in list if s not in punctuations]
    return result


def prepare_training_input_and_output():
    '''
    Prepares the training input and output data from the imported data file, tokenizing and stemming each pattern,
    and mapping them to the respective behavior types. A bag of 1s and 0s is also created for each tokenized patterns that
    with the size of the total number of words available across all the patterns. These bags are then used as the training data.
    The respective behavior types are also added into the output list with the same position index at the first level.

    Returns
    -------
    The training data and output data as 2D `ndarray`s to both be used to train the model. 
    The list that contains all the tokenized input words and behavior types are also returned.
    '''
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

    training = []
    output = []
    output_map = [0 for _ in range(len(behavior_types))]

    for index, tokenizedPattern in enumerate(tokenized_patterns):
        bag = []

        pattern = set(stem_tokenized_list(tokenizedPattern))

        for word in input_words:
            if word in pattern:
                bag.append(1)
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
    '''
    Trains the model of the given name with the training and output data as 2D `ndarray`s, then returns the model to be loaded.
    Parameters
    ----------
    model_name: str
        The model's name to be trained and returned.
    training_data: np.ndarray
        2D `ndarray` with each row representing the bag of 1s and 0s on whether certain tokenized words exist in the pattern.
    output_data: np.ndarray
        2D `ndarray` with each row representing a list of 1s and 0s with the size of all the available behavior types with a 1 at the
        position where the corresponding pattern's behavior type is located.

    Returns
    -------
    The loaded newly trained model.
    '''
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

    return model


def load_model(model_name: str, training_data, output_data):
    '''
    Returns the model to be loaded of the given name with the training and output data as 2D `ndarray`s.
    Parameters
    ----------
    model_name: str
        The model's name to be returned.
    training_data: np.ndarray
        2D `ndarray` with each row representing the bag of 1s and 0s on whether certain tokenized words exist in the pattern.
    output_data: np.ndarray
        2D `ndarray` with each row representing a list of 1s and 0s with the size of all the available behavior types with a 1 at the
        position where the corresponding pattern's behavior type is located.

    Returns
    -------
    The loaded model.
    '''
    input_size = len(training_data[0])
    output_size = len(output_data[0])
    network = tfl.input_data(shape=[None, input_size])
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, 8)
    network = tfl.fully_connected(network, output_size, activation='softmax')
    network = tfl.regression(network)
    model = tfl.DNN(network)

    try:
        model.load(f'./{model_name}')
        return model
    
    except Exception as e:
        print('Exception: ' + str(e))


def create_input_from_prompt(prompt, input_words):
    '''
    Creates the input to be fed into the model to obtain a response using the given user prompt.
    Parameters
    ----------
    prompt: str
        The user prompt to be converted into a bag of 1s and 0s 
        to be used as the input to obtain a response from the model.
    input_words: np.ndarray
        1D `ndarray` that contains all the tokenized words from the possible

    Returns
    -------
    The 2D `ndarray` with a single row which represents the bag of 1s and 0s depending on whether a word in the give prompt
    exists in the available input words.
    '''
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
    '''
    Predicts the behavior type of the given user prompt by converting it into an input readable by the specified model.
    Parameters
    ----------
    prompt: str
        The user prompt to be converted into a bag of 1s and 0s 
        to be used as the input to obtain a response from the model.
    model: DNN
        The model that consists of a deep neural network to fetch a response from.

    Returns
    -------
    The behavior type of the given prompt.
    Returns 'Unsure' if the predicted probability is below a certain threshold.
    '''
    n = len(input_words)
    prompt_input = create_input_from_prompt(prompt, input_words)
    
    output = model.predict(prompt_input)
    output_type_index = np.argmax(output[0])
    output_type_probability = output[0][output_type_index]

    output_type = behavior_types[output_type_index]
    if output_type_probability < 0.35:
        return 'Unsure'
    
    return output_type

@app.route('/startchat', methods=['POST'])
def start_chat():
    '''
    Starts the chat with the model, the desired model to be loaded and the required input to be fed into the model
    are sent here from the front-end via a post method. Once a behavior type has been predicted by the model, a random response
    is obtained and its behavior type are then sent back to the front-end to be displayed on screen.
    Returns
    -------
    A random response of the predicted behavior type and the behavior type itself which are sent back to the front-end.
    '''
    data = request.get_json()
    chatText = data['input']
    model_name = data['model']

    quit_prompt = ['q', 'bye', 'quit', 'leave', 'stop']

    if chatText.lower() in quit_prompt:
        return jsonify({'response': 'Goodbye!'})
    
    global model
    if not model:
        model = load_model(model_name, training, output)

    prompt_behavior_type = predict_behavior_type_from_prompt(chatText, model)

    if prompt_behavior_type == 'Unsure':
        return handle_unsure_behavior()
    
    index = behavior_types.index(prompt_behavior_type)
    behaviorTypeArr = behavior_data['behavior'][index]

    responseArr = behaviorTypeArr['response']
    rand = random.random()
    response = responseArr[int(rand * (len(responseArr) - 1))]
    
    return jsonify({'response': response, 'type': prompt_behavior_type})


unsure_response = ["I'm not quite sure about the answer.", 
                   "I don't understand, could you try asking something else?",
                   "Sorry I'm not picking up what you are trying to say..."
                   ]
def handle_unsure_behavior():
    '''
    Handles the case where the model predicts the highest behavior type probability to be below
    a certain threshold and the returned behavior type is 'Unsure'. In this case, a random response from
    the declared unsure_response list is returned instead.
    Returns
    -------
    A random response of the 'Unsure' behavior type with the behavior type itself.
    '''
    rand = random.random()
    response = unsure_response[int(rand * (len(unsure_response) - 1))]
    return jsonify({'response': response, 'type': 'Unsure'})


training, output, input_words, behavior_types = prepare_training_input_and_output()

def retrain():
    '''
    Retrains the current model in use.
    Only to be used in this environment.
    '''
    model = train_model_and_load(model_in_use, training, output)
    return None

if __name__ == "__main__":
    # retrain()
    app.run(debug=True, host='0.0.0.0', port=5000)







