import React, { ChangeEvent, useState } from 'react';
import { Button, Card, Input, Select } from 'antd';
import { CardStatus, CardType } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface CardItemProps {
    card: CardType;
    onDelete: (id: number) => void;
    onUpdate: (id: number, key: keyof CardType, value: string | CardStatus | boolean) => void;
    isAuthenticated: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onDelete, onUpdate, isAuthenticated }) => {
    const [localCard, setLocalCard] = useState({ ...card, isEditing: false });

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setLocalCard({ ...localCard, title: e.target.value });
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        setLocalCard({ ...localCard, text: e.target.value });
    };

    const handleStatusChange = (value: CardStatus): void => {
        setLocalCard({ ...localCard, status: value });
    };

    const handleSave = (): void => {
        onUpdate(localCard._id, 'title', localCard.title);
        onUpdate(localCard._id, 'text', localCard.text);
        onUpdate(localCard._id, 'status', localCard.status);
        setLocalCard({ ...localCard, isEditing: false });
    };

    const handleEdit = (): void => {
        setLocalCard({ ...localCard, isEditing: true });
    };

    return (
      <Card
        key={card._id}
        title={
            <Input
              value={localCard.title}
              onChange={handleTitleChange}
              disabled={!localCard.isEditing}
              style={{ width: '100%' }}
            />
        }
        extra={
          isAuthenticated && (
            <Button type="link"
                    disabled={!localCard.isEditing}
                    onClick={() => onDelete(card._id)}>Delete</Button>
          )
        }
        style={{
            borderLeft: `5px solid ${card.status}`,
            marginBottom: '10px'
        }}
      >
          <Select
            value={localCard.status}
            onChange={handleStatusChange}
            disabled={!localCard.isEditing}
            style={{ marginBottom: '10px' }}
          >
              <Option value="green">Green</Option>
              <Option value="yellow">Yellow</Option>
              <Option value="red">Red</Option>
          </Select>
          <TextArea
            value={localCard.text}
            onChange={handleTextChange}
            rows={4}
            disabled={!localCard.isEditing}
          />
          <div style={{ marginTop: '10px' }}>
              {localCard.isEditing ? (
                <Button type="primary" onClick={handleSave}>Save</Button>
              ) : (
                isAuthenticated && <Button type="default" onClick={handleEdit}>Edit</Button>
              )}
          </div>
      </Card>
    );
};
