import React, { ChangeEvent } from 'react';
import { Card, Button, Input, Select } from 'antd';
import { CardType, CardStatus } from '../types';

const { TextArea } = Input;
const { Option } = Select;

interface CardItemProps {
    card: CardType;
    onDelete: (id: number) => void;
    onUpdate: (id: number, key: keyof CardType, value: string | CardStatus | boolean) => void;
}

export const CardItem: React.FC<CardItemProps> = ({ card, onDelete, onUpdate }) => {
    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        onUpdate(card.id, 'title', e.target.value);
    };

    const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>): void => {
        onUpdate(card.id, 'text', e.target.value);
    };

    const handleStatusChange = (value: CardStatus): void => {
        onUpdate(card.id, 'status', value);
    };

    const handleSave = (): void => {
        onUpdate(card.id, 'isEditing', false);
    };

    const handleEdit = (): void => {
        onUpdate(card.id, 'isEditing', true);
    };

    return (
      <Card
        key={card.id}
        title={
            <Input
              value={card.title}
              onChange={handleTitleChange}
              disabled={!card.isEditing}
              style={{ width: '100%' }}
            />
        }
        extra={<Button type="link" onClick={() => onDelete(card.id)}>Delete</Button>}
        style={{
            borderLeft: `5px solid ${card.status}`,
            marginBottom: '10px'
        }}
      >
          <Select
            value={card.status}
            onChange={handleStatusChange}
            disabled={!card.isEditing}
            style={{ marginBottom: '10px' }}
          >
              <Option value="green">Green</Option>
              <Option value="yellow">Yellow</Option>
              <Option value="red">Red</Option>
          </Select>
          <TextArea
            value={card.text}
            onChange={handleTextChange}
            rows={4}
            disabled={!card.isEditing}
          />
          <div style={{ marginTop: '10px' }}>
              {card.isEditing ? (
                <Button type="primary" onClick={handleSave}>Save</Button>
              ) : (
                <Button type="default" onClick={handleEdit}>Edit</Button>
              )}
          </div>
      </Card>
    );
};
