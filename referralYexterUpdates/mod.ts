const referralSubmissionPoints = 10;
const referralHiredPoints = 25;

//API request parameters
const params = new URLSearchParams({
    api_key: '8af547b9801a9f538985248ec5dbb0e9',
    v: '20230330'
})

//API request headers
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
    //add 10 points if new referral has been submitted
    if (isNewReferral(event)) {
        return putRequest(addReferralPoints(event.primaryProfile, referralSubmissionPoints),event.primaryProfile.meta.id) 
    }
    //add 25 points if existing referral is hired
    else if (isReferralHired(event)) {
        const linkedYexter = await fetch (`https://api.yext.com/v2/accounts/3829319/entities/${event.primaryProfile.c_yexterWhoReferredThisPerson[0]}?${params.toString()}`, {
            method: "GET",
            headers
            }).then(response => response.json())
        return putRequest(addReferralPoints(linkedYexter.response, referralHiredPoints),event.primaryProfile.c_yexterWhoReferredThisPerson[0]) 
    }
    //do nothing if the update is not a new referral or existing referral hired
    else return
}

//function to add specified referral points to c_referralPoints field 
export function addReferralPoints(yexter: object, pointValue) {
    console.log(pointValue)
    //if the yexter's referral points = 0
    if(!('c_referralPoints' in yexter)) {
        return(pointValue.toString())
    }
    //if the yexter's referral points > 0
    if('c_referralPoints' in yexter) {
        return((parseInt(yexter.c_referralPoints, 10) + pointValue).toString())
    }
}
//function that executes the PUT request to update referral points
export async function putRequest(referralPoints: string, yexterID: string) {
    const request = new Request(`https://api.yext.com/v2/accounts/3829319/entities/${yexterID}?${params.toString()}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                "c_referralPoints": referralPoints
            })
        });
        return fetch(request);
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