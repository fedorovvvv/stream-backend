import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, Length, MinLength } from 'class-validator';

@InputType()
export class LoginInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  public login: string;

  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  public password: string;

  @Field(() => String, { nullable: true })
  @IsString()
  @IsOptional()
  @Length(6, 6)
  public pin?: string;
}
