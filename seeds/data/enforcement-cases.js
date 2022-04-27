module.exports = [
  {
    // no flags
    id: '870ce6f1-0b4f-404b-ac7a-214e76c801db',
    caseNumber: '10010',
    subjects: []
  },
  {
    // single profile
    id: 'e51bc9c2-f90e-413e-8d9a-55d9e26da22c',
    caseNumber: '10020',
    subjects: [
      {
        establishmentId: 8201,
        profileId: 'bccb6c90-ec85-4f7e-838e-69ecebff88b2', // Gerry Joseland
        flags: [
          {
            modelType: 'profile',
            modelId: 'bccb6c90-ec85-4f7e-838e-69ecebff88b2'
          }
        ]
      }
    ]
  },
  {
    // single profile and pil
    id: 'ab228908-110e-48fc-a6f3-222ecf6fb711',
    caseNumber: '10030',
    subjects: [
      {
        establishmentId: 8201,
        profileId: '6351c51a-40a3-4d1a-8d67-f64c0df7115d', // Patrizio Grigs
        flags: [
          {
            modelType: 'profile',
            modelId: '6351c51a-40a3-4d1a-8d67-f64c0df7115d'
          },
          {
            modelType: 'pil',
            modelId: '841d4cc8-8edd-4f01-93f0-afdb25dcee6f'
          }
        ]
      }
    ]
  },
  {
    // single profile and multiple projects
    id: '54a40457-4213-43b0-bca0-e8ae83c1b4aa',
    caseNumber: '10040',
    subjects: [
      {
        establishmentId: 8201,
        profileId: 'a6d3653a-37ab-4b20-8258-7a17ab324083', // Nicolea Domini
        flags: [
          {
            modelType: 'profile',
            modelId: 'a6d3653a-37ab-4b20-8258-7a17ab324083'
          },
          {
            modelType: 'project',
            modelId: '4dfed9cc-00a1-4ab5-9e20-b1dcb44a1994' // ENF-OPEN-1
          },
          {
            modelType: 'project',
            modelId: '078c345b-21b8-4692-a1fc-f77d6fa8e77a' // ENF-OPEN-2
          }
        ]
      }
    ]
  },
  {
    // single profile and multiple projects at different establishments
    id: 'f44b7974-dbfb-443c-929e-bfcb07911787',
    caseNumber: '10050',
    subjects: [
      {
        establishmentId: 8201,
        profileId: 'bd92e4b2-62a5-4ce3-94d4-df6220d733dc', // Derek Deschlein
        flags: [
          {
            modelType: 'profile',
            modelId: 'bd92e4b2-62a5-4ce3-94d4-df6220d733dc'
          },
          {
            modelType: 'project',
            modelId: '6464df1b-5dd1-4ee2-8fad-e430ff57de87' // ENF-OPEN-EST-1
          },
          {
            modelType: 'project',
            modelId: '6483cd4f-829f-45c9-9580-fe3950ecfc16' // ENF-OPEN-EST-2
          }
        ]
      }
    ]
  },
  {
    // multiple profiles single project
    id: 'feab4b6f-9480-46c4-a234-2f2ee551cc21',
    caseNumber: '10060',
    subjects: [
      {
        establishmentId: 8201,
        profileId: '78f16dc0-7fba-4e93-b27c-54707bb7ffe6', // Laurie Stuckford
        flags: [
          {
            modelType: 'profile',
            modelId: '78f16dc0-7fba-4e93-b27c-54707bb7ffe6'
          },
          {
            modelType: 'project',
            modelId: '2ccd2c57-8855-4a27-a482-1eb7068c02b0' // ENF-OPEN-1-PROJ-MANY-PEEPS
          }
        ]
      },
      {
        establishmentId: 8201,
        profileId: '1e45ff46-adc1-4dc8-95eb-ea2fb55e0117', // Honey Raggatt
        flags: [
          {
            modelType: 'profile',
            modelId: '1e45ff46-adc1-4dc8-95eb-ea2fb55e0117'
          }
        ]
      },
      {
        establishmentId: 8201,
        profileId: 'a791f32c-329c-4678-8b2e-f7a62e51d53d', // Helen O'Nowlan
        flags: [
          {
            modelType: 'profile',
            modelId: 'a791f32c-329c-4678-8b2e-f7a62e51d53d'
          }
        ]
      }
    ]
  },
  {
    // PELH, approved areas, roles and establishment details
    id: '796e926d-b7a9-4ce5-9702-5bef85f913b4',
    caseNumber: '10070',
    subjects: [
      {
        establishmentId: 40001,
        profileId: '92d74467-f871-4146-955e-f3ea53f971c0', // Juliann Holson
        flags: [
          {
            modelType: 'profile',
            modelId: '92d74467-f871-4146-955e-f3ea53f971c0'
          },
          {
            establishmentId: 40001,
            modelType: 'establishment',
            modelOptions: JSON.stringify(['places', 'roles', 'details'])
          }
        ]
      }
    ]
  }
];
