import { PluginOptions } from "gatsby";

/**
 * The plugin options.
 */
interface CustomPluginOptions extends PluginOptions {
  projectId: string;
  languageCodenames: string[];
};