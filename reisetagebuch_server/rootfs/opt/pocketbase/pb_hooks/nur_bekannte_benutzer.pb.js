// Login mit Google & Co. legt in PocketBase sonst automatisch neue Benutzer an,
// auch wenn die Registrierung gesperrt ist. Hier sind nur Benutzer erlaubt,
// die der Admin vorher mit derselben E-Mail-Adresse angelegt hat.
onRecordAuthWithOAuth2Request((e) => {
  if (e.isNewRecord) {
    throw new ForbiddenError("Für diese E-Mail-Adresse gibt es kein Konto. Bitte den Admin, dich anzulegen.");
  }
  e.next();
}, "users");
