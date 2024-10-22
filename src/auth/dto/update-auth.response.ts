import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

@InputType()
export class UpdateAuthResponse {
  @Field(() => String)
  refreshToken: string;

  @Field(() => String)
  accessToken: string;
}
