import { FC } from 'react';
import { Button } from 'antd';
import { CardList } from './CardList';
import { CardType, GroupType } from '../types';

interface GroupListProps {
    groups: GroupType[];
    cards: CardType[];
    deleteCard: (id: number) => void;
    updateCard: (id: number, updatedCard: Partial<CardType>) => void;
    addCard: () => void;
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
          {groups.map((group) => (
            <div key={group._id} className="group" onClick={() => handleGroupSelect(group)}>
                <h2>{group.groupName}</h2>
                <CardList
                  cards={cards.filter((card) => card.group?._id === group._id)}
                  onDelete={deleteCard}
                  onUpdate={updateCard}
                  onAddCard={addCard}
                  isAuthenticated={isAuthenticated}
                />
                {isAuthenticated && (
                  <div className="group-actions">
                      <Button onClick={() => deleteGroup(group._id)}>Удалить группу</Button>
                      <Button onClick={() => handleEditGroup(group)}>Редактировать группу</Button>
                  </div>
                )}
            </div>
          ))}
      </div>
    );
};
