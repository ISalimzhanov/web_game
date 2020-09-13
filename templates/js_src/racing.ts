import client from './client';

let timeout;

(window as any).checkTyped = () => {
  let typed: HTMLInputElement = document.getElementById('typed') as HTMLInputElement;
  let contentWait: HTMLElement = document.getElementById('contentWait') as HTMLInputElement;
  let contentDone: HTMLElement = document.getElementById('contentDone') as HTMLElement;

  let i: number = 0;
  while ((i < Math.min(typed.value.length, contentDone.innerText.length)) && (typed.value[i] == contentDone.innerText[i])) {
    i++;
  }
  if (i != contentDone.innerText.length) {
    contentWait.innerText = contentDone.innerText.substr(i) + contentWait.innerText;
    contentDone.innerText = contentDone.innerText.substr(0, i);
    return;
  }
  let j: number = 0;
  while (i < typed.value.length && j < contentWait.innerText.length && typed.value[i] == contentWait.innerText[j]) {
    i++;
    j++;
  }
  contentDone.innerText += contentWait.innerText.substr(0, j);
  contentWait.innerText = contentWait.innerText.substr(j);
  if (contentWait.innerText.length != 0) return;
  //------------------------------------------------------------------------------------
  let waiting: HTMLElement = document.getElementById('waiting') as HTMLElement;
  if (waiting.innerText.length != 0) {
    let done: HTMLElement = document.getElementById('done');
    const waitingWords: string[] = waiting.innerText.split(' ');
    done.innerText += ' ' + contentDone.innerText;
    contentWait.innerText = waitingWords[0];
    contentDone.innerText = '';
    waiting.innerText = '';
    typed.value = '';
    for (let i: number = 1; i < waitingWords.length; ++i) {
      waiting.innerText += waitingWords[i];
      if (i != waitingWords.length - 1)
        waiting.innerText += ' ';
    }
  } else {
    let score: number = parseInt(document.getElementById('score').innerText);
    let player_id: number = parseInt(document.getElementById('player_id').innerText);
    client.request('finished', [player_id, score]).then((result) => {
      let main: HTMLElement = document.getElementById('main');
      let text: HTMLElement = document.getElementById('textSnaps');
      let typingField: HTMLElement = document.getElementById('typingField');
      let standing: HTMLElement = document.createElement('p');
      text.remove();
      typingField.remove();
      standing.innerText = result.toString();
      clearTimeout(timeout);
      main.appendChild(standing);
    })
      .catch(e => {
        throw e;
      });
  }
}

(window as any).setCurrentTime = () => {
  let body: HTMLElement = document.getElementsByTagName('body').item(0);
  let timeField: HTMLElement = document.createElement('p');
  let time: number = new Date().getTime();
  timeField.setAttribute('id', 'time');
  timeField.innerText = time.toString();
  timeField.hidden = true;
  body.appendChild(timeField);
}

(window as any).updateScore = () => {
  let done: HTMLElement = document.getElementById('done');
  let timeField: HTMLElement = document.getElementById('time');
  let scoreField: HTMLElement = document.getElementById('score');
  let n_words: number = 0;
  if (done.innerText.length != 0)
    n_words = done.innerText.split(' ').length;
  let current_time = new Date().getTime();
  let creation_time: number = parseInt(timeField.innerText);
  let minInterval: number = (current_time - creation_time) / 1000 / 60;
  scoreField.innerText = Math.trunc(n_words / minInterval).toString();
}

(window as any).fillContentWait = () => {
  let contentWait: HTMLElement = document.getElementById('contentWait') as HTMLInputElement;
  let waiting: HTMLElement = document.getElementById('waiting') as HTMLElement;
  let waitingWords: string[] = waiting.innerText.split(' ');
  console.log(waitingWords[0]);
  contentWait.innerText = waitingWords[0];
  waiting.innerText = '';
  for (let i: number = 1; i < waitingWords.length; ++i) {
    waiting.innerText += waitingWords[i];
    if (i != waitingWords.length - 1)
      waiting.innerText += ' ';
  }
  console.log(waiting.innerText);
}