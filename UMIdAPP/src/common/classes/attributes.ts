class Attribute {
  code: string;
  mandatory: boolean;
  to_save: boolean;

  // UI Elements
  name: string;
  is_checked: boolean;

  /**
   * Construtor dum atributo da mDL
   * @param code Attribute identifier
   * @param name Attribute display name
   * @param mandatory default _false_
   * @param to_save default _false_
   */
  constructor(code, name, to_save = false) {
    this.code = code;
    this.name = name;
    this.is_checked = false;
    this.to_save = to_save;
  }

  static ticket(): Array<Attribute> {
    return [
      new Attribute('ticket', 'Senha'),
    ];
  }

  static identity(): Array<Attribute> {
    return [
      new Attribute('user.userType', 'Tipo de utilizador'),
      new Attribute('user.username', 'Número mecanográfico'),
      new Attribute('user.fullName', 'Nome completo'),
      new Attribute('user.birthdate', 'Data de nascimento'),
      new Attribute('user.picture', 'Fotografia'),
      new Attribute('course.designation', 'Designação do Curso'),
      new Attribute('course.teachingResearchUnits', 'Departamento de Ensino'),
      new Attribute('number', 'Número de aluno'),
      new Attribute('academicYear', 'Ano académico'),
    ].sort((a, b) => a.name.localeCompare(b.name));
  }
}

export default Attribute;
