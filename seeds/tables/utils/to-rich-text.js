const toRichText = (...strings) => {
  return {
    object: 'value',
    document: {
      object: 'document',
      data: {},
      nodes: strings.map(text => {
        return {
          object: 'block',
          type: 'paragraph',
          data: {},
          nodes: [
            {
              object: 'text',
              text,
              marks: []
            }
          ]
        };
      })
    }
  };
};

module.exports = toRichText;
