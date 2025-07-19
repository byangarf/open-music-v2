

exports.up = (pgm) => {
  pgm.createTable('album', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    name: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
  });
  pgm.createTable('song', {
    id: {
      type: 'VARCHAR(50)',
      primaryKey: true,
    },
    // eslint-disable-next-line camelcase
    album_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    title: {
      type: 'TEXT',
      notNull: true,
    },
    year: {
      type: 'INTEGER',
      notNull: true,
    },
    genre: {
      type: 'TEXT',
      notNull: true,
    },
    performer: {
      type: 'TEXT',
      notNull: true,
    },
    duration: {
      type: 'INTEGER',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('song');
  pgm.dropTable('album');

};
