export async function fritekstsok(searchText, apiKey) {
  if (searchText !== null && searchText !== "") {
    const query = `https://www.webatlas.no/WAAPI-FritekstSok/suggest/kommunecustom?Query=${searchText}&Size=5&Targets=gateadresse`;

    const apiResult = await fetch(query, {
      headers: {
        Accept: "application/json",
        "X-WAAPI-TOKEN": `${apiKey}`,
      },
      method: "GET",
    });

    if (apiResult.status === 200) {
      return await fritekstsokResultToAdress(apiResult);
    }
  }

  return [];
}

const fritekstsokResultToAdress = async (apiResult) => {
  const suggestions = [];

  const json = await apiResult.json();
  json.Options.forEach((suggestion) => {
    if (
      suggestion?.PayLoad?.Posisjon?.X &&
      suggestion?.PayLoad?.Posisjon?.Y &&
      suggestion?.PayLoad?.AdresseMatrikkelNummer
    ) {
      suggestions.push({
        id: suggestion.Id,
        matrikkelId: suggestion.PayLoad.AdresseMatrikkelNummer,
        text: suggestion.Text,
        latlng: {
          lat: suggestion.PayLoad.Posisjon.Y,
          lng: suggestion.PayLoad.Posisjon.X,
        },
      });
    } else if (
      suggestion?.PayLoad?.Posisjon?.X &&
      suggestion?.PayLoad?.Posisjon?.Y &&
      suggestion?.PayLoad?.MatrikkelNummer
    ) {
      suggestions.push({
        id: suggestion.Id,
        matrikkelId: suggestion.PayLoad.MatrikkelNummer,
        text: suggestion.Text,
        latlng: {
          lat: suggestion.PayLoad.Posisjon.Y,
          lng: suggestion.PayLoad.Posisjon.X,
        },
      });
    }
  });

  return suggestions ?? [];
};
