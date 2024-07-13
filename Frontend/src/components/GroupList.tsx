import { FC } from 'react';
import { Button, Popconfirm } from 'antd';
import { CardList } from './CardList';
import { CardType, GroupType } from '../types';
import { QuestionCircleOutlined } from '@ant-design/icons';

interface GroupListProps {
  groups: GroupType[];
  cards: CardType[];
  deleteCard: (id: number) => void;
  updateCard: (id: number, updatedCard: Partial<CardType>) => void;
  addCard: (group: GroupType) => void;
  deleteGroup: (id: number) => void;
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
            <CardList
              cards={cards.filter(card => card.group._id === group._id)}
              onDelete={deleteCard}
              onUpdate={updateCard}
              isAuthenticated={isAuthenticated}
            />
          </div>
          {isAuthenticated && (
            <div className="group-actions">
              <Button onClick={() => addCard(group)}>Добавить карточку</Button>
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
