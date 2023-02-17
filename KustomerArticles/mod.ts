//declare domain variable which is hardcoded right now
declare const domain: string;

//Appends the KB domain to the source and hash ID URL path to generate the full URL
export function createKustomerUrl(urlPath:string) {
    const url = `${domain}` + urlPath;
    return url
}