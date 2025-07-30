exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.addColumn('album', {
    owner: {
      type: 'VARCHAR(50)',
    },
  });
};

exports.down = (pgm) => {
  pgm.dropColumn('album', 'owner');
};