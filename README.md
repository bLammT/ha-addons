# Home-Assistant-Add-ons

| Add-on | Zweck |
|---|---|
| [Reisetagebuch Server](reisetagebuch_server/) | Login und Synchronisation für die [Reisekarte](https://github.com/bLammT/Reisetagebuch-) |

## Installieren

In Home Assistant: **Einstellungen → Add-ons → Add-on-Store → ⋮ (oben rechts) → Repositories**,
dann `https://github.com/bLammT/ha-addons` eintragen. Danach erscheint das Add-on im Store.

Die Einrichtung steht in [reisetagebuch_server/DOCS.md](reisetagebuch_server/DOCS.md) und in Home Assistant im Tab „Dokumentation“ des Add-ons.

## Aufbau

| Datei | Inhalt |
|---|---|
| `reisetagebuch_server/config.yaml` | Name, Port 8091, Optionen, Backup-Verhalten |
| `reisetagebuch_server/Dockerfile` | Lädt PocketBase (mit Prüfsumme) und nginx |
| `rootfs/etc/services.d/` | Startskripte: PocketBase, nginx, Zertifikatsprüfung |
| `rootfs/etc/nginx/` | nginx-Vorlage (HTTPS → PocketBase) |
| `rootfs/opt/pocketbase/pb_migrations/` | Legt die Tabelle `trips` und die Grundeinstellungen an |
| `rootfs/opt/pocketbase/pb_hooks/` | Lässt beim Google-Login nur bekannte Benutzer zu |

PocketBase aktualisieren: `POCKETBASE_VERSION` und beide Prüfsummen im Dockerfile anpassen
(stehen in `checksums.txt` beim jeweiligen [Release](https://github.com/pocketbase/pocketbase/releases)), dann `version` in `config.yaml` erhöhen.
