import { Test, TestingModule } from '@nestjs/testing';
import { TwofactorController } from './twofactor.controller';

describe('TwofactorController', () => {
  let controller: TwofactorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TwofactorController],
    }).compile();

    controller = module.get<TwofactorController>(TwofactorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
