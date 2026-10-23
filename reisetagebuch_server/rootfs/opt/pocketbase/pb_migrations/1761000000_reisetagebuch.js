// Legt die Tabelle für Reisen an und sperrt die offene Registrierung.
// Jede Reise gehört einem Benutzer (owner). Weitere Benutzer (members) dürfen sie
// lesen und bearbeiten, aber nicht löschen und die Mitglieder nicht ändern.
migrate((app) => {
  const users = app.findCollectionByNameOrId("users");

  // Neue Benutzer legt nur der Admin an (Admin-Oberfläche unter /_/).
  users.createRule = null;
  app.save(users);

  const access = "owner = @request.auth.id || members.id ?= @request.auth.id";
  const trips = new Collection({
    type: "base",
    name: "trips",
    listRule: access,
    viewRule: access,
    createRule: '@request.auth.id != "" && owner = @request.auth.id',
    updateRule: "owner = @request.auth.id || (members.id ?= @request.auth.id && @request.body.owner:isset = false && @request.body.members:isset = false)",
    deleteRule: "owner = @request.auth.id",
    fields: [
      { name: "title", type: "text", max: 200 },
      { name: "owner", type: "relation", collectionId: users.id, maxSelect: 1, required: true, cascadeDelete: true },
      { name: "members", type: "relation", collectionId: users.id, maxSelect: 20 },
      { name: "data", type: "json", maxSize: 10 * 1024 * 1024 },
      { name: "created", type: "autodate", onCreate: true },
      { name: "updated", type: "autodate", onCreate: true, onUpdate: true },
    ],
  });
  app.save(trips);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("trips"));

  const users = app.findCollectionByNameOrId("users");
  users.createRule = "";
  app.save(users);
});
