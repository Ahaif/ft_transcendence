import { IsEmail, IsNotEmpty, IsString } from "class-validator";



export class auth_dto {

   @IsEmail()
   @IsNotEmpty()
   email: string;

   @IsString()
   @IsNotEmpty()
   password: string;
  }