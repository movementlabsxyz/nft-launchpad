import axios, { AxiosHeaders } from 'axios';

const DEFAULT_API_URL = "http://localhost:8080/v1"
export async function createCollectionApi(
  creator_email: string,
  creator_name: string,
  creator_image: string,
  collection_name: string,
  description: string,
  mint_price: string,
  total_supply: string,
  images_cid: string,
  jsons_cid: string,
) {
  try {
    const data = await axios.post(`${process.env.LAUNCHPAD_API_URL ?? DEFAULT_API_URL}/collection/`, {
      creator_email,
      creator_name,
      creator_image,
      collection_name,
      description,
      mint_price,
      total_supply,
      images_cid,
      jsons_cid,
    }, {
      headers: new AxiosHeaders().setContentType('application/x-www-form-urlencoded')
    });
    if (data.status !== 200) {
      console.log("api failed status =", data.status);
      return null;
    }
    console.log("api success data =", data);
    return data.data;
  } catch {
    console.log("axios failed");
    return null;
  }

}

export async function getCollectionsApi(
  creator_email?: string,
) {
  try {
    const data = await axios.get(`${process.env.LAUNCHPAD_API_URL ?? DEFAULT_API_URL}/collection/all`,
    {
      params: {
        creator_email
      }
    });
    if (data.status !== 200) {
      console.log("api failed status =", data.status);
      return null;
    }
    console.log("api success data =", data);
    return data.data;
  } catch {
    console.log("axios failed");
    return null;
  }
}

export type CollectionData = {
  id: number,
  creator_email: string,
  creator_name: string,
  creator_image: string,
  name: string,
  desc: string,
  total_supply: number,
  mint_price: string,
  images_cid: string,
  jsons_cid: string,
  uri: string,
  tx_hash: string
}