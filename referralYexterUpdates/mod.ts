//import WEBHOOK_RESPONSE from "./updateMobility.ts"

const referralSubmissionPoints = 10;
const referralHiredPoints = 25;
const mobilityUpdatedPoints = 25;
const accountId = '3829319'; //'3151361';

//API request parameters
const params = new URLSearchParams({
    api_key: '8af547b9801a9f538985248ec5dbb0e9', //'1c95341425ee2191ed3bcc541ac8e1f0',
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
        entityType: string
    }
    name: string
}

//interface the Yexter Entity with c_linkedReferrals and c_referralPoints
interface YexterEntity {
    //Linked Referrals is an arry of entity IDs, which are strings
    c_linkedReferrals: string[]
    //Need to test if this works for string type as opposed to int
    c_referralPoints: string
    c_keySkills: string[],
    c_departmentsMostInterestedIn: string[],
    meta: {
        id: string,
        entityType: string
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
        const linkedYexter = await fetch (`https://api.yext.com/v2/accounts/${accountId}/entities/${event.primaryProfile.c_yexterWhoReferredThisPerson[0]}?${params.toString()}`, {
            method: "GET",
            headers
            }).then(response => response.json())
        return putRequest(addReferralPoints(linkedYexter.response, referralHiredPoints),event.primaryProfile.c_yexterWhoReferredThisPerson[0]) 
    }
    //do nothing if the update is not a new referral or existing referral hired
    else return
}

//updateReferral(WEBHOOK_RESPONSE)

//function to add specified referral points to c_referralPoints field 
export function addReferralPoints(yexter: any, pointValue: number) {
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
    console.log(referralPoints)
    const request = await new Request(`https://api.yext.com/v2/accounts/${accountId}/entities/${yexterID}?${params.toString()}`, {
            method: "PUT",
            headers,
            body: JSON.stringify({
                "c_referralPoints": referralPoints
            })
        });
        console.log(request);
        return fetch(request);
}

export async function updateForInternalMobility(event:any) {
    //if the mobility survey is updated
    if (mobilitySurveyUpdated(event)) {
        console.log("Mobility Survey Updated:" + mobilitySurveyUpdated(event))
        //if the mobility survey has been updated fewer than two times this year, update the entity ID for the correct number of mobility points
        if (await queryLogsApi(event)) {
            console.log("Can update for points")
            return putRequest(addReferralPoints(event.primaryProfile, mobilityUpdatedPoints),event.primaryProfile.meta.id)
        }
        else return
    }
    else return
}

export async function queryLogsApi(event:any) {
    const entityId = event.entityId;
    const changedField = event.changedFields.fieldNames[0];
    const timestampFilter = (new Date((new Date().getFullYear()), 0, 1)).toISOString();
    
    const request = await fetch(`https://api.yext.com/v2/accounts/${accountId}/logs/tables/entityHistory/query?${params.toString()}`, {
        method: "POST",
        headers,
        body: JSON.stringify({
            "filter": `fieldUpdated.field == '${changedField}') && updatedTimestamp >= '${timestampFilter}' && entity.id == '${entityId}'`
    })
  });
  const requestData = await request.json();
  console.log(requestData)
  //if the response is not empty 
  if (Object.keys(requestData.response).length !== 0) {
    const updatedCount = (requestData.response.logRecords).length
    console.log(updatedCount);
    console.log(updatedCount < 1)
    return updatedCount < 1;
  }
  //if the response is empty 
  if (Object.keys(requestData.response).length == 0) {
    return true
  }
}

//function that checks that c_linkedReferrals has been updated
export function isNewReferral(event: WebhookEventYexter) {
    //returns TRUE if the Linked Referral has been changed, returns FALSE otherwise
    return event.changedFields.fieldNames.includes("c_linkedReferrals") && event.meta.eventType === "ENTITY_UPDATED"
}

//function that checks a referral has been hired
export function isReferralHired(event: WebhookEventReferral) {
    //returns TRUE if the Referral Status has been updated to HIRED, returns FALSE otherwise
    return event.changedFields.fieldNames.includes("c_referralStatus") && event.primaryProfile?.c_referralStatus === "HIRED" && event.meta.eventType === "ENTITY_UPDATED";
}

//function that checks that the changed field is either c_keySkills or c_departmentsMostInterestIn for the mobility survey
export function mobilitySurveyUpdated(event: any) {
    return (event.changedFields.fieldNames.includes("c_keySkills") || event.changedFields.fieldNames.includes("c_departmentsMostInterestedIn")) && event.meta.eventType === "ENTITY_UPDATED"
}

//updateForInternalMobility(WEBHOOK_RESPONSE)