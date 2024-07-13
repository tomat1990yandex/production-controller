import { GroupType } from '../types.ts';

interface GroupActionsProps {
  ws: WebSocket | null;
  token: string | null | undefined;
}

export const addGroup = (
  { ws, token }: GroupActionsProps,
  newGroupName: string
): void => {
  if (!token || !newGroupName.trim()) return;

  const newGroup: Partial<GroupType> = {
    groupName: newGroupName.trim(),
  };

  ws?.send(JSON.stringify({ action: 'createGroup', payload: newGroup, token }));
};

export const deleteGroup = (
  { ws, token }: GroupActionsProps,
  id: string
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'deleteGroup', payload: { _id: id }, token }));
};

export const updateGroup = (
  { ws, token }: GroupActionsProps,
  id: string,
  updatedGroup: Partial<GroupType>
): void => {
  if (!token) return;

  ws?.send(JSON.stringify({ action: 'updateGroup', payload: { _id: id, ...updatedGroup }, token }));
};
