import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardType, GroupType } from './types';
import './App.css';
import { notification } from 'antd';
import { AdminPage } from './components/AdminPage';
import { GroupList } from './components/GroupList';
import { GroupModal } from './components/GroupModal';
import { Header } from './components/Header';
import { addGroup, deleteGroup, updateGroup } from './actions/groupActions';
import { addCard, deleteCard, updateCard } from './actions/cardActions';
import { useAuth } from './hooks/useAuth.ts';
import { WS_URL } from './constants/constants.ts';

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
  const  authContext = useAuth();

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

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
          setCards(message.payload);
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
          setGroups(message.payload);
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
      console.log('Вы отключены от WebSocket сервера');
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
      description: message
    });
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
      updateGroup({ ws, token: authContext?.token }, selectedGroup._id, { groupName: editedGroupName });
    }
    setIsEditModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditedGroupName('');
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    addGroup({ ws, token: authContext?.token }, newGroupName);
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
            <Header handleAddGroup={handleAddGroup} isAuthenticated={!!authContext?.token}
                    logout={authContext?.logout} />
            <main>
              <GroupList
                groups={groups}
                cards={cards}
                deleteCard={(id: string) => deleteCard({ ws, token: authContext?.token, logout: authContext?.logout, setCards}, id)}
                updateCard={(id: string, updatedCard: Partial<CardType>) =>
                  updateCard({ ws, token: authContext?.token, setCards }, id, updatedCard)
                }
                addCard={(groupName) =>
                  addCard({ ws, token: authContext?.token, setCards }, {
                    title: 'Новая карточка',
                    status: 'green',
                    text: '',
                    group: groupName
                  })
                }
                deleteGroup={(id: string) => deleteGroup({ ws, token: authContext?.token }, id)}
                handleEditGroup={handleEditGroup}
                handleGroupSelect={handleGroupSelect}
                isAuthenticated={!!authContext?.token}
              />
            </main>
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
          </div>
        }
      />
      <Route path="/admin" element={<AdminPage />} />
    </Routes>
  );
};
