import axios from "axios";
import { KontentItem, KontentType } from "./types";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName = 'x-continuation';

const loadAllKontentItems = async (projectId: string, language: string): Promise<KontentItem[]> => {
  let continuationToken = "";
  const items = [];
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

const loadAllKontentTypes = async (projectId: string): Promise<KontentType[]> => {
  const response = await axios.get(`${KontentDeliveryProductionDomain}/${projectId}/types`);
  return response.data.types;
}

export {
  loadAllKontentItems,
  loadAllKontentTypes,
}