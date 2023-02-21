from flask import Flask, render_template, session, url_for, redirect, jsonify, request, flash
from datetime import datetime
import werkzeug
import os
import hashlib

app = Flask(__name__)
app.config['SECRET_KEY'] = "thskrl2022!@#sonagi"

from pymongo import MongoClient

client = MongoClient('mongodb://sonagi:sonagi@localhost', 27017)
# client = MongoClient('localhost', 27017)
db = client.dbsonagi

# 메인 페이지
@app.route('/')
def home():
    return render_template('home.html')

# 사운드웍스 페이지
@app.route('/sound')
def sound_studio():
    return render_template('sound_studio.html')

# 버추얼스튜디오 페이지
@app.route('/virtual')
def virtual_studio():
    return render_template('virtual_studio.html')

# 필모그래피 페이지
@app.route('/filmography')
def filmography():
    return render_template('filmography.html')

# 필모그래피 관리자 페이지
@app.route('/filmography_admin')
def filmography_admin():
    if "userID" in session:
        return render_template("filmography_admin.html", login=True)
    else:
        return render_template("filmography_admin.html", login=False)

# 필모그래피 관리자 상세페이지
@app.route('/filmography_admin/<idx>')
def filmography_detail(idx):
    if "userID" in session:
        if db.filmography.find_one({'movie_num': idx}):
            movie_data = db.filmography.find_one({'movie_num': idx})

            doc = {
                "movie_num": movie_data.get("movie_num"),
                "movie_title": movie_data.get("movie_title"),
                "movie_img": movie_data.get("movie_img"),
                "movie_url": movie_data.get("movie_url")
            }
            return render_template("filmography_admin_detail.html", doc=doc, login=True)
        else:
            return render_template("filmography_admin.html", login=True)
    else:
        return render_template("filmography_admin.html", login=False)

# 필모그래피 API 생성
@app.route('/filmography_server', methods=['POST'])
def get_movie():
    movie_num_receive = request.form['movie_num_give']
    movie_title_receive = request.form['movie_title_give']
    movie_img_receive = request.form['movie_img_give']
    movie_url_receive = request.form['movie_url_give']

    doc = {
        'movie_num': movie_num_receive,
        'movie_title': movie_title_receive,
        'movie_img': movie_img_receive,
        'movie_url': movie_url_receive
    }

    db.filmography.insert_one(doc)

    return jsonify({'msg': '영화가 등록되었습니다.'})

# 필모그래피 API 읽기
@app.route('/filmography_server', methods=['GET'])
def read_movie():
    films = list(db.filmography.find({}, {'_id': False}))
    return jsonify({'all_films': films})

# 필모그래피 API 수정
@app.route('/filmography_server/update', methods=['POST'])
def update_movie():
    movie_num_receive = request.form['movie_num_give']
    movie_title_receive = request.form['movie_title_give']
    movie_img_receive = request.form['movie_img_give']
    movie_url_receive = request.form['movie_url_give']

    doc = [
        {'$set': {'movie_title': movie_title_receive}},
        {'$set': {'movie_img': movie_img_receive}},
        {'$set': {'movie_url': movie_url_receive}}
    ]

    db.filmography.update_one({'movie_num': movie_num_receive}, doc)

    return jsonify({'msg': '영화가 등록되었습니다.'})

# 필모그래피 API 삭제
@app.route('/filmography_server/delete', methods=['POST'])
def delete_movie():
    movie_delete_receive = request.form['movie_delete_give']
    db.filmography.delete_one({'movie_num': movie_delete_receive})
    return jsonify({'msg': '영화가 삭제되었습니다.'})

# 예약 페이지
@app.route('/contact')
def contact():
    return render_template('contact.html')

# 예약 관리자 페이지
@app.route('/contact_admin')
def reservation_admin():
    if "userID" in session:
        return render_template("contact_admin.html", login=True)
    else:
        return render_template("contact_admin.html", login=False)

# 예약 API 생성
@app.route('/message', methods=['POST'])
def get_message():
    num_receive = request.form['num_give']
    name_receive = request.form['name_give']
    phone_receive = request.form['phone_give']
    email_receive = request.form['email_give']
    date_receive = request.form['date_give']
    start_receive = request.form['start_give']
    end_receive = request.form['end_give']
    usage_receive = request.form['usage_give']
    produce_receive = request.form['produce_give']
    confirm_receive = request.form['confirm_give']

    doc = {
        'num': num_receive,
        'name': name_receive,
        'phone': phone_receive,
        'email': email_receive,
        'date': date_receive,
        'start_time': start_receive,
        'end_time': end_receive,
        'usage_time': usage_receive,
        'produce': produce_receive,
        'confirm': confirm_receive,
    }

    db.clients.insert_one(doc)

    return jsonify({'msg': '신청이 완료되었습니다.'})

# 예약 API 읽기
@app.route('/message', methods=['GET'])
def read_message():
    messages = list(db.clients.find({}, {'_id': False}))
    return jsonify({'all_messages': messages})

# 예약 API 승인
@app.route('/message/confirm', methods=['POST'])
def confirm_message():
    delete_receive = request.form['delete_give']
    confirm_target = db.clients.find_one({'num': delete_receive})
    confirm_status = confirm_target['confirm']

    if 'UNCONFIRMED' in confirm_status:
        confirm_status = 'CONFIRMED'
        db.clients.update_one({'num': delete_receive}, {'$set': {'confirm': confirm_status}})
        return jsonify({'msg': '메세지가 승인되었습니다.'})
    else:
        confirm_status = 'UNCONFIRMED'
        db.clients.update_one({'num': delete_receive}, {'$set': {'confirm': confirm_status}})
        return jsonify({'msg': '메세지 승인이 취소되었습니다.'})

# 예약 API 삭제
@app.route('/message/delete', methods=['POST'])
def delete_message():
    delete_receive = request.form['delete_give']
    db.clients.delete_one({'num': delete_receive})
    return jsonify({'msg': '메세지가 삭제되었습니다.'})

# 3D 샘플 페이지
@app.route('/sample')
def sample():
    return render_template('sample.html')

# 3D 샘플 상세페이지
@app.route('/sample/<idx>')
def sample_detail(idx):
    if db.sample.find_one({'sample_num': idx}):
        sample_data = db.sample.find_one({'sample_num': idx})

        doc = {
            "sample_num": sample_data.get("sample_num"),
            "sample_title": sample_data.get("sample_title"),
            "sample_icvfx": sample_data.get("sample_icvfx"),
            "sample_img1": sample_data.get("sample_img1"),
            "sample_img2": sample_data.get("sample_img2"),
            "sample_img3": sample_data.get("sample_img3"),
            "sample_img4": sample_data.get("sample_img4"),
            "sample_movie": sample_data.get("sample_movie"),
            "sample_info": sample_data.get("sample_info")
        }
        return render_template("sample_detail.html", doc=doc)
    else:
        return redirect('/sample')

# 3D 샘플 관리자 페이지
@app.route('/sample_admin')
def sample_admin():
    if "userID" in session:
        return render_template("sample_admin.html", login=True)
    else:
        return render_template("sample_admin.html", login=False)

# 3D 샘플 관리자 상세페이지
@app.route('/sample_admin/<idx>')
def sample_admin_detail(idx):
    if "userID" in session:
        if db.sample.find_one({'sample_num': idx}):
            sample_data = db.sample.find_one({'sample_num': idx})

            doc = {
                "sample_num": sample_data.get("sample_num"),
                "sample_title": sample_data.get("sample_title"),
                "sample_icvfx": sample_data.get("sample_icvfx"),
                "sample_img1": sample_data.get("sample_img1"),
                "sample_img2": sample_data.get("sample_img2"),
                "sample_img3": sample_data.get("sample_img3"),
                "sample_img4": sample_data.get("sample_img4"),
                "sample_movie": sample_data.get("sample_movie"),
                "sample_info": sample_data.get("sample_info")
            }
            return render_template("sample_admin_detail.html", doc=doc, login=True)
        else:
            return render_template("sample_admin.html", login=True)
    else:
        return render_template("sample_admin.html", login=False)

# 3D 샘플 API 생성
@app.route('/sample_server', methods=['POST'])
def get_sample():
    sample_num_receive = request.form['sample_num_give']
    sample_title_receive = request.form['sample_title_give']
    sample_icvfx_receive = request.form['sample_icvfx_give']
    sample_movie_receive = request.form['sample_movie_give'].split('?v=')[-1].split('&t=')[0]
    sample_info_receive = request.form['sample_info_give']

    sample_img1 = request.files['sample_img1_give']
    sample_extension1 = sample_img1.filename.split('.')[-1]
    today = datetime.now()
    sample_time = today.strftime('%Y%m%d%H%M%S')
    sample_file1 = f'{sample_time}_sample_img1'
    sample_save1 = f'static/sample/{sample_file1}.{sample_extension1}'
    sample_img1.save(sample_save1)

    doc = {
        'sample_num': sample_num_receive,
        'sample_title': sample_title_receive,
        'sample_icvfx': sample_icvfx_receive,
        'sample_movie': sample_movie_receive,
        'sample_info': sample_info_receive,
        'sample_img1': f'{sample_file1}.{sample_extension1}'
    }

    try:
        sample_img2 = request.files['sample_img2_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        sample_extension2 = sample_img2.filename.split('.')[-1]
        sample_file2 = f'{sample_time}_sample_img2'
        sample_save2 = f'static/sample/{sample_file2}.{sample_extension2}'
        sample_img2.save(sample_save2)
        doc['sample_img2'] = f'{sample_file2}.{sample_extension2}'

    try:
        sample_img3 = request.files['sample_img3_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        sample_extension3 = sample_img3.filename.split('.')[-1]
        sample_file3 = f'{sample_time}_sample_img3'
        sample_save3 = f'static/sample/{sample_file3}.{sample_extension3}'
        sample_img3.save(sample_save3)
        doc['sample_img3'] = f'{sample_file3}.{sample_extension3}'

    try:
        sample_img4 = request.files['sample_img4_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        sample_extension4 = sample_img4.filename.split('.')[-1]
        sample_file4 = f'{sample_time}_sample_img4'
        sample_save4 = f'static/sample/{sample_file4}.{sample_extension4}'
        sample_img4.save(sample_save4)
        doc['sample_img4'] = f'{sample_file4}.{sample_extension4}'

    db.sample.insert_one(doc)

    return jsonify({'msg': '샘플이 등록되었습니다.'})

# 3D 샘플 API 읽기
@app.route('/sample_server', methods=['GET'])
def read_sample():
    samples = list(db.sample.find({}, {'_id': False}))
    return jsonify({'all_samples': samples})

# 3D 샘플 API 수정
@app.route('/sample_server/update', methods=['POST'])
def update_sample():
    sample_num_receive = request.form['sample_num_give']
    sample_title_receive = request.form['sample_title_give']
    sample_icvfx_receive = request.form['sample_icvfx_give']
    sample_movie_receive = request.form['sample_movie_give'].split('?v=')[-1].split('&t=')[0]
    sample_info_receive = request.form['sample_info_give']

    sample_num_target = db.sample.find_one({'sample_num': sample_num_receive})

    today = datetime.now()
    sample_time = today.strftime('%Y%m%d%H%M%S')

    doc = [
        {'$set': {'sample_title': sample_title_receive}},
        {'$set': {'sample_icvfx': sample_icvfx_receive}},
        {'$set': {'sample_movie': sample_movie_receive}},
        {'$set': {'sample_info': sample_info_receive}},
    ]

    try:
        sample_img1 = request.files['sample_img1_give']
    except werkzeug.exceptions.BadRequestKeyError:
        sample_doc1 = [{'$set': {'sample_img1': sample_num_target['sample_img1']}}]
        doc.extend(sample_doc1)
    else:
        os.remove('./static/sample/' + sample_num_target['sample_img1'])
        sample_extension1 = sample_img1.filename.split('.')[-1]
        sample_file1 = f'{sample_time}_sample_img1'
        sample_save1 = f'static/sample/{sample_file1}.{sample_extension1}'
        sample_img1.save(sample_save1)
        sample_doc1 = [{'$set': {'sample_img1': f'{sample_file1}.{sample_extension1}'}}]
        doc.extend(sample_doc1)

    try:
        sample_img2 = request.files['sample_img2_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            sample_delete2 = sample_num_target['sample_img2']
        except KeyError:
            pass
        else:
            sample_doc2 = [{'$set': {'sample_img2': sample_delete2}}]
            doc.extend(sample_doc2)
    else:
        try:
            sample_delete2 = sample_num_target['sample_img2']
        except KeyError:
            sample_extension2 = sample_img2.filename.split('.')[-1]
            sample_file2 = f'{sample_time}_sample_img2'
            sample_save2 = f'static/sample/{sample_file2}.{sample_extension2}'
            sample_img2.save(sample_save2)
            sample_doc2 = [{'$set': {'sample_img2': f'{sample_file2}.{sample_extension2}'}}]
            doc.extend(sample_doc2)
        else:
            os.remove('./static/sample/' + sample_delete2)
            sample_extension2 = sample_img2.filename.split('.')[-1]
            sample_file2 = f'{sample_time}_sample_img2'
            sample_save2 = f'static/sample/{sample_file2}.{sample_extension2}'
            sample_img2.save(sample_save2)
            sample_doc2 = [{'$set': {'sample_img2': f'{sample_file2}.{sample_extension2}'}}]
            doc.extend(sample_doc2)

    try:
        sample_img3 = request.files['sample_img3_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            sample_delete3 = sample_num_target['sample_img3']
        except KeyError:
            pass
        else:
            sample_doc3 = [{'$set': {'sample_img3': sample_delete3}}]
            doc.extend(sample_doc3)
    else:
        try:
            sample_delete3 = sample_num_target['sample_img3']
        except KeyError:
            sample_extension3 = sample_img3.filename.split('.')[-1]
            sample_file3 = f'{sample_time}_sample_img3'
            sample_save3 = f'static/sample/{sample_file3}.{sample_extension3}'
            sample_img3.save(sample_save3)
            sample_doc3 = [{'$set': {'sample_img3': f'{sample_file3}.{sample_extension3}'}}]
            doc.extend(sample_doc3)
        else:
            os.remove('./static/sample/' + sample_delete3)
            sample_extension3 = sample_img3.filename.split('.')[-1]
            sample_file3 = f'{sample_time}_sample_img3'
            sample_save3 = f'static/sample/{sample_file3}.{sample_extension3}'
            sample_img3.save(sample_save3)
            sample_doc3 = [{'$set': {'sample_img3': f'{sample_file3}.{sample_extension3}'}}]
            doc.extend(sample_doc3)

    try:
        sample_img4 = request.files['sample_img4_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            sample_delete4 = sample_num_target['sample_img4']
        except KeyError:
            pass
        else:
            sample_doc4 = [{'$set': {'sample_img4': sample_delete4}}]
            doc.extend(sample_doc4)
    else:
        try:
            sample_delete4 = sample_num_target['sample_img4']
        except KeyError:
            sample_extension4 = sample_img4.filename.split('.')[-1]
            sample_file4 = f'{sample_time}_sample_img4'
            sample_save4 = f'static/sample/{sample_file4}.{sample_extension4}'
            sample_img4.save(sample_save4)
            sample_doc4 = [{'$set': {'sample_img4': f'{sample_file4}.{sample_extension4}'}}]
            doc.extend(sample_doc4)
        else:
            os.remove('./static/sample/' + sample_delete4)
            sample_extension4 = sample_img4.filename.split('.')[-1]
            sample_file4 = f'{sample_time}_sample_img4'
            sample_save4 = f'static/sample/{sample_file4}.{sample_extension4}'
            sample_img4.save(sample_save4)
            sample_doc4 = [{'$set': {'sample_img4': f'{sample_file4}.{sample_extension4}'}}]
            doc.extend(sample_doc4)

    db.sample.update_one({'sample_num': sample_num_receive}, doc)

    return jsonify({'msg': '샘플이 수정되었습니다.'})

# 3D 샘플 API 삭제
@app.route('/sample_server/delete', methods=['POST'])
def delete_sample():
    sample_delete_receive = request.form['sample_delete_give']

    sample_delete_target = db.sample.find_one({'sample_num': sample_delete_receive})

    os.remove('./static/sample/' + sample_delete_target['sample_img1'])
    try:
        sample_delete2 = sample_delete_target['sample_img2']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete2)

    try:
        sample_delete3 = sample_delete_target['sample_img3']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete3)

    try:
        sample_delete4 = sample_delete_target['sample_img4']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete4)

    db.sample.delete_one({'sample_num': sample_delete_receive})
    return jsonify({'msg': '샘플이 삭제되었습니다.'})

# 3D 샘플 이미지2 삭제
@app.route('/sample_img2', methods=['POST'])
def delete_img2():
    sample_num_receive = request.form['sample_num_give']

    sample_delete_target = db.sample.find_one({'sample_num': sample_num_receive})

    try:
        sample_delete2 = sample_delete_target['sample_img2']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete2)
        db.sample.update_one({'sample_num': sample_num_receive}, {'$unset': {'sample_img2': True}}, False, True)

    return jsonify({'msg': '이미지2가 삭제되었습니다.'})

# 3D 샘플 이미지3 삭제
@app.route('/sample_img3', methods=['POST'])
def delete_img3():
    sample_num_receive = request.form['sample_num_give']

    sample_delete_target = db.sample.find_one({'sample_num': sample_num_receive})

    try:
        sample_delete3 = sample_delete_target['sample_img3']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete3)
        db.sample.update_one({'sample_num': sample_num_receive}, {'$unset': {'sample_img3': True}}, False, True)

    return jsonify({'msg': '이미지3이 삭제되었습니다.'})

# 3D 샘플 이미지4 삭제
@app.route('/sample_img4', methods=['POST'])
def delete_img4():
    sample_num_receive = request.form['sample_num_give']

    sample_delete_target = db.sample.find_one({'sample_num': sample_num_receive})

    try:
        sample_delete4 = sample_delete_target['sample_img4']
    except KeyError:
        pass
    else:
        os.remove('./static/sample/' + sample_delete4)
        db.sample.update_one({'sample_num': sample_num_receive}, {'$unset': {'sample_img4': True}}, False, True)

    return jsonify({'msg': '이미지4가 삭제되었습니다.'})

# 포트폴리오 페이지
@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

# 포트폴리오 상세페이지
@app.route('/portfolio/<idx>')
def portfolio_detail(idx):
    if db.portfolio.find_one({'portfolio_num': idx}):
        portfolio_data = db.portfolio.find_one({'portfolio_num': idx})
        doc = {
            "portfolio_num": portfolio_data.get("portfolio_num"),
            "portfolio_title": portfolio_data.get("portfolio_title"),
            "portfolio_img1": portfolio_data.get("portfolio_img1"),
            "portfolio_img2": portfolio_data.get("portfolio_img2"),
            "portfolio_img3": portfolio_data.get("portfolio_img3"),
            "portfolio_img4": portfolio_data.get("portfolio_img4"),
            "portfolio_movie": portfolio_data.get("portfolio_movie")
        }
        return render_template("portfolio_detail.html", doc=doc)
    else:
        return redirect('/portfolio')

# 포트폴리오 관리자 페이지
@app.route('/portfolio_admin')
def portfolio_admin():
    if "userID" in session:
        return render_template("portfolio_admin.html", login=True)
    else:
        return render_template("portfolio_admin.html", login=False)

# 포트폴리오 관리자 상세페이지
@app.route('/portfolio_admin/<idx>')
def portfolio_admin_detail(idx):
    if "userID" in session:
        if db.portfolio.find_one({'portfolio_num': idx}):
            portfolio_data = db.portfolio.find_one({'portfolio_num': idx})

            doc = {
                "portfolio_num": portfolio_data.get("portfolio_num"),
                "portfolio_title": portfolio_data.get("portfolio_title"),
                "portfolio_img1": portfolio_data.get("portfolio_img1"),
                "portfolio_img2": portfolio_data.get("portfolio_img2"),
                "portfolio_img3": portfolio_data.get("portfolio_img3"),
                "portfolio_img4": portfolio_data.get("portfolio_img4"),
                "portfolio_movie": portfolio_data.get("portfolio_movie")
            }
            return render_template("portfolio_admin_detail.html", doc=doc, login=True)
        else:
            return render_template("portfolio_admin.html", login=True)
    else:
        return render_template("portfolio_admin.html", login=False)

# 포트폴리오 API 생성
@app.route('/portfolio_server', methods=['POST'])
def get_portfolio():
    portfolio_num_receive = request.form['portfolio_num_give']
    portfolio_title_receive = request.form['portfolio_title_give']
    portfolio_img1 = request.files['portfolio_img1_give']
    portfolio_movie_receive = request.form['portfolio_movie_give'].split('?v=')[-1].split('&t=')[0]

    portfolio_extension1 = portfolio_img1.filename.split('.')[-1]
    today = datetime.now()
    portfolio_time = today.strftime('%Y%m%d%H%M%S')
    portfolio_file1 = f'{portfolio_time}_portfolio_img1'
    portfolio_save1 = f'static/portfolio/{portfolio_file1}.{portfolio_extension1}'
    portfolio_img1.save(portfolio_save1)

    doc = {
        'portfolio_num': portfolio_num_receive,
        'portfolio_title': portfolio_title_receive,
        'portfolio_img1': f'{portfolio_file1}.{portfolio_extension1}',
        'portfolio_movie': portfolio_movie_receive
    }

    try:
        portfolio_img2 = request.files['portfolio_img2_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        portfolio_extension2 = portfolio_img2.filename.split('.')[-1]
        portfolio_file2 = f'{portfolio_time}_portfolio_img2'
        portfolio_save2 = f'static/portfolio/{portfolio_file2}.{portfolio_extension2}'
        portfolio_img2.save(portfolio_save2)
        doc['portfolio_img2'] = f'{portfolio_file2}.{portfolio_extension2}'

    try:
        portfolio_img3 = request.files['portfolio_img3_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        portfolio_extension3 = portfolio_img3.filename.split('.')[-1]
        portfolio_file3 = f'{portfolio_time}_portfolio_img3'
        portfolio_save3 = f'static/portfolio/{portfolio_file3}.{portfolio_extension3}'
        portfolio_img3.save(portfolio_save3)
        doc['portfolio_img3'] = f'{portfolio_file3}.{portfolio_extension3}'

    try:
        portfolio_img4 = request.files['portfolio_img4_give']
    except werkzeug.exceptions.BadRequestKeyError:
        pass
    else:
        portfolio_extension4 = portfolio_img4.filename.split('.')[-1]
        portfolio_file4 = f'{portfolio_time}_portfolio_img4'
        portfolio_save4 = f'static/portfolio/{portfolio_file4}.{portfolio_extension4}'
        portfolio_img4.save(portfolio_save4)
        doc['portfolio_img4'] = f'{portfolio_file4}.{portfolio_extension4}'

    db.portfolio.insert_one(doc)

    return jsonify({'msg': '포트폴리오가 등록되었습니다.'})

# 포트폴리오 API 읽기
@app.route('/portfolio_server', methods=['GET'])
def read_portfolio():
    portfolios = list(db.portfolio.find({}, {'_id': False}))
    return jsonify({'all_portfolios': portfolios})

# 포트폴리오 API 수정
@app.route('/portfolio_server/update', methods=['POST'])
def update_portfolio():
    portfolio_num_receive = request.form['portfolio_num_give']
    portfolio_title_receive = request.form['portfolio_title_give']
    portfolio_movie_receive = request.form['portfolio_movie_give'].split('?v=')[-1].split('&t=')[0]

    portfolio_num_target = db.portfolio.find_one({'portfolio_num': portfolio_num_receive})

    today = datetime.now()
    portfolio_time = today.strftime('%Y%m%d%H%M%S')

    doc = [
        {'$set': {'portfolio_title': portfolio_title_receive}},
        {'$set': {'portfolio_movie': portfolio_movie_receive}},
    ]

    try:
        portfolio_img1 = request.files['portfolio_img1_give']
    except werkzeug.exceptions.BadRequestKeyError:
        portfolio_doc1 = [{'$set': {'portfolio_img1': portfolio_num_target['portfolio_img1']}}]
        doc.extend(portfolio_doc1)
    else:
        os.remove('./static/portfolio/' + portfolio_num_target['portfolio_img1'])
        portfolio_extension1 = portfolio_img1.filename.split('.')[-1]
        portfolio_file1 = f'{portfolio_time}_portfolio_img1'
        portfolio_save1 = f'static/portfolio/{portfolio_file1}.{portfolio_extension1}'
        portfolio_img1.save(portfolio_save1)
        portfolio_doc1 = [{'$set': {'portfolio_img1': f'{portfolio_file1}.{portfolio_extension1}'}}]
        doc.extend(portfolio_doc1)

    try:
        portfolio_img2 = request.files['portfolio_img2_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            portfolio_delete2 = portfolio_num_target['portfolio_img2']
        except KeyError:
            pass
        else:
            portfolio_doc2 = [{'$set': {'portfolio_img2': portfolio_delete2}}]
            doc.extend(portfolio_doc2)
    else:
        try:
            portfolio_delete2 = portfolio_num_target['portfolio_img2']
        except KeyError:
            portfolio_extension2 = portfolio_img2.filename.split('.')[-1]
            portfolio_file2 = f'{portfolio_time}_portfolio_img2'
            portfolio_save2 = f'static/portfolio/{portfolio_file2}.{portfolio_extension2}'
            portfolio_img2.save(portfolio_save2)
            portfolio_doc2 = [{'$set': {'portfolio_img2': f'{portfolio_file2}.{portfolio_extension2}'}}]
            doc.extend(portfolio_doc2)
        else:
            os.remove('./static/portfolio/' + portfolio_delete2)
            portfolio_extension2 = portfolio_img2.filename.split('.')[-1]
            portfolio_file2 = f'{portfolio_time}_portfolio_img2'
            portfolio_save2 = f'static/portfolio/{portfolio_file2}.{portfolio_extension2}'
            portfolio_img2.save(portfolio_save2)
            portfolio_doc2 = [{'$set': {'portfolio_img2': f'{portfolio_file2}.{portfolio_extension2}'}}]
            doc.extend(portfolio_doc2)

    try:
        portfolio_img3 = request.files['portfolio_img3_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            portfolio_delete3 = portfolio_num_target['portfolio_img3']
        except KeyError:
            pass
        else:
            portfolio_doc3 = [{'$set': {'portfolio_img3': portfolio_delete3}}]
            doc.extend(portfolio_doc3)
    else:
        try:
            portfolio_delete3 = portfolio_num_target['portfolio_img3']
        except KeyError:
            portfolio_extension3 = portfolio_img3.filename.split('.')[-1]
            portfolio_file3 = f'{portfolio_time}_portfolio_img3'
            portfolio_save3 = f'static/portfolio/{portfolio_file3}.{portfolio_extension3}'
            portfolio_img3.save(portfolio_save3)
            portfolio_doc3 = [{'$set': {'portfolio_img3': f'{portfolio_file3}.{portfolio_extension3}'}}]
            doc.extend(portfolio_doc3)
        else:
            os.remove('./static/portfolio/' + portfolio_delete3)
            portfolio_extension3 = portfolio_img3.filename.split('.')[-1]
            portfolio_file3 = f'{portfolio_time}_portfolio_img3'
            portfolio_save3 = f'static/portfolio/{portfolio_file3}.{portfolio_extension3}'
            portfolio_img3.save(portfolio_save3)
            portfolio_doc3 = [{'$set': {'portfolio_img3': f'{portfolio_file3}.{portfolio_extension3}'}}]
            doc.extend(portfolio_doc3)

    try:
        portfolio_img4 = request.files['portfolio_img4_give']
    except werkzeug.exceptions.BadRequestKeyError:
        try:
            portfolio_delete4 = portfolio_num_target['portfolio_img4']
        except KeyError:
            pass
        else:
            portfolio_doc4 = [{'$set': {'portfolio_img4': portfolio_delete4}}]
            doc.extend(portfolio_doc4)
    else:
        try:
            portfolio_delete4 = portfolio_num_target['portfolio_img4']
        except KeyError:
            portfolio_extension4 = portfolio_img4.filename.split('.')[-1]
            portfolio_file4 = f'{portfolio_time}_portfolio_img4'
            portfolio_save4 = f'static/portfolio/{portfolio_file4}.{portfolio_extension4}'
            portfolio_img4.save(portfolio_save4)
            portfolio_doc4 = [{'$set': {'portfolio_img4': f'{portfolio_file4}.{portfolio_extension4}'}}]
            doc.extend(portfolio_doc4)
        else:
            os.remove('./static/portfolio/' + portfolio_delete4)
            portfolio_extension4 = portfolio_img4.filename.split('.')[-1]
            portfolio_file4 = f'{portfolio_time}_sample_img4'
            portfolio_save4 = f'static/portfolio/{portfolio_file4}.{portfolio_extension4}'
            portfolio_img4.save(portfolio_save4)
            portfolio_doc4 = [{'$set': {'portfolio_img4': f'{portfolio_file4}.{portfolio_extension4}'}}]
            doc.extend(portfolio_doc4)

    db.portfolio.update_one({'portfolio_num': portfolio_num_receive}, doc)
    flash('포트폴리오가 수정되었습니다.', 'msg')
    return jsonify({'msg': '포트폴리오가 수정되었습니다.'})

# 포트폴리오 API 삭제
@app.route('/portfolio_server/delete', methods=['POST'])
def delete_portfolio():
    portfolio_delete_receive = request.form['portfolio_delete_give']

    portfolio_delete_target = db.portfolio.find_one({'portfolio_num': portfolio_delete_receive})
    os.remove('./static/portfolio/' + portfolio_delete_target['portfolio_img1'])

    try:
        portfolio_delete2 = portfolio_delete_target['portfolio_img2']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete2)

    try:
        portfolio_delete3 = portfolio_delete_target['portfolio_img3']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete3)

    try:
        portfolio_delete4 = portfolio_delete_target['portfolio_img4']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete4)

    db.portfolio.delete_one({'portfolio_num': portfolio_delete_receive})
    return jsonify({'msg': '포트폴리오가 삭제되었습니다.'})

# 포트폴리오 이미지2 삭제
@app.route('/portfolio_img2', methods=['POST'])
def delete_portfolio_img2():
    portfolio_num_receive = request.form['portfolio_num_give']

    portfolio_delete_target = db.portfolio.find_one({'portfolio_num': portfolio_num_receive})

    try:
        portfolio_delete2 = portfolio_delete_target['portfolio_img2']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete2)
        db.portfolio.update_one({'portfolio_num': portfolio_num_receive}, {'$unset': {'portfolio_img2': True}}, False,
                                True)

    return jsonify({'msg': '이미지2가 삭제되었습니다.'})

# 포트폴리오 이미지3 삭제
@app.route('/portfolio_img3', methods=['POST'])
def delete_portfolio_img3():
    portfolio_num_receive = request.form['portfolio_num_give']

    portfolio_delete_target = db.portfolio.find_one({'portfolio_num': portfolio_num_receive})

    try:
        portfolio_delete3 = portfolio_delete_target['portfolio_img3']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete3)
        db.portfolio.update_one({'portfolio_num': portfolio_num_receive}, {'$unset': {'portfolio_img3': True}}, False,
                                True)

    return jsonify({'msg': '이미지3이 삭제되었습니다.'})

# 포트폴리오 이미지4 삭제
@app.route('/portfolio_img4', methods=['POST'])
def delete_portfolio_img4():
    portfolio_num_receive = request.form['portfolio_num_give']

    portfolio_delete_target = db.portfolio.find_one({'portfolio_num': portfolio_num_receive})

    try:
        portfolio_delete4 = portfolio_delete_target['portfolio_img4']
    except KeyError:
        pass
    else:
        os.remove('./static/portfolio/' + portfolio_delete4)
        db.portfolio.update_one({'portfolio_num': portfolio_num_receive}, {'$unset': {'portfolio_img4': True}}, False,
                                True)

    return jsonify({'msg': '이미지4가 삭제되었습니다.'})

# 관리자 페이지
@app.route('/admin')
def admin():
    if "userID" in session:
        return render_template("admin.html", login=True)
    else:
        return render_template("admin.html", login=False)

# 관리자 정보 API
@app.route('/admin_server', methods=['POST'])
def get_admin_info():
    id_receive = request.form['id_give']
    id_hash = hashlib.sha256(id_receive.encode('utf-8')).hexdigest()

    password_receive = request.form['password_give']
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    db.admin.update_one({'id': id_hash}, {'$set': {'password': password_hash}})

    return jsonify({'msg': '비밀번호가 변경되었습니다.'})

# SNS 페이스북 API
@app.route('/facebook', methods=['POST'])
def get_facebook():
    facebook_receive = request.form['facebook_give']
    facebook_url_receive = request.form['facebook_url_give']

    db.sns.update_one({'facebook': facebook_receive}, {'$set': {'facebook_url': facebook_url_receive}})

    return jsonify({'msg': '페이스북 주소가 변경되었습니다.'})

# SNS 인스타그램 API
@app.route('/instagram', methods=['POST'])
def get_instagram():
    instagram_receive = request.form['instagram_give']
    instagram_url_receive = request.form['instagram_url_give']

    db.sns.update_one({'instagram': instagram_receive}, {'$set': {'instagram_url': instagram_url_receive}})

    return jsonify({'msg': '인스타그램 주소가 변경되었습니다.'})

# SNS 유튜브 API
@app.route('/youtube', methods=['POST'])
def get_youtube():
    youtube_receive = request.form['youtube_give']
    youtube_url_receive = request.form['youtube_url_give']

    db.sns.update_one({'youtube': youtube_receive}, {'$set': {'youtube_url': youtube_url_receive}})

    return jsonify({'msg': '유튜브 주소가 변경되었습니다.'})

# SNS 틱톡 API
@app.route('/tiktok', methods=['POST'])
def get_tiktok():
    tiktok_receive = request.form['tiktok_give']
    tiktok_url_receive = request.form['tiktok_url_give']

    db.sns.update_one({'tiktok': tiktok_receive}, {'$set': {'tiktok_url': tiktok_url_receive}})

    return jsonify({'msg': '틱톡 주소가 변경되었습니다.'})

# SNS 네이버 블로그 API
@app.route('/blog', methods=['POST'])
def get_blog():
    blog_receive = request.form['blog_give']
    blog_url_receive = request.form['blog_url_give']

    db.sns.update_one({'blog': blog_receive}, {'$set': {'blog_url': blog_url_receive}})

    return jsonify({'msg': '블로그 주소가 변경되었습니다.'})

# 푸터 SNS 읽기
@app.route('/sns', methods=['GET'])
def read_sns():
    sns = list(db.sns.find({}, {'_id': False}))
    return jsonify({'all_sns': sns})

# 로그인 페이지
@app.route('/login', methods=["get"])
def login():
    id_receive = request.args.get('loginId')
    id_hash = hashlib.sha256(id_receive.encode('utf-8')).hexdigest()

    password_receive = request.args.get('loginPw')
    password_hash = hashlib.sha256(password_receive.encode('utf-8')).hexdigest()

    doc = {
        'id': id_hash,
        'password': password_hash
    }

    result = db.admin.find_one(doc)

    if result is not None:
        session["userID"] = id_receive
        return redirect(url_for("admin"))
    else:
        return redirect(url_for("admin"))

# 로그아웃
@app.route('/logout')
def logout():
    session.pop("userID")
    return redirect(url_for("home"))

# 이용약관 페이지
@app.route('/terms')
def terms():
    return render_template('terms.html')

# 개인정보 처리방침 페이지
@app.route('/policy')
def policy():
    return render_template('policy.html')


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=False)
