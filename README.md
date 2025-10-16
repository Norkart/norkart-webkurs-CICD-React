# Velkommen til workshop med Norkart!

Vi gir dere en enkel fremgangsmåte på å sette opp en React-applikasjon med et Maplibre-kart. Deretter skal dere utvide kartfunksjonaliteten til applikasjonen ved å bruke data fra Norkart. Her kan dere velge mellom forskjellige oppgaver, eller lage noe helt selv!

Still spørsmål dersom dere står fast eller noe er uklart! 😄

Lykke til!

## Nyttige lenker:

- React-dokumentasjon: https://react.dev/reference/react
- TypeScript-dokumentasjon: https://www.typescriptlang.org/docs/
- Material UI (MUI) dokumentasjon: https://mui.com/material-ui/getting-started/
- MapLibre-dokumentasjon: https://maplibre-react-components.pentatrion.com/getting-started

---

## STEG 0: Forutsetninger

Før dere starter må dere ha noe programvare installert (installer kun det dere ikke har fra før):

1. **Git**. Følg instruksjonene som gjelder for ditt OS her: https://git-scm.com/book/en/v2/Getting-Started-Installing-Git. Sjekk at git er installert ved å kjøre følgende i en terminal:

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

1. For å få din egen versjon av prosjektet under egen GitHub-bruker fork-er du dette prosjektet. Dette gjøres ved å trykke `fork` oppe i høyre hjørnet.
   Behold default innstillinger.

2. I en terminal: Finn fram til fillokasjonen hvor dere vil lagre prosjektet og klon repoet (deres egen versjon av prosjektet som dere nettopp forket):

```
   git clone https://github.com/<YOUR_GITHUB_USERNAME>/norkart-webkurs-React.git
```

3. Åpne VSCode og åpne prosjektet du nettopp clonet.

4. Åpne ny terminal. Installer npm pakkene til prosjektet. De relevante pakkene kan sees i `package.json` filen i prosjektet. Vi bruker for eksempel `maplibre-gl` biblioteket til å vise kart på nettsiden.

```
   npm install
```

5. **API-nøkkel**. I rotmappa av repoet, lag en fil ved navn ".env" og legg inn følgende:

```
VITE_API_KEY=
```

Bak "=" skal dere legge inn API-nøkkelen dere får tildelt.

**API-nøkkelen skal IKKE legges noe annet sted enn her, og .env skal IKKE lastes opp på GitHub!!**

6. Kjør opp prosjektet lokalt:

```
   npm run dev
```

Dette bør åpne nettleseren din på http://localhost:5173/.

HURRA! Du kan nå kalle deg for en React-utvikler!

---

## STEG 2: Legg til funksjonalitet

Nå som du har en enkel kart-applikasjon kan du begynne å utvide den med mer spennende funksjonalitet!

Under finner du forskjellige oppgaver som kan gjøres i hvilken som helst rekkefølge (med unntak av noen ekstraoppgaver), med litt ulik grad av veildening. Dersom du føler deg komfortabel nok med React og TypeScript kan du også gjøre noe helt annet med de dataene og verktøyene som er tilgjengelig!

---

### OPPGAVE 1: Følg tutorialen til Maplibre og legg til mer kartfunksjonalitet i appen

Gjerne ta utgangspunkt i [Maplibre sin tutorial](https://maplibre-react-components.pentatrion.com/tutorial) for å legge til flere funksjoner i appen.
_ℹ️ Husk at vi bruker TypeScript og ikke JavaScript, så du må kanskje gjøre noen små endringer på koden i tutorialen for at det skal funke. Spør gjerne om hjelp!_

---

### Oppgave 2: Vis høyde i kartet basert på punkt

Funksjonen [getHoydeFromPunkt.ts](/src/api/getHoydeFromPunkt.ts) kan benyttes til å hente høyde for et geografisk punkt, som vist i kart-komponenten [MapLibreMap.tsx](/src/components/MapLibreMap.tsx), hvor høyden for et punkt lagres i staten "pointHoyde" og vises konsollen i nettleseren når man klikker i kartet. Din oppgave er å implementere en visning av denne høyden i applikasjonen.

Her kan du for eksempel benytte deg av MapLibre-komponenten [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup), eller lage en egen komponent ved siden av eller under kartet som viser latitude, longitude og høyde for valgt punkt. Da kan man for eksempel bruke MUI-komponenten [Card](https://mui.com/material-ui/react-card/) eller legge inn detaljene direkte inn i Overlay-komponenten.

Hint: Latitude og longitude av punktet man klikker på blir lagret i `clickPoint`-state'en. Disse må brukes dersom du velger å prøve [RPopup](https://maplibre-react-components.pentatrion.com/components/rpopup).

---

### Oppgave 3: Implementer søk etter adresse

[SearchBar.tsx](/src/components/SearchBar.tsx) eksporterer en komponent som kan brukes til å søke etter adresser. For å vise den i applikasjonen må den importeres og plasseres i en komponent som faktisk rendres, som [MapLibreMap](/src/components/MapLibreMap.tsx). I denne filen, importer SearchBar ved å plassere følgende øverst i filen:

```
import { SearchBar, type Address } from './SearchBar';
```

Videre må vi lage en state hvor en valgt adresse kan lagres og en state-setter-funksjon som kan oppdatere den. Dette oppnås ved å legge til følgende i MapLibreMap-komponenten:

```
export const MapLibreMap = () => {
   const [hoyde, setHoydeAtPunkt] = useState<undefined | number>(undefined);
   const [address, setAddress] = useState<Address | null>(null); // <--- Legg til dette!
  ...
}
```

For å rendre [Searchbar](/src/components/SearchBar.tsx)-komponenten, plasser den inni Overlay-komponenten, slik:

```
export const MapLibreMap = () => {
  ...

  return (
    <RMap
      ...
    >
      <Overlay>
        <SearchBar setAddress={setAddress}/> // <--- Legg til denne
      </Overlay>
      <DrawComponent />
    </RMap>
  );
};
```

Her gir vi state-setter-funksjonen videre til komponenten, slik at komponenten kan oppdatere den. Nå skal Søkefeltet vises i applikasjonen!

Som du derimot kanskje ser kommer det ikke opp noen valgalternativer når man søker. Her kan funksjonen [getAddresserFromSearchText](/src/api/getAdresserFromSearchText.ts) benyttes til å hente adresser fra et Norkart API som matcher en søketekst. Endre komponenten [SearchBar](/src/components/SearchBar.tsx) til å bruke denne funksjonen til å hente adresser.

Hint: Adressealternativer settes i konstanten "adresser" i useEffect i komponenten. Husk å bruk "await", siden getAddresserFromSearchText er en asynkron funksjon! Du kan se på hvordan getHoydeFromPunkt blir brukt i [MapLibreMap.tsx](/src/components/MapLibreMap.tsx) som et eksempel.

Når du har fått til dette kan du gå videre til å få kartet til å "fly til" en valgt adresse. Dette kan man gjøre ved å benytte seg av staten vi opprettet ved navn "address", som oppdateres når man velger en adresse. Det som gjenstår er å benytte seg av komponenten MapFlyTo, og å gi den lagrede adresseposisjonen til denne komponenten:

```
<RMap
      minZoom={6}
      ...
>
   {address && (
      <MapFlyTo
         lngLat={
         new LngLat(address.PayLoad.Posisjon.X, address.PayLoad.Posisjon.Y)
         }
      />
   )}
</RMap>
```

### Oppgave 4: Vis bygninger i kartet

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

5. Oppdater MapLibre importer i [MapLibreMap](/src/components/MapLibreMap.tsx)-komponenten:

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

Dersom du har implementert adressesøk (se [Oppgave 3](#oppgave-3-implementer-søk-etter-adresse)), kan du bruke posisjonen i Adresse-objektet til å hente en bygning på adressen og vise dette i kartet!

#### Ekstraoppgave:

Norkart har også et API-endepunkt for Risiko- og sårbarhetsdata (ROS-data) for bygninger. Implementer funksjonen [getRosDataForBygning](/src/api/getRosDataForBygning.ts) og hent data for en valgt bygning. Vis ROS-data enten i kart eller ved å bruke MUI-komponenter utenfor kartet.

---

### Oppgave 5: Hent og vis solmengde for tak ved punkt

Implementer funksjonen [getTakflateDataForPunkt](/src/api/getTakflateDataForPunkt.ts) for å hente solmengde-data for et tak ved et punkt.

Når implementert kan du modifisere funksjonen onMapClick i [MapLibreMap](/src/components/MapLibreMap.tsx)-komponenten for å hente solmengde-data for et tak ved et valgt punkt i kartet. Respons-objektet inneholder blant annet en geometri som kan vises i kartet (se [oppgave 4](#oppgave-4-vis-bygninger-i-kartet) for å se hvordan dette kan gjøres).

I tillegg innholder responsen den beregnede solmengden (i kWh/m^2) som treffer taket i en gitt måned. Denne informasjonen kan for eksempel vises ved hjelp av komponenten [MUI Table](https://mui.com/material-ui/react-table/).

#### Ekstraoppgave:

Dersom du har implementert [getBygningAtPunkt](/src/api/getBygningAtPunkt.ts) (se [oppgave 4](#oppgave-4-vis-bygninger-i-kartet)), kan du benytte bygningsnummeret som returneres fra API-et til å hente solmengde-data for alle takene på en valgt bygning. For å gjøre dette må du implementere [getTakflateDataForBygning](/src/api/getTakflateDataForBygning.ts). Responsen fra dette API-kallet kan brukes både til å vise alle tak i kartet og til å vise total solmengde på alle tak ved forskjellige tider av året.

### OPPGAVE 6: Gjør noe med andre, åpne geografiske data

Her står du fritt til å bruke andre åpne geografiske data til å utvide appen. Eksempel er:

- Sjekk ut maplibre gl sine eksempler: http://maplibre.org/maplibre-gl-js/docs/examples/
- Visualisere historiske Oslo bysykkel data: https://oslobysykkel.no/en/open-data/historical
- Lag et Koropletkart av Norgesbefolkning. En Json fil er lagt ved (se [befolkning_5km.json](/src/sample_data/befolkning_5km.json)) som viser Norges befolkning delt opp i 5x5km ruter.
- Visualiser din egen data. Du kan lage GeoJson filer her: https://geojson.io/#map=2/20.0/0.0
