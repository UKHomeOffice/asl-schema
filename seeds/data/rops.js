module.exports = [
  {
    projectId: 'b978c34f-d3bf-4747-ab03-97e44e2a80d8',
    year: '2020',
    status: 'submitted',
    submittedDate: '2021-01-10'
  },
  {
    projectId: '98876c9f-9917-4c3b-bb88-722b0bb5a351',
    year: '2020',
    status: 'submitted',
    submittedDate: '2021-01-10'
  },
  {
    projectId: '8804dfc0-ae9b-4bfc-9343-200b845b9cb0',
    year: '2020',
    status: 'submitted',
    submittedDate: '2021-01-10'
  },
  {
    projectId: 'db22f92c-0c2d-470f-9152-c203eb5d3262',
    year: '2020',
    status: 'submitted',
    submittedDate: '2021-01-10'
  },
  {
    projectId: 'b87aa91e-65d8-4d38-9a70-305ba81c6109',
    year: '2020',
    status: 'draft'
  },
  {
    projectId: '22436667-60d8-4afe-beaf-7284c1642e79',
    year: '2021',
    status: 'submitted',
    submittedDate: '2021-01-10'
  },
  {
    projectId: '6ae2295c-dd09-4c30-bd19-c67dd7f24cea',
    year: '2021',
    status: 'draft'
  },
  {
    projectId: '0c01cd7d-394b-45bb-99fd-ae31aac6943d',
    year: '2021',
    status: 'submitted'
  },
  {
    id: 'aa5d4f4a-256c-4dbf-bb70-0a509379553e',
    projectId: '5dea79ff-990b-4278-a772-d13ee7913547',
    year: '2021',
    status: 'submitted',
    proceduresCompleted: true,
    postnatal: true,
    endangered: false,
    nmbas: false,
    rodenticide: false,
    productTesting: true,
    productTestingTypes: JSON.stringify(['alcohol']),
    otherSpecies: false,
    species: null,
    reuse: true,
    placesOfBirth: JSON.stringify(['uk-licenced', 'rest-of-world']),
    scheduleTwoDetails: '',
    ga: true,
    purposes: JSON.stringify(['regulatory', 'preservation']),
    regulatorySubpurposes: JSON.stringify(['toxicity-genotoxicity']),
    regulatoryLegislation: JSON.stringify(['medical-devices']),
    regulatoryLegislationOrigin: JSON.stringify(['uk']),
    newGeneticLine: true,
    submittedDate: '2021-08-04 15:57:28.319+00',
    procedures: [
      {
        species: 'mice',
        reuse: true,
        placesOfBirth: 'uk-licenced',
        ga: 'no-ga',
        purposes: 'preservation',
        newGeneticLine: true,
        severity: 'mild',
        severityNum: 30,
        severityHoNote: '',
        severityPersonalNote: '',
        specialTechniqueUsed: false
      },
      {
        species: 'mice',
        reuse: false,
        placesOfBirth: 'uk-licenced',
        ga: 'ga-not-harmful',
        purposes: 'regulatory',
        regulatorySubpurposes: 'toxicity-genotoxicity',
        regulatoryLegislation: 'medical-devices',
        regulatoryLegislationOrigin: 'uk',
        newGeneticLine: false,
        severity: 'mild',
        severityNum: 50,
        severityHoNote: 'Note for HO',
        severityPersonalNote: '',
        specialTechniqueUsed: false
      }
    ]
  },
  {
    id: '9b0cb70f-5e9e-4014-a1a8-d44eed98ac45',
    projectId: 'd564d049-4cb9-422d-b039-fd94dbaa22e0',
    year: 2021,
    status: 'submitted',
    proceduresCompleted: true,
    postnatal: true,
    endangered: false,
    nmbas: true,
    generalAnaesthesia: false,
    generalAnaesthesiaDetails: 'Reason for no GA',
    rodenticide: false,
    productTesting: false,
    species: {'precoded': ['other-amphibians'], 'otherSpecies': [], 'species-other-amphibians': ['Cane Toads']},
    reuse: false,
    placesOfBirth: JSON.stringify(['eu-registered']),
    ga: false,
    purposes: JSON.stringify(['basic', 'translational']),
    basicSubpurposes: JSON.stringify(['immune']),
    translationalSubpurposes: JSON.stringify(['other', 'diagnosis']),
    translationalSubpurposesOther: JSON.stringify([{'id': '2fbd3d1c-119b-4298-9568-91321b0d24ff', 'value': 'Disorder A'}, {'id': '2daf812b-21b5-44ea-b126-231a5fd3819a', 'value': 'Disorder B'}]),
    newGeneticLine: false,
    submittedDate: '2021-08-04 15:57:28.319+00',
    procedures: [
      {
        species: 'Cane Toads',
        placesOfBirth: 'eu-registered',
        ga: 'no-ga',
        purposes: 'translational',
        translationalSubpurposes: 'other',
        newGeneticLine: false,
        severity: 'severe',
        severityNum: 5,
        severityHoNote: '',
        severityPersonalNote: '',
        subpurposeOther: '2daf812b-21b5-44ea-b126-231a5fd3819a'
      },
      {
        species: 'Cane Toads',
        placesOfBirth: 'eu-registered',
        ga: 'no-ga',
        purposes: 'basic',
        basicSubpurposes: 'immune',
        newGeneticLine: false,
        severity: 'sub',
        severityNum: 50,
        severityHoNote: 'Note for the HO',
        severityPersonalNote: ''
      },
      {
        species: 'Cane Toads',
        placesOfBirth: 'eu-registered',
        ga: 'no-ga',
        purposes: 'translational',
        translationalSubpurposes: 'diagnosis',
        newGeneticLine: false,
        severity: 'mild',
        severityNum: 10,
        severityHoNote: '',
        severityPersonalNote: ''
      },
      {
        species: 'Cane Toads',
        placesOfBirth: 'eu-registered',
        ga: 'no-ga',
        purposes: 'translational',
        translationalSubpurposes: 'other',
        newGeneticLine: false,
        severity: 'moderate',
        severityNum: 15,
        severityHoNote: '',
        severityPersonalNote: '',
        subpurposeOther: '2fbd3d1c-119b-4298-9568-91321b0d24ff'
      }
    ]
  },
  {
    id: 'e16a0d06-ec12-40c1-b8ce-8fce70b41992',
    projectId: '48dab955-a0b7-4ad3-bdc0-6b79d0aaeac8',
    year: (new Date()).getFullYear(),
    status: 'draft',
    proceduresCompleted: true,
    postnatal: true,
    endangered: false,
    nmbas: true,
    generalAnaesthesia: false,
    generalAnaesthesiaDetails: 'Reason for no GA',
    rodenticide: false,
    productTesting: false,
    species: {'precoded': ['mice'], 'otherSpecies': []},
    reuse: true,
    placesOfBirth: JSON.stringify(['uk-licenced', 'rest-of-world']),
    scheduleTwoDetails: '',
    ga: true,
    purposes: JSON.stringify(['preservation']),
    newGeneticLine: true,
    procedures: [
      {
        species: 'mice',
        reuse: true,
        placesOfBirth: 'uk-licenced',
        ga: 'no-ga',
        purposes: 'preservation',
        newGeneticLine: true,
        severity: 'mild',
        severityNum: 30,
        severityHoNote: '',
        severityPersonalNote: '',
        specialTechniqueUsed: false
      },
      {
        species: 'mice',
        reuse: false,
        placesOfBirth: 'uk-licenced',
        ga: 'ga-not-harmful',
        purposes: 'preservation',
        newGeneticLine: false,
        severity: 'mild',
        severityNum: 50,
        severityHoNote: 'Note for HO',
        severityPersonalNote: '',
        specialTechniqueUsed: false
      }
    ]
  }
];
