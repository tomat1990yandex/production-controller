import { ChangeEvent, FC, useContext, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { CardType, GroupType } from './types';
import './App.css';
import { AuthContext } from './contexts/AuthContext';
import { notification } from 'antd';
import { AdminPage } from './components/AdminPage';
import { GroupList } from './components/GroupList';
import { GroupModal } from './components/GroupModal';
import { Header } from './components/Header';
import { addGroup, deleteGroup, updateGroup } from './actions/groupActions';
import { addCard, deleteCard, updateCard } from './actions/cardActions';

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
          setCards(message.payload);
          break;
        case 'getGroups':
          setGroups(message.payload);
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
      updateGroup({ ws, token: authContext?.token, setGroups }, selectedGroup._id, { groupName: editedGroupName });
    }
    setIsEditModalVisible(false);
  };

  const handleEditModalCancel = () => {
    setIsEditModalVisible(false);
    setEditedGroupName('');
  };

  const handleModalOk = () => {
    setIsModalVisible(false);
    addGroup({ ws, token: authContext?.token, setGroups }, newGroupName);
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
                deleteCard={(id: string) => deleteCard({ ws, token: authContext?.token, setCards }, id)}
                updateCard={(id: string, updatedCard: Partial<CardType>) =>
                  updateCard({ ws, token: authContext?.token, setCards }, id, updatedCard)
                }
                addCard={(_id) =>
                  addCard({ ws, token: authContext?.token, setCards }, {
                    title: 'New Card',
                    status: 'green',
                    text: '',
                    group: _id
                  })
                }
                deleteGroup={(id: string) => deleteGroup({ ws, token: authContext?.token, setGroups }, id)}
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
