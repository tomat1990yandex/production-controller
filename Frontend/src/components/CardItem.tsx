import { ChangeEvent, FC, useEffect, useState } from 'react';
import { Button, Card, ConfigProvider, Input, Popconfirm, Select } from 'antd';
import { CardStatus, CardType } from '../types';
import { QuestionCircleOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Option } = Select;

interface CardItemProps {
  card: CardType;
  onDelete: (id: string) => void;
  onUpdate: (id: string, updatedCard: Partial<CardType>) => void;
  isAuthenticated: boolean;
}

export const CardItem: FC<CardItemProps> = ({ card, onDelete, onUpdate, isAuthenticated }) => {
  const [localCard, setLocalCard] = useState({ ...card, isEditing: false });

  useEffect(() => {
    setLocalCard({ ...card, isEditing: localCard.isEditing });
  }, [card, localCard.isEditing]);

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
    if (localCard._id !== undefined) {
      onUpdate(localCard._id, {
        title: localCard.title,
        text: localCard.text,
        status: localCard.status
      });
      setLocalCard({ ...localCard, isEditing: false });
    }
  };

  const handleEdit = (): void => {
    setLocalCard({ ...localCard, isEditing: true });
  };

  const handleDelete = (): void => {
    if (localCard._id) {
      onDelete(localCard._id);
    }
  };

  const getCardBackgroundColor = (status: CardStatus): string => {
    switch (status) {
      case 'green':
        return 'linear-gradient(to top, #1d711d, #2b8523, #3a9929, #49ad2e, #59c233)';
      case 'yellow':
        return 'linear-gradient(to top, #71711d, #848322, #989528, #ada82d, #c2bb33)';
      case 'red':
        return 'linear-gradient(to top, #71201d, #852923, #993228, #ad3b2e, #c24533)';
      default:
        return 'white';
    }
  };

  return (
    <ConfigProvider
      theme={{
        components: {
          Card: {
            padding: 12,
            paddingLG: 12,
            colorBgContainer: getCardBackgroundColor(localCard.status),
            colorBorderSecondary: 'none'
          },
          Input: {
            colorTextDisabled: '#000000e0',
            colorBgContainerDisabled: '#ffffffde'
          },
          Select: {
            colorTextDisabled: '#000000e0',
            colorBgContainerDisabled: '#ffffffde'
          },
          Button: {}
        }
      }}
    >
      <Card
        key={card._id}
        title={
          <Input
            value={localCard.title}
            onChange={handleTitleChange}
            disabled={!localCard.isEditing}
          />
        }
        extra={
          isAuthenticated && (
            <Popconfirm
              title="Удалить карточку?"
              description="Вы уверены, что хотите удалить карточку?"
              icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
              onConfirm={handleDelete}
            >
              <Button style={{ marginLeft: 10 }} danger disabled={!localCard.isEditing}>
                Удалить
              </Button>
            </Popconfirm>
          )
        }
      >
        <div className="card-body">
          <Select
            value={localCard.status}
            onChange={handleStatusChange}
            disabled={!localCard.isEditing}
          >
            <Option value="green">Замечаний нет</Option>
            <Option value="yellow">Необходима диагностика</Option>
            <Option value="red">Требуется ремонт</Option>
          </Select>
          <TextArea
            value={localCard.text}
            onChange={handleTextChange}
            rows={3}
            disabled={!localCard.isEditing}
          />
          <div>
            {localCard.isEditing ? (
              <Button type="primary" className="cards-button" onClick={handleSave}>Сохранить</Button>
            ) : (
              isAuthenticated &&
              <Button type="default" className="cards-button" onClick={handleEdit}>Редактировать</Button>
            )}
          </div>
        </div>
      </Card>
    </ConfigProvider>
  );
};
