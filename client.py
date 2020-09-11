from jsonrpcclient import request

if __name__ == '__main__':
    print(request("http://localhost:5000/", "new_player").data.result)
