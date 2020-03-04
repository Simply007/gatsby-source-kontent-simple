import axios from "axios";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName: string = 'x-continuation';

const loadAllKontentItems = async (projectId: string, language: string) => {
  let continuationToken: string = "";
  let items = [];
  do {
    const headers = {
      [continuationHeaderName]: continuationToken
    };
    const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`, {
      headers
    });
    items.push(...response.data.items);
    continuationToken = response.headers[continuationHeaderName];
  } while (continuationToken);
  return items;
}

const loadAllKontentTypes = async (projectId: string) => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/types`);
  return response.data.types;
}

export {
  loadAllKontentItems,
  loadAllKontentTypes,
}