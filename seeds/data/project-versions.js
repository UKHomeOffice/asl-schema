const uuid = require('uuid/v4');
const toRichText = require('../tables/utils/to-rich-text');

module.exports = [
  {
    id: '5760be36-6234-43e2-a0fe-f2cb244ba30a',
    'projectId': '519eb1d6-e8f0-4d9c-8628-8da4394c2d2e',
    'data': {
      'title': 'Active project',
      'keywords': ['Voila', 'Une', 'Baguette'],
      'training-licence': false,
      'permissible-purpose': ['basic-research'],
      'translational-research': ['translational-research-1'],
      'project-aim': toRichText('Lorem ipsum dolor', 'Sit amet'),
      species: ['mice'],
      objectives: [
        { id: uuid(), title: 'First objective' },
        { id: uuid(), title: 'Second objective' }
      ],
      'objective-relation': toRichText(
        'Some reasoning about how the objectives relate',
        'Additional text content in a second paragraph'
      ),
      'objectives-alternatives': toRichText(
        'Some description about alternatives',
        'Additional text content in a second paragraph'
      ),
      protocols: [
        {
          id: uuid(),
          title: 'First protocol title',
          description: toRichText('Description of the first protocol.'),
          severity: 'mild',
          locations: ['University of Croydon', 'Invalid location'],
          objectives: ['First objective', 'Second objective'],
          gaas: false,
          steps: [
            {
              id: uuid(),
              optional: true,
              adverse: false,
              title: toRichText('Description of step one', 'Additional content about this step')
            },
            {
              id: uuid(),
              optional: false,
              adverse: false,
              title: toRichText('Description of step two', 'Additional content about this step')
            },
            {
              id: uuid(),
              optional: false,
              adverse: false,
              title: toRichText('Description of step three', 'Additional content about this step')
            }
          ],
          'experience-summary': toRichText('Summary of the typical animal experience'),
          'experience-endpoints': toRichText('Humane endpoints applied to the animals'),
          outputs: toRichText('The outputs expected from this protocol'),
          'quantitative-data': false
        }
      ],
      'conditions': [
        {
          'key': 'non-purpose-bred-sched-2',
          'path': 'non-purpose-bred-sched-2.versions.0',
          'type': 'condition',
          'autoAdded': true
        },
        {
          'key': 'code-of-practice',
          'path': 'code-of-practice.versions.0',
          'type': 'authorisation',
          'autoAdded': true
        }
      ]
    },
    'status': 'granted'
  },
  {
    id: uuid(),
    'projectId': 'a91150dd-e6b1-4582-9764-7af9a05b4aff',
    'data': {
      'title': 'Content search test',
      'keywords': ['Voila', 'Une', 'Autre', 'Baguette'],
      'training-licence': false,
      'permissible-purpose': ['basic-research'],
      'translational-research': ['translational-research-1'],
      protocols: [
        {
          id: uuid(),
          title: 'First protocol title',
          description: toRichText(
            `I am the very model of a modern Major-General,`,
            `I've information vegetable, animal, and mineral,`,
            `I know the kings of England, and I quote the fights historical`,
            `From Marathon to Waterloo, in order categorical.`
          )
        }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '84ec643f-893b-4232-ab4c-5789d50773de',
    'data': {
      'title': 'Legacy project',
      'primary-establishment': 'University of Croydon',
      'protocols': [
        {
          'id': '8a647535-4165-4528-b841-a6324a509e17',
          'steps': null
        }
      ],
      'conditions': [
        {
          'key': 'custom',
          'edited': 'This is a legacy custom condition'
        }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '395fd103-b933-44c2-a42b-05af4d39c1ec',
    'data': {
      'title': 'Legacy other species test'
    },
    'status': 'granted'
  },
  {
    'projectId': 'ba50976e-1cca-4cda-baa7-f7d0be53d83a',
    'data': {
      'title': 'Legacy AWERB test',
      'primary-establishment': 'University of Croydon',
      'protocols': [
        {
          'id': 'f975dde0-7e1c-41c4-b5d3-71040e7f4ea8',
          'steps': null
        }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '1cbbb865-f5e7-4314-a35d-e8adcf19a811',
    'data': {
      'title': 'Test legacy change licence holder',
      'experience-knowledge': toRichText('Experience content before')
    },
    'status': 'granted'
  },
  {
    'projectId': 'eef743f2-de64-421b-a1bc-2a0c7cd81814',
    'data': {
      'title': 'Test change licence holder'
    },
    'status': 'granted'
  },
  {
    'projectId': 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031',
    'data': {
      'title': 'Basic user project',
      'permissible-purpose': ['basic-research'],
      'protocols': [
        {
          'id': 'cd64135f-2770-4bdb-8858-bfefb16f3d8d',
          'steps': [
            {
              'id': '7a2a0d9f-2a63-40bc-be16-d06deb41a7aa'
            }
          ],
          'complete': true,
          'speciesDetails': []
        }
      ],
      'objectives': [
        {
          'id': '4d5dd800-de78-43de-b619-2ac050f49cdf'
        }
      ],
      'keywords': [
        'fishmonger',
        'elephant',
        'happiness'
      ],
      'id': 'dbc6845f-82b6-4ffe-9d93-12b8fff74029'
    },
    'status': 'granted',
    'createdAt': '2019-10-14',
    'updatedAt': '2019-10-14'
  },
  {
    'projectId': 'e2b36165-d85d-4467-a9f9-0014af089131',
    'data': {
      'title': 'Change licence holder'
    },
    'status': 'granted',
    'createdAt': '2019-10-14',
    'updatedAt': '2019-10-14'
  },
  {
    'projectId': '9ad36797-7bb4-4f4f-96c1-a8162c5eec44',
    'data': {
      'title': 'Download test project',
      'project-aim': toRichText('This is a project used for testing file downloads. DO NOT USE IT FOR AMENDMENTS!'),
      'permissible-purpose': ['basic-research'],
      'protocols': [
        {
          'id': '119b4a7e-ee08-4437-9328-283a8fe1a190',
          'steps': [
            {
              'id': '43bb032e-1cde-43f7-93a9-cd137e2ce990'
            }
          ],
          'complete': true,
          'speciesDetails': []
        }
      ],
      'objectives': [
        {
          'id': 'ee39ef5f-7fbb-4f2d-bda6-85151069a59a'
        }
      ],
      'keywords': [
        'barbershop',
        'clementine',
        'muffintop'
      ],
      'id': '1689353d-e064-4898-bf56-7d1a4061d6b7'
    },
    'status': 'granted',
    'createdAt': '2020-10-14',
    'updatedAt': '2020-10-14'
  },
  {
    'projectId': 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031',
    'data': {
      'title': 'First basic user project title'
    },
    'status': 'granted',
    'createdAt': '2017-02-05',
    'updatedAt': '2017-02-05'
  },
  {
    'projectId': 'd42196ff-eb93-4b20-8b71-22673901873d',
    'data': {
      'title': 'Project with protocols',
      'protocols': [
        {
          'id': 'fb95dd09-cfe0-4efc-baef-dbecb61ccc8d',
          'steps': [
            {'id': '61395505-2400-444b-a47e-a7a08879b654'}
          ],
          'title': 'New protocol',
          'complete': true,
          'severity': 'mild',
          'conditions': [],
          'description': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Purpose 1","marks":[]}]}]}}',
          'speciesDetails': [],
          'severity-proportion': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"10%","marks":[]}]}]}}'
        },
        {
          'id': 'b9233bf4-e354-4ee7-8143-83ba6b1355eb',
          'steps': [
            {
              'id': 'ffa8233d-00d8-4647-8805-eb12d1490ca8',
              'title': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"A new step","marks":[]}]}]}}',
              'completed': true
            },
            {
              'id': '39a85fda-09f4-4d5a-ab92-dfe8192be7b1',
              'title': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Step 2","marks":[]}]}]}}',
              'completed': true
            }
          ],
          'title': 'New protocol 2',
          'complete': true,
          'severity': 'mild',
          'conditions': [],
          'speciesDetails': [],
          'description': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"Some details","marks":[]}]}]}}'
        }
      ],
      'conditions': [
        {
          'key': 'non-purpose-bred-sched-2',
          'path': 'non-purpose-bred-sched-2.versions.0',
          'type': 'condition',
          'autoAdded': true
        },
        {
          'key': 'code-of-practice',
          'path': 'code-of-practice.versions.0',
          'type': 'authorisation',
          'autoAdded': true
        }
      ],
      'objectives': [
        {'id': 'f9d2ff55-bedb-4f9c-b39c-4dd850b4f737'}
      ],
      'purpose-bred': false,
      'wild-animals': false,
      'feral-animals': false,
      'nmbas-complete': true,
      'poles-complete': true,
      'funding-complete': true,
      'benefits-complete': true,
      'strategy-complete': true,
      'transfer-expiring': false,
      'clinical-condition': false,
      'endangered-animals': false,
      'protocols-complete': true,
      'reduction-complete': true,
      'experience-complete': true,
      'experience-projects': true,
      'nts-review-complete': true,
      'refinement-complete': true,
      'action-plan-complete': true,
      'commercial-slaughter': false,
      'other-establishments': false,
      'replacement-complete': true,
      'introduction-complete': true,
      'feral-animals-complete': true,
      'project-harms-complete': true,
      'establishments-complete': true,
      'fate-of-animals-complete': true,
      'experimental-design-sexes': false,
      'endangered-animals-complete': true,
      'general-principles-complete': true,
      'experimental-design-complete': true,
      'commercial-slaughter-complete': true,
      'experimental-design-repeating': false,
      'purpose-bred-animals-complete': true,
      'establishments-care-conditions': false,
      'scientific-background-complete': true,
      'animals-containing-human-material': false,
      'containing-human-material-complete': true,
      'animals-taken-from-the-wild-complete': true,
      'establishments-care-conditions-justification': null
    },
    'status': 'granted'
  },
  {
    'projectId': '7d867c46-5e17-4f7f-8718-4f99160582d3',
    'data': {
      'title': 'Draft with withdrawn'
    }
  },
  {
    'projectId': '7d867c46-5e17-4f7f-8718-4f99160582d3',
    'data': {
      'title': 'Draft with withdrawn'
    },
    'status': 'withdrawn'
  },
  {
    'projectId': '77af45c8-761e-49f6-b6fb-e105f0e67185',
    'data': {
      'title': 'Additional availability to be added draft'
    }
  },
  {
    'projectId': '5cb97819-3e21-4ea5-85f0-32df2b06213b',
    'data': {
      'title': 'Additional availability to be added'
    },
    'status': 'granted'
  },
  {
    id: '2b80b02a-3ee1-408a-b86d-6417a1ac5483',
    'projectId': '5cb97819-3e21-4ea5-85f0-32df2b06213c',
    'data': {
      'title': 'Additional availability active',
      'other-establishments': true,
      establishments: [
        { 'establishment-id': 30001, 'name': 'Small Pharma' }
      ],
      protocols: [
        {
          title: 'First protocol',
          complete: true,
          locations: ['University of Croydon', 'Small Pharma']
        }
      ]
    },
    'status': 'granted'
  },
  {
    id: '74671de8-bf09-4e94-9d66-60096f2d6228',
    'projectId': '27c98cdb-fd33-4449-852c-823d43ccda03',
    'data': {
      'title': 'Additional availability to transfer',
      'other-establishments': true,
      establishments: [
        { 'establishment-id': 30001, 'name': 'Small Pharma' }
      ],
      protocols: [
        { title: 'First protocol', complete: true }
      ]
    },
    'status': 'granted'
  },
  {
    'projectId': '163c30f5-d6f9-4b34-9c63-21f21e7948ba',
    'status': 'granted',
    'data': {
      'title': 'Additional availability old style',
      'other-establishments': true,
      'transfer-of-animals-complete': true,
      'establishments': [
        {
          'id': 'c57600db-6d2e-443b-bec9-c21f070861ce',
          'establishment-name': 'Marv Pharm'
        },
        {
          'id': '79be38a4-c797-4b96-a6a5-f2bcaeaaf056',
          'establishment-name': 'Mini Pharm'
        }
      ]
    }
  },
  {
    'projectId': '38008c26-8748-45f8-b0a5-18f1bafbae70',
    'data': {
      'title': 'Draft legacy project',
      'protocols': [
        {
          'id': 'd43ebbca-7ea7-40a2-9c06-d18608a13759',
          'steps': null
        }
      ]
    }
  },
  {
    'id': 'b603d058-267a-4f7b-8356-389271076c06',
    projectId: '6b9b7471-396e-47fe-a98f-da0c76e0a26a',
    data: {
      title: 'Amend in prog project 2',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText(
                'Step content after amendment',
                'with another paragraph',
                'and a changed paragraph'
              )
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:36.146Z'
  },
  {
    projectId: '6b9b7471-396e-47fe-a98f-da0c76e0a26a',
    data: {
      title: 'Amend in prog project',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText(
                'Step content before amendment',
                'with another paragraph',
                'and another paragraph'
              )
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'granted',
    createdAt: '2019-09-18T11:39:17.292Z'
  },
  {
    id: '74ddb097-a988-4955-920b-a439e580041a',
    projectId: 'e022533a-bc01-438a-815b-6cbf6ec1f31c',
    data: {
      title: 'Draft Application',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          title: 'A protocol',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText('Initial submission'),
              adverse: true,
              'adverse-effects': toRichText('Changed effects')
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:36.146Z'
  },
  {
    projectId: 'e022533a-bc01-438a-815b-6cbf6ec1f31c',
    data: {
      title: 'Draft Application',
      protocols: [
        {
          id: '119b4a7e-ee08-4437-9328-283a8fe1a190',
          title: 'A protocol',
          steps: [
            {
              id: '43bb032e-1cde-43f7-93a9-cd137e2ce990',
              title: toRichText('Initial submission'),
              adverse: true,
              'adverse-effects': toRichText('Adverse effects')
            }
          ],
          complete: true,
          speciesDetails: []
        }
      ]
    },
    status: 'submitted',
    createdAt: '2019-09-18T11:39:17.292Z'
  },
  {
    'projectId': '6b9b7471-396e-47fe-a98f-da0c76e0a26b',
    'data': {
      'title': 'Project with legacy list',
      'project-aim': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"bulleted-list","nodes":[{"object":"block","type":"list-item","nodes":[{"object":"text","text":"List item 1","marks":[]}],"data":{}},{"object":"block","type":"list-item","nodes":[{"object":"text","text":"List item 2","marks":[]}],"data":{}}],"data":{}}]}}'
    },
    'status': 'granted'
  },
  {
    'projectId': '739fbe40-cfb9-431d-80c2-ac3d5beee2b2',
    'status': 'granted',
    'data': {
      'title': 'Active project wrong issue date',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'projectId': '6b9b7471-396e-47fe-a98f-da0c76e0a26d',
    'data': {
      'title': 'Submitted draft'
    },
    'status': 'submitted'
  },
  {
    'projectId': 'b8973df0-408c-4f3c-a7f2-b5b8f8c2943b',
    'status': 'granted',
    'data': {
      'title': 'RA true',
      'retrospectiveAssessment': true
    }
  },
  {
    'projectId': '6b97eee3-0d2a-4ffa-8ba5-094b0d67154e',
    'status': 'granted',
    'data': {
      'title': 'RA false',
      'retrospectiveAssessment': false
    }
  },
  {
    'projectId': '0841bc71-f6b5-402d-a8f0-45467213f158',
    'status': 'granted',
    'raCompulsory': true,
    'data': {
      'title': 'RA not editable - species',
      'species': ['cats']
    }
  },
  {
    'projectId': '715a0156-4639-42ee-bd00-35a96e75ca4a',
    'status': 'draft',
    'data': {
      'title': 'Unmigrated Species',
      'species': [ 'zebra-fish', 'mice' ],
      'protocols': [
        {
          'id': 'f1797774-520f-417e-9ed6-18450b273b6c',
          'title': 'Protocol 1',
          'species': [ 'zebra-fish', 'mice' ],
          'speciesDetails': [
            { 'name': 'Mice' },
            { 'name': 'Zebra fish' }
          ]
        }
      ]
    }
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2018-12-31',
    'updatedAt': '2019-01-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-01-31',
    'updatedAt': '2019-02-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-02-28',
    'updatedAt': '2019-03-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-03-31',
    'updatedAt': '2019-04-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'submitted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-04-30',
    'updatedAt': '2019-05-01'
  },
  {
    'projectId': 'fab30838-4316-4863-9070-5caa08e87d47',
    'status': 'granted',
    'data': {
      'title': 'Project with multiple versions'
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': '3b125d04-a0ec-46fe-9954-80a13b3e39f9',
    'status': 'granted',
    'data': {
      'title': 'Transfer basic user project',
      'protocols': [
        {
          'id': uuid(),
          'steps': [],
          'title': 'P1',
          'severity': 'mild',
          'locations': ['University of Croydon'],
          'speciesDetails': [],
          'complete': true
        },
        {
          'id': uuid(),
          'steps': [],
          'title': 'P2',
          'severity': 'moderate',
          'locations': ['University of Croydon'],
          'speciesDetails': [],
          'complete': true
        }
      ],
      'other-establishments': true,
      establishments: [
        {
          id: uuid(),
          'establishment-id': 8202,
          name: 'Marvell Pharmaceutical',
          'establishment-about': toRichText('First establishment details')
        },
        {
          id: uuid(),
          'establishment-id': 10001,
          name: 'University of Life',
          'establishment-about': toRichText('Second establishment details')
        }
      ],
      poles: true,
      'poles-environment': toRichText('Environment answer'),
      'poles-inspection': toRichText('Inspection answer'),
      'poles-justification': toRichText('Justification answer'),
      polesList: [
        {
          id: uuid(),
          title: 'First POLE',
          'pole-info': toRichText('POLE one info')
        },
        {
          id: uuid(),
          title: 'Second POLE',
          'pole-info': toRichText('POLE two info')
        }
      ]
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': 'b5554241-083c-4fce-a031-71403fdae509',
    'status': 'draft',
    'data': {
      'title': 'Transfer basic user draft'
    },
    'createdAt': '2019-05-31',
    'updatedAt': '2019-06-01'
  },
  {
    'projectId': '04956663-711b-4bda-b201-46d9eeabf9d4',
    'data': {
      'title': 'Project with deleted protocols',
      'species': ['mice', 'rats'],
      'protocols': [
        {
          'id': '43f5e295-277c-4e60-9759-e6c3612d6bfe',
          'steps': [],
          'title': 'First protocol',
          'species': [ 'mice' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': '39415b58-73bc-4040-b7dd-d5bef57de5f2',
              'name': 'Mice',
              'reuse': false,
              'value': 'mice',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ]
        },
        {
          'id': '997659c6-6789-49db-a5cd-1cfcb6856406',
          'steps': [],
          'title': 'Deleted protocol',
          'species': [ 'rats' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': 'f4252ce0-10b0-49d8-ab7c-4548d65c906f',
              'name': 'Rats',
              'reuse': false,
              'value': 'rats',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ],
          'deleted': true
        }
      ]
    },
    'status': 'draft',
    'createdAt': '2020-06-30',
    'updatedAt': '2019-06-30'
  },
  {
    'projectId': '04956663-711b-4bda-b201-46d9eeabf9d4',
    'data': {
      'title': 'Project with deleted protocols',
      'species': ['mice', 'rats'],
      'protocols': [
        {
          'id': '43f5e295-277c-4e60-9759-e6c3612d6bfe',
          'steps': [],
          'title': 'First protocol',
          'species': [ 'mice' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': '39415b58-73bc-4040-b7dd-d5bef57de5f2',
              'name': 'Mice',
              'reuse': false,
              'value': 'mice',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ]
        },
        {
          'id': '997659c6-6789-49db-a5cd-1cfcb6856406',
          'steps': [],
          'title': 'Deleted protocol',
          'species': [ 'rats' ],
          'conditions': [],
          'speciesDetails': [
            {
              'id': 'f4252ce0-10b0-49d8-ab7c-4548d65c906f',
              'name': 'Rats',
              'reuse': false,
              'value': 'rats',
              'life-stages': [ 'adult' ],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '100'
            }
          ],
          'deleted': true
        }
      ]
    },
    'status': 'submitted',
    'createdAt': '2020-06-29',
    'updatedAt': '2019-06-29'
  },
  {
    'projectId': '609e57a1-3436-4163-a7d2-97c7ce465364',
    'status': 'granted',
    'data': {
      'title': 'ASRU amendment in progress: draft',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'createdAt': '2020-04-29',
    'updatedAt': '2020-04-29'
  },
  {
    'projectId': '609e57a1-3436-4163-a7d2-97c7ce465364',
    'status': 'draft',
    'data': {
      'title': 'ASRU amendment in progress: draft',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'asruVersion': true,
    'createdAt': '2020-04-30',
    'updatedAt': '2020-04-30'
  },
  {
    'projectId': 'd584ca49-5f44-41f8-902b-5aa7e9334969',
    'status': 'granted',
    'data': {
      'title': 'ASRU amendment in progress: submitted',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'createdAt': '2020-04-29',
    'updatedAt': '2020-04-29'
  },
  {
    'projectId': 'd584ca49-5f44-41f8-902b-5aa7e9334969',
    'status': 'submitted',
    'data': {
      'title': 'ASRU amendment in progress: submitted',
      'duration': {
        'years': 5,
        'months': 0
      }
    },
    'asruVersion': true,
    'createdAt': '2020-04-30',
    'updatedAt': '2020-04-30'
  },
  {
    'projectId': '2de9d19a-6858-467d-a4fb-a1a3e31c3435',
    'status': 'granted',
    'data': {
      'title': 'Continuation ids migration',
      'transfer-expiring': true,
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        },
        {
          'licence-number': '70/1234',
          'expiry-date': '2020-08-01'
        }
      ]
    }
  },
  {
    'projectId': '5e703f3c-9af7-4344-add5-a542fbb6f3bd',
    'status': 'granted',
    'data': {
      'title': 'Continuation migrated',
      'transfer-expiring': true,
      'expiring-yes': '{"object":"value","document":{"object":"document","data":{},"nodes":[{"object":"block","type":"paragraph","data":{},"nodes":[{"object":"text","text":"This was the input - licence number P12345678, expiring 1st July 2020","marks":[]}]}]}}',
      'project-continuation': [
        {
          'licence-number': 'P12345678',
          'expiry-date': '2020-07-01'
        }
      ]
    }
  },
  {
    'projectId': '23e96d12-74d5-4ccb-ba3f-ec16829d4b6d',
    'status': 'granted',
    'data': {
      'title': 'Training licence',
      'training-licence': true
    },
    'raCompulsory': true
  },
  {
    'projectId': '423dc041-8293-4531-9652-3ca03f3e5fbb',
    'status': 'granted',
    'data': {
      'title': 'Testing establishment merge basic ppl',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'projectId': '4eed2b09-2b21-45a9-be54-3b2736d6f287',
    'status': 'granted',
    'data': {
      'title': 'Testing establishment merge admin ppl',
      'duration': {
        'years': 5,
        'months': 0
      }
    }
  },
  {
    'id': '6c3dd9de-8e65-46ff-8840-913b7c7943c9',
    'projectId': '3c7990f7-8e6b-4fa1-8ba5-34ede489b22a',
    'status': 'draft',
    'data': {
      'title': 'Testing deadline extension'
    },
    'createdAt': '2020-09-01',
    'updatedAt': '2020-09-01'
  },
  {
    'id': 'b44cc7fc-5dfb-4900-9be0-c0e475d2ddc5',
    'projectId': '9d83dcac-a544-4cf8-90c8-b9915ab16f80',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline extension (old style)'
    },
    'createdAt': '2020-09-01',
    'updatedAt': '2020-09-01'
  },
  {
    'id': 'cada2e28-d678-49c1-afac-11acaf325f6d',
    'projectId': '52949a8f-879c-45bd-b6a4-cbc01c746da0',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline passed'
    },
    'createdAt': '2020-06-01',
    'updatedAt': '2020-06-01'
  },
  {
    'id': '4e1b4de2-4e9d-4c9d-9009-6fcffff47443',
    'projectId': '04e9f8f0-ba3c-4357-b4ef-39e8bb4445f1',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline removed'
    },
    'createdAt': '2020-06-01',
    'updatedAt': '2020-06-01'
  },
  {
    'id': '08e4cc9a-8627-48ff-b89f-24ff18224630',
    'projectId': '52949a8f-879c-45bd-b6a4-cbc01c746da1',
    'status': 'submitted',
    'data': {
      'title': 'Testing deadline passed external'
    },
    'createdAt': '2020-06-01',
    'updatedAt': '2020-06-01'
  },
  {
    'id': '32814630-4b9b-42df-9963-329df1b4a0d1',
    'projectId': 'd661f113-9594-4374-b461-b75d1b6a02db',
    'status': 'granted',
    'data': {
      'title': 'Unsubmitted amendment'
    },
    'createdAt': '2021-01-08 12:00:00',
    'updatedAt': '2021-01-08 12:00:00'
  },
  {
    'id': '878cf7d7-a6fc-48a0-b1d6-dc61147724c8',
    'projectId': 'd661f113-9594-4374-b461-b75d1b6a02db',
    'status': 'draft',
    'data': {
      'title': 'Unsubmitted amendment'
    },
    'createdAt': '2021-01-08 13:00:00',
    'updatedAt': '2021-01-08 13:00:00'
  },
  {
    'id': '9d85a472-942f-48eb-9e13-34e41fcf879f',
    'projectId': '78508e8c-26e9-4960-88cd-2761eb1afd57',
    'status': 'granted',
    'data': {
      'title': 'Unsubmitted ASRU amendment'
    },
    'createdAt': '2021-01-08 12:00:00',
    'updatedAt': '2021-01-08 12:00:00'
  },
  {
    'id': '701de6c8-1ac0-4258-afeb-fca7077b12e3',
    'projectId': '78508e8c-26e9-4960-88cd-2761eb1afd57',
    'status': 'draft',
    'data': {
      'title': 'Unsubmitted ASRU amendment'
    },
    'asruVersion': true,
    'createdAt': '2021-01-08 13:00:00',
    'updatedAt': '2021-01-08 13:00:00'
  },
  {
    'projectId': 'b978c34f-d3bf-4747-ab03-97e44e2a80d8',
    'status': 'granted',
    'data': {
      'title': 'RA due revoked',
      'retrospectiveAssessment': true
    }
  },
  {
    'projectId': '98876c9f-9917-4c3b-bb88-722b0bb5a351',
    'status': 'granted',
    'data': {
      'title': 'RA due cats',
      'species': ['cats']
    }
  },
  {
    'projectId': '8804dfc0-ae9b-4bfc-9343-200b845b9cb0',
    'status': 'granted',
    'data': {
      'title': 'RA due nhp',
      'species': ['rhesus']
    }
  },
  {
    'projectId': 'db22f92c-0c2d-470f-9152-c203eb5d3262',
    'status': 'granted',
    'data': {
      'title': 'RA due endangered',
      'species-other': ['Dodos', 'Velociraptors'],
      'endangered-animals': true
    }
  },
  {
    'projectId': 'b87aa91e-65d8-4d38-9a70-305ba81c6109',
    'status': 'granted',
    'data': {
      'title': 'RA due severe procedures',
      'species': ['mice'],
      'protocols': [
        {
          id: 'c56ff0ed-64a0-409f-a112-3f1884567111',
          title: 'Protocol 1',
          complete: true,
          speciesDetails: [],
          severity: 'severe',
          gaas: true
        }
      ]
    }
  },
  {
    'projectId': '22436667-60d8-4afe-beaf-7284c1642e79',
    'status': 'granted',
    'data': {
      'title': 'RA due multiple reasons (dogs, severe)',
      'species': ['beagles'],
      'protocols': [
        {
          id: 'f422b5e4-9866-4b06-adda-1e855e20e188',
          title: 'Protocol 1',
          complete: true,
          speciesDetails: [],
          severity: 'severe',
          gaas: true
        }
      ]
    }
  },
  {
    'projectId': '6ae2295c-dd09-4c30-bd19-c67dd7f24cea',
    'status': 'granted',
    'data': {
      'title': 'RA due asru added',
      'species': ['rats'],
      'retrospectiveAssessment': true
    }
  },
  {
    'projectId': 'd63ddbd0-3e8b-49b4-a87a-9867408d5697',
    'status': 'granted',
    'data': {
      'title': 'RA due previous version',
      'species': ['rats']
    },
    'createdAt': '2020-06-02',
    'updatedAt': '2020-06-02'
  },
  {
    // same project as above, earlier version with cats to trigger RA
    'projectId': 'd63ddbd0-3e8b-49b4-a87a-9867408d5697',
    'status': 'granted',
    'data': {
      'title': 'RA due previous version',
      'species': ['cats']
    },
    'createdAt': '2020-06-01',
    'updatedAt': '2020-06-01'
  },
  {
    'projectId': 'a6eaf231-6228-4974-8c53-1e967f9ed216',
    'status': 'granted',
    'data': {
      'title': 'RA due training licence',
      'training-licence': true
    }
  },
  {
    'projectId': '9bf6b04a-5aae-4016-b090-832fd6d75f4d',
    'status': 'granted',
    'data': {
      'title': 'RA due revoked legacy',
      'retrospectiveAssessment': true
    }
  },
  {
    'projectId': '765775b8-845f-4b9d-9c32-950fc392afea',
    'status': 'granted',
    'data': {
      'title': 'RA test submission internal',
      'retrospectiveAssessment': true
    },
    raCompulsory: true
  },
  {
    'projectId': 'c519cb97-2431-445f-9ad8-0fbd90dd33ad',
    'status': 'granted',
    'data': {
      'title': 'RA test editable states',
      'retrospectiveAssessment': true
    },
    raCompulsory: true
  },
  {
    id: '0f41ed69-967c-4a71-9ec4-b80a7551fa98',
    projectId: '3110030b-3a79-48ee-b288-10218afcbd48',
    status: 'granted',
    raCompulsory: true,
    data: {
      title: 'Ticking all the boxes',
      establishments: [{ 'establishment-id': 8202, 'name': 'Marvell Pharmaceutical' }],
      polesList: [{ 'id': 'acb1b3e4-82bb-47c7-b61d-f69b2555150e', 'title': 'Somewhere' }],
      protocols: [
        {
          id: 'd1b3876f-3c16-433e-99ae-e1df492ad2b2',
          title: 'Protocol 1',
          complete: true,
          speciesDetails: [],
          severity: 'mild'
        },
        {
          id: 'ec5d1e34-a80b-4c88-b741-f131f1ac1a38',
          title: 'Protocol 2',
          complete: true,
          speciesDetails: [],
          severity: 'severe',
          gaas: true
        },
        {
          id: '474badcd-5c2c-4821-9c25-2dc56e58cdde',
          title: 'Protocol 3',
          complete: true,
          speciesDetails: [],
          severity: 'moderate'
        }
      ],
      'nmbas-used': true,
      'purpose-bred': true,
      'endangered-animals': true,
      'wild-animals': true,
      'feral-animals': true,
      'commercial-slaughter': true,
      'animals-containing-human-material': true,
      'experimental-design-sexes': true,
      'funding-basic-translational': true,
      'scientific-background-producing-data': true,
      'scientific-background-producing-data-service': true,
      'scientific-background-non-regulatory': true,
      'scientific-background-genetically-altered': true,
      'scientific-background-vaccines': true,
      'project-continuation': [{
        id: '920322e2-e0a9-4192-896d-32b01cd3abc8',
        'expiry-date': '2022-01-01',
        'licence-number': 'P12345678'
      }]
    }
  },
  {
    id: '5d7971ea-1d43-418e-b421-a74ad2cbe7b6',
    projectId: '723c7c7c-d6c6-4ef0-84a8-939eb7f8f838',
    status: 'granted',
    raCompulsory: true,
    data: {
      title: 'Ticking all the boxes',
      establishments: [{ 'establishment-id': 8202, 'name': 'Marvell Pharmaceutical' }],
      protocols: [
        {
          id: 'd1b3876f-3c16-433e-99ae-e1df492ad2b2',
          title: 'Protocol 1',
          species: [
            {
              id: 'be3282ee-2642-4b9a-8cd3-ced02e23c0c3',
              quantity: '100',
              speciesId: '5',
              'life-stages': 'embryo',
              'genetically-altered': false
            }
          ],
          severity: 'Mild'
        },
        {
          id: 'ec5d1e34-a80b-4c88-b741-f131f1ac1a38',
          title: 'Protocol 2',
          species: [
            {
              id: 'be3282ee-2642-4b9a-8cd3-ced02e23c0c3',
              quantity: '100',
              speciesId: '5',
              'life-stages': 'adult',
              'genetically-altered': false
            }
          ],
          severity: 'Severe'
        },
        {
          id: '474badcd-5c2c-4821-9c25-2dc56e58cdde',
          title: 'Protocol 3',
          species: [
            {
              id: 'be3282ee-2642-4b9a-8cd3-ced02e23c0c3',
              quantity: '400',
              speciesId: '18',
              'life-stages': 'adult',
              'genetically-altered': true
            }
          ],
          severity: 'Moderate'
        }
      ]
    }
  },
  {
    projectId: '53e28f7b-3aaa-467f-8b3b-3d721f524d94',
    status: 'granted',
    data: {
      title: 'Legacy permissible purpose NTS regression',
      purpose: ['purpose-a', 'purpose-b', 'purpose-c', 'purpose-d', 'purpose-e', 'purpose-g'],
      'purpose-b': ['purpose-b1', 'purpose-b2', 'purpose-b3']
    }
  },
  {
    projectId: 'a398cc56-ea40-46fa-856e-8915dd831c78',
    status: 'granted',
    data: {
      title: 'Version comparison test amendment',
      'project-aim': toRichText('Granted version')
    }
  },
  {
    projectId: '6a33993f-bc63-49e0-a7ba-79581fbfd9b6',
    status: 'granted',
    data: {
      'poles': true,
      'title': 'Test changes to POLEs',
      'polesList': [
        {
          'id': 'a714da27-f074-499c-a276-005a1d217a8e',
          'title': 'Windermere',
          'pole-info': { 'object': 'value', 'document': { 'data': {}, 'nodes': [{ 'data': {}, 'type': 'paragraph', 'nodes': [{ 'text': 'A lake.', 'marks': [], 'object': 'text' }], 'object': 'block' }], 'object': 'document' } }
        },
        {
          'id': '13f7226b-0f77-4505-a761-a3c70cd23be2',
          'title': 'Conniston',
          'pole-info': { 'object': 'value', 'document': { 'data': {}, 'nodes': [{ 'data': {}, 'type': 'paragraph', 'nodes': [{ 'text': 'Also a lake.', 'marks': [], 'object': 'text' }], 'object': 'block' }], 'object': 'document' } }
        }
      ],
      'poles-transfer': false,
      'poles-inspection': { 'object': 'value', 'document': { 'data': {}, 'nodes': [{ 'data': {}, 'type': 'paragraph', 'nodes': [{ 'text': 'Ensure.', 'marks': [], 'object': 'text' }], 'object': 'block' }], 'object': 'document' } },
      'poles-environment': { 'object': 'value', 'document': { 'data': {}, 'nodes': [{ 'data': {}, 'type': 'paragraph', 'nodes': [{ 'text': 'Environment.', 'marks': [], 'object': 'text' }], 'object': 'block' }], 'object': 'document' } },
      'poles-justification': { 'object': 'value', 'document': { 'data': {}, 'nodes': [{ 'data': {}, 'type': 'paragraph', 'nodes': [{ 'text': 'It needs to be done outside.', 'marks': [], 'object': 'text' }], 'object': 'block' }], 'object': 'document' } },
      'conditions': [{ 'key': 'poles', 'path': 'poles.versions.0', 'type': 'condition', 'autoAdded': true }]
    }
  },
  {
    projectId: '1f69a7f8-e23b-42f6-b74b-ddf5d40f43cf',
    status: 'granted',
    data: {
      title: 'ROP creation test 1',
      species: ['mice']
    }
  },
  {
    projectId: '6d3942fd-e647-4c06-a186-1b4dd0407043',
    status: 'granted',
    data: {
      title: 'ROP creation test 2',
      species: ['mice']
    }
  },
  {
    projectId: 'a5a2ae4e-0d9a-4eec-b0c6-991fc3a62e46',
    status: 'granted',
    data: {
      title: 'ROP creation test 3',
      species: ['mice']
    }
  },
  {
    projectId: 'f641942d-1fe0-4a75-9415-eb8c9950f0ff',
    status: 'granted',
    data: {
      title: 'Project with NHPs',
      species: ['marmosets']
    }
  },
  {
    'id': '96e46b82-5146-4b49-8a1e-56cd69903d5a',
    'projectId': '822892a7-d080-41f8-9e33-55f11466fdc1',
    'status': 'submitted',
    'data': {
      'title': 'Project with task history'
    },
    'createdAt': '2021-05-13 11:43:49.857962+00',
    'updatedAt': '2021-05-13 11:48:14.714+00',
    'licenceHolderId': '5b7bad13-f34b-4959-bd08-c6067ae2fcdd'
  },
  {
    'id': '3d2619f6-5146-4ab0-8d43-bef9e8754203',
    'projectId': '822892a7-d080-41f8-9e33-55f11466fdc1',
    'status': 'granted',
    'data': {
      'title': 'Project with task history'
    },
    'createdAt': '2021-05-13 11:48:33.063993+00',
    'updatedAt': '2021-05-13 11:49:35.204+00',
    'licenceHolderId': '5b7bad13-f34b-4959-bd08-c6067ae2fcdd'
  },
  {
    'projectId': '704ad1d8-685b-4377-9e23-5be056306390',
    'status': 'granted',
    'data': {
      'title': 'RA test collaborator',
      'retrospectiveAssessment': true
    },
    raCompulsory: true
  },
  {
    projectId: '993f312b-2216-4e5a-b14e-070875a630d1',
    status: 'granted',
    data: {
      title: 'ROP collaborator test',
      species: ['mice']
    }
  },
  {
    projectId: 'c63226d1-69ca-4fe2-a79b-811755cb4456',
    data: {
      'title': 'Collaborator active project'
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: 'e482a24d-835a-4580-97da-47fad3739b0a',
    data: {
      'title': 'Content search - application',
      'funding-how': toRichText('This term appears in the full application')
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: '5850275f-e8fd-4d93-a7bc-088d81e93389',
    data: {
      'title': 'Content search - NTS',
      'project-aim': toRichText('This term appears in the NTS section')
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: 'ce588984-6ae7-4772-9ae4-41204a5db4d0',
    data: {
      'title': 'Content search - granted',
      'objective-relation': toRichText('This term appears in the granted licence')
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: 'f21caac5-2ecf-4e3f-b2e2-4e8bee775ad8',
    data: {
      'title': 'Content search - ra'
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: '209696c6-13ac-4297-911d-bbce28954a62',
    data: {
      'title': 'Internal amendment test'
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: '46c41498-5e2b-4949-956d-e0159d89b78c',
    data: {
      'title': 'Content search - continuation',
      'transfer-expiring': true
    },
    status: 'granted',
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: '32bf9973-6bc1-4529-a887-2aca5f06cab2',
    status: 'granted',
    data: {
      title: 'ROP re-use/endangered/GAAs test',
      species: ['mice', 'rats'],
      protocols: [
        {
          gaas: true,
          speciesDetails: [
            {
              value: 'mice',
              reuse: true
            },
            {
              value: 'rats',
              reuse: false
            }
          ]
        }
      ],
      'endangered-animals': true
    }
  },
  {
    projectId: 'e33259f0-e8ba-4093-a6b4-b7129af7b8e6',
    status: 'granted',
    data: {
      title: 'Project task recovery test'
    },
    createdAt: '2020-10-01',
    updatedAt: '2020-10-01'
  },
  {
    projectId: 'c8880526-7d92-4973-a87f-e0257d0bc03b',
    status: 'granted',
    data: {
      title: 'ROP standard species test',
      species: ['mice', 'rats']
    }
  },
  {
    projectId: '6cd7f54b-598d-4519-9798-9c64d641e8ac',
    status: 'granted',
    data: {
      title: 'ROP other species not started',
      species: ['mice', 'other-rodents'],
      'species-other-rodents': ['Chinchilla', 'Capybara']
    }
  },
  {
    projectId: 'd564d049-4cb9-422d-b039-fd94dbaa22e0',
    status: 'granted',
    data: {
      title: 'ROP other species submitted',
      species: ['other-amphibians'],
      'species-other-amphibians': ['Cane Toads']
    }
  },
  {
    projectId: '5dea79ff-990b-4278-a772-d13ee7913547',
    status: 'granted',
    data: {
      title: 'ROP with procedures',
      species: ['mice']
    }
  },
  {
    id: 'f5e19fb1-38ce-4c91-b3a2-7d4a272fbda9',
    projectId: '782732c5-4457-46d6-9d46-6610a0ecf872',
    status: 'submitted',
    data: {
      title: 'Comment Count Test',
      species: ['mice', 'rats'],
      'other-establishments': true,
      establishments: [
        {
          id: uuid(),
          'establishment-id': 8202,
          name: 'Marvell Pharmaceutical',
          'establishment-about': toRichText('First establishment details')
        },
        {
          id: uuid(),
          'establishment-id': 9999,
          name: 'Big Pharma',
          'establishment-about': toRichText('Second establishment details')
        }
      ],
      poles: true,
      'poles-environment': toRichText('Environment answer'),
      'poles-inspection': toRichText('Inspection answer'),
      'poles-justification': toRichText('Justification answer'),
      polesList: [
        {
          id: uuid(),
          title: 'First POLE',
          'pole-info': toRichText('POLE one info')
        },
        {
          id: uuid(),
          title: 'Second POLE',
          'pole-info': toRichText('POLE two info')
        }
      ],
      protocols: [
        {
          id: uuid(),
          title: 'First protocol',
          species: ['mice', 'rats'],
          speciesDetails: [
            {
              id: uuid(),
              name: 'Mice',
              value: 'mice',
              reuse: true,
              'maximum-animals': 100,
              'maximum-times-used': 100
            },
            {
              id: uuid(),
              name: 'Rats',
              value: 'rats',
              reuse: false
            }
          ],
          steps: [
            {
              id: uuid(),
              title: toRichText('Step one')
            },
            {
              id: uuid(),
              title: toRichText('Step two')
            },
            {
              id: uuid(),
              title: toRichText('Step three')
            }
          ]
        },
        {
          id: uuid(),
          title: 'Second protocol',
          species: ['mice'],
          speciesDetails: [
            {
              id: uuid(),
              name: 'Mice',
              value: 'mice',
              reuse: true
            }
          ],
          steps: [
            {
              id: uuid(),
              title: toRichText('Step one')
            },
            {
              id: uuid(),
              title: toRichText('Step two')
            },
            {
              id: uuid(),
              title: toRichText('Step three')
            }
          ]
        }
      ]
    }
  },
  {
    projectId: '1c8f324a-c93a-4b93-b3ce-ca27dc6383cb',
    status: 'submitted',
    data: {
      title: 'Internal deadline future',
      species: ['mice']
    }
  },
  {
    projectId: '562ec6a3-be67-454d-83dc-6cd6e379956b',
    status: 'submitted',
    data: {
      title: 'Internal deadline urgent',
      species: ['mice']
    }
  },
  {
    projectId: '4ac58c06-6350-4bc8-a5b6-ead1e0ffbb9b',
    status: 'submitted',
    data: {
      title: 'Internal deadline past',
      species: ['mice']
    }
  },
  {
    projectId: 'f88fadc5-fd31-4932-86fd-0da593b6e9c2',
    status: 'submitted',
    data: {
      title: 'Internal deadline future, statutory deadline future (same date)',
      species: ['mice']
    }
  },
  {
    projectId: '42c30236-65aa-4f51-8ea5-9ff7a3d31148',
    status: 'submitted',
    data: {
      title: 'Internal deadline future, statutory deadline future (internal earlier)',
      species: ['mice']
    }
  },
  {
    projectId: '6e4cb09b-f084-47f9-bc31-4a548edb0145',
    status: 'submitted',
    data: {
      title: 'Internal deadline past, statutory deadline future',
      species: ['mice']
    }
  },
  {
    projectId: 'c4f8df6e-0e9d-4fea-aeb0-d444211a63d8',
    status: 'submitted',
    data: {
      title: 'Internal deadline past, statutory deadline past',
      species: ['mice']
    }
  },
  {
    projectId: 'e7295338-beb8-4b66-8bb6-2e65da0e0e3b',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: submitted',
      species: ['mice']
    }
  },
  {
    projectId: '482fa74c-56b2-40ca-9dca-6b00d174b5e4',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: submitted - No licenceHolder on task',
      species: ['mice']
    }
  },
  {
    projectId: 'e2265359-f8eb-4607-951b-c4cf3c213132',
    status: 'draft', // returned projects need a forked draft
    data: {
      title: 'Refuse PPL: can resubmit',
      species: ['mice']
    }
  },
  {
    projectId: 'e2265359-f8eb-4607-951b-c4cf3c213132',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: can resubmit',
      species: ['mice']
    }
  },
  {
    projectId: 'b75ff8d7-fee4-4436-8598-e70b7101f446',
    status: 'draft', // returned projects need a forked draft
    data: {
      title: 'Refuse PPL: deadline future with applicant',
      species: ['mice']
    }
  },
  {
    projectId: 'b75ff8d7-fee4-4436-8598-e70b7101f446',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: deadline future with applicant',
      species: ['mice']
    }
  },
  {
    projectId: '92ff5870-fc92-4d71-bd14-e72f83e4dae7',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: deadline passed with applicant',
      species: ['mice']
    }
  },
  {
    projectId: '92ff5870-fc92-4d71-bd14-e72f83e4dae7',
    status: 'draft',
    data: {
      title: 'Refuse PPL: deadline passed with applicant',
      species: ['mice']
    }
  },
  {
    projectId: '3545e6a5-ed37-4f25-8cae-15367b295a77',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: deadline future with asru',
      species: ['mice']
    }
  },
  {
    projectId: '23ab7fdc-cf39-4a50-8bbb-b1f817d06e29',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: deadline passed with asru',
      species: ['mice']
    }
  },
  {
    projectId: 'c0038b53-3417-4a6e-aeb0-6bc92969b3ac',
    status: 'draft', // returned projects need a forked draft
    data: {
      title: 'Refuse PPL: refused',
      species: ['mice']
    }
  },
  {
    projectId: 'c0038b53-3417-4a6e-aeb0-6bc92969b3ac',
    status: 'submitted',
    data: {
      title: 'Refuse PPL: refused',
      species: ['mice']
    }
  },
  {
    projectId: '120311bb-2209-4123-bca2-a2dea7dba2c0',
    status: 'granted',
    data: {
      title: 'Removing project level species shows protocols as changed',
      'training-licence': false,
      duration: {
        'years': 5,
        'months': 0
      },
      species: ['mice', 'rats'],
      protocols: [
        {
          id: uuid(),
          title: 'First protocol',
          complete: true,
          severity: 'mild',
          species: ['mice', 'rats'],
          speciesDetails: [
            {
              id: uuid(),
              name: 'Mice',
              value: 'mice',
              reuse: false,
              'life-stages': ['adult'],
              'continued-use': false,
              'maximum-animals': '100',
              'maximum-times-used': '1'
            },
            {
              id: uuid(),
              name: 'Rats',
              value: 'rats',
              reuse: false,
              'life-stages': ['adult'],
              'continued-use': false,
              'maximum-animals': '50',
              'maximum-times-used': '1'
            }
          ]
        },
        {
          id: uuid(),
          title: 'Second protocol',
          complete: true,
          severity: 'mild',
          species: ['mice', 'rats'],
          speciesDetails: [
            {
              id: uuid(),
              name: 'Mice',
              value: 'mice',
              reuse: false,
              'life-stages': ['adult'],
              'continued-use': false,
              'maximum-animals': '30',
              'maximum-times-used': '1'
            },
            {
              id: uuid(),
              name: 'Rats',
              value: 'rats',
              reuse: false,
              'life-stages': ['adult'],
              'continued-use': false,
              'maximum-animals': '10',
              'maximum-times-used': '1'
            }
          ]
        }
      ]
    }
  }
];
