exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('song', {
    owner: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('song', 'owner');
};