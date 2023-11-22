import { NullPipePipe } from './null-pipe.pipe';

describe('NullPipePipe', () => {
  it('create an instance', () => {
    const pipe = new NullPipePipe();
    expect(pipe).toBeTruthy();
  });
});
