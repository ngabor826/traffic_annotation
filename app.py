from core import process_user_input
from core import put_row_into_csv

from flask import Flask, render_template
from flask_socketio import SocketIO
from flask_socketio import emit

app = Flask(__name__)
app.debug = True
socketio = SocketIO(app)
csv_path = 'static/event_coords_data.csv'

@socketio.on('conn_event')
def handle_message(data):
    print('\t[ Recieved message:', data, ']')

@socketio.on('user_input')
def handle_user_input(text):
    print("\t[ Got data from clientside: " + text + " ]")
    d = process_user_input(text)
    
    print('\t[ Processed result:', d, ']')
    put_row_into_csv(csv_path, d)

    emit('redraw', {'q': 'q'})
    print('\t[ Sent redraw request to client ]')

@app.route('/')
def my_form():
    return render_template('map.html')
    
if __name__ == '__main__':
    socketio.run(app)