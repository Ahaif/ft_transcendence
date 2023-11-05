import { Test, TestingModule } from '@nestjs/testing';
import { Friendship } from './friendship';

describe('Friendship', () => {
  let provider: Friendship;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Friendship],
    }).compile();

    provider = module.get<Friendship>(Friendship);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
