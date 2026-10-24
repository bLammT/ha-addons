// Teilen mit Nur-Lese-Zugang: Leser (viewers) sehen Reise und Fotos, ändern aber nichts.
// Mitglieder (members) dürfen weiter bearbeiten. Ein- und Ausladen geht über /api/reisetagebuch/share.
//
// Sicherheitskorrektur: Jede Regel verlangt jetzt ausdrücklich eine Anmeldung. Vorher passte
// „members.id ?= @request.auth.id“ bei einer Reise ohne Mitglieder auch für nicht angemeldete
// Besucher (leere Liste und leere Benutzer-ID gelten als gleich).
const AUTH = '@request.auth.id != ""';
migrate((app) => {
  const users = app.findCollectionByNameOrId("users");
  const trips = app.findCollectionByNameOrId("trips");
  trips.fields.add(new RelationField({ name: "viewers", collectionId: users.id, maxSelect: 50 }));
  const see = `${AUTH} && (owner = @request.auth.id || members.id ?= @request.auth.id || viewers.id ?= @request.auth.id)`;
  trips.listRule = see;
  trips.viewRule = see;
  trips.createRule = `${AUTH} && owner = @request.auth.id`;
  trips.updateRule = `${AUTH} && (owner = @request.auth.id || (members.id ?= @request.auth.id && @request.body.owner:isset = false && @request.body.members:isset = false && @request.body.viewers:isset = false))`;
  trips.deleteRule = `${AUTH} && owner = @request.auth.id`;
  app.save(trips);

  const photos = app.findCollectionByNameOrId("photos");
  const seeTrip = `${AUTH} && (trip.owner = @request.auth.id || trip.members.id ?= @request.auth.id || trip.viewers.id ?= @request.auth.id)`;
  const editTrip = `${AUTH} && (trip.owner = @request.auth.id || trip.members.id ?= @request.auth.id)`;
  photos.listRule = seeTrip;
  photos.viewRule = seeTrip;
  photos.createRule = editTrip;
  photos.deleteRule = editTrip;
  app.save(photos);
}, (app) => {
  const trips = app.findCollectionByNameOrId("trips");
  const access = `${AUTH} && (owner = @request.auth.id || members.id ?= @request.auth.id)`;
  trips.fields.removeByName("viewers");
  trips.listRule = access;
  trips.viewRule = access;
  trips.updateRule = `${AUTH} && (owner = @request.auth.id || (members.id ?= @request.auth.id && @request.body.owner:isset = false && @request.body.members:isset = false))`;
  app.save(trips);
  const photos = app.findCollectionByNameOrId("photos");
  const prev = `${AUTH} && (trip.owner = @request.auth.id || trip.members.id ?= @request.auth.id)`;
  photos.listRule = prev; photos.viewRule = prev; photos.createRule = prev; photos.deleteRule = prev;
  app.save(photos);
});
