var loc = window.location;
var endpoint = "ws://";
var form = document.querySelector("#form");
var chatbox = document.querySelector("#chatbox");
const message = document.querySelector("#message");
if (loc.protocol == "https:")
{
    endpoint = "wss://";
}
endpoint += window.location.host + window.location.pathname;
var socket = new ReconnectingWebSocket(endpoint);
socket.onmessage = e => {
    const data = JSON.parse(JSON.parse(e.data).text);
    const new_el = document.createElement("li");
    new_el.append(`${data.username}: ${data.message}`);
    new_el.classList.add("chatitem");
    chatbox.append(new_el);
    chatbox.scrollTo(0,chatbox.scrollHeight)
}
socket.onopen = e => {
    form.onkeydown = event => {
        if ( (window.event ? event.keyCode : event.which) == 13){
            event.preventDefault();
            socket.send(event.target.value);
            message.value = "";
            return false;
        }
    }
}
