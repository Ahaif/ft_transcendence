import { Test, TestingModule } from '@nestjs/testing';
import { Twofactor } from './twofactor';

describe('Twofactor', () => {
  let provider: Twofactor;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [Twofactor],
    }).compile();

    provider = module.get<Twofactor>(Twofactor);
  });

  it('should be defined', () => {
    expect(provider).toBeDefined();
  });
});
