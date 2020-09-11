import rpc from "json-rpc2";
const url: string = 'http://localhost:5000/'
const client = rpc.Client.$create(5000, 'localhost')
let t;

function new_player() {
    client.call('new_player', [], function (err, result) {
        if (err) throw err;
        let playerField = document.createElement('p')
        playerField.hidden = true
        playerField.innerText = result.toString()
        playerField.setAttribute('id', 'playerId')
    })
}

function update() {
    const playerField: HTMLElement = document.getElementById('playerId')
    const player_id: number = parseInt(playerField.innerText)
    client.call('is_started', [player_id], function (err, result) {
        if (err) throw err;
        let race_condition: [number, boolean] = result
        let numberPlayers: HTMLElement = document.getElementById('#players')
        numberPlayers.innerText = race_condition[0].toString()
        if (race_condition[1]) {
            window.location.href = url + "/racing";
            clearTimeout(t)
        }
    })
}