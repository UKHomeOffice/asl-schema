module.exports = [
  // single profile
  {
    caseId: 'e51bc9c2-f90e-413e-8d9a-55d9e26da22c',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: 'bccb6c90-ec85-4f7e-838e-69ecebff88b2' // Gerry Joseland
  },

  // single profile and pil
  {
    caseId: 'ab228908-110e-48fc-a6f3-222ecf6fb711',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: '6351c51a-40a3-4d1a-8d67-f64c0df7115d' // Patrizio Grigs
  },
  {
    caseId: 'ab228908-110e-48fc-a6f3-222ecf6fb711',
    establishmentId: 8201,
    modelType: 'pil',
    modelId: '841d4cc8-8edd-4f01-93f0-afdb25dcee6f'
  },

  // single profile and multiple projects
  {
    caseId: '54a40457-4213-43b0-bca0-e8ae83c1b4aa',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: 'a6d3653a-37ab-4b20-8258-7a17ab324083' // Nicolea Domini
  },
  {
    caseId: '54a40457-4213-43b0-bca0-e8ae83c1b4aa',
    establishmentId: 8201,
    modelType: 'project',
    modelId: '4dfed9cc-00a1-4ab5-9e20-b1dcb44a1994' // ENF-OPEN-1
  },
  {
    caseId: '54a40457-4213-43b0-bca0-e8ae83c1b4aa',
    establishmentId: 8201,
    modelType: 'project',
    modelId: '078c345b-21b8-4692-a1fc-f77d6fa8e77a' // ENF-OPEN-2
  },

  // single profile and multiple projects at different establishments
  {
    caseId: 'f44b7974-dbfb-443c-929e-bfcb07911787',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: 'bd92e4b2-62a5-4ce3-94d4-df6220d733dc' // Derek Deschlein
  },
  {
    caseId: 'f44b7974-dbfb-443c-929e-bfcb07911787',
    establishmentId: 8201,
    modelType: 'project',
    modelId: '6464df1b-5dd1-4ee2-8fad-e430ff57de87' // ENF-OPEN-EST-1
  },
  {
    caseId: 'f44b7974-dbfb-443c-929e-bfcb07911787',
    establishmentId: 8202,
    modelType: 'project',
    modelId: '6483cd4f-829f-45c9-9580-fe3950ecfc16' // ENF-OPEN-EST-2
  },

  // multiple profiles single project
  {
    caseId: 'feab4b6f-9480-46c4-a234-2f2ee551cc21',
    establishmentId: 8201,
    modelType: 'project',
    modelId: '2ccd2c57-8855-4a27-a482-1eb7068c02b0' // ENF-OPEN-1-PROJ-MANY-PEEPS
  },
  {
    caseId: 'feab4b6f-9480-46c4-a234-2f2ee551cc21',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: '78f16dc0-7fba-4e93-b27c-54707bb7ffe6' // Laurie Stuckford
  },
  {
    caseId: 'feab4b6f-9480-46c4-a234-2f2ee551cc21',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: '1e45ff46-adc1-4dc8-95eb-ea2fb55e0117' // Honey Raggatt
  },
  {
    caseId: 'feab4b6f-9480-46c4-a234-2f2ee551cc21',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: 'a791f32c-329c-4678-8b2e-f7a62e51d53d' // Helen O'Nowlan
  },

  // PELH, approved areas, roles and establishment details
  {
    caseId: '796e926d-b7a9-4ce5-9702-5bef85f913b4',
    establishmentId: 8201,
    modelType: 'profile',
    modelId: '92d74467-f871-4146-955e-f3ea53f971c0' // Juliann Holson
  },
  {
    caseId: '796e926d-b7a9-4ce5-9702-5bef85f913b4',
    establishmentId: 40001,
    modelType: 'establishment',
    modelOptions: { places: true, roles: true, details: true }
  }
];
