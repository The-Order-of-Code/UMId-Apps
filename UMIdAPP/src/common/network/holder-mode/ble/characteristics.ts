export const MDLServiceCharacteristics = {
    'State': {
        uuid: '00000001-A123-48CE-896B-4C76973373E6',
        permissions: {
          read: true,
          write: true,
          // readEncryptionRequired: true,
          //, writeEncryptionRequired: true,
        },
        properties: {
          notify: true,
          writeWithoutResponse: true,
          writeNoResponse: true
        },
    },
    'Client2Server': {
        uuid: '00000002-A123-48CE-896B-4C76973373E6',
        permissions: {
          read: true,
          write: true,
          // readEncryptionRequired: true,
          // writeEncryptionRequired: true,
        },
        properties: {
          writeNoResponse: true,
          writeWithoutResponse: true
        },
    },
    'Server2Client': {
        uuid: '00000003-A123-48CE-896B-4C76973373E6',
        permissions: {
          read: true,
          write: true,
          // readEncryptionRequired: true,
          // writeEncryptionRequired: true,
        },
        properties: {
          notify: true,
          writeWithoutResponse: true
        }
    }
};