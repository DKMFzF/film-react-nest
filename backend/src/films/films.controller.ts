import { Controller, Get, Param } from '@nestjs/common';
import { FilmsService } from './films.service';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Get()
  async findAll() {
    const allFilms = await this.filmsService.findAll();
    return { items: allFilms };
  }

  @Get(':id/schedule')
  async findSchedule(@Param('id') id: string) {
    const oneFilm = await this.filmsService.findSchedule(id);
    return { items: oneFilm };
  }
}
