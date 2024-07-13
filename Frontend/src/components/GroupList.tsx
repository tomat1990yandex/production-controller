import { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { CardType, GroupType } from '../types';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { CardItem } from './CardItem.tsx';

interface GroupListProps {
  groups: GroupType[];
  cards: CardType[];
  deleteCard: (id: string) => void;
  updateCard: (id: string, updatedCard: Partial<CardType>) => void;
  addCard: (group: string) => void;
  deleteGroup: (id: string) => void;
  handleEditGroup: (group: GroupType) => void;
  handleGroupSelect: (group: GroupType) => void;
  isAuthenticated: boolean;
}

export const GroupList: FC<GroupListProps> = ({
                                                groups,
                                                cards,
                                                deleteCard,
                                                updateCard,
                                                addCard,
                                                deleteGroup,
                                                handleEditGroup,
                                                handleGroupSelect,
                                                isAuthenticated
                                              }) => {
  return (
    <div className="groups-container">
      {groups.map(group => (
        <div key={group._id} className="group-wrapper">
          <h2 className="group-title">{group.groupName}</h2>
          <div className="group" onClick={() => handleGroupSelect(group)}>
            <div className="cards-container">
              {cards.filter(card => card.group === group.groupName).map(card =>
                <CardItem
                  key={card._id}
                  card={card}
                  onDelete={deleteCard}
                  onUpdate={updateCard}
                  isAuthenticated={isAuthenticated}
                />
              )}
            </div>
          </div>
          {isAuthenticated && (
            <div className="group-actions">
              <Button onClick={() => addCard(group.groupName)}>Добавить карточку</Button>
              <Button onClick={() => handleEditGroup(group)}>Редактировать группу</Button>
              <Popconfirm
                title="Удалить группу?"
                description="Вы уверены что хотите удалить группу?"
                icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
                onConfirm={() => deleteGroup(group._id)}
              >
                <Button danger>Удалить группу</Button>
              </Popconfirm>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
