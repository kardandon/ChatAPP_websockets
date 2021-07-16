# Final Project: Chat App with websocket

In this project, I used websockets, django, django channels, redis, javascript, reconnectingwebsocket.
### Brief
This project mainly connects to frontend using websockets and create a chat room including 2 distinct users like modern messenger apps. To do that I had to use [ASGI](https://asgi.readthedocs.io/en/latest/) for websocket communication. Using javascript reconnecting websocket, frontend connects to the chatroom thread where other also the user connects to. Whent either one of the users send a message, the message is saved to the database synchronously and is sent back to the both of the users with username of the sender. After that frontend js of both users append unordered list to display message and scrolls to the new message.
Also user can see the user list by clicking the button on the rightmost-bottom. User can choose one of the users and start chatting from there. In addition to that tictactoe app is designed. It is a basic tictactoe app designed using react and has an AI. Player can choose either X or Y or both to be AI.

### Why this project is distinct and complex?
In this project, I had to use asyncronous server gateway interface (ASGI) and websockets. Handling the websockets are complex and not easy to do. Also connecting 2 websockets using redis is also an another challenge. Also I've added tictactoe with AI in it.

### Content
All django scripts are in src folder. An app called chat is started. In project settings channel layer using [redis](https://github.com/redis/redis) is defined. In asgi.py routing for websocket is defined at /messages/<str:username>. In chat app consumer.py is defined in order to consume calls. This is where i handle websocket connections. In models.py, Thread model and ThreadManager modelManager are defined. Thread can be considered as chat room where 2 users communicate. Also we got ChatMessage Model in order to store chat messages. Also views.py urls.py templates static files are created. In tictactoe there only exists tictactoe game

### How To Run
In order to run, Redis must be installed. I used [Redis 5.0.10 for Windows](https://github.com/tporadowski/redis/releases) After redis is installed, redis server must be started using
```redis-server```
And you must see 
``` file use c:\program files\redis\redis-server.exe /path/to/redis.conf
                _._
           _.-``__ ''-._
      _.-``    `.  `_.  ''-._           Redis 5.0.10 (1c047b68/0) 64 bit
  .-`` .-```.  ```\/    _.,_ ''-._
 (    '      ,       .-`  | `,    )     Running in standalone mode
 |`-._`-...-` __...-.``-._|'` _.-'|     Port: 6379
 |    `-._   `._    /     _.-'    |     PID: 14816
  `-._    `-._  `-./  _.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |           http://redis.io
  `-._    `-._`-.__.-'_.-'    _.-'
 |`-._`-._    `-.__.-'    _.-'_.-'|
 |    `-._`-._        _.-'_.-'    |
  `-._    `-._`-.__.-'_.-'    _.-'
      `-._    `-.__.-'    _.-'
          `-._        _.-'
              `-.__.-'

[14816] 16 Jul 12:16:40.633 # Server initialized
[14816] 16 Jul 12:16:40.635 * Ready to accept connections
```
After that requirements must be installed\
I used Python: 3.9.4. To install requriements:
```
pip install -r requirements.txt
```

After that you can use in src folder to make migrations (not necessary)
```
python manage.py makemigrations
python manage.py migrate
```
To run 
```
python manage.py runserver
```

After that, server will be hosting at 127.0.0.1:8000 or localhost:8000
