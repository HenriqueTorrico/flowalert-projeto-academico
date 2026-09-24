export const studentsByTurma = {
  1: [
    { id: 1, name: 'Bruno Almeida', email: 'bruno.almeida@escola.com.br' },
    { id: 2, name: 'Carla Mendes', email: 'carla.mendes@escola.com.br' },
    { id: 3, name: 'Diego Rocha', email: 'diego.rocha@escola.com.br' },
    { id: 4, name: 'Fernanda Lima', email: 'fernanda.lima@escola.com.br' },
  ],
  2: [
    { id: 5, name: 'Gabriel Santos', email: 'gabriel.santos@escola.com.br' },
    { id: 6, name: 'Helena Costa', email: 'helena.costa@escola.com.br' },
    { id: 7, name: 'Igor Martins', email: 'igor.martins@escola.com.br' },
  ],
  3: [
    { id: 8, name: 'Julia Pereira', email: 'julia.pereira@escola.com.br' },
    { id: 9, name: 'Lucas Ferreira', email: 'lucas.ferreira@escola.com.br' },
    { id: 10, name: 'Marina Souza', email: 'marina.souza@escola.com.br' },
    { id: 11, name: 'Pedro Nunes', email: 'pedro.nunes@escola.com.br' },
  ],
}

export function getStudentsForTurma(turmaId) {
  return studentsByTurma[turmaId] ?? []
}
