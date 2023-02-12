from flask import Flask, render_template, url_for, jsonify, request
app = Flask(__name__)

from pymongo import MongoClient
client = MongoClient('localhost', 27017)
db = client.dbsonagi

@app.route('/')
def home():
   return render_template('home.html')

@app.route('/sound')
def sound_studio():
   return render_template('sound_studio.html')

@app.route('/virtual')
def virtual_studio():
   return render_template('virtual_studio.html')

@app.route('/filmography')
def flimography():
   return render_template('filmography.html')

@app.route('/contact')
def contact():
   return render_template('contact.html')

@app.route('/message', methods=['POST'])
def get_message():
    name_receive = request.form['name_give']
    phone_receive = request.form['phone_give']
    email_receive = request.form['email_give']
    studio_receive = request.form['studio_give']
    produce_receive = request.form['produce_give']
    message_receive = request.form['message_give']

    doc = {
        'name':name_receive,
        'phone':phone_receive,
        'email':email_receive,
        'studio':studio_receive,
        'produce':produce_receive,
        'message':message_receive
    }

    db.clients.insert_one(doc)

    return jsonify({'msg': '전송되었습니다.'})

if __name__ == '__main__':
   app.run('0.0.0.0',port=5000,debug=True)