export function createInitialNotifications() {
  return [
    {
      id: 1,
      tone: 'wine',
      icon: 'arrow',
      title: 'Mudança de sala',
      text: 'Banco de Dados — A: aula agora na sala 202A (antes 300B)',
      time: 'Há 25 min',
      unread: true,
    },
    {
      id: 2,
      tone: 'amber',
      icon: 'x',
      title: 'Sem aula',
      text: 'Estrutura de Dados: não haverá aula hoje',
      time: 'Há 2 h',
      unread: true,
    },
    {
      id: 3,
      tone: 'slate',
      icon: 'bell',
      title: 'Aviso geral',
      text: 'Engenharia de Software: lembrete sobre entrega do trabalho',
      time: 'Ontem',
      unread: false,
    },
    {
      id: 4,
      tone: 'wine',
      icon: 'arrow',
      title: 'Mudança de sala',
      text: 'Lab 02 passou para o bloco C, sala 110',
      time: 'Segunda-feira',
      unread: false,
    },
  ]
}
