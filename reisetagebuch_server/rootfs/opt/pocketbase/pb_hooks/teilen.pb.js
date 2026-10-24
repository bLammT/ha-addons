// Teilen einer Reise aus der App heraus (nur der Besitzer der Reise).
// Benutzer anderer kann die App nicht selbst nachschlagen (E-Mails sind privat), deshalb dieser Endpunkt.
// Hinweis: Handler laufen in einer eigenen Umgebung, Hilfsfunktionen müssen daher innerhalb stehen.

// Liste der Personen, mit denen die Reise geteilt ist.
routerAdd("GET", "/api/reisetagebuch/share/{trip}", (e) => {
  const trip = $app.findRecordById("trips", e.request.pathValue("trip"));
  if (trip.getString("owner") !== e.auth.id) throw new ForbiddenError("Nur wer die Reise angelegt hat, kann sie teilen.");
  const people = [];
  for (const role of ["members", "viewers"]) {
    const ids = trip.getStringSlice(role);
    if (!ids.length) continue;
    for (const u of $app.findRecordsByIds("users", ids)) {
      if (u) people.push({ id: u.id, email: u.email(), role: role === "members" ? "member" : "viewer" });
    }
  }
  return e.json(200, { people });
}, $apis.requireAuth("users"));

// Person einladen, Rolle ändern oder ausladen.
// body: { trip, email, role: "member" | "viewer" | "remove", password? }
// Gibt es zur E-Mail noch kein Konto, wird es mit dem mitgeschickten Passwort angelegt (sonst Fehler "no_account").
routerAdd("POST", "/api/reisetagebuch/share", (e) => {
  const body = e.requestInfo().body || {};
  const email = String(body.email || "").trim().toLowerCase();
  const role = String(body.role || "");
  if (!["member", "viewer", "remove"].includes(role)) throw new BadRequestError("Unbekannte Rolle.");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new BadRequestError("Das ist keine gültige E-Mail-Adresse.");

  const trip = $app.findRecordById("trips", String(body.trip || ""));
  if (trip.getString("owner") !== e.auth.id) throw new ForbiddenError("Nur wer die Reise angelegt hat, kann sie teilen.");

  let user = null;
  let created = false;
  try { user = $app.findAuthRecordByEmail("users", email); } catch (_) { user = null; }
  if (!user) {
    if (role === "remove") return e.json(200, { ok: true });
    const password = String(body.password || "");
    if (!password) return e.json(404, { code: "no_account", message: "Für diese E-Mail-Adresse gibt es noch kein Konto." });
    if (password.length < 8) throw new BadRequestError("Das Passwort braucht mindestens 8 Zeichen.");
    user = new Record($app.findCollectionByNameOrId("users"));
    user.setEmail(email);
    user.setPassword(password);
    user.setVerified(true);
    $app.save(user);
    created = true;
  }
  if (user.id === e.auth.id) throw new BadRequestError("Die Reise gehört dir schon.");

  const members = trip.getStringSlice("members").filter((id) => id !== user.id);
  const viewers = trip.getStringSlice("viewers").filter((id) => id !== user.id);
  if (role === "member") members.push(user.id);
  if (role === "viewer") viewers.push(user.id);
  trip.set("members", members);
  trip.set("viewers", viewers);
  $app.save(trip);
  return e.json(200, { ok: true, created });
}, $apis.requireAuth("users"));
