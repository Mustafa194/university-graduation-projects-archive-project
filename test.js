const argon2 = require('argon2');

argon2.hash('12345').then(password => console.log(password));
