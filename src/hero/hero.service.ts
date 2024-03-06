import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { readFileSync } from 'fs';
import { Model } from 'mongoose';

import * as path from 'path';
import { CreateHeroDto } from './dto/create-hero.dto';
import { UpdateHeroDto } from './dto/update-hero.dto';
import { Hero } from './entities/hero.entity';

@Injectable()
export class HeroService {
  constructor(@InjectModel(Hero.name) private heroModel: Model<Hero>) {}

  async create(createHeroDto: CreateHeroDto) {
    const hero = await this.heroModel
      .findOne({ superhero: createHeroDto.superhero })
      .lean();

    if (hero) {
      throw new UnprocessableEntityException(
        `Ya existe un heroe con el nombre ${createHeroDto.superhero}`,
      );
    }

    const newHero = await this.heroModel.create(createHeroDto);
    newHero.save();
    return newHero;
  }

  async findAll(keyword: string) {
    let query = {};

    if (keyword) {
      const regex = new RegExp(keyword, 'i');
      query = {
        superhero: { $regex: regex },
      };
    }

    return this.heroModel.find(query).lean();
  }

  async findOne(id: string) {
    const hero = await this.heroModel.findById(id);

    if (!hero) {
      throw new NotFoundException('Hero no encontrado');
    }

    return hero;
  }

  async update(id: string, updateHeroDto: UpdateHeroDto) {
    const hero = await this.heroModel.findByIdAndUpdate(
      id,
      { $set: updateHeroDto },
      { new: true },
    );

    if (!hero) {
      throw new NotFoundException('Hero no encontrado');
    }

    return hero;
  }

  async remove(id: string) {
    const hero = await this.heroModel.findOneAndDelete({ _id: id });

    if (!hero) {
      throw new NotFoundException('Hero no encontrado');
    }
  }

  async sendSeeders() {
    const jsonString = await readFileSync(
      path.resolve(__dirname, '../../src/seeder/db.json'),
      {
        encoding: 'utf-8',
      },
    );
    const db = JSON.parse(jsonString);
    const collections = [];

    for (const hero of db.heroes) {
      const { id, ...rest } = hero;
      collections.push({
        ...rest,
        slug: id,
      });
    }
    await this.heroModel.deleteMany({});

    await this.heroModel.insertMany(collections);
  }
}
