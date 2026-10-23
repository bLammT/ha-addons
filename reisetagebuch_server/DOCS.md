# Reisetagebuch Server

Speichert die Reisen der [Reisekarte](https://github.com/bLammT/Reisetagebuch-) mit Login, damit sie auf mehreren Geräten gleich sind.
Technisch ist das [PocketBase](https://pocketbase.io) (Datenbank mit Benutzerverwaltung), davor ein nginx für HTTPS mit deinen Let's-Encrypt-Zertifikaten.

## Voraussetzungen

- Das **DuckDNS-Add-on mit Let's Encrypt** läuft, die Zertifikate liegen in `/ssl` (Standard: `fullchain.pem` und `privkey.pem`).
- Im Router ist **TCP-Port 8091** an den Raspberry Pi weitergeleitet (gleicher Port innen und außen).

## Einrichtung

1. Add-on installieren und starten. Der erste Build dauert auf dem Pi ein paar Minuten.
2. Im Tab **Protokoll** steht beim ersten Start ein Link wie
   `http://127.0.0.1:8090/_/#/pbinstall/eyJhbGciOi…`.
   Ersetze darin `http://127.0.0.1:8090` durch `https://DEINNAME.duckdns.org:8091` und öffne ihn.
   Dort legst du den **Admin** an (E-Mail und ein starkes Passwort). Der Link gilt 30 Minuten; nach einem Neustart des Add-ons erscheint ein neuer.
3. Admin-Oberfläche: `https://DEINNAME.duckdns.org:8091/_/`
   → Sammlung **users** → **New record**: E-Mail und Passwort für dich eintragen, **verified** einschalten, speichern.
4. In der Reisekarte auf **Online-Sync** tippen, die Adresse `https://DEINNAME.duckdns.org:8091` eintragen, anmelden und
   „… online speichern“ wählen. Auf weiteren Geräten anmelden und die Reise unter „Online-Reisen“ öffnen.

## Mitreisende

1. In der Admin-Oberfläche unter **users** ein Konto für die Person anlegen.
2. Unter **trips** die Reise öffnen und die Person bei **members** hinzufügen.

Mitglieder dürfen die Reise sehen und bearbeiten, aber nicht löschen und keine weiteren Mitglieder eintragen.

## Login mit Google (optional)

1. In der Google Cloud Console einen OAuth-Client vom Typ „Webanwendung“ anlegen.
   Autorisierte Weiterleitungs-URI: `https://DEINNAME.duckdns.org:8091/api/oauth2-redirect`
2. In der Admin-Oberfläche bei der Sammlung **users** in den Optionen unter OAuth2 „Google“ aktivieren und Client-ID und Client-Secret eintragen.
3. In der Reisekarte erscheint dann „Mit Google anmelden“.

Anmelden kann sich nur, wer vorher unter **users** mit derselben E-Mail-Adresse angelegt wurde. Fremde Google-Konten werden abgewiesen.

## Optionen

| Option | Bedeutung |
|---|---|
| `certfile` | Zertifikatsdatei in `/ssl` (wie im DuckDNS-Add-on) |
| `keyfile` | Schlüsseldatei in `/ssl` (wie im DuckDNS-Add-on) |

Erneuerte Zertifikate übernimmt das Add-on selbst (Prüfung einmal pro Stunde).

## Daten und Backup

Alle Daten liegen im Add-on (`/data/pb_data`) und sind in den normalen Home-Assistant-Backups enthalten.
Für ein sauberes Backup der Datenbank hält Home Assistant das Add-on dabei kurz an.

## Sicherheit

- Der Server ist aus dem Internet erreichbar. Nutze für den Admin ein langes, eigenes Passwort.
- Die offene Registrierung ist abgeschaltet; neue Konten legt nur der Admin an.
- Gegen Passwort-Raten ist die Begrenzung der Anfragen von PocketBase eingeschaltet.
