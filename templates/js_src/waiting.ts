import client from './client';

(window as any).new_player = () => {
  client.request('new_player', [])
    .then((result) => {
      const playerField = document.createElement('p');
      playerField.hidden = true;
      playerField.innerText = result.toString();
      playerField.setAttribute('id', 'playerId');
      console.log(playerField);
      document.body.appendChild(playerField);
    })
    .catch(e => {
      throw e;
    });
};

(window as any).update = () => {
  console.log('caught update!');
  const playerField: HTMLElement = document.getElementById('playerId');
  const player_id: number = parseInt(playerField.innerText);
  client.request('is_started', [player_id]).then((result) => {
    let race_condition: [number, boolean] = result;
    let numberPlayers: HTMLElement = document.getElementById('#players');
    numberPlayers.innerText = race_condition[0].toString();
    if (race_condition[1]) {
      window.location.href = '/racing.html';
    }
  })
    .catch(e => {
      throw e;
    });
};