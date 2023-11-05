import {IsNotEmpty, IsString, IsAlphanumeric, Length, IsEmpty} from 'class-validator';

export class UserDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @Length(3, 20)
    username: string;
}

export class FriendDTO {
    @IsNotEmpty()
    @IsString()
    @IsAlphanumeric()
    @Length(3, 20)
    friend: string;
}


