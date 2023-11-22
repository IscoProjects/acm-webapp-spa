import { NanToZeroPipe } from './nan-to-zero.pipe';

describe('NanToZeroPipe', () => {
  it('create an instance', () => {
    const pipe = new NanToZeroPipe();
    expect(pipe).toBeTruthy();
  });
});
