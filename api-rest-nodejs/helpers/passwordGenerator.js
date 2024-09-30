"use strict";

exports.generate = function () {
  var characters =
    'ABCDEFGHIJKLMNPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890!@#$%^&*()?><"}';
  var charactersLength = characters.length;
  var randomPassword = "";

  for (var i = 0; i < charactersLength; i++) {
    randomPassword += characters.charAt(
      Math.floor(Math.random() * charactersLength)
    );
  }

  return randomPassword;
};
