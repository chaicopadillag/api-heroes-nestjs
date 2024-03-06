import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateHeroDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  superhero: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  publisher: string;

  @IsNotEmpty()
  @IsString()
  alter_ego: string;

  @IsNotEmpty()
  @IsString()
  first_appearance: string;

  @IsNotEmpty()
  @IsString()
  characters: string;

  @IsOptional()
  @IsString()
  alt_img?: string;
}
