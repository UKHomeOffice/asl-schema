const projects =
  [
    {
      'id': '56763107-6430-43a1-841d-ad2ecf4196ad',
      'licenceHolderId': '084457d6-0f38-43dd-b133-70858ff4b3de',
      'establishmentId': 54321,
      'title': 'Training project 1',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-05',
      'licenceNumber': 'PR250147',
      'status': 'active',
      'createdAt': '2020-02-05',
      'updatedAt': '2020-10-14',
      'amendedDate': '2020-10-14'
    },
    {
      'id': 'e3310c1a-5fe0-4e59-95b8-6410d8fd8031',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'title': 'Basic user project',
      'issueDate': '2023-10-01',
      'expiryDate': '2028-10-01',
      'licenceNumber': 'PR-250872',
      'status': 'active',
      'createdAt': '2021-02-05',
      'updatedAt': '2023-10-14',
      'amendedDate': '2023-10-14'
    },
    {
      'id': 'e2b36165-d85d-4467-a9f9-0014af089131',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'title': 'Change licence holder',
      'issueDate': '2023-10-01',
      'expiryDate': '2028-10-01',
      'licenceNumber': 'PR-250877',
      'status': 'active',
      'createdAt': '2021-02-05',
      'updatedAt': '2023-10-14',
      'amendedDate': '2023-10-14'
    },
    {
      'id': '7b97f33e-662b-4357-8dd9-609380e92286',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'title': 'Change licence holder collaborator',
      'issueDate': '2023-10-01',
      'expiryDate': '2028-10-01',
      'licenceNumber': 'PR-250877',
      'status': 'active',
      'createdAt': '2021-02-05',
      'updatedAt': '2023-10-14',
      'amendedDate': '2023-10-14',
      'collaborators': [
        {
          'profileId': 'f3fdd3a1-319b-4e74-b9e4-71fa2fdfafee',
          'role': 'basic'
        }
      ]
    },
    {
      'id': '9ad36797-7bb4-4f4f-96c1-a8162c5eec44',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'title': 'Download test project',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-05',
      'licenceNumber': 'PR-123123',
      'status': 'active',
      'createdAt': '2020-02-05',
      'updatedAt': '2020-10-14',
      'amendedDate': '2020-10-14'
    },
    {
      'id': '84ec643f-893b-4232-ab4c-5789d50773de',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'schemaVersion': 0,
      'title': 'Legacy project',
      'issueDate': '2023-11-01',
      'expiryDate': '2028-11-01',
      'licenceNumber': 'PR-123456',
      'status': 'active'
    },
    {
      'id': '395fd103-b933-44c2-a42b-05af4d39c1ec',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'schemaVersion': 0,
      'title': 'Legacy other species test',
      'issueDate': '2023-11-01',
      'expiryDate': '2028-11-01',
      'licenceNumber': 'PL-123456',
      'status': 'active'
    },
    {
      'id': 'ba50976e-1cca-4cda-baa7-f7d0be53d83a',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'schemaVersion': 0,
      'title': 'Legacy AWERB test',
      'issueDate': '2023-11-01',
      'expiryDate': '2028-11-01',
      'licenceNumber': 'LEGACY-AWERB',
      'status': 'active'
    },
    {
      'id': '1cbbb865-f5e7-4314-a35d-e8adcf19a811',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'schemaVersion': 0,
      'title': 'Test legacy change licence holder',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'licenceNumber': 'PR-000000',
      'status': 'active'
    },
    {
      'id': 'eef743f2-de64-421b-a1bc-2a0c7cd81814',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'schemaVersion': 1,
      'title': 'Test change licence holder',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'licenceNumber': 'PR-458145',
      'status': 'active'
    },
    {
      'id': 'a1149bae-a448-4ef8-b2d8-39414fe34ba5',
      'licenceHolderId': 'fcfd3d23-0582-4d90-9822-1db678a41792',
      'establishmentId': 8201,
      'schemaVersion': 0,
      'title': 'Legacy Autoproject Draft',
      'status': 'inactive'
    },
    {
      'id': 'e1f488fb-a9d0-4e55-aca7-396d31e9f814',
      'establishmentId': 8201,
      'title': 'Search for the luminescent aether',
      'issueDate': '2016-02-05',
      'expiryDate': '2018-03-01',
      'licenceNumber': 'PR-764848',
      'status': 'expired'
    },
    {
      'id': 'f638b9b2-e11b-477a-84f9-fd6755f428c3',
      'establishmentId': 8201,
      'title': 'Evaluation of novel anti-cancer agents',
      'issueDate': '2016-02-05',
      'expiryDate': '2018-07-01',
      'licenceNumber': 'PR-250436',
      'status': 'expired'
    },
    {
      'id': 'f638b9b2-e11b-477a-84f9-fd6755f428c4',
      'establishmentId': 8201,
      'title': 'Internal View Test',
      'issueDate': '2020-05-01',
      'expiryDate': '2025-05-01',
      'licenceNumber': 'PR-250437',
      'status': 'active'
    },
    {
      'id': 'f638b9b2-e11b-477a-84f9-fd6755f428c5',
      'establishmentId': 8201,
      'title': 'Internal Revoke Test',
      'issueDate': '2020-05-01',
      'expiryDate': '2025-05-01',
      'licenceNumber': 'PR-250438',
      'status': 'active'
    },
    {
      'id': 'f638b9b2-e11b-477a-84f9-fd6755f428c6',
      'establishmentId': 8201,
      'title': 'Public Revoke Test',
      'issueDate': '2020-05-01',
      'expiryDate': '2025-05-01',
      'licenceNumber': 'PR-250439',
      'status': 'active'
    },
    {
      'id': 'a09937d7-6c05-4dea-bd5f-3ba8168875cb',
      'establishmentId': 8201,
      'title': 'Development of new biological anti-cancer agents',
      'issueDate': '2017-10-01',
      'expiryDate': '2018-08-01',
      'licenceNumber': 'PR-890458',
      'status': 'expired'
    },
    {
      'id': '7828ae88-68a8-404b-ab53-ff1077722f07',
      'establishmentId': 8201,
      'title': 'Thermosensitive nanoparticles for cancer therapy',
      'issueDate': '2015-11-24',
      'expiryDate': '2018-09-01',
      'licenceNumber': 'PR-192985',
      'status': 'expired'
    },
    {
      'id': 'b8b28a7b-3157-41c8-ae3f-7baf33085e8d',
      'establishmentId': 8201,
      'title': 'Oncolytic HSV as an anti-cancer therapy',
      'issueDate': '2018-02-24',
      'expiryDate': '2018-10-01',
      'licenceNumber': 'PR-278783',
      'status': 'expired'
    },
    {
      'id': 'c2334f4e-f8ce-4fb6-a726-5f87ee26da55',
      'establishmentId': 8201,
      'title': 'Hypoxy and angiogenesis in cancer therapy',
      'issueDate': '2017-04-23',
      'expiryDate': '2018-11-01',
      'licenceNumber': 'PR-671216',
      'status': 'expired'
    },
    {
      'id': '5a1ad546-f347-4f65-b905-595d64932da2',
      'establishmentId': 8201,
      'title': 'Evaluation of novel anti-cancer agents',
      'issueDate': '2016-02-05',
      'expiryDate': '2018-12-01',
      'licenceNumber': 'PR-050381',
      'status': 'expired'
    },
    {
      'id': 'ce80a27b-054c-4264-a60b-469a67413d73',
      'establishmentId': 8201,
      'title': 'Development of new biological anti-cancer agents',
      'issueDate': '2017-10-01',
      'expiryDate': '2019-01-01',
      'licenceNumber': 'PR-787013',
      'status': 'expired'
    },
    {
      'id': '8b946810-e202-412d-95ba-d9473fc600d3',
      'establishmentId': 8201,
      'title': 'Thermosensitive nanoparticles for cancer therapy',
      'issueDate': '2015-11-24',
      'expiryDate': '2019-02-01',
      'licenceNumber': 'PR-519417',
      'status': 'expired'
    },
    {
      'id': '7f28e0d2-3431-4b4b-bf77-3652f1968c5d',
      'establishmentId': 8201,
      'title': 'Oncolytic HSV as an anti-cancer therapy',
      'issueDate': '2018-02-24',
      'expiryDate': '2019-03-01',
      'licenceNumber': 'PR-265039',
      'status': 'expired'
    },
    {
      'id': '4e3241d6-5725-489f-bdf9-8b688a7a85c7',
      'establishmentId': 8201,
      'title': 'Hypoxy and angiogenesis in cancer therapy',
      'issueDate': '2017-04-23',
      'expiryDate': '2019-04-01',
      'licenceNumber': 'PR-127482',
      'status': 'expired'
    },
    {
      'id': '01a55d81-76b7-42eb-957e-c31d69da52d4',
      'establishmentId': 8201,
      'title': 'Evaluation of novel anti-cancer agents',
      'issueDate': '2016-02-05',
      'expiryDate': '2019-05-01',
      'licenceNumber': 'PR-635078',
      'status': 'expired'
    },
    {
      'id': 'f05b13d5-de41-4173-b313-cd165c8f8072',
      'establishmentId': 8201,
      'title': 'Development of new biological anti-cancer agents',
      'issueDate': '2017-10-01',
      'expiryDate': '2019-06-01',
      'licenceNumber': 'PR-141529',
      'status': 'expired'
    },
    {
      'id': 'e15b1645-730e-40ea-a177-7fee4ab757cb',
      'establishmentId': 8201,
      'title': 'Thermosensitive nanoparticles for cancer therapy',
      'issueDate': '2015-11-24',
      'expiryDate': '2019-07-01',
      'licenceNumber': 'PR-377835',
      'status': 'active'
    },
    {
      'id': '6d2c6e8c-d38f-48b5-806b-ac698e5d4f6e',
      'establishmentId': 8201,
      'title': 'Oncolytic HSV as an anti-cancer therapy',
      'issueDate': '2018-02-24',
      'expiryDate': '2019-08-01',
      'licenceNumber': 'PR-474098',
      'status': 'active'
    },
    {
      'id': '09971443-dfcb-483d-88f7-d0bacbbf4d76',
      'establishmentId': 8201,
      'title': 'Hypoxy and angiogenesis in cancer therapy',
      'issueDate': '2017-04-23',
      'expiryDate': '2019-09-01',
      'licenceNumber': 'PR-627808',
      'status': 'active'
    },
    {
      'id': '6a651f3b-fa06-460f-a321-147b4002e20a',
      'establishmentId': 8201,
      'title': 'Evaluation of novel anti-cancer agents',
      'issueDate': '2016-02-05',
      'expiryDate': '2019-10-01',
      'licenceNumber': 'PR-398957',
      'status': 'active'
    },
    {
      'id': '3dfbaca9-8ff4-4509-b0ef-763b6a31b2ac',
      'establishmentId': 8201,
      'title': 'Development of new biological anti-cancer agents',
      'issueDate': '2017-10-01',
      'expiryDate': '2019-11-01',
      'licenceNumber': 'PR-404484',
      'status': 'active'
    },
    {
      'id': '855d6a51-338d-4c81-ae6f-d2dc89674c66',
      'establishmentId': 8201,
      'title': 'Thermosensitive nanoparticles for cancer therapy',
      'issueDate': '2023-12-01',
      'expiryDate': '2028-12-01',
      'licenceNumber': 'PR-374785',
      'status': 'active'
    },
    {
      'id': '2319e33e-ffa0-4197-bb92-26a38c18662e',
      'establishmentId': 8201,
      'title': 'Oncolytic HSV as an anti-cancer therapy',
      'issueDate': '2018-02-24',
      'expiryDate': '2026-01-01',
      'licenceNumber': 'PR-439411',
      'status': 'active'
    },
    {
      'id': 'd42196ff-eb93-4b20-8b71-22673901873d',
      'establishmentId': 8201,
      'title': 'Project with protocols',
      'issueDate': '2023-04-01',
      'expiryDate': '2028-04-01',
      'licenceNumber': 'PR-670832',
      'status': 'active'
    },
    {
      'id': 'd42196ff-eb93-4b20-8b71-22673901873e',
      'establishmentId': 8201,
      'title': 'Revoked project',
      'issueDate': '2015-03-01',
      'expiryDate': '2020-03-01',
      'revocationDate': '2018-04-23',
      'licenceNumber': 'PR-000000',
      'status': 'revoked'
    },
    {
      'id': 'd42196ff-eb93-4b20-8b71-22673901873f',
      'establishmentId': 8201,
      'title': 'Draft project',
      'status': 'inactive'
    },
    {
      'id': '7d867c46-5e17-4f7f-8718-4f99160582d3',
      'establishmentId': 8201,
      'title': 'Draft with withdrawn',
      'status': 'inactive'
    },
    {
      'id': '38008c26-8748-45f8-b0a5-18f1bafbae70',
      'establishmentId': 8201,
      'title': 'Draft legacy project',
      'status': 'inactive',
      'schemaVersion': 0
    },
    {
      'id': '25d769f2-cbe1-4e05-921f-efdbea9c117b',
      'establishmentId': 8201,
      'title': 'Expired project',
      'issueDate': '2015-04-23',
      'expiryDate': '2018-04-23',
      'licenceNumber': 'PR-X00001',
      'status': 'expired'
    },
    {
      'id': '6949f7e8-2c4a-4cdc-b64d-297e0c1a722c',
      'establishmentId': 8201,
      'title': 'Expired legacy project',
      'issueDate': '2015-07-04',
      'expiryDate': '2020-07-04',
      'licenceNumber': 'PR-349578',
      'status': 'expired',
      'schemaVersion': 0
    },
    {
      'id': '6b9b7471-396e-47fe-a98f-da0c76e0a26a',
      'establishmentId': 8201,
      'title': 'Amend in prog project',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceNumber': 'PR-X00002',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'active'
    },
    {
      'id': 'e022533a-bc01-438a-815b-6cbf6ec1f31c',
      'establishmentId': 8201,
      'title': 'Draft Application',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'inactive'
    },
    {
      'id': '6b9b7471-396e-47fe-a98f-da0c76e0a26b',
      'establishmentId': 8201,
      'title': 'Project with legacy list',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceNumber': 'PR-X00003',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'active'
    },
    {
      'id': 'c4113aee-faba-4dde-8b4f-360e4e7913ed',
      'establishmentId': 8201,
      'title': 'New draft',
      'status': 'inactive',
      'schemaVersion': 1
    },
    {
      'id': '77af45c8-761e-49f6-b6fb-e105f0e67185',
      'establishmentId': 8201,
      'title': 'Additional availability to be added draft',
      'status': 'inactive',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1
    },
    {
      'id': '5cb97819-3e21-4ea5-85f0-32df2b06213b',
      'establishmentId': 8201,
      'title': 'Additional availability to be added',
      'status': 'active',
      'licenceNumber': 'PR-X12345',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1
    },
    {
      'id': '5cb97819-3e21-4ea5-85f0-32df2b06213c',
      'establishmentId': 8201,
      'title': 'Additional availability active',
      'status': 'active',
      'licenceNumber': 'PR-X23456',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1,
      'additionalEstablishments': [
        {
          'establishmentId': 30001,
          'status': 'active'
        }
      ]
    },
    {
      'id': '27c98cdb-fd33-4449-852c-823d43ccda03',
      'establishmentId': 8201,
      'title': 'Additional availability to transfer',
      'status': 'active',
      'licenceNumber': 'PR-YAAAA',
      'issueDate': '2021-01-10',
      'expiryDate': '2026-01-10',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1,
      'additionalEstablishments': [
        {
          'establishmentId': 30001,
          'status': 'active'
        }
      ]
    },
    {
      'id': '163c30f5-d6f9-4b34-9c63-21f21e7948ba',
      'establishmentId': 8201,
      'title': 'Additional availability old style',
      'status': 'active',
      'licenceNumber': 'PR-X12346',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1
    },
    {
      'id': '519eb1d6-e8f0-4d9c-8628-8da4394c2d2e',
      'establishmentId': 8201,
      'title': 'Active project',
      'status': 'active',
      'schemaVersion': 1,
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'PR-X12345'
    },
    {
      'id': '739fbe40-cfb9-431d-80c2-ac3d5beee2b2',
      'establishmentId': 8201,
      'title': 'Active project wrong issue date',
      'status': 'active',
      'schemaVersion': 1,
      'issueDate': '2019-08-10',
      'expiryDate': '2026-04-23',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'PR-X66421'
    },
    {
      'id': '6b9b7471-396e-47fe-a98f-da0c76e0a26c',
      'establishmentId': 8201,
      'title': 'Unsubmitted draft',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'inactive'
    },
    {
      'id': '2ae6a098-9447-49a2-b841-6c63dc8a9767',
      'establishmentId': 8201,
      'title': 'Submit application test',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'status': 'inactive'
    },
    {
      'id': 'a5a71e6f-f03d-4771-bc25-deed74a01794',
      'establishmentId': 8201,
      'title': 'Submit on behalf test',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'status': 'inactive'
    },
    {
      'id': '6fcbc8cc-2665-4c79-9b03-1f67edc664e8',
      'establishmentId': 8201,
      'title': 'Transfer draft test',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'inactive'
    },
    {
      'id': '6b9b7471-396e-47fe-a98f-da0c76e0a26d',
      'establishmentId': 8201,
      'title': 'Submitted draft',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'inactive'
    },
    {
      'id': 'b8973df0-408c-4f3c-a7f2-b5b8f8c2943b',
      'title': 'RA true',
      'schemaVersion': 1,
      'status': 'active',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201,
      'licenceNumber': 'PR-X10006',
      'createdAt': '2023-09-04T13:32:45.886Z',
      'issueDate': '2023-04-23T00:00:00.000Z',
      'updatedAt': '2023-09-04T13:32:45.886Z',
      'expiryDate': '2028-04-23T00:00:00.000Z',
      'raDate': '2028-10-23T00:00:00.000Z'
    },
    {
      'id': '6b97eee3-0d2a-4ffa-8ba5-094b0d67154e',
      'title': 'RA false',
      'schemaVersion': 1,
      'status': 'active',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201,
      'licenceNumber': 'PR-X10007',
      'createdAt': '2023-09-04T13:32:45.886Z',
      'issueDate': '2023-04-23T00:00:00.000Z',
      'updatedAt': '2023-09-04T13:32:45.886Z',
      'expiryDate': '2028-04-23T00:00:00.000Z'
    },
    {
      'id': '0841bc71-f6b5-402d-a8f0-45467213f158',
      'title': 'RA not editable - species',
      'schemaVersion': 1,
      'status': 'active',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201,
      'licenceNumber': 'PR-X10012',
      'createdAt': '2023-09-04T13:32:45.886Z',
      'issueDate': '2023-04-23T00:00:00.000Z',
      'updatedAt': '2023-09-04T13:32:45.886Z',
      'expiryDate': '2028-04-23T00:00:00.000Z',
      'raDate': '2028-10-23T00:00:00.000Z'
    },
    {
      'id': '715a0156-4639-42ee-bd00-35a96e75ca4a',
      'title': 'Unmigrated Species',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201
    },
    {
      'id': 'fab30838-4316-4863-9070-5caa08e87d47',
      'title': 'Project with multiple versions',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201,
      'status': 'active',
      'issueDate': '2023-01-01',
      'expiryDate': '2028-01-01',
      'licenceNumber': 'PR-X10099'
    },
    {
      'id': '04956663-711b-4bda-b201-46d9eeabf9d4',
      'title': 'Project with deleted protocols',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'establishmentId': 8201,
      'status': 'inactive'
    },
    {
      'id': 'e8e437a3-ac2b-4d66-af37-1c369a3211dc',
      'establishmentId': 30001,
      'title': 'Small pharma project',
      'status': 'active',
      'schemaVersion': 1,
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e148',
      'licenceNumber': 'PR-X10016'
    },
    {
      'id': '3b125d04-a0ec-46fe-9954-80a13b3e39f9',
      'establishmentId': 8201,
      'title': 'Transfer basic user project',
      'status': 'active',
      'schemaVersion': 1,
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'licenceNumber': 'PR-X10017',
      'additionalEstablishments': [
        {
          'establishmentId': 8202,
          'status': 'active'
        }
      ]
    },
    {
      'id': 'b5554241-083c-4fce-a031-71403fdae509',
      'establishmentId': 8201,
      'title': 'Transfer basic user draft',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '609e57a1-3436-4163-a7d2-97c7ce465364',
      'establishmentId': 8201,
      'title': 'ASRU amendment in progress: draft',
      'status': 'active',
      'issueDate': '2020-04-29',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'd584ca49-5f44-41f8-902b-5aa7e9334969',
      'establishmentId': 8201,
      'title': 'ASRU amendment in progress: submitted',
      'status': 'active',
      'issueDate': '2020-04-29',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '2de9d19a-6858-467d-a4fb-a1a3e31c3435',
      'establishmentId': 8201,
      'title': 'Continuation ids migration',
      'status': 'active',
      'issueDate': '2020-08-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': '5e703f3c-9af7-4344-add5-a542fbb6f3bd',
      'establishmentId': 8201,
      'title': 'Continuation migrated',
      'status': 'active',
      'issueDate': '2020-07-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': '23e96d12-74d5-4ccb-ba3f-ec16829d4b6d',
      'establishmentId': 8201,
      'title': 'Training licence',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-05',
      'raDate': '2025-08-05',
      'licenceNumber': 'XY-12345678'
    },
    {
      'id': '423dc041-8293-4531-9652-3ca03f3e5fbb',
      'establishmentId': 10801,
      'title': 'Testing establishment merge basic ppl',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': '4befc336-c870-414e-bf10-8b003e9e119d',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-05',
      'licenceNumber': 'BASIC-PPL@SOURCE'
    },
    {
      'id': '4eed2b09-2b21-45a9-be54-3b2736d6f287',
      'establishmentId': 10801,
      'title': 'Testing establishment merge admin ppl',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ca8b2fce-5938-49b5-b1d1-4fe620be8673',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-05',
      'licenceNumber': 'ADMIN-PPL@SOURCE'
    },
    {
      'id': '3c7990f7-8e6b-4fa1-8ba5-34ede489b22a',
      'establishmentId': 8201,
      'title': 'Testing deadline extension',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': '9d83dcac-a544-4cf8-90c8-b9915ab16f80',
      'establishmentId': 8201,
      'title': 'Testing deadline extension (old style)',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': '52949a8f-879c-45bd-b6a4-cbc01c746da0',
      'establishmentId': 8201,
      'title': 'Testing deadline passed',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01'
    },
    {
      'id': '04e9f8f0-ba3c-4357-b4ef-39e8bb4445f1',
      'establishmentId': 8201,
      'title': 'Testing deadline remove',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01'
    },
    {
      'id': '52949a8f-879c-45bd-b6a4-cbc01c746da1',
      'establishmentId': 8201,
      'title': 'Testing deadline passed external',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01'
    },
    {
      'id': 'd661f113-9594-4374-b461-b75d1b6a02db',
      'establishmentId': 8201,
      'title': 'Unsubmitted amendment',
      'status': 'active',
      'issueDate': '2021-01-08',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': '78508e8c-26e9-4960-88cd-2761eb1afd57',
      'establishmentId': 8201,
      'title': 'Unsubmitted ASRU amendment',
      'status': 'active',
      'issueDate': '2021-01-08',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83'
    },
    {
      'id': 'b978c34f-d3bf-4747-ab03-97e44e2a80d8',
      'establishmentId': 8201,
      'title': 'RA due revoked',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567124',
      'raDate': '2025-01-01'
    },
    {
      'id': '98876c9f-9917-4c3b-bb88-722b0bb5a351',
      'establishmentId': 8201,
      'title': 'RA due cats',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567127',
      'raDate': '2025-01-01',
      'species': '["cats"]'
    },
    {
      'id': '8804dfc0-ae9b-4bfc-9343-200b845b9cb0',
      'establishmentId': 8201,
      'title': 'RA due nhp',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567128',
      'raDate': '2025-01-01',
      'species': '["rhesus"]'
    },
    {
      'id': 'db22f92c-0c2d-470f-9152-c203eb5d3262',
      'establishmentId': 8201,
      'title': 'RA due endangered',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567129',
      'raDate': '2025-01-01',
      'species': '["Dodos","Velociraptors"]'
    },
    {
      'id': 'b87aa91e-65d8-4d38-9a70-305ba81c6109',
      'establishmentId': 8201,
      'title': 'RA due severe procedures',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567130',
      'raDate': '2025-01-01',
      'species': '["mice"]'
    },
    {
      'id': '22436667-60d8-4afe-beaf-7284c1642e79',
      'establishmentId': 8201,
      'title': 'RA due multiple reasons (dogs, severe)',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2021-01-01',
      'licenceNumber': 'PR-X567131',
      'raDate': '2025-01-01',
      'species': '["beagles"]'
    },
    {
      'id': '6ae2295c-dd09-4c30-bd19-c67dd7f24cea',
      'establishmentId': 8201,
      'title': 'RA due asru added',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2021-01-01',
      'licenceNumber': 'PR-X567132',
      'raDate': '2025-01-01',
      'species': '["rats"]'
    },
    {
      'id': 'd63ddbd0-3e8b-49b4-a87a-9867408d5697',
      'establishmentId': 8201,
      'title': 'RA due previous version',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567133',
      'raDate': '2025-01-01',
      'species': '["rats"]'
    },
    {
      'id': 'a6eaf231-6228-4974-8c53-1e967f9ed216',
      'establishmentId': 8201,
      'title': 'RA due training licence',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567125',
      'raDate': '2025-01-01'
    },
    {
      'id': '9bf6b04a-5aae-4016-b090-832fd6d75f4d',
      'establishmentId': 8201,
      'title': 'RA due revoked legacy',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 0,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2020-08-01',
      'licenceNumber': 'PR-X567126',
      'raDate': '2025-01-01'
    },
    {
      'id': '765775b8-845f-4b9d-9c32-950fc392afea',
      'establishmentId': 8201,
      'title': 'RA test submission internal',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2021-01-01',
      'licenceNumber': 'PR-RA-TEST',
      'raDate': '2025-01-01'
    },
    {
      'id': 'c519cb97-2431-445f-9ad8-0fbd90dd33ad',
      'establishmentId': 8201,
      'title': 'RA test editable states',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2021-01-01',
      'licenceNumber': 'PR-RA-TEST-2',
      'raDate': '2025-01-01'
    },
    {
      'id': '3110030b-3a79-48ee-b288-10218afcbd48',
      'establishmentId': 8201,
      'title': 'Ticking all the boxes',
      'status': 'active',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'licenceNumber': 'PR-ALL-BOXES',
      'raDate': '2025-01-01',
      'species': '["Cats","Dogs"]'
    },
    {
      'id': '723c7c7c-d6c6-4ef0-84a8-939eb7f8f838',
      'establishmentId': 8201,
      'title': 'Ticking all the boxes legacy',
      'status': 'active',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'schemaVersion': 0,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'licenceNumber': 'PR-ALL-BOXES-LEGACY',
      'raDate': '2025-01-01',
      'species': '["Cats","Dogs"]'
    },
    {
      'id': 'a91150dd-e6b1-4582-9764-7af9a05b4aff',
      'establishmentId': 8201,
      'title': 'Content search test',
      'status': 'active',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-11-01',
      'updatedAt': '2020-11-01',
      'licenceNumber': 'PR-CONTENT'
    },
    {
      'id': '53e28f7b-3aaa-467f-8b3b-3d721f524d94',
      'establishmentId': 8201,
      'title': 'Legacy permissible purpose NTS regression',
      'status': 'active',
      'issueDate': '2020-11-01',
      'expiryDate': '2025-11-01',
      'schemaVersion': 0,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-11-01',
      'updatedAt': '2020-11-01',
      'licenceNumber': 'PR-891234'
    },
    {
      'id': '4f56fe77-26e7-4626-a27c-7b68fa78dd03',
      'establishmentId': 8201,
      'title': 'Training record test application',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '7296249e-a719-4c2f-8115-8047b40091ac',
      'establishmentId': 8201,
      'title': 'Version comparison test application',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'a398cc56-ea40-46fa-856e-8915dd831c78',
      'establishmentId': 8201,
      'title': 'Version comparison test amendment',
      'status': 'active',
      'issueDate': '2021-01-01',
      'expiryDate': '2026-01-01',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'licenceNumber': 'COMPARE'
    },
    {
      'id': '6a33993f-bc63-49e0-a7ba-79581fbfd9b6',
      'establishmentId': 8201,
      'title': 'Test changes to POLEs',
      'status': 'active',
      'issueDate': '2021-01-01',
      'expiryDate': '2026-01-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'P0L35'
    },
    {
      'id': '1f69a7f8-e23b-42f6-b74b-ddf5d40f43cf',
      'establishmentId': 10266,
      'title': 'ROP creation test 1',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP1'
    },
    {
      'id': '6d3942fd-e647-4c06-a186-1b4dd0407043',
      'establishmentId': 10266,
      'title': 'ROP creation test 2',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP2'
    },
    {
      'id': 'a5a2ae4e-0d9a-4eec-b0c6-991fc3a62e46',
      'establishmentId': 10266,
      'title': 'ROP creation test 3',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP3'
    },
    {
      'id': '0c01cd7d-394b-45bb-99fd-ae31aac6943d',
      'establishmentId': 8201,
      'title': 'ROP unsubmit test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'UNSUBMIT'
    },
    {
      'id': 'f641942d-1fe0-4a75-9415-eb8c9950f0ff',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 10266,
      'title': 'Project with NHPs',
      'issueDate': '2020-02-05',
      'expiryDate': '2025-02-04',
      'licenceNumber': 'PR-NHP5',
      'status': 'active',
      'createdAt': '2020-02-05',
      'updatedAt': '2020-02-05',
      'amendedDate': '2020-02-05',
      'species': '["marmosets"]'
    },
    {
      'id': '822892a7-d080-41f8-9e33-55f11466fdc1',
      'establishmentId': 8201,
      'title': 'Project with task history',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'PP2617822',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': '704ad1d8-685b-4377-9e23-5be056306390',
      'establishmentId': 8201,
      'title': 'RA test collaborator',
      'status': 'revoked',
      'issueDate': '2020-06-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'createdAt': '2020-06-01',
      'updatedAt': '2020-06-01',
      'revocationDate': '2021-01-01',
      'licenceNumber': 'COL-RA-TEST',
      'raDate': '2025-01-01',
      'collaborators': [
        {
          'profileId': '736c6491-b73b-4522-908a-45069ccbad96',
          'role': 'edit'
        },
        {
          'profileId': '22f027e8-064f-45bd-9b82-8e21b67f4c10',
          'role': 'basic'
        }
      ]
    },
    {
      'id': '993f312b-2216-4e5a-b14e-070875a630d1',
      'establishmentId': 8201,
      'title': 'ROP collaborator test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-COLLAB',
      'collaborators': [
        {
          'profileId': '736c6491-b73b-4522-908a-45069ccbad96',
          'role': 'edit'
        },
        {
          'profileId': '22f027e8-064f-45bd-9b82-8e21b67f4c10',
          'role': 'basic'
        }
      ]
    },
    {
      'id': 'c63226d1-69ca-4fe2-a79b-811755cb4456',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'establishmentId': 8201,
      'title': 'Collaborator active project',
      'issueDate': '2020-10-01',
      'expiryDate': '2025-10-01',
      'licenceNumber': 'COL-ACTIVE-PROJ',
      'status': 'active',
      'createdAt': '2020-10-01',
      'updatedAt': '2020-10-01',
      'amendedDate': '2020-10-01',
      'collaborators': [
        {
          'profileId': '22f027e8-064f-45bd-9b82-8e21b67f4c10',
          'role': 'basic'
        },
        {
          'profileId': '736c6491-b73b-4522-908a-45069ccbad96',
          'role': 'edit'
        }
      ]
    },
    {
      'id': 'e482a24d-835a-4580-97da-47fad3739b0a',
      'establishmentId': 8201,
      'title': 'Content search - application',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'CONTENT-APPLICATION',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': '5850275f-e8fd-4d93-a7bc-088d81e93389',
      'establishmentId': 8201,
      'title': 'Content search - NTS',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'CONTENT-NTS',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': 'ce588984-6ae7-4772-9ae4-41204a5db4d0',
      'establishmentId': 8201,
      'title': 'Content search - granted',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'CONTENT-GRANTED',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': 'f21caac5-2ecf-4e3f-b2e2-4e8bee775ad8',
      'establishmentId': 8201,
      'title': 'Content search - ra',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'raDate': '2026-10-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'CONTENT-GRANTED',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': '46c41498-5e2b-4949-956d-e0159d89b78c',
      'establishmentId': 8201,
      'title': 'Content search - continuation',
      'status': 'active',
      'issueDate': '2021-05-13 11:49:35.214+00',
      'expiryDate': '2026-05-13 11:49:35.214+00',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'CONTENT-GRANTED',
      'createdAt': '2021-05-13 11:43:49.857962+00',
      'updatedAt': '2021-05-13 11:49:35.215+00'
    },
    {
      'id': '32bf9973-6bc1-4529-a887-2aca5f06cab2',
      'establishmentId': 8201,
      'title': 'ROP re-use/endangered/GAAs test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROPGAAS'
    },
    {
      'id': '209696c6-13ac-4297-911d-bbce28954a62',
      'establishmentId': 8201,
      'title': 'Internal amendment test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTAMEND'
    },
    {
      'id': 'e33259f0-e8ba-4093-a6b4-b7129af7b8e6',
      'establishmentId': 8201,
      'title': 'Project task recovery test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'PROJRECOVERY'
    },
    {
      'id': 'c8880526-7d92-4973-a87f-e0257d0bc03b',
      'establishmentId': 8201,
      'title': 'ROP standard species test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-SPECIES-STANDARD',
      'species': '["mice", "rats"]'
    },
    {
      'id': '6cd7f54b-598d-4519-9798-9c64d641e8ac',
      'establishmentId': 8201,
      'title': 'ROP other species not started',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-SPECIES-OTHER-NOT-START',
      'species': '["mice", "Chinchilla", "Capybara"]'
    },
    {
      'id': 'd564d049-4cb9-422d-b039-fd94dbaa22e0',
      'establishmentId': 8201,
      'title': 'ROP other species submitted',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-SPECIES-OTHER-SUBMITTED',
      'species': '["Cane Toads"]'
    },
    {
      'id': '5dea79ff-990b-4278-a772-d13ee7913547',
      'establishmentId': 8201,
      'title': 'ROP with procedures',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-WITH-PROCEDURES',
      'species': '["mice"]'
    },
    {
      'id': '48dab955-a0b7-4ad3-bdc0-6b79d0aaeac8',
      'establishmentId': 8201,
      'title': 'ROP submission test',
      'status': 'active',
      'issueDate': '2021-03-01',
      'expiryDate': '2026-03-01',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'ROP-SUBMIT'
    },
    {
      'id': '782732c5-4457-46d6-9d46-6610a0ecf872',
      'establishmentId': 8201,
      'title': 'Comment Count Test',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'species': '["mice"]'
    },
    {
      'id': '1c8f324a-c93a-4b93-b3ce-ca27dc6383cb',
      'establishmentId': 8201,
      'title': 'Internal deadline future',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-FUT',
      'species': '["mice"]'
    },
    {
      'id': '562ec6a3-be67-454d-83dc-6cd6e379956b',
      'establishmentId': 8201,
      'title': 'Internal deadline urgent',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-URG',
      'species': '["mice"]'
    },
    {
      'id': '4ac58c06-6350-4bc8-a5b6-ead1e0ffbb9b',
      'establishmentId': 8201,
      'title': 'Internal deadline past',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-PAST',
      'species': '["mice"]'
    },
    {
      'id': 'f88fadc5-fd31-4932-86fd-0da593b6e9c2',
      'establishmentId': 8201,
      'title': 'Internal deadline future, statutory deadline future (same date)',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-STAT-FUT',
      'species': '["mice"]'
    },
    {
      'id': '42c30236-65aa-4f51-8ea5-9ff7a3d31148',
      'establishmentId': 8201,
      'title': 'Internal deadline future, statutory deadline future (internal earlier)',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-EARLY-STAT',
      'species': '["mice"]'
    },
    {
      'id': '6e4cb09b-f084-47f9-bc31-4a548edb0145',
      'establishmentId': 8201,
      'title': 'Internal deadline past, statutory deadline future',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-PAST-STAT-FUT',
      'species': '["mice"]'
    },
    {
      'id': 'c4f8df6e-0e9d-4fea-aeb0-d444211a63d8',
      'establishmentId': 8201,
      'title': 'Internal deadline past, statutory deadline past',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'licenceNumber': 'INTDL-PAST-STAT-PAST',
      'species': '["mice"]'
    },
    {
      'id': '4dfed9cc-00a1-4ab5-9e20-b1dcb44a1994',
      'establishmentId': 8201,
      'title': 'Enforcement open case 1',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'a6d3653a-37ab-4b20-8258-7a17ab324083',
      'licenceNumber': 'ENF-OPEN-1',
      'species': '["mice"]'
    },
    {
      'id': '078c345b-21b8-4692-a1fc-f77d6fa8e77a',
      'establishmentId': 8201,
      'title': 'Enforcement open case 2',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'a6d3653a-37ab-4b20-8258-7a17ab324083',
      'licenceNumber': 'ENF-OPEN-2',
      'species': '["mice"]'
    },
    {
      'id': '48f7340f-add9-460a-ba15-8eb042d2dc58',
      'establishmentId': 8201,
      'title': 'Enforcement open against profile but not this project',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'a6d3653a-37ab-4b20-8258-7a17ab324083',
      'licenceNumber': 'ENF-OPEN-NOT-THIS',
      'species': '["mice"]'
    },
    {
      'id': '6464df1b-5dd1-4ee2-8fad-e430ff57de87',
      'establishmentId': 8201,
      'title': 'Enforcement open project at Croydon',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'bd92e4b2-62a5-4ce3-94d4-df6220d733dc',
      'licenceNumber': 'ENF-OPEN-EST-1',
      'species': '["mice"]'
    },
    {
      'id': '6483cd4f-829f-45c9-9580-fe3950ecfc16',
      'establishmentId': 8202,
      'title': 'Enforcement open project at Marvell',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'bd92e4b2-62a5-4ce3-94d4-df6220d733dc',
      'licenceNumber': 'ENF-OPEN-EST-2',
      'species': '["mice"]'
    },
    {
      'id': '2ccd2c57-8855-4a27-a482-1eb7068c02b0',
      'establishmentId': 8201,
      'title': 'Enforcement open one project many profiles',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': '78f16dc0-7fba-4e93-b27c-54707bb7ffe6',
      'licenceNumber': 'ENF-OPEN-1-PROJ-MANY-PEEPS',
      'species': '["mice"]',
      'collaborators': [
        {
          'profileId': '1e45ff46-adc1-4dc8-95eb-ea2fb55e0117',
          'role': 'basic'
        },
        {
          'profileId': 'a791f32c-329c-4678-8b2e-f7a62e51d53d',
          'role': 'basic'
        }
      ]
    },
    {
      'id': '5c247f18-26b6-4482-8d1d-d6544b5ce893',
      'establishmentId': 8201,
      'title': 'Refuse PPL: amendments should not be refusable',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'e7295338-beb8-4b66-8bb6-2e65da0e0e3b',
      'establishmentId': 8201,
      'title': 'Refuse PPL: submitted',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '482fa74c-56b2-40ca-9dca-6b00d174b5e4',
      'establishmentId': 8201,
      'title': 'Refuse PPL: submitted - No licenceHolder on task',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'e2265359-f8eb-4607-951b-c4cf3c213132',
      'establishmentId': 8201,
      'title': 'Refuse PPL: can resubmit',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'b75ff8d7-fee4-4436-8598-e70b7101f446',
      'establishmentId': 8201,
      'title': 'Refuse PPL: deadline future with applicant',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '92ff5870-fc92-4d71-bd14-e72f83e4dae7',
      'establishmentId': 8201,
      'title': 'Refuse PPL: deadline passed with applicant',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '1b02489d-1583-4836-9ba7-925f8c062cc5',
      'establishmentId': 8201,
      'title': 'Intent to refuse PPL: deadline passed with applicant',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '3545e6a5-ed37-4f25-8cae-15367b295a77',
      'establishmentId': 8201,
      'title': 'Refuse PPL: deadline future with asru',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': '23ab7fdc-cf39-4a50-8bbb-b1f817d06e29',
      'establishmentId': 8201,
      'title': 'Refuse PPL: deadline passed with asru',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'a8c7622f-f629-4685-baa5-e55c23cb223c',
      'establishmentId': 8201,
      'title': 'Intent to refuse PPL: deadline passed with asru',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147'
    },
    {
      'id': 'c0038b53-3417-4a6e-aeb0-6bc92969b3ac',
      'establishmentId': 8201,
      'title': 'Refuse PPL: refused',
      'status': 'inactive',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'refusedDate': '2022-08-08'
    },
    {
      'id': 'e3b2dc42-bb7a-4d1e-8693-6c36928f1eea',
      'establishmentId': 8201,
      'title': 'Suspend PPL',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'licenceNumber': 'SUSP-1',
      'species': '["mice"]'
    },
    {
      'id': '6ef7ad7f-5275-4c1d-bb5f-e9e33e2fbdb6',
      'establishmentId': 100002,
      'title': 'Suspend Establishment',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ff50caf0-42c5-45aa-aacc-bea21b1b5f15',
      'licenceNumber': 'SUSP-2',
      'species': '["mice"]',
      'additionalEstablishments': [
        {
          'establishmentId': 8202,
          'status': 'active'
        },
        {
          'establishmentId': 30001,
          'status': 'active'
        },
        {
          'establishmentId': 40001,
          'status': 'active'
        },
        {
          'establishmentId': 54321,
          'status': 'active'
        }
      ]
    },
    {
      'id': '120311bb-2209-4123-bca2-a2dea7dba2c0',
      'establishmentId': 8201,
      'title': 'Removing project level species shows protocols as changed',
      'issueDate': '2023-04-01',
      'expiryDate': '2028-04-01',
      'licenceNumber': 'PR-PSC',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'schemaVersion': 1,
      'status': 'active'
    },
    {
      'id': '356835fa-3835-416d-9d11-076e6c85b7f6',
      'establishmentId': 8201,
      'title': 'Condition reminders',
      'licenceHolderId': '7816dcdc-47d6-42ab-b561-aa5fef591e83',
      'status': 'inactive'
    },
    {
      'id': 'a905d730-cb0c-4b88-a8bf-a00277eb5e51',
      'establishmentId': 8201,
      'title': 'Reusable steps',
      'licenceHolderId': '304235c0-1a83-49f0-87ca-b11b1ad1e147',
      'status': 'inactive'
    },
    {
      'id': '5cb97819-3e21-4ea5-85f0-32df2b06213d',
      'establishmentId': 8201,
      'title': 'Additional availability at Only AA Licences',
      'status': 'active',
      'licenceNumber': 'PR-X23457',
      'issueDate': '2023-04-23',
      'expiryDate': '2028-04-23',
      'licenceHolderId': 'caf67e14-dfcd-432f-8dad-859af40e85c9',
      'schemaVersion': 1,
      'additionalEstablishments': [
        {
          'establishmentId': 10263,
          'status': 'active'
        }
      ]
    },
    {
      'id': '6ef7ad7f-5275-4c1d-bb5f-e9e33e2fbdb7',
      'establishmentId': 10264,
      'title': 'Suspended Primary Establishment',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ff50caf0-42c5-45aa-aacc-bea21b1b5f15',
      'licenceNumber': 'SUSP-3',
      'species': '["mice"]',
      'additionalEstablishments': [
        {
          'establishmentId': 8202,
          'status': 'active'
        },
        {
          'establishmentId': 30001,
          'status': 'active'
        }
      ]
    },
    {
      'id': '6ef7ad7f-5275-4c1d-bb5f-e9e33e2fbdb8',
      'establishmentId': 8202,
      'title': 'Suspended Additional Establishment',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ff50caf0-42c5-45aa-aacc-bea21b1b5f15',
      'licenceNumber': 'SUSP-4',
      'species': '["mice"]',
      'additionalEstablishments': [
        {
          'establishmentId': 10264,
          'status': 'active'
        }
      ]
    },
    {
      'id': '6ef7ad7f-5275-4c1d-bb5f-e9e33e2fbdb9',
      'establishmentId': 10265,
      'title': 'Suspended Primary Establishment - no permission',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ff50caf0-42c5-45aa-aacc-bea21b1b5f15',
      'licenceNumber': 'SUSP-5',
      'species': '["mice"]',
      'additionalEstablishments': [
        {
          'establishmentId': 8202,
          'status': 'active'
        }
      ]
    },
    {
      'id': '6ef7ad7f-5275-4c1d-bb5f-e9e33e2fbdba',
      'establishmentId': 8202,
      'title': 'Suspended Additional Establishment - no permission',
      'status': 'active',
      'schemaVersion': 1,
      'licenceHolderId': 'ff50caf0-42c5-45aa-aacc-bea21b1b5f15',
      'licenceNumber': 'SUSP-6',
      'species': '["mice"]',
      'additionalEstablishments': [
        {
          'establishmentId': 10265,
          'status': 'active'
        }
      ]
    }
  ];
export default projects;
