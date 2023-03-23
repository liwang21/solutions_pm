const accessToken = 'Mz/uK8oiMGfXomclzGB4GHY4x0ocPsebjSYxNk5Sk00Dlt6J+4D/n8Q7gk8e2gYL223abr/Cgsc23gNh04vc6MkILCcpktXcEmLBC24rqu4zpBgE25lXQGp6eUTj3XAeQPRKl1pxCAQDKwXs9r9Jix2zOAAXcKwm4+QoIU8xASk='

const requestOptions = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    }
}

export const extractPhotoUrls = async(folderId:string) => {
    const folderEndpoint = `https://www.googleapis.com/drive/v3/files?q=%22${folderId}%22+in+parents&fields=files(*)`
    const images = (await fetch(folderEndpoint, requestOptions).then(response => response.json())).files;
    let urlList = ""
    for (var image in images) {
        urlList += images[image].thumbnailLink + ","
    }
    console.log(urlList)
    return(urlList)
}
extractPhotoUrls('1gx4BS20rchBJguSsj_6R74JuW7a7JYij')