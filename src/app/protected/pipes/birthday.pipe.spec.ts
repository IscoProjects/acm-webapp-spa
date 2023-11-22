import { BirthdayPipe } from './birthday.pipe';

describe('BirthdayPipe', () => {
  it('create an instance', () => {
    const pipe = new BirthdayPipe();
    expect(pipe).toBeTruthy();
  });
});
