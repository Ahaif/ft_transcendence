import { Body, Controller, Get, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { auth_dto } from "src/auth/dto";





@Controller('users')
export class UserController{
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getme(@Body() dto : auth_dto){

        return dto.password
    }
}