from flask import Flask, render_template, request, Response
from jsonrpcserver import method, dispatch

from config import race_capacity
from dbHandler import DbHandler

app = Flask(__name__)


@app.route('/', methods=['GET'])
def wait():
    return render_template("main.html")


@app.route('/racing<player_id>', methods=['GET'])
def racing(player_id):
    return render_template('racing.html', player_id=player_id)


@app.route('/', methods=['POST'])
def response_handler():
    req = request.get_data().decode()
    response = dispatch(req)
    return Response(str(response), response.http_status, mimetype="application/json")


@method
def new_player() -> int:
    '''
    :return:
    '''
    db_handler = DbHandler()
    player_id, _ = db_handler.new_player()
    return player_id


@method
def is_started(player_id: int) -> tuple:
    '''
    :param player_id:
    :return:
    '''
    db_handler = DbHandler()
    race_id, n_players = db_handler.get_race_info(player_id)
    return n_players, n_players == race_capacity


@method
def finished(player_id: int, score: int) -> int:
    '''
    :param player_id:
    :param score:
    :return:
    '''
    db_handler = DbHandler()
    race_id, _ = db_handler.get_race_info(player_id)
    db_handler.update_score(player_id, score)
    standing = db_handler.standings(player_id, race_id)
    try:
        db_handler.finish(race_id)
    except ValueError:
        print('Not finished yet')
    return standing


def prepare_db():
    try:
        open('myDb.db', 'r')
    except FileNotFoundError:
        db_handler = DbHandler()
        db_handler.create()


if __name__ == '__main__':
    app.run(debug=True)
