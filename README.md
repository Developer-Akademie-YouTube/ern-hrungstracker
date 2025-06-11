# Ernährungstracker

Dieses Beispielprojekt ermöglicht nun eine Registrierung per E-Mail und Passwort. Nach der Registrierung wird eine Bestätigungs-E-Mail über einen Test-Mailserver versendet. Erst nach Bestätigung kann man sich anmelden. Die Ernährungsdaten werden anschließend auf dem Server gespeichert.

## Anwendung starten
1. Installiere die Abhängigkeiten mit `npm install`.
2. Starte den Server mit `node server.js`.
3. Öffne `index.html` in einem Browser und registriere dich mit deiner E-Mail-Adresse.
4. Die Konsole des Servers zeigt einen Link zur Bestätigung der E-Mail an. Rufe diesen auf, um dein Konto zu aktivieren.
5. Nach der Anmeldung können Ernährungsdaten eingegeben werden.


## Datenschutz
- Registrierungsdaten (E-Mail und Passwort-Hash) und alle Ernährungsdaten werden in den Dateien `users.json` und `entries.json` auf dem Server gespeichert.
- Die Bestätigungs-E-Mail wird über einen Nodemailer-Testaccount versendet.
- Über den Logout-Button kannst du dich jederzeit abmelden und lokale Daten löschen.

Weitere Informationen findest du in unserer [Datenschutzerklärung](datenschutz.html) und im [Impressum](impressum.html).
