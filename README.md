# Velkommen til workshop med Norkart!

Vi gir dere en enkel boilerplate på en react-applikasjon med maplibre kart og forklarer hvordan denne kan deployes til github pages. Videre kan dere:

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

4. Installer npm pakkene til prosjektet. De relevante pakkene kan sees i `package.json` filen i prosjektet. Vi bruker for eksempel `maplibre-gl` biblioteket til å vise kart på nettsiden. Dette vil i tillegg installere `gh-pages` som brukes til å deploye nettsiden.

```
   npm install
```

5. Kjør opp prosjektet lokalt:

```
   npm run dev
```

Dette bør åpne browseren din på http://localhost:5173/react-bedpress/.

HURRA! Du kan nå kalle deg for en React-utvikler!

---

## OPPGAVER

Nå som du har en enkel kart-applikasjon kan du begynne å utvide den med mer spennende funksjonalitet! 

Under mappen [api](/src/api/) finner du TypeScript funksjoner som henter data fra et utvalg av Norkart API-er. To av disse er allerede implementerte og kan brukes, mens de resterende må du implementere selv. Under finner du oppgaver som du kan velge mellom basert på hva du har lyst til å implementere.

API-NØKKEL GJENNOM BITWARDEN

---

### Oppgave 1: Vis høyde i kartet basert på punkt

Funksjonen [getHoydeFromPunkt.ts](/src/api/getHoydeFromPunkt.ts) kan benyttes til å hente høyde for et geografisk punkt, som vist kart-komponenten [MapLibreMap.tsx](/src/components/MapLibreMap.tsx), hvor høyden for et punkt lagres i staten "hoyde" og vises konsollen i nettleseren når man klikker i kartet. Din oppgave er å implementere en visning av denne høyden i applikasjonen. 

Her kan du for eksempel benytte deg av MapLibre-komponenten [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup), eller lage en egen komponent ved siden av eller under kartet som viser latitude, longitude og høyde for valgt punkt. Da kan man for eksempel bruke MUI-komponenten [Card](https://mui.com/material-ui/react-card/).

---

### Oppgave 2: Implementer søk etter adresse


Funksjonen [getAddresserFromSearchText](/src/api/getAdresserFromSearchText.ts) kan benyttes til å hente adresser som matcher en søketekst. Endre komponenten [SearchBar](/src/components/SearchBar.tsx) til å bruke denne funksjonen til å hente adresser.

Hint: Adressealternativer settes i konstanten "adresser" i useEffect i komponenten. Husk å bruk "await", siden getAddresserFromSearchText er en asynkron funksjon! Du kan se på hvordan getHoydeFromPunkt blir brukt i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx) som et eksempel.

Når du har fått til dette kan du gå videre til å få kartet til å "fly til" en valgt adresse. Dette kan man gjøre ved å benytte seg av staten "address" som er lagret i [App](/src/App.tsx)-komponenten og som oppdateres når man velger en adresse. Denne staten gis videre til [MapLibreMap](/src/components/MapLibreMap.tsx), slik at den kan benyttes der. Det som gjenstår er å benytte seg av komponenten MapFlyTo, og å gi adresseposisjonen til denne komponenten:

```
<RMap
      minZoom={6}
      ...
>
   <MapFlyTo lat={address?.PayLoad.Posisjon.Y} lng={address?.PayLoad.Posisjon.X}/>
</RMap>
```

### Oppgave 3: Vis bygninger i kartet

Norkart har også et API-endepunkt for å hente data for et bygning ved et punkt. For å hente og bruke denne må funksjonen [getBygningAtPunkt.ts](/src/api/getBygningAtPunkt.ts) implementeres. Se filen for implementasjonsinstruksjoner.

Når implementert kan funksjonen brukes i [MapLibreMap](/src/components/MapLibreMap.tsx)-komponenten for å hente omrisset av en bygning. Gjør følgende:

1. Legg til følgende importer øverst i komponent-fila under de andre importene:

```
import { getBygningAtPunkt } from '../api/getBygningAtPunkt';
import type { GeoJSON } from 'geojson';
```

2. Definer en state og en state-setter for bygningsomrisset, under de andre state og state-setterne:

```
const [bygningsOmriss, setBygningsOmriss] = useState<GeoJSON | undefined>(undefined);
```

3. Endre onMapClick-funksjonen til å hente bygningsdata ved klikk og til å oppdatere staten. Merk at implementasjonen nedenfor forutsetter at getBygningAtPunkt returnerer én bygning og ikke en liste av bygninger.

```
const onMapClick = async (e: MapLayerMouseEvent) => {
   const bygningResponse = await getBygningAtPunkt(e.lngLat.lng, e.lngLat.lat)
   if (bygningResponse?.FkbData?.BygningsOmriss) {
      const geoJsonObject = JSON.parse(bygningResponse.FkbData.BygningsOmriss);
      setBygningsOmriss(geoJsonObject);
   } else {
      setBygningsOmriss(undefined);
   }
   ...
}
```

4. Legg til en polygon-stil. Denne kan du redigere etter eget ønske:

```
const polygonStyle = {
   "fill-outline-color": "rgba(0,0,0,0.1)",
   "fill-color":  "rgba(18, 94, 45, 0.41)" 
}
```

5. Oppdater MapLibre importer:

```
import { RLayer, RMap, RSource, useMap } from 'maplibre-react-components';
```

6. Legg til komponenter for å vise et polygon for valgt bygning. Disse rendres kun når bygningsOmriss er definert.

```
<RMap
   ...
>
      {bygningsOmriss && 
         <>
            <RSource id="bygning" type="geojson" data={bygningsOmriss} />
            <RLayer
               source="bygning"
               id="bygning-fill"
               type="fill"
               paint={polygonStyle}
            />
         </>
      }
</RMap>
```

#### Ekstraoppgave:

API-et returnerer også andre data knyttet til en bygning. Kanskje du kan vise disse dataene ved hjelp av en [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup) eller et [MUI Card](https://mui.com/material-ui/react-card/)?


#### Ekstraoppgave:

Dersom du har implementert adressesøk (se [Oppgave 2](#oppgave-2-implementer-søk-etter-adresse)), kan du bruke posisjonen i Adresse-objektet til å hente en bygning på adressen og vise dette i kartet!

#### Ekstraoppgave:

Norkart har også et API-endepunkt for Risiko- og sårbarhetsdata (ROS-data) for bygninger. Implementer funksjonen [getRosDataForBygning](/src/api/getRosDataForBygning.ts) og hent data for en valgt bygning. Vis ROS-data enten i kart eller ved å bruke MUI-komponenter utenfor kartet.


---

### Oppgave 4: Hent og vis solmengde for tak ved punkt

Implementer funksjonen [getTakflateDataForPunkt](/src/api/getTakflateDataForPunkt.ts) for å hente solmengde-data for et tak ved et punkt.

Når implementert kan du modifisere funksjonen onMapClick i [MapLibreMap](/src/components/MapLibreMap.tsx)-komponenten for å hente solmengde-data for et tak ved et valgt punkt i kartet. Respons-objektet inneholder blant annet en geometri som kan vises i kartet (se [oppgave 3](#oppgave-3-vis-bygninger-i-kartet) for å se hvordan dette kan gjøres).

I tillegg innholder responsen den beregnede solmengden (i kWh/m^2) som treffer taket i en gitt måned. Denne informasjonen kan for eksemple vises ved hjelp av komponenten [MUI Table](https://mui.com/material-ui/react-table/).

#### Ekstraoppgave:

Dersom du har implementert [getBygningAtPunkt](/src/api/getBygningAtPunkt.ts) (se [oppgave 3](#oppgave-3-vis-bygninger-i-kartet)), kan du benytte bygningsnummeret som returneres fra API-et til å hente solmengde-data for alle takene på en valgt bygning. For å gjøre dette må du implementere [getTakflateDataForBygning](/src/api/getTakflateDataForBygning.ts). Responsen fra dette API-kallet kan brukes både til å vise alle tak i kartet og til å vise total solmengde på alle tak ved forskjellige tider av året.


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

### Option 1: Følg tutorialen til Maplibre og legg til flere funksjoner i appen

Gjerne ta utgangspunkt i [Maplibre sin torturial](https://maplibre-react-components.pentatrion.com/tutorial) for å legge til flere funksjoner i appen.
*ℹ️ Husk at vi bruker typeScript og ikke javascript, så du må kanskje gjøre noen små endringer på koden i tutorialen for at det skal funke. Spør gjerne om hjelp!*

### Option 2: Legg til tegneverktøy i kartet

Legg til komponenten DrawComponent som en child av MapLibreMap i MapLibreMap.tsx.
Har tatt utganspunkt i [dette Maplibre eksempelet](https://maplibre.org/maplibre-gl-js/docs/examples/draw-geometries-with-terra-draw/) for å lage denne React komponenten.

## OPTION 3: Gjør Noe Annet Kult

Her kan man gjøre noe helt annet eller noe som bygger på oppgavene over. Dette er gjerne oppgave man starter på dersom man er godt kjent med React eller er blitt ferdig med en av de andre oppgavene over. Forslag kan være å bygge på en av de tidligere oppgavene man har fullført, prøve å kombinere noen oppgaver eller finne på noe helt annet.

Tips til andre ting du kan gjøre med kartet:

- Sjekk ut maplibre gl sine eksempler: http://maplibre.org/maplibre-gl-js/docs/examples/
- Visualisere historiske Oslo bysykkel data: https://oslobysykkel.no/en/open-data/historical
- Lag et Koropletkart av Norgesbefolkning. En Json fil er lagt ved (se sample_data folderen) som viser norges befolkning delt opp i 5x5km ruter.
- Visualiser din egen data. Du kan lage geojson filer her: https://geojson.io/#map=2/20.0/0.0