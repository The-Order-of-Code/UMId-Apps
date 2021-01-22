/**
 * Atributos presentes na carta de condução, para consultar 
 * ver a secção na ISO secção 7.4.1 - Tabela 3
 */
export interface FieldsRequested {
  age_birth_year: boolean;
  age_in_years: boolean;
  age_over_18: boolean;
  birth_date: boolean;
  birth_place: boolean;
  document_number: boolean;
  driving_privileges: boolean;
  expiry_date: boolean;
  eye_color: boolean;
  family_name: boolean;
  gender: boolean;
  given_name: boolean;
  hair_color: boolean;
  height: boolean;
  issue_date: boolean;
  issuing_authority: boolean;
  issuing_country: boolean;
  nationality: boolean;
  portrait: boolean;
  portrait_capture_date: boolean;
  signature_usual_mark: boolean;
  un_distinguishing_sign: boolean;
  weight: boolean;
}
