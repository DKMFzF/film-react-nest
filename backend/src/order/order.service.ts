import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

import { FilmsService } from '../films/films.service';
import { CreateOrderDto } from './dto/order.dto';
import { Order } from './entities/order.entity';
import { OrdersRepository } from '../repository/order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly ordersRepository: OrdersRepository,
    private readonly filmsService: FilmsService,
  ) {}

  async createOrder(createOrderDto: CreateOrderDto): Promise<Order> {
    const { email, phone, tickets } = createOrderDto;

    for (const ticket of tickets) {
      const { film: filmId, session: sessionId, row, seat } = ticket;

      const film = await this.filmsService.findById(filmId);
      if (!film) {
        throw new NotFoundException(`Film with ID ${filmId} not found`);
      }

      const session = film.schedule.find((s) => s.id === sessionId);
      if (!session) {
        throw new NotFoundException(`Session with ID ${sessionId} not found`);
      }

      const seatId = `${row}:${seat}`;
      if (session.taken.includes(seatId)) {
        throw new ConflictException(`Seat ${seatId} is already taken`);
      }
      session.taken.push(seatId);
      await this.filmsService.saveFilm(film);
    }

    const order = new Order();
    order.email = email;
    order.phone = phone.toString();
    order.tickets = tickets;

    return this.ordersRepository.createOrder(order);
  }
}
