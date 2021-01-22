import Attribute from './attributes';

class Profile {
  name: string;
  attributes: Array<Attribute>;

  constructor(name, attributes) {
    this.name = name;
    this.attributes = attributes;
  }

  static prepareRequest(attributes: Array<Attribute>): Object {
    // TODO : método de instancia não funciona idkw
    const codes = {};

    attributes.forEach((a) => {
      codes[a.code] = a.to_save;
    });

    return codes;
  }
}

export default Profile;
