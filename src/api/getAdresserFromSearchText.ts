export const getAdresserFromSearchText = async (searchText: string) => {
    if (!searchText) {
        return [];
    }

    const apiKey = import.meta.env.VITE_API_KEY;
    const query = `https://fritekstsok.api.norkart.no/suggest/custom?Query=${searchText}&Targets=gateadresse`;

    try {
        const apiResult = await fetch(query, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "X-WAAPI-TOKEN": `${apiKey}`,
            },
        });

        if (apiResult.ok) {
            const data = await apiResult.json();
            return data.Options; 
        } else {
            console.error("API request failed with status:", apiResult.status);
            return []; 
        }
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
        return []; 
    }
};