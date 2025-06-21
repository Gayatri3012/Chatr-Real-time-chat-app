// websocket.js
const WebSocket = require('ws');
const Message = require('./models/Message');


// Keeping track of all currently connected usernames
const activeUsers = new Set();


module.exports = function(server) {
  const wss = new WebSocket.Server({ server });

  // Whenever a new client connects
  wss.on('connection', async (ws) => {
    let username = 'user';
    let avatar = '🐱';

    ws.on('message', async (data) => {
      const parsed = JSON.parse(data);

      // When user first connects, they'll send their username and avatar
      if (parsed.type === 'intro') {
        // If someone is already using this usrname, sen error message
        if (activeUsers.has(parsed.username)) {
          ws.send(JSON.stringify({ type: 'error', message: 'Username already in use.' }));
          ws.close();
          return;
        }
  
        username = parsed.username;
        avatar = parsed.avatar || '🐱';
        activeUsers.add(username);
  
        // Fetch the last 50 messages from MongoDB and send it to this new user
        const history = await Message.find().sort({ timestamp: -1 }).limit(50).lean();
        console.log('sending history to ', username, avatar)
        ws.send(JSON.stringify({ type: 'history', messages: history.reverse() }));
      }
      


      // When a user sends a chat message
      if (parsed.type === 'message') {
         // Save the message in the database
        const newMsg = new Message({
          username,
          message: parsed.message,
          avatar
        });
        await newMsg.save();

        // Send the message to everyone who's currently connected
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

    // When someone leaves, remove them from the active users set
    ws.on('close', () => {
      console.log(`${username} disconnected`);
      if (username) activeUsers.delete(username);
    });
  });
};
