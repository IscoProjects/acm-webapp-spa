import { FilterPacienteStringPipe } from './filter-paciente-string.pipe';

describe('FilterPacienteStringPipe', () => {
  it('create an instance', () => {
    const pipe = new FilterPacienteStringPipe();
    expect(pipe).toBeTruthy();
  });
});
