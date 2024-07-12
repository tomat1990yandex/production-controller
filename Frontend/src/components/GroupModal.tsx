import { ChangeEvent, FC } from 'react';
import { Input, Modal } from 'antd';

interface GroupModalProps {
  isModalVisible: boolean;
  handleModalOk: () => void;
  handleModalCancel: () => void;
  newGroupName: string;
  handleGroupNameChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

export const GroupModal: FC<GroupModalProps> = ({
                                                  isModalVisible,
                                                  handleModalOk,
                                                  handleModalCancel,
                                                  newGroupName,
                                                  handleGroupNameChange
                                                }) => {
  return (
    <Modal
      title="Добавить/Редактировать группу"
      open={isModalVisible}
      onOk={handleModalOk}
      onCancel={handleModalCancel}
    >
      <Input
        placeholder="Введите название группы"
        value={newGroupName}
        onChange={handleGroupNameChange}
      />
    </Modal>
  );
};
