import { notification } from 'antd';
import { GroupType } from '../types.ts';
import { Dispatch, SetStateAction } from 'react';

interface GroupActionsProps {
  ws: WebSocket | null;
  token: string | null | undefined;
  setGroups: Dispatch<SetStateAction<GroupType[]>>;
}

const showErrorNotification = (title: string, message: string) => {
  notification.error({
    message: title,
    description: message,
  });
};

export const addGroup = (
  { ws, token, setGroups }: GroupActionsProps,
  newGroupName: string
): void => {
  if (!token || !newGroupName.trim()) return;

  const newGroup: Partial<GroupType> = {
    groupName: newGroupName.trim(),
  };

  ws?.send(JSON.stringify({ action: 'createGroup', payload: newGroup, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'createGroup') {
      setGroups((prevGroups) => [...prevGroups, message.payload]);
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};

export const deleteGroup = (
  { ws, token, setGroups }: GroupActionsProps,
  id: number
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'deleteGroup', payload: { _id: id }, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'deleteGroup') {
      setGroups((prevGroups) => prevGroups.filter((group) => group._id !== id));
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};

export const updateGroup = (
  { ws, token, setGroups }: GroupActionsProps,
  id: number,
  updatedGroup: Partial<GroupType>
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'updateGroup', payload: { _id: id, ...updatedGroup }, token }));

  ws?.addEventListener('message', (event) => {
    const message = JSON.parse(event.data);
    if (message.action === 'updateGroup') {
      setGroups((prevGroups) =>
        prevGroups.map((group) => (group._id === id ? message.payload : group))
      );
    } else if (message.action === 'error') {
      showErrorNotification(message.payload, message.message);
    }
  });
};
