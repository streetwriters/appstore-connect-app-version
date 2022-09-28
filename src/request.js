import fetch from "node-fetch";

export default async function request(appId, jwt, platform) {
  const outputLimit = 2;
  const url = `https://api.appstoreconnect.apple.com/v1/apps/${appId}/appStoreVersions?limit=${outputLimit}&filter[platform]=${platform}`;
  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${jwt}` },
  });
  return await response.json();
}
