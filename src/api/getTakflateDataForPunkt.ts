export const getTakflateDataForPunkt = async (x: number, y: number) => {
    const apiKey = import.meta.env.VITE_API_KEY;
    const query = `https://takflater.api.norkart.no/takflater/punkt/utvidet?x=${x}&y=${y}`;

    // TODO: Fullfør/endre koden for hente og returnere takflatedata for et punkt

    // Hint: Du kan se på getAdresseFromSearchText og getHoydeFromPunkt for å få en idé om hvordan
    // dette kan gjøres.

    // Merk at dette er en GET request, og ikke en POST request!

    // Når du har fått til kallet til API-et kan du se i Network-taben i nettleseren eller i
    // konsollen for å se hvordan responsen ser ut.
}