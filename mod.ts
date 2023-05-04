declare const API_KEY: string;
declare const ACCOUNT_ID: string;
import WEBHOOK_RESPONSE from "./testDataReferralHired.ts";
const referralPointsValue = 10;

const params = new URLSearchParams({
    api_key: '8af547b9801a9f538985248ec5dbb0e9',
    v: '20230330'
})

const headers = new Headers({
    "content-type": "application/json"
});

//interface the Referral Entity with the c_referralStatus
interface ReferralEntity {
    c_referralStatus: string
    c_yexterWhoReferredThisPerson: string[]
    meta: {
        id: string,
        entityType: ce_referral
    }
    name: string
}

//interface the Yexter Entity with c_linkedReferrals and c_referralPoints
interface YexterEntity {
    //Linked Referrals is an arry of entity IDs, which are strings
    c_linkedReferrals: string[]
    //Need to test if this works for string type as opposed to int
    c_referralPoints: string
    meta: {
        id: string,
        entityType: ce_yexter
    }
    name: string
}

//interface a Webhook Event that listens for changes to the Yexter Entity 
interface WebhookEventYexter {
    meta: {
        eventType: "ENTITY_UPDATED"
    }
    primaryProfile: YexterEntity
    changedFields : { 
        fieldNames: ["c_linkedReferrals"]
    }
}

//interface a Webhook Event that listens for changes to the Referral Entity
interface WebhookEventReferral {
    meta: {
        eventType: "ENTITY_UPDATED"
    }
    primaryProfile: ReferralEntity
    changedFields : { 
        fieldNames: ["c_referralStatus"]
    }

}

export async function updateReferral(event:any) {
    if (isNewReferral(event)) {
        console.log("New Referral")
        putRequest(addReferralPoints(event.primaryProfile),event.primaryProfile.meta.id) 
    }
    if (isReferralHired(event)) {
        console.log("Existing Referral Hired")
        console.log(event.primaryProfile.c_yexterWhoReferredThisPerson[0])
        const linkedYexter = await fetch (`https://api.yext.com/v2/accounts/3829319/entities/${event.primaryProfile.c_yexterWhoReferredThisPerson[0]}?${params.toString()}`, {
            method: "GET",
            headers
            }).then(response => response.json())
        return putRequest(addReferralPoints(linkedYexter.response),event.primaryProfile.c_yexterWhoReferredThisPerson[0]) 
    }
    //do nothing if the update is not a new referral or existing referral hired
    else return
}
//updateReferral(WEBHOOK_RESPONSE)

//function to add 10 points to c_referralPoints field 
export function addReferralPoints(yexter: object) {
    console.log(yexter)
    //if the yexter's referral points = 0
    if(!('c_referralPoints' in yexter)) {
        console.log("response does not contain referral points")
        return(referralPointsValue.toString())
    }
    //if the yexter's referral points > 0
    if('c_referralPoints' in yexter) {
        console.log("response contains referral points: " + yexter.c_referralPoints)
        return((parseInt(yexter.c_referralPoints, 10) + referralPointsValue).toString())
    }
}
//function that executes the PUT request to update referral points
export async function putRequest(referralPoints: string, yexterID: string) {
    console.log(referralPoints, yexterID)
    if (typeof referralPoints === "string") {
        console.log("myVariable is a string");
      } else {
        console.log("myVariable is not a string");
      }
    // const requestInit: requestInit =  {
    //     method: "PUT",
    //     headers,
    //     body: JSON.stringify({
    //         "c_referralPoints": referralPoints
    //     }),
    // };
    // console.log(requestInit)
    // const request1 = await fetch (`https://api.yext.com/v2/accounts/3829319/entities/${yexterID}?${params.toString()}`, {
    //         method: "PUT",
    //         headers,
    //         body: JSON.stringify({
    //             "c_referralPoints": referralPoints
    //         })
    //         }).then(response => response.json())
    //         console.log(request1)
    
    const request2 = new Request(`https://api.yext.com/v2/accounts/3829319/entities/${yexterID}?${params.toString()}`, {
            method: "PUT",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                "c_referralPoints": referralPoints
            })
        });
        return fetch(request2);
        console.log(request2)
    console.log("Yexter successfully updated for new referral")
}

export async function updateForHiredReferral(event:WebhookEventReferral) {
    //do nothing if the update is not a new referral
    if (!(isReferralHired(event))) return

    //get entity ID and linked Yexter entity ID of the referral entity
    const entityID = event.primaryProfile.meta.id
    const linkedYexterID = event.primaryProfile.c_yexterWhoReferredThisPerson[0]
    console.log("Linked Yexter ID: "+linkedYexterID)
    //create the body for the PUT request 
    const body = JSON.stringify({
        "meta": {
            "id": entityID
        },
        "c_referralPoints": addReferralPoints(event.primaryProfile)
    })
    
    await fetch(`https://api.yext.com/v2/accounts/3829319/entities/${linkedYexterID}?${params.toString()}`, {
        method: "PUT",
        headers,
        body: body
    })

    console.log("Yexter successfully updated for new referral")
}
//function that checks that c_linkedReferrals has been updated
export function isNewReferral(event: WebhookEventYexter) {
    //returns TRUE if the Linked Referral has been changed, returns FALSE otherwise
    return event.meta.eventType === "ENTITY_UPDATED" && 
    (event.changedFields.fieldNames.includes("c_linkedReferrals"))
}

//function that checks a referral has been hired
export function isReferralHired(event: WebhookEventReferral) {
    //returns TRUE if the Referral Status has been updated to HIRED, returns FALSE otherwise
    return event.meta.eventType === "ENTITY_UPDATED" && (event.changedFields.fieldNames.includes("c_referralStatus")) && event.primaryProfile?.c_referralStatus === "HIRED";
}