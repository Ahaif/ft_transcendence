type Position = {
  x: Number;
  y: Number;
  z: Number;
};
type GameDataType = {
  ball: Position;
  player1: Position;
  player2: Position;
  score: {
    player1: Number;
    player2: Number;
  };
};
type userDataInterface = {
  id: number;
  username: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  userName: string;
  imageUrl: string;
  tfaSecret: string | null;
  isTfaEnabled: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  isFistSignIn: true;
};
type RoomDataType = {
  player1: string;
  player2: string;
  roomName: string;
  winner?: string;
  status: string;
  type: string;
};

enum userStatus {
  MUTED = 'muted',
  ACTIVE = 'active',
  BANNED = 'banned',
  PENDING = 'pending',
}

//TODO remove all not used types

interface IFMessage {
  body: string;
  createdAt: string;
  sentBy: {
    id: number;
    firstName: string;
    lastName: string;
  };
}

interface IFUser {
  user_name: string;
  status_user: string; //onine offline mute..
  role: string; //admin ,member or owner
}

export enum status {
  PUBLIC = 'PUBLIC',
  PROTECTED = 'PROTECTED',
  PRIVATE = 'PRIVATE',
}
interface IConversation {
  id: number;
  name: string;
  type?: string; //protected public private in case of Room
  status?: string; // active blocked muted in case of Dm
}

interface IDm {
  conversationId: number;
  firstName: string;
  lastName: string;
  userName: string;
}

//a channel memebr type
interface IMember {
  id: string;
  firstName: string;
  lastName: string;
  userName: string;
  imageUrl: string;
  status: userStatus;
  is_admin: boolean;
  is_owner: boolean;
}

export type {
  IFMessage,
  IFUser,
  IConversation,
  IDm,
  IMember,
  Position,
  GameDataType,
  userDataInterface,
  RoomDataType,
};
