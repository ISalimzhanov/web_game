import sqlite3

from config import race_capacity


class DbHandler:
    _instance = None

    def __new__(cls, *args, **kwargs):
        if not DbHandler._instance:
            DbHandler._instance = super(DbHandler, cls).__new__(cls)
        return DbHandler._instance

    def __init__(self):
        self.conn = sqlite3.connect("myDb.db")

    def create(self):
        c = self.conn.cursor()
        race_q = '''CREATE TABLE race(
            race_id INTEGER PRIMARY KEY AUTOINCREMENT
        );'''
        player_q = '''CREATE TABLE player(
            player_id INTEGER PRIMARY KEY AUTOINCREMENT,
            race_id INTEGER NOT NULL,
            FOREIGN KEY(race_id) REFERENCES race(race_id)
        );'''
        score_q = '''CREATE TABLE score(
            player_id INTEGER NOT NULL PRIMARY KEY,
            score INTEGER NOT NULL DEFAULT 0,
            FOREIGN KEY(player_id) REFERENCES player(player_id)
        );'''
        c.execute(race_q)
        c.execute(player_q)
        c.execute(score_q)
        self.conn.commit()
        c.close()

    def new_player(self):
        '''
        :return:
        '''
        c = self.conn.cursor()
        find_free_q = f'''SELECT race_id as ri
                         FROM race 
                         WHERE 
                            (SELECT COUNT(player_id) FROM player WHERE player.race_id == ri) < {race_capacity}'''
        c.execute(find_free_q)
        race_id = c.fetchone()
        if not race_id:
            c.execute('''INSERT INTO race  DEFAULT VALUES''')
            race_id = c.lastrowid
        else:
            race_id = race_id[0]
        c.execute(f'''INSERT INTO player (race_id) VALUES ({race_id})''')
        player_id = c.lastrowid
        c.execute(f'''INSERT INTO score (player_id) VALUES ({player_id})''')
        self.conn.commit()
        c.close()
        return player_id, race_id

    def get_race_info(self, player_id: int) -> tuple:
        '''
        :param player_id:
        :return: race_id, #players in the race
        '''
        c = self.conn.cursor()
        c.execute(f'''SELECT race_id FROM player WHERE player.player_id == {player_id}''')
        race_id = c.fetchone()
        race_id = race_id[0]
        c.execute(f'''SELECT COUNT(player_id) FROM player WHERE player.race_id == {race_id}''')
        n_players = c.fetchone()[0]
        c.close()
        return race_id, n_players

    def update_score(self, player_id: int, score: int):
        '''
        :param player_id:
        :return:
        '''
        c = self.conn.cursor()
        c.execute(f'''UPDATE score SET score = {score} WHERE player_id == {player_id}''')
        self.conn.commit()
        c.close()

    def get_race_res(self, race_id: int) -> list:
        '''
        :param race_id:
        :return:
        '''
        c = self.conn.cursor()
        race_res_q = f'''SELECT player_id as pi, score
                         FROM score
                         WHERE 
                         (SELECT race_id FROM player WHERE player.player_id == pi) == {race_id}
                      '''
        c.execute(race_res_q)
        res = c.fetchall()
        res = sorted(res, key=lambda r: -r[1])
        c.close()
        return res

    def standings(self, player_id: int, race_id: int) -> int:
        '''
        :param race_id:
        :param player_id:
        :return:
        '''
        c = self.conn.cursor()
        res = self.get_race_res(race_id)
        for i in range(len(res)):
            if res[i][0] == player_id:
                c.close()
                return i + 1

    def finish(self, race_id: int):
        '''
        :param race_id:
        :return:
        '''
        c = self.conn.cursor()
        res = self.get_race_res(race_id)
        if not res[len(res) - 1][1] or len(res) != race_capacity:
            raise ValueError
        c.execute(f'''SELECT player_id FROM player WHERE player.race_id == {race_id}''')
        players = c.fetchall()
        players = [player[0] for player in players]
        del_players = f'''DELETE FROM player
                         WHERE player.player_id IN ({','.join(['?'] * len(players))})'''
        del_scores = f'''DELETE FROM score
                         WHERE score.player_id IN ({','.join(['?'] * len(players))})'''
        del_race = f'''DELETE FROM race WHERE race.race_id == {race_id}'''
        c.execute(del_players, players)
        c.execute(del_scores, players)
        c.execute(del_race)
        self.conn.commit()
        c.close()
