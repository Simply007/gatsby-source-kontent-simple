import { PluginOptions, CreateSchemaCustomizationArgs } from "gatsby";

/**
 * The plugin options.
 */
interface CustomPluginOptions extends PluginOptions {
  projectId: string;
  languageCodenames: string[];
};

interface CustomCreateSchemaCustomizationArgs extends CreateSchemaCustomizationArgs {
  schema: any;
}

interface PluginNamingConfiguration {
  prefix: string,
}