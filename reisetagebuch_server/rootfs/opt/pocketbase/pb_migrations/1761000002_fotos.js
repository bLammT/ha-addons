// Fotos zu den Tagebucheinträgen. Schlüssel ist die Foto-ID aus der App (key),
// pro Reise eindeutig. Wer die Reise sehen darf, darf ihre Fotos sehen, hochladen und löschen.
// Die Dateien sind geschützt: Abruf nur mit einem kurzlebigen Datei-Token des angemeldeten Benutzers.
migrate((app) => {
  const trips = app.findCollectionByNameOrId("trips");
  const access = "trip.owner = @request.auth.id || trip.members.id ?= @request.auth.id";
  const photos = new Collection({
    type: "base",
    name: "photos",
    listRule: access,
    viewRule: access,
    createRule: access,
    updateRule: null,
    deleteRule: access,
    fields: [
      { name: "trip", type: "relation", collectionId: trips.id, maxSelect: 1, required: true, cascadeDelete: true },
      { name: "key", type: "text", required: true, max: 64, pattern: "^[A-Za-z0-9_-]+$" },
      { name: "file", type: "file", required: true, maxSelect: 1, maxSize: 15 * 1024 * 1024, protected: true,
        mimeTypes: ["image/jpeg", "image/png", "image/webp"] },
      { name: "created", type: "autodate", onCreate: true },
    ],
    indexes: ["CREATE UNIQUE INDEX idx_photos_trip_key ON photos (trip, key)"],
  });
  app.save(photos);
}, (app) => {
  app.delete(app.findCollectionByNameOrId("photos"));
});
