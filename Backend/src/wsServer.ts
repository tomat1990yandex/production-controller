import WebSocket, { WebSocketServer } from 'ws';
import { createCard, deleteCard, findAllCards, updateCard } from './services/cardService';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws: WebSocket) => {
    console.log('Client connected');

    ws.on('message', async (message: string) => {
        const data = JSON.parse(message);
        const { action, payload } = data;

        switch (action) {
            case 'getCards':
                try {
                    const cards = await findAllCards();
                    ws.send(JSON.stringify({ action: 'getCards', payload: cards }));
                } catch (error) {
                    ws.send(JSON.stringify({ action: 'error', payload: 'Internal Server Error' }));
                }
                break;
            case 'createCard':
                try {
                    const newCard = await createCard(payload);
                    ws.send(JSON.stringify({ action: 'createCard', payload: newCard }));
                } catch (error) {
                    ws.send(JSON.stringify({ action: 'error', payload: 'Server error' }));
                }
                break;
            case 'updateCard':
                try {
                    const { id, ...updateData } = payload;
                    const card = await updateCard(id, updateData);
                    if (!card) {
                        ws.send(JSON.stringify({ action: 'error', payload: 'Card not found' }));
                    } else {
                        ws.send(JSON.stringify({ action: 'updateCard', payload: card }));
                    }
                } catch (error) {
                    ws.send(JSON.stringify({ action: 'error', payload: 'Server error' }));
                }
                break;
            case 'deleteCard':
                try {
                    const { id } = payload;
                    const card = await deleteCard(id);
                    if (!card) {
                        ws.send(JSON.stringify({ action: 'error', payload: 'Card not found' }));
                    } else {
                        ws.send(JSON.stringify({ action: 'deleteCard', payload: id }));
                    }
                } catch (error) {
                    ws.send(JSON.stringify({ action: 'error', payload: 'Server error' }));
                }
                break;
            default:
                ws.send(JSON.stringify({ action: 'error', payload: 'Unknown action' }));
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });

    ws.on('error', (error) => {
        console.log('WebSocket error:', error);
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
