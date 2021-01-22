export interface Payload {
  iss: string;
  iat: number;
  exp: number;
  nameSpaces: {
    'org.iso.18013.5.1.PT.UminhoID': string[];
  };
}
