import { IsNotEmpty, IsString, IsAlphanumeric, Length, IsNumber, IsDecimal } from 'class-validator';
import { Transform, TransformFnParams } from 'class-transformer';
export class GroupDTO {
    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    roomName: string;

    @IsString()
    @Length(0, 20)
    password: string;

    isPrivate?: boolean;
}


export class PrivateMessageDTO {
    @IsNotEmpty()
    @Length(1, 100)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    message: string;

    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    to: string;
}


export class GroupMessageDTO {
    @IsNotEmpty()
    @Length(1, 100)
    @IsString()
    @Transform(({ value }: TransformFnParams) => value?.trim())
    message: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    group: string;
}

export class MuteDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 20)
    username: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    groupName: string;

    @IsNotEmpty()
    @IsNumber()
    duration: number;
}

export class ChangePasswordDTO {
    @IsNotEmpty()
    @IsString()
    @Length(1, 10)
    groupName: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 20)
    newPassword: string;
}

