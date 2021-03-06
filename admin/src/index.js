import pluginPkg from "../../package.json";
import pluginId from "./pluginId";
import App from "./containers/App";
import Initializer from "./containers/Initializer";
import lifecycles from "./lifecycles";
import trads from "./translations";

export default (strapi) => {
  const icon = pluginPkg.strapi.icon;
  const name = pluginPkg.strapi.name;
  const pluginDescription =
    pluginPkg.strapi.description || pluginPkg.description;

  const plugin = {
    blockerComponent: null,
    blockerComponentProps: {},
    description: pluginDescription,
    icon: pluginPkg.strapi.icon,
    id: pluginId,
    initializer: Initializer,
    injectedComponents: [],
    isReady: false,
    isRequired: pluginPkg.strapi.required || false,
    layout: null,
    lifecycles,
    leftMenuLinks: [],
    leftMenuSections: [],
    mainComponent: App,
    name: pluginPkg.strapi.name,
    preventComponentRendering: false,
    trads,
    icon,
    menu: {
      // Set a link into the PLUGINS section
      pluginsSectionLinks: [
        {
          destination: `/plugins/${pluginId}`, // Endpoint of the link
          icon,
          name,
          label: {
            id: `${pluginId}.plugin.name`, // Refers to a i18n
            defaultMessage: "export",
          },
        },
      ],
    },
  };

  return strapi.registerPlugin(plugin);
};
