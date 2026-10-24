# Änderungen

## 0.3.0

- **Sicherheitskorrektur, bitte sofort aktualisieren:** Reisen ohne Mitglieder (und ihre Fotos) waren für nicht angemeldete Besucher lesbar und änderbar, wenn sie die Server-Adresse kannten. Alle Zugriffsregeln verlangen jetzt ausdrücklich eine Anmeldung.
- Teilen aus der App: Personen per E-Mail einladen, wahlweise zum Mitbearbeiten oder nur zum Lesen (neues Feld `viewers`). Gibt es noch kein Konto, kann es dabei mit einem Start-Passwort angelegt werden.

## 0.2.0

- Neue Tabelle `photos` für die Fotos der Tagebucheinträge. Sie ist geschützt: Fotos sieht nur, wer die Reise sehen darf, und die Dateien lassen sich nur mit Anmeldung abrufen.

## 0.1.0

- Erste Version: PocketBase 0.40.5 mit Tabelle `trips` (Besitzer und Mitglieder), nginx für HTTPS mit den DuckDNS-Zertifikaten.
- Offene Registrierung gesperrt, OAuth2-Login nur für bereits angelegte Benutzer, Anfragebegrenzung aktiv.
