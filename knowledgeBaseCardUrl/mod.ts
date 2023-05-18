declare const apiKey: string;
declare const accountId: string;

//function to update all of the knowledge base cards landing page URLs

const pageSize: number = 10;
let pageToken: string | undefined = undefined; 

const params = new URLSearchParams({
    api_key: 'e3630c74306cbb98b7e191372545861b',
    v: '20230330',
    entityTypes: 'card',
    fields: 'c_parentBoard,name'
})

const putParams = new URLSearchParams({
    api_key: 'e3630c74306cbb98b7e191372545861b',
    v: '20230330'
})

const headers = new Headers({
    "content-type": "application/json"
});

interface ApiResponse {
    data: any[];
    nextPageToken?: string;
};

// async function fetchApiResults(): Promise<void> {
//     try {
//         const response: Response = await fetch(`https://api.yext.com/v2/accounts/3151361/entities?${params.toString()}`);
//         const apiResponse: ApiResponse = await response.json();
        
//         const { data, nextPageToken } = apiResponse;

//         pageToken = nextPageToken
//     }
// };

//function to update existing cards with landing page URLs
async function updateURLs() {
    try {
        const jsonResponse = (await fetch (`https://api.yext.com/v2/accounts/3151361/entities?${params.toString()}`, {
                    method: "GET",
                    headers
        }).then(response => response.json()))

        console.log(jsonResponse)

        const cards = jsonResponse.response.entities
        const pageToken = jsonResponse.response.pageToken
        
        console.log(cards)
        console.log(pageToken)

        // for (const card of cards) {
        //     updateURL(card);
        //     console.log('URL successfully updated')
        // }

        // if (pageToken) {
        //     params.set('pageToken', pageToken);
        //     await updateURLs();
        // }

    } catch (error) {
        console.error('Error fetching cards', error);
    }
}

updateURLs()


async function updateURL(card: any) {
    // console.log(card)
    const entityId = card.meta.id
    // console.log(entityId)
    const parentBoardId = card.c_parentBoard[0].toLowerCase()
    const landingPageUrl = `https://knowledge.telescope.yext.com/board/${parentBoardId}?selected=${entityId}`
    console.log(landingPageUrl)

     //for each card, send a put request to that entity to update the landing page URL
    const putRequest = new Request(`https://api.yext.com/v2/accounts/3151361/entities/${entityId}?${putParams.toString()}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({
            "landingPageUrl": landingPageUrl
        })
    });
    return fetch(putRequest);
}

//function to create a landing page URL for cards that are being newly created

export async function createURL(event: any) {
    if (event.meta.eventType == 'ENTITY_UPDATED') {
        const card = event.primaryProfile
        updateURL(card)
    }
    else return
}
