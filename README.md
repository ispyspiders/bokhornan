# Projektuppgift - Bokhörnan
#### Av Kajsa Classon, VT25. DT210G – Fördjupad frontend-utveckling, Mittuniversitetet.

En webbplattform för informationssökning och recensioner, integrerad med Google Books API. 

Repo för backend: https://github.com/ispyspiders/bokAPI.git

## Uppgiftsbeskrivning
Webbplattformen ska erbjuda besökare möjlighet att söka efter och utforska innehåll samt läsa användarrecensioner. För att skriva, redigera eller ta bort recensioner krävs ett användarkonto. Inloggade användare ska kunna hantera sina recensioner.

För godkänt ska applikationen uppfylla följande krav:
* Ett sökgränssnitt för att hitta och visa innehåll från valt API (exempelvis Google Books API).
* Vy med lista av sökresultat utskrivet i lämpligt format.
* Detaljerad visning av enskilda objekt med mer information, här ska också befintliga recensioner för valt objekt finnas tillgänglig.
* Användarhantering med registrering och inloggning.
* CRUD-funktionalitet för recensioner (skapa, läsa, uppdatera, ta bort).

Utöver obligatorisk funktionalitet enligt ovan kan du utöka din lösning för fler poäng. För att få fler poäng behöver den extra funktionalitet avsevärt tillföra den färdiga lösningen något.

### Tekniska krav
* Utveckling sker med React och TypeScript med väldefinierade interface/types.
* Implementerad komponentbaserad arkitektur.
* Strukturerad state management-lösning.
* React Router för routingstruktur med navigering i gränsnittet.
* Implementerad användarautentisering.
* JWT-autentisering med tokenhantering, antingen lagrat i localStorage eller som HTTP-cookie.
* Källkoden är välkommenterad.
* Integration med minst ett externt API.
* Felhantering och tydliga felmeddelanden vid formulärhantering och API-anrop.
* Responsiv design som fungerar på olika skärmstorlekar.
* En README-fil ska finnas i ditt repo som beskriver din applikation.
