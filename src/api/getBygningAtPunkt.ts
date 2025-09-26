export const getBygningAtPunkt = async (x: number, y: number) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const query = `https://bygning.api.norkart.no/bygninger/byposition?x=${x}&y=${y}&MaxRadius=1`;

    return undefined;

    // TODO: Fullfør/endre koden for hente og returnere bygningsdata på et punkt

    // Hint: Du kan se på getAdressweDeomSearchText og getHoydeFromPunkt for å få en idé om hvordan
    // dette kan gjøres.

    // Merk at dette er en GET request, og ikke en POST request!

    // Når du har fått til kallet til API-et kan du se i Network-taben i nettleseren eller i
    // konsollen for å se hvordan responsen ser ut.
}