# Ernährungstracker

Dieses Beispielprojekt speichert alle Daten ausschließlich lokal im Browser. Die Anmeldung erfolgt optional über Google. Dabei werden der Google-Name und die E-Mail-Adresse nur lokal im `localStorage` gespeichert, um die Nutzung des Trackers an den angemeldeten Nutzer zu knüpfen. Es findet keine Übertragung der Daten an einen Server statt.

## Google Sign-In einrichten
1. Lege in der [Google Cloud Console](https://console.cloud.google.com/) ein OAuth-2.0-Webclient an und trage die URL deines Projektes als zugelassene Ursprungs- und Weiterleitungs-URL ein.
2. Ersetze in `script.js` den Platzhalter `YOUR_GOOGLE_CLIENT_ID` durch die Client-ID.
3. Rufe `index.html` in einem kompatiblen Browser auf.

Nach erfolgreichem Login werden Eingabeformular und Tabelle angezeigt. 

## Datenschutz
- Alle Ernährungsdaten werden im Browser gespeichert und nicht über das Internet versendet.
- Die Anmeldung über Google ist optional und dient nur der Authentifizierung im Browser.
- Nutzer können sich jederzeit über den Logout-Button abmelden. Dabei werden die im Browser gespeicherten Profildaten gelöscht.
