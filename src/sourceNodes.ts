import { SourceNodesArgs } from "gatsby";
import { CustomPluginOptions } from "./types";
import {loadAllKontentItems} from "./client";
import { getKontentItemNodeStringForId, getKontentItemNodeTypeName } from "./naming";

const sourceNodes = async (api: SourceNodesArgs, options: CustomPluginOptions) => {
  for (const language of options.languageCodenames) {
    const kontentItems = await loadKontentItemsFromLanguage(options.projectId, language);
    addPreferredLanguageProperty(kontentItems, language);
    for (const kontentItem of kontentItems) {
      const nodeData = getKontentItemLanguageVariantArtifact(api, kontentItem);
      api.actions.createNode(nodeData);
    }
  }
};

const loadKontentItemsFromLanguage = async (projectId: string, language: string) =>
 await loadAllKontentItems(projectId, language);

const addPreferredLanguageProperty = (items: any[], language: string) => {
  for (const item of items) {
    item.preferred_language = language;
  }
  return items;
}


const getKontentItemLanguageVariantArtifact = (api: SourceNodesArgs, kontentItem: any) => {
  const nodeIdString = getKontentItemNodeStringForId(kontentItem.system.id, kontentItem.preferred_language);
  const nodeContent = JSON.stringify(kontentItem)
  const nodeData = Object.assign({}, kontentItem, {
    id: api.createNodeId(nodeIdString),
    parent: null,
    children: [],
    internal: {
      type: getKontentItemNodeTypeName(kontentItem.system.type),
      content: nodeContent,
      contentDigest: api.createContentDigest(kontentItem),
    },
  })
  return nodeData;
};

export {
  sourceNodes
};
