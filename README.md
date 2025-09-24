# Velkommen til workshop med Norkart!

Vi gir dere en enkel boilerplate på en react-applikasjon med mapbox kart og forklarer hvordan denne kan deployes til github pages. Videre kan dere:

- sette opp automatisk utrulling ved bruk av github actions.
- utvikle mer funksjonalitet i appen.

Lykke til!

---

## STEG 0: Forutsetninger

Før dere starter må dere ha noe programvare installert:

1. **Git**. Følg instruksjonene som gjelder for ditt OS her: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git. Sjekk at git er installert:

```
   git --version
```

2. **Github**. Lag deg en bruker her https://github.com/

3. **Node.js med npm** https://nodejs.org/en/download

Sjekk at du har fått installert node med npm!
```
   node --version
```

```
    npm --version
```

4. **En code editor (vs code anbefales)**. https://code.visualstudio.com/download

---

## STEG 1: Fork, clone og kjør prosjektet

1. For å få din egen versjon av prosjektet under egen github-bruker fork'er du dette prosjektet. Dette gjøres ved å trykke `fork` oppe i høyre hjørnet.
   Behold default innstillinger.

2. I terminalen. Finn fram til fillokasjonen hvor dere vil lagre prosjektet og klon repoet (deres egen versjon av prosjektet som dere nettop forket):

```
   git clone https://github.com/{{YOUR_GITHUB_USERNAME}}/norkart-webkurs-CICD-React.git
```

3. Gå inn i mappen du nettop klonet:

```
 cd norkart-webkurs-CICD-React/
```

4. Installer npm pakkene til prosjektet. De relevante pakkene kan sees i `package.json` filen i prosjektet. Vi bruker for eksempel `mapbox-gl` biblioteket til å vise kart på nettsiden. Dette vil i tillegg installere `gh-pages` som brukes til å deploye nettsiden.

```
   npm install
```

5. Kjør opp prosjektet lokalt:

```
   npm start
```

Dette bør åpne browseren din på https://localhost:3000/react-bedpress.

HURRA! Du kan nå kalle deg for en React-utvikler!

---

## STEG 2: Få nettsiden til å kjøre på github-pages.

1. Åpne prosjektet i vs code. (skriv `code .` i terminalen )
2. Endre homepage i `package.json` til din egen url: `"homepage": "https://{{YOUR_GITHUB_USERNAME}}.github.io/norkart-webkurs-CICD-React",`
   ![package json](public/Images/packagejsonhome.png)

3. Aktiver github actions i repoet ditt.

![activate github pages](public/Images/activate-gh-actions.png)

4. Deploy appen til github pages:

```
   npm run deploy
```

Denne kommandoen vil lage en branch i repoet ditt som heter gh-pages. Du kan kjøre denne kommandoen siden kildekoden har definert den i scripts i package.json. I tillegg, har du allerede installert pakken `gh-pages` når du kjørte kommandoen `npm install`.

![package json](public/Images/packagejsonscript.png)

5. Sjekk at github action 'pages-build-deployment' kjører

![Github action pages-build-deployment](public/Images/action-pages-build-deployment.png)

6. Når github action er ferdig - sjekk om nettsiden din kjører på: `https://{{YOUR_GITHUB_USERNAME}}.github.io/norkart-webkurs-CICD-React/`

Hurra! nettsiden din er live :D

## STEG 3: Automatisk deploy med github actions

For å oppdattere nettsiden må vi manuelt kjøre **npm run deploy** etter å ha endret koden. Hadde det ikke vært greit å automatisert dette slik at nettsiden oppdatteres hver gang main-branchen oppdateres? Dette kan vi gjøre ved hjelp av Github Actions:

1. Generer access token for å deploye nettsiden gjennom Github Actions

For å gi Github Actions tilgang til å lese og deploye repoet vårt, trenger vi ett access token. Gå til https://github.com/settings/tokens og trykk 'Generate new token', velg 'Classic'
<br>
<br>

![generate github token](public/Images/github-deploy-token.png)

<br>
<br>

Gi tokenet et navn, f.eks 'deploy-access', og huk av på 'repo'. Klikk så på 'Generate token' og kopier verdien.

<img src="public/Images/github-example-token.png" alt="secret" width="600"/>

<br>
<br>
<br>

2. Lag en secret som kan brukes av Github Actions

For å la Github Actions hente tokenet vi nettop lagde, trenger vi en secret. Trykk på 'New Secret'. Gi den navn: 'ACTIONS_DEPLOY_ACCESS_TOKEN', og verdi: tokenet du kopierte fra forrige steg.
<br >
<br >
<br >
<img src="public/Images/github-create-secret.png" alt="secret" width="600"/>
<br>
<br>
<br>

3. Gjør endring i appen og push til main branchen. Dette skal trigge en github action (se '.github\workflows\main.yml' ) som automatisk kjører `npm run deploy`. Når denne actionen er ferdig, skal dette trigge pages-build-deployment workflowen og endringene skal automatisk rulles ut til nettsiden din.

## STEG 4: Utvikle en super cool react-app med continuous deployment!



1. Gjør endringer i koden (start for eksempel med å oppdatere kartets zoom nivå, start koordinater eller bakgrunnskart).
2. Push oppdateringene dine til git og deploy endringene

```
git add .
git commit -m 'Your commit message'
git push origin main
```

Endringene du gjør vil automatisk oppdateres på nettsiden din! Happy coding :D
Nå står du fritt til å gjøre noe det du vil med appen, mulige utfordringer:


TODO: Lag options ( Se på orignalt repo )
Her er en tutorial:
https://maplibre-react-components.pentatrion.com/tutorial