export const getHoydeFromPunkt = async (x: number, y: number) => {
    const query = `https://hoyde.api.norkart.no/hoyde`;
    const apiKey = import.meta.env.VITE_API_KEY;

    const postData = {
        "Punkter": [
            {
                "X": x,
                "Y": y
            }
        ]
    };

    try {
        const apiResult = await fetch(query, {
            method: "POST",
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
                "X-WAAPI-TOKEN": `${apiKey}`,
            },
            body: JSON.stringify(postData),
        });

        if (apiResult.ok) { 
            const data = await apiResult.json(); 
            return data.PunktHoyder; 
        } else {
            console.error("API request failed with status:", apiResult.status);
            return []; 
        }
    } catch (error) {
        console.error("An error occurred while fetching data:", error);
        return [];
    }
}