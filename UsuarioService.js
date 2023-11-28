'use strict';
const mysql = require('mysql');
const bcrypt = require('bcrypt');

exports.checkUser = function (user, pass) {
  return new Promise(function (resolve, reject) {
    const connection = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'dism'
    });
    connection.query("SELECT * FROM usuarios WHERE usuario = ?", user.user, function (err, rows) {
      if (err) {
        connection.end();
        reject(err); // En caso de error, rechazamos la promesa
      } else {
        console.log(rows[0])
        if (rows.length > 0) {
        const storedHash = rows[0].clave; // Suponiendo que el hash está almacenado en la columna 'password'
        bcrypt.compare(user.pass, storedHash, function (err, res) {
          if (err) {
            reject(err); // En caso de error en la comparación, rechazamos la promesa
          } else {
            if (res) {
              resolve({ status: true }); // Usuario encontrado y contraseña válida
              console.log("logeado")
            } else {
              resolve({ status: false }); // Usuario encontrado pero contraseña incorrecta
            }
          }
          connection.end();
        });
      } else {
        connection.end();
        resolve({ status: false }); // Usuario no encontrado
      }
    }
      });
});
};


