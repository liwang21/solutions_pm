const accessToken = 'ya29.a0Ael9sCORiQxhDE5IABe733ZjTWbCd4m4b5-fkGOSzqFUqeZbsZx_mPWbMJ82yBoMzgmYBCPRSOrXETBSy14fd4iwHzD0GrisIhFIZP9n-qIbeo18DaqKxLZdx_PeCuSgAZU68B0e4BuyZwUZFRB9a9baGVDDn4_laCgYKAQ8SARMSFQF4udJhvcSxn07BwUEhSSpxObCXGw0167'

const requestOptions = {
    method: 'GET',
    headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`
    }
}

export const getPhotoGallery = async(entityId:string) => {
    const params = new URLSearchParams({
        v: '20230403',
        api_key: 'fb8d6cb398dd15f218fc0c1c5d0bc1c1'
    })
    const endpoint = `https://api.yextapis.com/v2/accounts/3829319/entities/${entityId}?${params.toString()}`
    const requestOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    }
    const photoGallery = (await fetch(endpoint, requestOptions).then(response => response.json())).response.photoGallery;
    let photoGalleryList = '';
    for (var i in photoGallery) {
        photoGalleryList += photoGallery[0].image.url + ','
        console.log('Add '+ i+' url to photo gallery list')
    }
    console.log(photoGalleryList)
    return(photoGalleryList)
}

getPhotoGallery('Test-1')

export const extractPhotoUrls = async(folderId:string) => {
    const folderEndpoint = `https://www.googleapis.com/drive/v3/files?q=%22${folderId}%22+in+parents&fields=files(*)`
    const images = (await fetch(folderEndpoint, requestOptions).then(response => response.json())).files;
    let urlList = '';
    for (var i in images) {
        urlList += images[i].thumbnailLink + ","
    }
    console.log(urlList)
    return(urlList)
}

//extractPhotoUrls('1mJugy7x9POwcqXLsU6G-Vdt75MLuvM4M')