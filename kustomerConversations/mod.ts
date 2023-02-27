//declare domain variable (hardcoded right now in _resource.json)
declare const apiKey: string;
declare const domain: string;

//Appends the KB domain to the source and hash ID URL path to generate the full URL
export const getAllMessages = async (conversationId: string) => {
    const allMessagesEndpoint = `https://api.kustomerapp.com/v1/conversations/${conversationId}/messages`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const response = (await fetch(allMessagesEndpoint, requestOptions).then(response => response.json())).data;
    const messagesCount = response.length;
    console.log(messagesCount)
    const allMessages = [];
    for (let count = 0; count < response.length; count++) {
        //Iterates through all the messages in the data array and appends them to empty array
        allMessages.push("\nMessage "+(count+1)+": "+response[count].attributes.preview)
        console.log(allMessages);
    }
    console.log(allMessages.toString());
    return(allMessages.toString());
}
//getAllMessages("63ee4dcea5c95ff7e2e3acf3");

export const createConversationUrl = async(urlPath:string) => {
    const orgEndpoint = "https://api.kustomerapp.com/v1/orgs/current"
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const orgName = (await fetch(orgEndpoint, requestOptions).then(response => response.json())).data.attributes.name;
    const url = `https://${orgName}.kustomerapp.com/app/customers/${urlPath}`
    return url
}

//createConversationUrl("629912146bedcb45dfa77542/event/62991215d8663334273444e0")

export const getCustomerName = async (customerId:string) => {
    const customerEndpoint = `https://api.kustomerapp.com/v1/customers/${customerId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const response = (await fetch(customerEndpoint, requestOptions).then(response => response.json())).data;
        return (response.attributes.name)
}

export const getCustomerEmail = async (customerId:string) => {
    const customerEndpoint = `https://api.kustomerapp.com/v1/customers/${customerId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const response = (await fetch(customerEndpoint, requestOptions).then(response => response.json())).data;
        return(response.attributes.emails[0].email)
}

const getCustomerPhoneNumber = async (customerId:string) => {
    const customerEndpoint = `https://api.kustomerapp.com/v1/customers/${customerId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const response = (await fetch(customerEndpoint, requestOptions).then(response => response.json())).data;
        return(response.attributes.phones[0].phone)
}

const getCustomerIcon = async (customerId:string) => {
    const customerEndpoint = `https://api.kustomerapp.com/v1/customers/${customerId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const icon = (await fetch(customerEndpoint, requestOptions).then(response => response.json())).data.attributes.avatarUrl;
    return(icon)
}

export const getBrand = async (brandId:string) => {
    const brandEndpoint = `https://api.kustomerapp.com/v1/brands/${brandId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const brand = (await fetch(brandEndpoint, requestOptions).then(response => response.json())).data.attributes.name;
    return(brand)
}

const getAssignedUserName = async (userId:string) => {
    const userEndpoint = `https://api.kustomerapp.com/v1/users/${userId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const userName = (await fetch(userEndpoint, requestOptions).then(response => response.json())).data.attributes.name;
    return(userName)
}

// getAssignedUserName("633de0c077c9445cb20d881a");

const getAssignedUserEmail = async (userId:string) => {
    const userEndpoint = `https://api.kustomerapp.com/v1/users/${userId}`
    const myHeaders = {
        "Content-Type": "application/json",
        "Authorization": `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYzZjY3YjE1OGI0NzhkN2U3NDM2NTBiZCIsInVzZXIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIiLCJvcmciOiI2Mjk5MTIwOGU5ZjE3MTM1NzkxOTQ2MjYiLCJvcmdOYW1lIjoicGFyLXlleHQtYmVybmhhcmQiLCJ1c2VyVHlwZSI6Im1hY2hpbmUiLCJwb2QiOiJwcm9kMSIsInJvbGVzIjpbIm9yZy5wZXJtaXNzaW9uIl0sImF1ZCI6InVybjpjb25zdW1lciIsImlzcyI6InVybjphcGkiLCJzdWIiOiI2M2Y2N2IxNTQ4N2I3ZmM1MDhjMzkyMGIifQ.IVdx8P7u-01Yz_JGGX6gSioNQGfSoZRz_uzqPSHr5Xw`,
    }
    const requestOptions = {
        method: "GET",
        headers: myHeaders
    };

    const userEmail = (await fetch(userEndpoint, requestOptions).then(response => response.json())).data.attributes.email;
    return(userEmail)
}