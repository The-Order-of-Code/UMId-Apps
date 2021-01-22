export function translateList(list) {
  const attributes_translation = {
      'user.userType': 'Tipo de utilizador',
      'user.username': 'Número mecanográfico',
      'user.fullName': 'Nome completo',
      'user.birthdate': 'Data de nascimento',
      'user.picture': 'Fotografia',
      'course.designation': 'Designação do Curso',
      'course.teachingResearchUnits': 'Departamento de Ensino',
      'number': 'Número de aluno',
      'academicYear': 'Ano académico',
      'ticket': 'Senha'
  };

  return list.map((e) => attributes_translation[e]);
}
