import axios from "axios";
import { PINATA_JWT } from "../config";
const JWT = "Bearer " + PINATA_JWT;

export const pinFileToIPFS = async (file: any) => {
  let ipfsCid: any = "";
  try {
    const formData = new FormData();
    //   const src = "path/to/file.png";

    // const file = fs.createReadStream(src);
    formData.append("file", file);

    const metadata = JSON.stringify({
      name: `${0}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    const res = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        maxBodyLength: Number.POSITIVE_INFINITY,
        headers: {
          "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
          Authorization: JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const pinJSONToIPFS = async (jsonObj: any) => {
  let ipfsCid: any = "";
  try {
    let res = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      { ...jsonObj },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: JWT,
        },
      }
    );
    ipfsCid = res.data.IpfsHash;
  } catch (error) {
    ipfsCid = null;
  }
  return ipfsCid;
};

export const UPLOADING_FILE_TYPES = {
  OTHERS: 0,
  JSON: 1,
  IMAGE: 2,
};

export const pinDirectoryToPinata = async (
  filelist: any,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid: any = "";
  try {
    if (filelist?.length <= 0) return null;
    const formData = new FormData();

    Array.from(filelist).forEach((file: any) => {
      formData.append("file", file);
    });

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Number.POSITIVE_INFINITY,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
            Authorization: JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};

export const pinUpdatedJSONDirectoryToPinata = async (
  jsonlist: any,
  type = UPLOADING_FILE_TYPES.IMAGE
) => {
  let ipfsCid: any = "";
  try {
    if (jsonlist?.length <= 0) return null;
    let formData = new FormData();
    for (let idx = 0; idx < jsonlist.length; idx++) {
      formData.append(
        "file",
        new Blob([jsonlist[idx]], { type: "application/json" }),
        `json/${idx}.json`
      );
    }

    const metadata = JSON.stringify({
      name: `${type}_${Date.now()}`,
    });
    formData.append("pinataMetadata", metadata);

    const options = JSON.stringify({
      cidVersion: 0,
    });
    formData.append("pinataOptions", options);

    try {
      const res = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Number.POSITIVE_INFINITY,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
            Authorization: JWT,
          },
        }
      );
      ipfsCid = res.data.IpfsHash;
    } catch (error) {
      ipfsCid = null;
    }
  } catch (error) {
    ipfsCid = null;
  }

  return ipfsCid;
};
