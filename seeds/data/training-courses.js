const trainingCourses = [
  {
    'id': '17edf16b-d9fc-4eca-a5a8-a36fd720d608',
    'establishmentId': 54321,
    'title': 'Training course with expired PIL-E',
    'startDate': '2020-04-01',
    'species': ['Mice'],
    'projectId': '56763107-6430-43a1-841d-ad2ecf4196ad',
    'participants': [
      {
        'id': '3ca6bf4a-b52b-46dc-a08a-9a50844e1414',
        'profile_id': '34887c4e-578c-4797-8103-e801826dbe01',
        'issue_date': '2020-04-08',
        'expiry_date': '2020-07-08',
        'status': 'expired'
      }
    ]
  },
  {
    'id': '17edf16b-d9fc-4eca-a5a8-a36fd720d607',
    'establishmentId': 54321,
    'title': 'Training course with active PIL-Es',
    'startDate': '2020-04-01',
    'species': ['Mice'],
    'projectId': '56763107-6430-43a1-841d-ad2ecf4196ad',
    'participants': [
      {
        'id': '3ca6bf4a-b52b-46dc-a08a-9a50844e1411',
        'profile_id': 'a0daf3a3-b86b-4d35-a7e7-e86ad0e32853',
        'issue_date': '2020-03-30',
        'expiry_date': '2020-06-30',
        'status': 'expired'
      },
      {
        'id': '3ca6bf4a-b52b-46dc-a08a-9a50844e1412',
        'profile_id': 'b0bd0d40-0c8b-4b6e-8668-ba0a414a4317',
        'issue_date': '2020-03-30',
        'expiry_date': '2020-06-30',
        'revocation_date': '2020-05-30',
        'status': 'revoked'
      },
      {
        'id': '3ca6bf4a-b52b-46dc-a08a-9a50844e1413',
        'profile_id': 'fe503fe4-c61c-4dd7-8d8f-8bd5e5bde1be',
        'issue_date': '2020-03-30',
        'expiry_date': '2020-06-30',
        'revocation_date': '2020-04-01',
        'status': 'revoked'
      },
      {
        'id': '3ca6bf4a-b52b-46dc-a08a-9a50844e1415',
        'profile_id': '34887c4e-578c-4797-8103-e801826dbe01',
        'issue_date': '2020-10-01',
        'expiry_date': '2021-01-01',
        'status': 'active'
      }
    ]
  },
  {
    'establishmentId': 54321,
    'title': 'Training course to delete',
    'startDate': '2025-01-01',
    'species': ['Mice'],
    'projectId': '56763107-6430-43a1-841d-ad2ecf4196ad'
  },
  {
    'establishmentId': 54321,
    'title': 'Training course to add participants to',
    'startDate': '2025-01-01',
    'species': [
      'Mice',
      'Rats'
    ],
    'projectId': '56763107-6430-43a1-841d-ad2ecf4196ad'
  }
];
export default trainingCourses;
