# Simple Gatsby source plugin for Kentico Kontent

## Description

(Unofficial) Simple source plugin for Kentico Kontent REST Delivery API.

> Include a summary of what this plugin accomplishes. Is there a demo site that shows how this plugin operates? If so, include a link to the deployed demo site and/or its source code here.
> Themes are considered plugins in the Gatsby ecosystem and should follow this README as well. Note that themes include multiple READMEs. One inside the theme directory with configuration instructions, one inside the example project directory, and one in the root of the repository which will follow this guide.

### Dependencies (optional)

> Are there any plugins that must be installed in order to make this plugin work? If so, please include a list of those plugins and links to their pages here.

### Learning Resources (optional)

> If there are other tutorials, docs, and learning resources that are necessary or helpful to someone using this plugin, please link to those here.

### Delivery API alternations

Some of the data from Kontent Delivery API requires to be altered, or extended in order to be usable in Gatsby. There is a list of them with its description.

#### Preferred language

Besides of `system.language` every Kontent item node contains the property `preferred_language` to distinguish which language version it represents. Using this property, it is the easy to distinguish whether the language fallback is used. When `preferred_language` is not the same as `system.language`, Kontent item was not translated to `preferred_language` and the delivery API returned fallback language (`system.language`).

#### Linked items as links

Each linked items element in **linked items element** as well as in **rich text element** is using [Gatsby GraphQL node references](https://www.gatsbyjs.org/docs/create-source-plugin/#creating-the-relationship) that can be used to traverse to the nodes linked through the use of the *Linked items* element.

Linked Items element

  ```gql
  query PersonQuery {
    allSimpleKontentItemPerson {
      nodes {
        elements {
          friends {
            value {
              ... on simple_kontent_item_person {
                id
                elements {
                  name_and_surname {
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  ```

Rich text element

  ```gql
  query PersonQuery {
    allSimpleKontentItemPerson {
      nodes {
        elements {
          bio {
            modular_content { // inline linked items as well as content components
              ... on simple_kontent_item_website {
                id
                elements {
                  name {
                    value
                  }
                  url {
                    value
                  }
                }
              }
            }
            value
          }
        }
      }
    }
  }
  ```

#### Rich text images and links

Kontent REST API return images and links for Rich Text element in form of object, not as array:

```json
{
  "bio": {
    "type": "rich_text",
    "name": "Bio",
    "images": {
      "fcf07d43-46d4-46ef-a58d-c7bf7a4aecb1": {
        "image_id": "fcf07d43-46d4-46ef-a58d-c7bf7a4aecb1",
        "description": null,
        "url": "https://assets-us-01.kc-usercontent.com:443/09fc0115-dd4d-00c7-5bd9-5f73836aee81/0faa87b4-9e1e-41b8-8b38-c107cbb35147/2.jpg",
        "width": 1600,
        "height": 1065
      },
    },
    "links": {
      "59002186-1886-48f3-b8ba-6f053b5cf777": {
        "codename": "developer_community_site",
        "type": "website",
        "url_slug": ""
      }
    },
    "modular_content": [],
    "value": "..."
  }
}
```

This wrapper transforms these objects to the the arrays. In case ofe image the ID of an image is already stored there, in case of link, the id of a link is moved to `linked_id` property. The query then looks like:

```gql
query PersonQuery {
  allSimpleKontentItemPerson {
    nodes {
      elements {
        bio {
          images { # Object transformed to array
            image_id
            url
            description
            height
            width
          }
          links { # Object transformed to array
            codename
            type
            url_slug
            link_id # Newly generated property
          }
        }
      }
    }
  }
}
```

## How to install

> Please include installation instructions here.
> Gatsby documentation uses `npm` for installation. This is the recommended approach for plugins as well.
> If the plugin is a theme that needs to use `yarn`, please point to [the documentation for switching package managers](/docs/gatsby-cli/#how-to-change-your-default-package-manager-for-your-next-project) in addition to the `yarn`-based instructions.

## Available options (if any)

## When do I use this plugin

> Include stories about when this plugin is helpful and/or necessary.

## Examples of usage

> This usually shows a code example showing how to include this plugin in a site's `config.js` file.

    code example

> See this [Markdown Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet#code) on how to format code examples.
> This section could also include before-and-after examples of data when the plugin is enabled, if applicable.

## How to query for data (source plugins only)

> If this is a source plugin README, source plugins ought to allow people to query for data within their Gatsby site. Please include code examples to show how to query for data using your source plugin.
> If this is a theme that requires data in a specific format in order to match an existing query, include those examples here.

## How to run tests

## How to develop locally

## How to contribute

> If you have unanswered questions, would like help with enhancing or debugging the plugin, it is nice to include instructions for people who want to contribute to your plugin.

- _written according to [Gatsby plugin template](https://www.gatsbyjs.org/contributing/docs-templates/#plugin-readme-template)_
