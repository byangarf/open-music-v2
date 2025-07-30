exports.shorthands = undefined;

exports.up = (pgm) => {
  pgm.sql("INSERT INTO users(id, username, password, fullname) VALUES ('old_notes', 'old_notes', 'old_notes', 'old notes')");

  pgm.sql("UPDATE album SET owner = 'old_notes' WHERE owner IS NULL");
  pgm.sql("UPDATE song SET owner = 'old_notes' WHERE owner IS NULL");

  pgm.addConstraint('album', 'fk_album.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');
  pgm.addConstraint('song', 'fk_song.owner_users.id', 'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE');

};

exports.down = (pgm) => {
  pgm.dropConstraint('album', 'fk_album.owner_users.id');
  pgm.dropConstraint('song', 'fk_song.owner_users.id');

  pgm.sql("UPDATE album SET owner = NULL WHERE owner = 'old_notes'");
  pgm.sql("UPDATE song SET owner = NULL WHERE owner = 'old_notes'");

  pgm.sql("DELETE FROM users WHERE id = 'old_notes'");
};