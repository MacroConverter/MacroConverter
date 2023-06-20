import { type Request, type Response } from 'express';
import axios from 'axios';
import { load } from 'cheerio';

import { Ingredient } from '../models/ingredientModel';

/**
 * WebScraper contains the functions used by the web scraper controller to recieve a link,
 * parse it correctly, and return the data obtained from the scraping.
 *
 * The structure of the class is Shared functions followed by Web Specific functions.
 */
class WebScraper {
  static UNITS = new Set([
    'teaspoon',
    'tsp',
    'tablespoon',
    'tbsp',
    'cup',
    'pint',
    'pt',
    'quart',
    'qt',
    'gallon',
    'gal',
    'ounce',
    'oz',
    'pound',
    'lb',
    'gram',
    'g',
    'kilogram',
    'kg',
    'milliliter',
    'ml',
    'liter',
    'l',
    'dash',
    'pinch',
    'clove',
    'stalk',
    'can',
  ]);

  /**
   * Given a unit, turn it to lower case and in its singular form.
   * @param {string} word - A string representing a unit (can assume isUnit returns true on it).
   * @returns {string} - A string that is `word` in lower case and singular.
   */
  retUnit(word: string): string {
    const lower = word.toLowerCase();

    if (lower.endsWith('s')) {
      return lower.slice(0, -1);
    }

    return lower;
  }

  /**
   * Return true if the singular version of `word` is in the UNITS dictionary, else return false.
   * @param {string} word - A string.
   * @returns {boolean} - True if the singular version of `word` found in dictionary, else false.
   */
  isUnit(word: string): boolean {
    const lower = word.toLowerCase();

    if (lower.endsWith('s')) {
      return WebScraper.UNITS.has(lower.slice(0, -1));
    }

    return WebScraper.UNITS.has(lower);
  }

  /**
   * Remove text between parentheses in the given string.
   * @param {string} input - A string.
   * @returns {string} - `input` without text in parentheses.
   */
  removeTextInBrackets(input: string): string {
    return input.replace(/\([^)]*\)/g, '').trim();
  }

  /**
   * Given a guaranteed single value that can be any of the following formats:
   *    - written fraction (ie: 1/2)
   *    - unicode vulgar fraction (ie: ½)
   *    - regular numbers (ie: 1 or 12 ...)
   * Return it in its corresponding type number. Return -1 on error.
   * @param {string} single - A string of anything.
   * @returns {number} - Return the numerical value of `single`, if not possible return -1.
   */
  convertSingleToNumber(single: string): number {
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
    }
    return parseFloat(single);
  }

  /**
   * Convert the given multivalue string (max two values) into its corresponding numerical value.
   * The function takes care of a mix of types connected by a single space.
   * Here are the possible types:
   *    - written fraction (ie: 1/2)
   *    - unicode vulgar fraction (ie: ½)
   *    - regular numbers (ie: 1 or 12 ...)
   * @param {string} line - A string that has at most two types.
   * @returns {number} - Return the numerical value or throw an error if a value is invalid.
   */
  convertLineToNumber(line: string): number {
    const valSplit = line.split(' ');

    if (valSplit.length === 1) {
      const val = this.convertSingleToNumber(valSplit[0]);
      if (val === -1) {
        throw new Error(`Invalid number string sent: ${line}`);
      }
      return val;
    } else if (valSplit.length === 2) {
      const val1 = this.convertSingleToNumber(valSplit[0]);
      const val2 = this.convertSingleToNumber(valSplit[1]);
      if (val1 === -1 || val2 === -1) {
        throw new Error(`Invalid number strings sent: ${line}`);
      }
      return val1 + val2;
    }
    throw new Error(`Unexpected value length: ${valSplit.length}`);
  }

  /**
   * AllRecipe SPECIFIC!!!
   * Extract necessary data given a line from the list of ingredients in an AllRecipe web page.
   * @param {string} line - A line part of the ingredient list.
   * @returns {[string, number, string]} - Return the data extracted: [ingredient, quantity, unit].
   */
  parseAllRecipeIngredientLine(line: string): [string, number, string] {
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
          listItemQuantity = this.convertLineToNumber(
            lineSplit[1].replace('(', ''),
          );
        } else {
          lineSplit[1] = `${lineSplit[1]} ${lineSplit[2]}`;
          listItemQuantity = this.convertLineToNumber(
            lineSplit[1].replace('(', ''),
          );
          lineSplit.splice(2, 1);
        }
      } catch (error) {
        listItemQuantity = -1;
      }

      let unitCheck = lineSplit[2].replace(')', '');
      if (this.isUnit(unitCheck)) {
        listItemUnit = this.retUnit(unitCheck);
      } else {
        unitCheck = lineSplit[3].replace(')', '');
        listItemUnit = 'N/A';
      }

      listItemIngredient = line.slice(
        lineSplit[0].length + lineSplit[1].length + lineSplit[2].length + 3,
      );
    } else {
      try {
        listItemQuantity = this.convertLineToNumber(lineSplit[0]);
      } catch (error) {
        listItemQuantity = -1;
        lineSplit.unshift('');
      }

      const unitCheck = lineSplit[1];
      if (this.isUnit(unitCheck)) {
        listItemUnit = this.retUnit(unitCheck);
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

    listItemIngredient = this.removeTextInBrackets(listItemIngredient);

    return [listItemIngredient, listItemQuantity, listItemUnit];
  }

  /**
   * AllRecipe SPECIFIC!!!
   * Extract necessary data given an AllRecipe recipe web page.
   * @param {string} webLink - An web link (https://).
   * @param {Response} res - A Response object to get data back to API caller.
   */
  async getAllRecipeWebIngredients(
    webLink: string,
    res: Response,
  ): Promise<void> {
    // Fetch the website and parse
    const response = await axios.get(webLink);
    const html = response.data;
    const $ = load(html);

    // Find the necessary ingredients data.
    const ingredientList: Ingredient[] = [];
    $('.mntl-structured-ingredients__list')
      .find('li')
      .each((index, element) => {
        const lineData = new Ingredient('N/A', 0, 'N/A');

        const listItemText = $(element).text().replace('\n', '').trim();

        const [lii, liq, liu] = this.parseAllRecipeIngredientLine(listItemText);

        lineData.setName(lii);
        lineData.setQuantity(liq);
        lineData.setUnit(liu);

        ingredientList.push(lineData);
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
      ingredient_list: ingredientList.map((ingredient) => ingredient.toJSON()),
      nutrition_facts: nutritionDict,
    });
  }
}

/**
 * The main function caller present in the route. Acts as a "wrapper".
 * Works for AllRecipes ...(Add more when available)...
 * @param {Request} req - Request object to get the data sent by API caller.
 * @param {Response} res - A Response object to get data back to API caller.
 */
export const getWebIngredientsWrapper = (req: Request, res: Response): void => {
  // Have to load the WebScraper class.
  const scraper = new WebScraper();

  scraper.getAllRecipeWebIngredients(req.body.webLink, res).catch((error) => {
    res.send(error.message);
  });
};
