import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardType, GroupType } from './types';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { notification } from "antd";
import { AdminPage } from "./components/AdminPage";
import { GroupList } from "./components/GroupList";
import { GroupModal } from "./components/GroupModal";
import { Header } from "./components/Header";

const initialCards: CardType[] = [];
const initialGroups: GroupType[] = [];

export const App: FC = () => {
    const [cards, setCards] = useState<CardType[]>(initialCards);
    const [groups, setGroups] = useState<GroupType[]>(initialGroups);
    const [ws, setWs] = useState<WebSocket | null>(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isEditModalVisible, setIsEditModalVisible] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');
    const [selectedGroup, setSelectedGroup] = useState<GroupType | null>(null);
    const [editedGroupName, setEditedGroupName] = useState('');
    const authContext = useContext(AuthContext);

    useEffect(() => {
        const socket = new WebSocket('ws://localhost:8080');

        socket.onopen = () => {
            console.log('Connected to WebSocket server');
            socket.send(JSON.stringify({ action: 'getCards' }));
            socket.send(JSON.stringify({ action: 'getGroups' }));
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            if (!message.payload) return;

            if (message.action === 'error') {
                showErrorNotification(message.payload, message.message);
                return;
            }

            switch (message.action) {
                case 'getCards':
                    setCards(message.payload || []);
                    break;
                case 'createCard':
                    setCards((prevCards) => [...prevCards, message.payload]);
                    break;
                case 'updateCard':
                    setCards((prevCards) =>
                      prevCards.map((card) => (card._id === message.payload._id ? message.payload : card))
                    );
                    break;
                case 'deleteCard':
                    setCards((prevCards) => prevCards.filter((card) => card._id !== message.payload));
                    break;
                case 'getGroups':
                    setGroups(message.payload || []);
                    break;
                case 'createGroup':
                    setGroups((prevGroups) => [...prevGroups, message.payload]);
                    break;
                case 'updateGroup':
                    setGroups((prevGroups) =>
                      prevGroups.map((group) => (group._id === message.payload._id ? message.payload : group))
                    );
                    break;
                case 'deleteGroup':
                    setGroups((prevGroups) => prevGroups.filter((group) => group._id !== message.payload));
                    break;
                default:
                    break;
            }
        };

        socket.onclose = () => {
            console.log('Отключение от WebSocket server');
        };

        socket.onerror = (error) => {
            console.log('Ошибка WebSocket:', error);
        };

        setWs(socket);

        return () => {
            socket.close();
        };
    }, []);

    const showErrorNotification = (title: string, message: string) => {
        notification.error({
            message: title,
            description: message,
        });
    };

    const addCard = (): void => {
        if (!authContext?.token || !selectedGroup) return;

        const newCard: CardType = {
            title: 'New Card',
            status: 'green',
            text: '',
            group: selectedGroup
        };

        ws?.send(JSON.stringify({ action: 'createCard', payload: newCard, token: authContext.token }));
    };

    const deleteCard = (id: number): void => {
        if (!authContext?.token) return;

        ws?.send(JSON.stringify({ action: 'deleteCard', payload: { _id: id }, token: authContext.token }));
    };

    const updateCard = (id: number, updatedCard: Partial<CardType>): void => {
        if (!authContext?.token) return;

        const updatedCards = cards.map((card) => (card._id === id ? { ...card, ...updatedCard } : card));
        setCards(updatedCards);

        const cardToUpdate = updatedCards.find((card) => card._id === id);
        if (cardToUpdate) {
            ws?.send(JSON.stringify({ action: 'updateCard', payload: cardToUpdate, token: authContext.token }));
        }
    };

    const addGroup = (): void => {
        if (!authContext?.token || !newGroupName.trim()) return;

        const newGroup: Partial<GroupType> = {
            groupName: newGroupName.trim()
        };

        ws?.send(JSON.stringify({ action: 'createGroup', payload: newGroup, token: authContext.token }));
        setNewGroupName('');
    };

    const deleteGroup = (id: number): void => {
        if (!authContext?.token) return;

        ws?.send(JSON.stringify({ action: 'deleteGroup', payload: { _id: id }, token: authContext.token }));
    };

    const updateGroup = (id: number, updatedGroup: Partial<GroupType>): void => {
        if (!authContext?.token) return;

        const updatedGroups = groups.map((group) => (group._id === id ? { ...group, ...updatedGroup } : group));
        setGroups(updatedGroups);

        const groupToUpdate = updatedGroups.find((group) => group._id === id);
        if (groupToUpdate) {
            ws?.send(JSON.stringify({ action: 'updateGroup', payload: groupToUpdate, token: authContext.token }));
        }
    };

    const handleAddGroup = () => {
        setIsModalVisible(true);
    };

    const handleEditGroup = (group: GroupType) => {
        setSelectedGroup(group);
        setEditedGroupName(group.groupName || '');
        setIsEditModalVisible(true);
    };

    const handleEditModalOk = () => {
        if (selectedGroup) {
            updateGroup(selectedGroup._id, { groupName: editedGroupName });
        }
        setIsEditModalVisible(false);
    };

    const handleEditModalCancel = () => {
        setIsEditModalVisible(false);
        setEditedGroupName('');
    };

    const handleModalOk = () => {
        setIsModalVisible(false);
        addGroup();
    };

    const handleModalCancel = () => {
        setIsModalVisible(false);
        setNewGroupName('');
    };

    const handleGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setNewGroupName(e.target.value);
    };

    const handleEditGroupNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        setEditedGroupName(e.target.value);
    };

    const handleGroupSelect = (group: GroupType) => {
        setSelectedGroup(group);
    };

    return (
      <Routes>
          <Route
            path="/"
            element={
                <div className="app-container">
                    <Header
                      handleAddGroup={handleAddGroup}
                      isAuthenticated={!!authContext?.token}
                      logout={authContext?.logout}
                    />
                    <main>
                        <GroupModal
                          isModalVisible={isModalVisible}
                          handleModalOk={handleModalOk}
                          handleModalCancel={handleModalCancel}
                          newGroupName={newGroupName}
                          handleGroupNameChange={handleGroupNameChange}
                        />
                        <GroupModal
                          isModalVisible={isEditModalVisible}
                          handleModalOk={handleEditModalOk}
                          handleModalCancel={handleEditModalCancel}
                          newGroupName={editedGroupName}
                          handleGroupNameChange={handleEditGroupNameChange}
                        />
                        <GroupList
                          groups={groups}
                          cards={cards}
                          deleteCard={deleteCard}
                          updateCard={updateCard}
                          addCard={addCard}
                          deleteGroup={deleteGroup}
                          handleEditGroup={handleEditGroup}
                          handleGroupSelect={handleGroupSelect}
                          isAuthenticated={!!authContext?.token}
                        />
                    </main>
                </div>
            }
          />
          <Route path="/admin" element={<AdminPage />} />
      </Routes>
    );
};
