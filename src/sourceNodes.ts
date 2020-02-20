import { SourceNodesArgs } from "gatsby";
import { CustomPluginOptions } from "./types";
import axios from "axios";

const KontentDeliveryProductionDomain = "https://deliver.kontent.ai";
const continuationHeaderName: string = 'x-continuation';

const sourceNodes = async (api: SourceNodesArgs, options: CustomPluginOptions) => {
  debugger;
  for (const language of options.languageCodenames) {
    const kontentItems = await loadKontentItemsFromLanguage(options.projectId, language);
    addPreferredLanguageProperty(kontentItems, language);
    for (const kontentItem of kontentItems) {
      const nodeData = getKontentItemLanguageVariantArtifact(api, kontentItem);
      api.actions.createNode(nodeData);
    }
  }
};

const loadKontentItemsFromLanguage = async (projectId: string, language: string) => {
  let continuationToken: string = "";
  let items = [];
  do {
    const headers = {
      [continuationHeaderName]: continuationToken
    }
    const response = await axios.get(
      `${KontentDeliveryProductionDomain}/${projectId}/items-feed?language=${language}`,
      {
        headers
      }
    );
    items.push(...response.data.items);
    continuationToken = response.headers[continuationHeaderName];
  } while (continuationToken);


  return items;
}

const addPreferredLanguageProperty = (items: any[], language: string) => {
  for (const item of items) {
    item.preferred_language = language;
  }
  return items;
}


const getKontentItemLanguageVariantArtifact = (api: SourceNodesArgs, kontentItem: any) => {
  const nodeId = api.createNodeId(`simple-kontent-item-${kontentItem.preferred_language}-${kontentItem.system.id}`)
  const nodeContent = JSON.stringify(kontentItem)
  const nodeData = Object.assign({}, kontentItem, {
    id: nodeId,
    parent: null,
    children: [],
    internal: {
      type: `SimpleKontentItem${convertSnakeCaseToPascalCase(kontentItem.system.type)}`,
      content: nodeContent,
      contentDigest: api.createContentDigest(kontentItem),
    },
  })
  return nodeData;
};

const convertSnakeCaseToPascalCase = (input: string) => input
  .split('_')
  .map((str: string) => str.slice(0, 1).toUpperCase() + str.slice(1, str.length))
  .join('');

export {
  sourceNodes
};