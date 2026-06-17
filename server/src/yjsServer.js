import { WebSocketServer } from 'ws';
import { setupWSConnection, setPersistence } from 'y-websocket/bin/utils';
import * as Y from 'yjs';
import { loadDocState, saveDocState, roomExists } from './db.js';

// Register PostgreSQL persistence with y-websocket
setPersistence({
  bindState: async (docName, ydoc) => {
    const [roomId] = docName.split('/');
    const state = await loadDocState(roomId, 'main');
    if (state) {
      Y.applyUpdate(ydoc, new Uint8Array(state));
    }
  },
  writeState: async (docName, ydoc) => {
    const [roomId] = docName.split('/');
    const update = Y.encodeStateAsUpdate(ydoc);
    await saveDocState(roomId, 'main', Buffer.from(update));
  },
});

export function setupYjsWebSocket(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', async (req, socket, head) => {
    try {
      // URL format: /yjs/<roomId>
      const parts = req.url?.split('/').filter(Boolean);
      if (!parts || parts[0] !== 'yjs' || !parts[1]) {
        socket.destroy();
        return;
      }

      const roomId = parts[1];
      const exists = await roomExists(roomId);
      if (!exists) {
        socket.write('HTTP/1.1 404 Room Not Found\r\n\r\n');
        socket.destroy();
        return;
      }

      wss.handleUpgrade(req, socket, head, (ws) => {
        wss.emit('connection', ws, req);
      });
    } catch (err) {
      console.error('WebSocket upgrade error:', err);
      socket.destroy();
    }
  });

  wss.on('connection', (ws, req) => {
    const parts = req.url?.split('/').filter(Boolean);
    const roomId = parts[1];
    // docName is used as key in y-websocket's internal docs map
    setupWSConnection(ws, req, { docName: `${roomId}/main` });
  });

  return wss;
}
