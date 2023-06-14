import { type Request, type Response } from 'express';
import axios from 'axios';
import { load } from 'cheerio';

const UNITS = new Set([
  'teaspoon',
  'tablespoon',
  'cup',
  'ounce',
  'pound',
  'gram',
  'kilogram',
  'milliliter',
  'liter',
  'clove',
  'stalk',
  'can',
]);

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
}

// Given a certified unit string, turn it into lower and without an 's' at the end if it has one.
function retUnit(word: string): string {
  const lower = word.toLowerCase();

  if (lower.endsWith('s')) {
    return lower.slice(0, -1);
  }

  return lower;
}

// Make sure that the given string is a unit from the UNITS dictionary.
function isUnit(word: string): boolean {
  const lower = word.toLowerCase();

  if (lower.endsWith('s')) {
    return UNITS.has(lower.slice(0, -1));
  }

  return UNITS.has(lower);
}

// Remove any text between brackets in the given string.
function removeTextInBrackets(input: string): string {
  return input.replace(/\([^)]*\)/g, '').trim();
}

// Given a guaranteed single value that can be any of the following formats:
//  - written fraction (ie: 1/2)
//  - unicode vulgar fraction (ie: ½)
//  - regular numbers (ie: 1 or 12 ...)
// Return it in its corresponding type number. Return -1 on error.
function convertSingleToNumber(single: string): number {
  if (isNaN(Number(single))) {
    if (single.includes('/')) {
      const splitFrac = single.split('/');
      const num = Number(splitFrac[0]);
      const den = Number(splitFrac[1]);
      if (splitFrac.length === 2 && !isNaN(num) && !isNaN(den)) {
        return num / den;
      }
    } else if (single.length === 1) {
      const norm = single.normalize('NFKD');
      if (norm.length !== 1) {
        const normValSplit = norm.split('\u2044');
        if (normValSplit.length === 2) {
          const num = parseFloat(normValSplit[0]);
          const den = parseFloat(normValSplit[1]);
          return num / den;
        }
      }
    }
    return -1;
  } else {
    return parseFloat(single);
  }
}

// Convert the given string line into its corresponding type number.
// The function takes care of unicode vulgar fraction instances and typed out fractions too.
function convertLineToNumber(line: string): number {
  const valSplit = line.split(' ');

  if (valSplit.length === 1) {
    const val = convertSingleToNumber(valSplit[0]);
    if (val === -1) {
      throw new Error(`Invalid number string sent: ${line}`);
    }
    return val;
  } else if (valSplit.length === 2) {
    const val1 = convertSingleToNumber(valSplit[0]);
    const val2 = convertSingleToNumber(valSplit[1]);
    if (val1 === -1 || val2 === -1) {
      throw new Error(`Invalid number strings sent: ${line}`);
    } else {
      return val1 + val2;
    }
  } else {
    throw new Error(`Unexpected value length: ${valSplit.length}`);
  }
}

// Given an ingredient line from the list of ingredients in AllRecipe's web page, extract the data.
const parseIngredientLine = (line: string): [string, number, string] => {
  const lineSplit = line.split(' ');
  if (lineSplit[1].length === 1) {
    lineSplit[0] = `${lineSplit[0]} ${lineSplit[1]}`;
    lineSplit.splice(1, 1);
  }

  let listItemIngredient = '';
  let listItemQuantity = 0;
  let listItemUnit = '';

  if (lineSplit[1][0] === '(') {
    try {
      if (lineSplit[2].endsWith(')')) {
        listItemQuantity = convertLineToNumber(lineSplit[1].replace('(', ''));
      } else {
        lineSplit[1] = `${lineSplit[1]} ${lineSplit[2]}`;
        listItemQuantity = convertLineToNumber(lineSplit[1].replace('(', ''));
        lineSplit.splice(2, 1);
      }
    } catch (error) {
      listItemQuantity = -1;
    }

    let unitCheck = lineSplit[2].replace(')', '');
    if (isUnit(unitCheck)) {
      listItemUnit = retUnit(unitCheck);
    } else {
      unitCheck = lineSplit[3].replace(')', '');
      listItemUnit = 'N/A';
    }

    listItemIngredient = line.slice(
      lineSplit[0].length + lineSplit[1].length + lineSplit[2].length + 3,
    );
  } else {
    try {
      listItemQuantity = convertLineToNumber(lineSplit[0]);
    } catch (error) {
      listItemQuantity = -1;
      lineSplit.unshift('');
    }

    const unitCheck = lineSplit[1];
    if (isUnit(unitCheck)) {
      listItemUnit = retUnit(unitCheck);
      listItemIngredient = line.slice(
        lineSplit[0].length + lineSplit[1].length + 2,
      );
    } else {
      listItemUnit = 'N/A';
      listItemIngredient = line.slice(
        lineSplit[0].length + 1 + (listItemQuantity === -1 ? -1 : 0),
      );
    }
  }

  listItemIngredient = removeTextInBrackets(listItemIngredient);

  return [listItemIngredient, listItemQuantity, listItemUnit];
};

// Get all the data from a recipe given an AllRecipe web page.
const getWebIngredients = async (
  webLink: string,
  res: Response,
): Promise<void> => {
  // Fetch the website and parse
  const response = await axios.get(webLink);
  const html = response.data;
  const $ = load(html);

  // Find the necessary ingredients data.
  const ingredientList: Ingredient[] = [];
  $('.mntl-structured-ingredients__list')
    .find('li')
    .each((index, element) => {
      const listItem: Ingredient = {
        name: 'N/A',
        quantity: 0,
        unit: 'N/A',
      };

      const listItemText = $(element).text().replace('\n', '').trim();

      const [lii, liq, liu] = parseIngredientLine(listItemText);

      listItem.name = lii;
      listItem.quantity = liq;
      listItem.unit = liu;

      ingredientList.push(listItem);
    });

  // Find the necessary nutrition data.
  const nutritionDict: Record<string, string> = {};
  $('.mntl-nutrition-facts-summary__table-body')
    .find('.mntl-nutrition-facts-summary__table-row')
    .each((index, element) => {
      const children = $(element).children(
        '.mntl-nutrition-facts-summary__table-cell',
      );
      nutritionDict[$(children.get(1)).text()] = $(children.get(0)).text();
    });

  res.send({
    ingredient_list: ingredientList,
    nutrition_facts: nutritionDict,
  });
};

// Works for AllRecipes ...(Add more when available)...
export const getWebIngredientsWrapper = (req: Request, res: Response): void => {
  getWebIngredients(req.body.webLink, res).catch((error) => {
    console.error('Error:', error.message);
    res.send(error.message);
  });
};
