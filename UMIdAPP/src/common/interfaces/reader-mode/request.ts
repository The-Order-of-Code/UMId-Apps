import { FieldsRequested } from './fields-requested';
/**
 *  interface para requisição 
 */

export interface Request {
  version: string;
  token: string;
  docType?: string;
  nameSpaces: {
    'org.iso.18013.5.1.PT.UminhoID': FieldsRequested;
  };
}
