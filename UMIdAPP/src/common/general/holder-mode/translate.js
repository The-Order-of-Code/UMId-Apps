export function translateList(list) {
    const attributes_translation = {
        'user.userType': 'Tipo de utilizador',
        'user.fullName': 'Nome completo',
        'user.username': 'Nome do utilizador',
        'user.birth_date': 'Data Nascimento',
        'user.picture': 'Data Nascimento',
        'course.designation': 'Designação do curso',
        'course.teachingResearchUnits': 'Departamento de Ensino',
        'number': 'Número de aluno',
        'year':'Ano Letivo',
        'academicYear':'Ano do curso'
    };
  
    return list.map((e) => attributes_translation[e]);
  }
  