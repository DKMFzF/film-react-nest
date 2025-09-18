import { Test, TestingModule } from '@nestjs/testing';
import { OrderController } from '../order.controller';
import { OrderService } from '../order.service';
import { CreateOrderDto } from '../dto/order.dto';

describe('OrderController', () => {
  let controller: OrderController;
  let service: OrderService;

  beforeEach(async () => {
    const mockOrderService = {
      createOrder: jest.fn().mockResolvedValue({
        tickets: [
          { film: 'Matrix', session: 'evening', row: '3', seat: '5' },
          { film: 'Matrix', session: 'evening', row: '3', seat: '6' },
        ],
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [OrderController],
      providers: [
        { provide: OrderService, useValue: mockOrderService },
      ],
    }).compile();

    controller = module.get<OrderController>(OrderController);
    service = module.get<OrderService>(OrderService);
  });

  it('should call orderService.createOrder and return items', async () => {
    const dto: CreateOrderDto = {
      email: 'user@example.com',
      phone: '+1234567890',
      tickets: [
        { film: 'Matrix', session: 'evening', row: '3', seat: '5' },
        { film: 'Matrix', session: 'evening', row: '3', seat: '6' },
      ],
    };

    const result = await controller.createOrder(dto);

    expect(service.createOrder).toHaveBeenCalledWith(dto);
    expect(result).toEqual({
      items: [
        { film: 'Matrix', session: 'evening', row: '3', seat: '5' },
        { film: 'Matrix', session: 'evening', row: '3', seat: '6' },
      ],
    });
  });
});