import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { OrderDto } from './dto/order.dto';
import { Film, FilmDocument } from '../films/schemas/film.schema';

@Injectable()
export class OrderService {
  constructor(
    @InjectModel(Film.name) private filmModel: Model<FilmDocument>,
  ) {}

  async bookSeats(orderDto: OrderDto): Promise<any> {
    const { filmId, scheduleId, seats } = orderDto;

    const film = await this.filmModel.findOne({ id: filmId }).exec();
    if (!film) {
      throw new NotFoundException(`Film with ID "${filmId}" not found.`);
    }

    const schedule = film.schedule.find(s => s.id === scheduleId);
    if (!schedule) {
      throw new NotFoundException(`Schedule with ID "${scheduleId}" not found.`);
    }

    const alreadyTakenSeats = seats.filter(seat => schedule.taken.includes(seat));
    if (alreadyTakenSeats.length > 0) {
      throw new BadRequestException(`Seats are already taken: ${alreadyTakenSeats.join(', ')}`);
    }

    for (const seat of seats) {
      const [row, col] = seat.split(':').map(Number);
      if (row < 1 || row > schedule.rows || col < 1 || col > schedule.seats || isNaN(row) || isNaN(col)) {
        throw new BadRequestException(`Invalid seat coordinates: ${seat}. The format should be "row:col".`);
      }
    }

    const updatedFilm = await this.filmModel.findOneAndUpdate(
      { 'id': filmId, 'schedule.id': scheduleId },
      { '$addToSet': { 'schedule.$.taken': { '$each': seats } } },
      { new: true }
    ).exec();
    
    if (!updatedFilm) {
      throw new NotFoundException(`Film or schedule not found during update.`);
    }

    return { message: 'Seats booked successfully', bookedSeats: seats };
  }
}