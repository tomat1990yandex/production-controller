import React, { ChangeEvent } from 'react';
import { Button, Input } from 'antd';

interface AddCardFormProps {
    newCardTitle: string;
    onTitleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onAddCard: () => void;
}

export const AddCardForm: React.FC<AddCardFormProps> = ({ newCardTitle, onTitleChange, onAddCard }) => {
    return (
      <div className="add-card">
          <Input
            placeholder="Card Title"
            value={newCardTitle}
            onChange={onTitleChange}
            style={{ width: '200px', marginRight: '10px' }}
          />
          <Button type="primary" onClick={onAddCard}>Add Card</Button>
      </div>
    );
};

