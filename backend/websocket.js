// websocket.js
const WebSocket = require('ws');
const Message = require('./models/Message');

const activeUsers = new Set();


module.exports = function(server) {
  const wss = new WebSocket.Server({ server });

  wss.on('connection', async (ws) => {
    let username = 'user';
    let avatar = '🐱';

    ws.on('message', async (data) => {
      const parsed = JSON.parse(data);

      if (parsed.type === 'intro') {
     
        if (activeUsers.has(parsed.username)) {
          ws.send(JSON.stringify({ type: 'error', message: 'Username already in use.' }));
          ws.close();
          return;
        }
  
        username = parsed.username;
        avatar = parsed.avatar || '🐱';
        activeUsers.add(username);
  
        const history = await Message.find().sort({ timestamp: -1 }).limit(50).lean();
        console.log('sending history to ', username, avatar)
        ws.send(JSON.stringify({ type: 'history', messages: history.reverse() }));
      }
      


      if (parsed.type === 'message') {
        const newMsg = new Message({
          username,
          message: parsed.message,
          avatar
        });
        await newMsg.save();

        const broadcastData = JSON.stringify({
          type: 'message',
          message: parsed.message,
          avatar,
          username,
          timestamp: newMsg.timestamp
        });

        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(broadcastData);
          }
        });
      }
    });

    ws.on('close', () => {
      console.log(`${username} disconnected`);
      if (username) activeUsers.delete(username);
    });
    console.log(activeUsers)
  });
};
