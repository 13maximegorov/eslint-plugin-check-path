"use strict";

const path = require('path');

module.exports = {
  meta: {
    type: null, // `problem`, `suggestion`, or `layout`
    docs: {
      description: "Check path",
      recommended: false,
      url: null, // URL to the documentation page for this rule
    },
    fixable: null, // Or `code` or `whitespace`
    schema: [], // Add a schema if the rule has options
  },

  create(context) {
    return {
      ImportDeclaration(node) {
        // entities/Article
        const importTo = node.source.value;

        // C:/Users/Maxim/Desktop/project/src/entities/Article
        const fromFilename = context.filename;

        if (shouldBeRelative(fromFilename, importTo)) {
          context.report(node, 'В рамках одного slice все пути должны быть относительными');
        }
      }
    };
  },
};

function isPathRelative(path) {
  return path === '.' || path.startsWith('./') || path.startsWith('../');
}

const layers = {
  'entities': 'entities',
  'features': 'features',
  'shared': 'shared',
  'pages': 'pages',
  'widgets': 'widgets',
}

function shouldBeRelative(from, to) {
  if (isPathRelative(to)) {
    return false
  }

  // entities/Article
  const arrayTo = to.split('/');
  const toLayer = arrayTo[0] // entities
  const toSlice = arrayTo[1] // Article

  if (!toLayer || !toSlice || !layers[toLayer]) {
    return false;
  }

  // C:/Users/Maxim/Desktop/project/src/entities/Article
  const normalizedPath = path.toNamespacedPath(from);
  const projectFrom = normalizedPath.split('src')[1];
  const fromArray = projectFrom.split('\\');

  const fromLayer = fromArray[1];
  const fromSlice = fromArray[2];

  if (!fromLayer || !fromSlice || !layers[fromLayer]) {
    return false;
  }

  return toLayer === fromLayer && toSlice === fromSlice;
}
