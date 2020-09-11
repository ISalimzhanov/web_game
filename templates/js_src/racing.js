var DateTimeFormat = Intl.DateTimeFormat;
var timeout;
function checkTyped() {
    var typed = document.getElementById("typed");
    var contentWait = document.getElementById("contentWait");
    var contentDone = document.getElementById("contentDone");
    var i = 0;
    while ((i < Math.min(typed.value.length, contentDone.innerText.length)) && (typed.value[i] == contentDone.innerText[i])) {
        i++;
    }
    if (i != contentDone.innerText.length) {
        contentWait.innerText = contentDone.innerText.substr(i) + contentWait.innerText;
        contentDone.innerText = contentDone.innerText.substr(0, i);
        return;
    }
    var j = 0;
    while (i < typed.value.length && j < contentWait.innerText.length && typed.value[i] == contentWait.innerText[j]) {
        i++;
        j++;
    }
    contentDone.innerText += contentWait.innerText.substr(0, j);
    contentWait.innerText = contentWait.innerText.substr(j);
    if (contentWait.innerText.length != 0)
        return;
    //------------------------------------------------------------------------------------
    var waiting = document.getElementById("waiting");
    if (waiting.innerText.length != 0) {
        var done = document.getElementById("done");
        var waitingWords = waiting.innerText.split(" ");
        done.innerText += " " + contentDone.innerText;
        contentWait.innerText = waitingWords[0];
        contentDone.innerText = "";
        waiting.innerText = "";
        typed.value = "";
        for (var i_1 = 1; i_1 < waitingWords.length; ++i_1) {
            waiting.innerText += waitingWords[i_1];
            if (i_1 != waitingWords.length - 1)
                waiting.innerText += " ";
        }
    }
    else {
        var main = document.getElementById("main");
        var text = document.getElementById("textSnaps");
        var typingField = document.getElementById("typingField");
        text.remove();
        typingField.remove();
        var result = document.createElement("img");
        result.src = "crown.png";
        result.setAttribute("alt", "You won");
        result.setAttribute("width", "256");
        result.setAttribute("height", "256");
        clearTimeout(timeout);
        main.appendChild(result);
    }
}
function setCurrentTime() {
    var body = document.getElementsByTagName("body").item(0);
    var timeField = document.createElement("p");
    var time = new Date().getTime();
    timeField.setAttribute("id", "time");
    timeField.innerText = time.toString();
    timeField.hidden = true;
    body.appendChild(timeField);
}
function updateScore() {
    var done = document.getElementById("done");
    var timeField = document.getElementById("time");
    var scoreField = document.getElementById("score");
    var n_words = 0;
    if (done.innerText.length != 0)
        n_words = done.innerText.split(" ").length;
    var current_time = new Date().getTime();
    var creation_time = parseInt(timeField.innerText);
    var minInterval = (current_time - creation_time) / 1000 / 60;
    scoreField.innerText = Math.trunc(n_words / minInterval).toString();
}
function fillContentWait() {
    var contentWait = document.getElementById("contentWait");
    var waiting = document.getElementById("waiting");
    var waitingWords = waiting.innerText.split(" ");
    console.log(waitingWords[0]);
    contentWait.innerText = waitingWords[0];
    waiting.innerText = "";
    for (var i = 1; i < waitingWords.length; ++i) {
        waiting.innerText += waitingWords[i];
        if (i != waitingWords.length - 1)
            waiting.innerText += " ";
    }
    console.log(waiting.innerText);
}
