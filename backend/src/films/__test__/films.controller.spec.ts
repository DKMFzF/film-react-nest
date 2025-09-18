import { Test, TestingModule } from '@nestjs/testing';
import { FilmsController } from '../films.controller';
import { FilmsService } from '../films.service';

describe('FilmsController', () => {
  let controller: FilmsController;
  let service: FilmsService;

  beforeEach(async () => {
    const mockFilmsService = {
      findAll: jest.fn().mockResolvedValue(['film1', 'film2']),
      findSchedule: jest.fn().mockResolvedValue(['schedule1']),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [FilmsController],
      providers: [
        { provide: FilmsService, useValue: mockFilmsService },
      ],
    }).compile();

    controller = module.get<FilmsController>(FilmsController);
    service = module.get<FilmsService>(FilmsService);
  });

  it('should return all films', async () => {
    const result = await controller.findAll();

    expect(service.findAll).toHaveBeenCalled();
    expect(result).toEqual({ items: ['film1', 'film2'] });
  });

  it('should return schedule for film by id', async () => {
    const result = await controller.findSchedule('123');

    expect(service.findSchedule).toHaveBeenCalledWith('123');
    expect(result).toEqual({ items: ['schedule1'] });
  });
});