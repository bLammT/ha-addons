// Grundeinstellungen für den Betrieb hinter dem nginx des Add-ons.
migrate((app) => {
  const settings = app.settings();
  settings.meta.appName = "Reisetagebuch";
  // nginx hängt die echte Client-IP rechts an X-Forwarded-For an.
  settings.trustedProxy.headers = ["X-Forwarded-For"];
  settings.trustedProxy.useLeftmostIP = false;
  // Schutz gegen Passwort-Raten, der Server ist aus dem Internet erreichbar.
  settings.rateLimits.enabled = true;
  app.save(settings);
});
