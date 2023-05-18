


async function addUrls(entity, board) {
    // create landing page URL using entity ID and parent board entity ID
    const body = {
        landingPageUrl: `https://knowledge.telescope.yext.com/board/${board}?selected=${entity}`
    }
    const requestOptions = {
        method: "PUT",
        body: JSON.stringify(body),
        headers: {
            "Content-Type": "application/json",
          },
    }
    // update entity's landing page URL
    const updateEntityResponse = await fetch(`https://api.yextapis.com/v2/accounts/me/entities/${entity}?v=20230517&api_key=5cfa0375ff44f0dc6dc5520a192c5b1c`, requestOptions).then(response => response.json());
    console.log(updateEntityResponse);
}

interface CardCreated {
    meta: {
        eventType: "ENTITY_CREATED"
    }
    primaryProfile: Card
    changedFields : { 
        fieldNames: ["c_parentBoard"]
    }
}

interface CardUpdated {
    meta: {
        eventType: "ENTITY_UPDATED"
    }
    primaryProfile: Card
    changedFields : { 
        fieldNames: ["c_parentBoard"]
    }
}

interface Card {
    c_parentBoard: string[]
    meta: {
        id: string,
        entityType: card
    }
    name: string
}

async function createURL(event:any) {

    //checks that the event type is either ENTITY_CREATED or ENTITY_UPDATED for a card and that c_parentBoard has been updated 

    if (isCardCreated(event) || isCardUpdated(event)) {

        

    }

}

//checks that the event type is either ENTITY_CREATED or ENTITY_UPDATED
function isCardCreated(event: CardCreated) {
    //returns TRUE if event type is ENTITY_CREATED and changed fields is c_parentBoard
    return event.changedFields.fieldNames.includes("c_parentBoard") && event.meta.eventType === "ENTITY_CREATED"
}

function isCardUpdated(event: CardUpdated) {
    //returns TRUE if event type is ENTITY_UPDATED and changed fields is c_parentBoard
    return event.changedFields.fieldNames.includes("c_parentBoard") && event.meta.eventType === "ENTITY_UPDATED"
}

//checks that the landing page URL is blank 
function isURLBlank()

//checks that the parent board is filled out 

//create URL with parent board and entity ID, update the entity via API