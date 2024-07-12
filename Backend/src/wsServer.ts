import WebSocket, { WebSocketServer } from 'ws';
import { createCard, deleteCard, findAllCards, updateCard } from './services/cardService';
import { createGroup, deleteGroup, findAllGroups, updateGroup } from './services/groupService';
import { JwtPayload, verify } from 'jsonwebtoken';

const wss = new WebSocketServer({ port: 8080 });

interface CustomJwtPayload extends JwtPayload {
  id: string;
}

wss.on('connection', (ws: WebSocket) => {
  console.log('Клиент подключен');

  ws.on('message', async (message: string) => {
    const data = JSON.parse(message);
    const { action, payload, token } = data;

    const checkAuthorization = (token: string): boolean => {
      try {
        const decoded = verify(token, process.env.JWT_SECRET!) as CustomJwtPayload;
        return !!decoded.id;
      } catch (error) {
        return false;
      }
    };

    const broadcast = (message: string) => {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(message);
        }
      });
    };

    switch (action) {
      case 'getCards':
        try {
          const cards = await findAllCards();
          ws.send(JSON.stringify({ action: 'getCards', payload: cards }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          ws.send(JSON.stringify({
            action: 'error',
            payload: 'Внутренняя ошибка сервера при получении карточек',
            message: errorMessage
          }));
        }
        break;
      case 'createCard':
      case 'updateCard':
      case 'deleteCard':
        if (!checkAuthorization(token)) {
          ws.send(JSON.stringify({ action: 'error', payload: 'Неавторизованный запрос' }));
          break;
        }
        try {
          if (action === 'createCard') {
            const newCard = await createCard(payload);
            broadcast(JSON.stringify({ action: 'createCard', payload: newCard }));
          } else if (action === 'updateCard') {
            const { _id, ...updateData } = payload;
            const card = await updateCard(_id, updateData);
            if (!card) {
              ws.send(JSON.stringify({ action: 'error', payload: 'Карточка не найдена' }));
            } else {
              broadcast(JSON.stringify({ action: 'updateCard', payload: card }));
            }
          } else if (action === 'deleteCard') {
            const { _id } = payload;
            const card = await deleteCard(_id);
            if (!card) {
              ws.send(JSON.stringify({ action: 'error', payload: 'Карточка не найдена' }));
            } else {
              broadcast(JSON.stringify({ action: 'deleteCard', payload: _id }));
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          ws.send(JSON.stringify({
            action: 'error',
            payload: 'Ошибка сервера при работе с карточками',
            message: errorMessage
          }));
        }
        break;
      case 'getGroups':
        try {
          const groups = await findAllGroups();
          ws.send(JSON.stringify({ action: 'getGroups', payload: groups }));
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          ws.send(JSON.stringify({
            action: 'error',
            payload: 'Внутренняя ошибка сервера при получении групп',
            message: errorMessage
          }));
        }
        break;
      case 'createGroup':
      case 'updateGroup':
      case 'deleteGroup':
        if (!checkAuthorization(token)) {
          ws.send(JSON.stringify({ action: 'error', payload: 'Неавторизованный запрос' }));
          break;
        }
        try {
          if (action === 'createGroup') {
            const newGroup = await createGroup(payload);
            broadcast(JSON.stringify({ action: 'createGroup', payload: newGroup }));
          } else if (action === 'updateGroup') {
            const { _id, ...updateData } = payload;
            const group = await updateGroup(_id, updateData);
            if (!group) {
              ws.send(JSON.stringify({ action: 'error', payload: 'Группа не найдена' }));
            } else {
              broadcast(JSON.stringify({ action: 'updateGroup', payload: group }));
            }
          } else if (action === 'deleteGroup') {
            const { _id } = payload;
            const group = await deleteGroup(_id);
            if (!group) {
              ws.send(JSON.stringify({ action: 'error', payload: 'Группа не найдена' }));
            } else {
              broadcast(JSON.stringify({ action: 'deleteGroup', payload: _id }));
            }
          }
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Неизвестная ошибка';
          ws.send(JSON.stringify({
            action: 'error',
            payload: 'Ошибка сервера при работе с группами',
            message: errorMessage
          }));
        }
        break;
      default:
        ws.send(JSON.stringify({ action: 'error', payload: 'Неизвестное действие' }));
    }
  });

  ws.on('close', () => {
    console.log('Клиент отключен');
  });

  ws.on('error', (error) => {
    console.log('Ошибка WebSocket:', error);
  });
});

console.log('WebSocket сервер работает');
