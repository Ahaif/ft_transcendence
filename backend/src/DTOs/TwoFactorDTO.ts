import { IsNotEmpty, IsDecimal, Length, IsNumber, IsNumberString, Matches} from 'class-validator';


export class TwoFactorDTO {
    @IsNotEmpty()
    @IsNumberString()
    @Matches(/^\d{6}$/, { message: 'Invalid code' })
    token: string;

}
