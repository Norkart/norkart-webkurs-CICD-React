export const getBygningAtPunkt = async (x: number, y: number) => {
  const apiKey = import.meta.env.VITE_API_KEY;
  const query = `https://bygning.api.norkart.no/bygninger/byposition?x=${x}&y=${y}&MaxRadius=1&GeometryTextFormat=GeoJson&IncludeFkbData=true`;

  // TODO: Fullfør/endre koden for hente og returnere bygningsdata på et punkt

  // Hint: Du kan se på getAdresseFromSearchText og getHoydeFromPunkt for å få en idé om hvordan
  // dette kan gjøres.

  // Merk at dette er en GET request, og ikke en POST request!

  // Når du har fått til kallet til API-et kan du se i Network-taben i nettleseren eller i
  // konsollen for å se hvordan responsen ser ut.

  try {
    const apiResult = await fetch(query, {
      method: 'GET', // OBS mange kommer til å prøve seg på en POST her :D
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        'X-WAAPI-TOKEN': `${apiKey}`,
      },
    });

    if (apiResult.ok) {
      const data = await apiResult.json();
      console.log(data);
      return data?.Bygninger[0];
    } else {
      console.error('API request failed with status:', apiResult.status);
      return undefined;
    }
  } catch (error) {
    console.error('An error occurred while fetching data:', error);
    return undefined;
  }
};
