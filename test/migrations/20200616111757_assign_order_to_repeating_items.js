const assert = require('assert');
const { get } = require('lodash');
const { transform, up } = require('../../migrations/20200616111757_assign_order_to_repeating_items');

describe('transform', () => {
  it('ignores falsy versions', () => {
    const version = null;
    assert.equal(transform(version), undefined);
  });

  it('ignores versions without repeating items', () => {
    const version = {
      title: 'test title'
    };
    assert.equal(transform(version).patched, undefined);
  });

  it('ignores protocols with order already defined', () => {
    const version = {
      protocols: [
        {
          order: 0
        },
        {
          order: 1
        }
      ]
    };
    assert.equal(transform(version).patched, undefined)
  });

  it('patches all repeating items', () => {
    const version = {
      protocols: [
        {
          title: 'first'
        },
        {
          title: 'second',
          steps: [
            {
              title: 'first'
            },
            {
              title: 'second'
            }
          ]
        }
      ],
      objectives: [
        {
          title: 'first'
        },
        {
          title: 'second'
        }
      ],
      polesList: [
        {
          title: 'first'
        },
        {
          title: 'second'
        }
      ],
      establishments: [
        {
          title: 'first'
        },
        {
          title: 'second'
        }
      ]
    };

    const after = transform(version);

    assert.equal(after.patched, true);
    assert.equal(get(after, 'protocols[0].order'), 0);
    assert.equal(get(after, 'protocols[1].order'), 1);
    assert.equal(get(after, 'protocols[1].steps[0].order'), 0);
    assert.equal(get(after, 'protocols[1].steps[1].order'), 1);
    assert.equal(get(after, 'objectives[0].order'), 0);
    assert.equal(get(after, 'objectives[1].order'), 1);
    assert.equal(get(after, 'polesList[0].order'), 0);
    assert.equal(get(after, 'polesList[1].order'), 1);
    assert.equal(get(after, 'establishments[0].order'), 0);
    assert.equal(get(after, 'establishments[1].order'), 1);
  })
});
