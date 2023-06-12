import { type Request, type Response } from 'express';
import axios from 'axios';
import { load } from 'cheerio';

interface Ingredient {
  name: string;
  quantity: string;
  unit: string;
}

// Works for AllRecipes ...(Add more when available)...
export const getWebIngredients = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    // Fetch the website and parse
    const response = await axios.get(req.body.webLink);
    const html = response.data;
    const $ = load(html);

    // Find the necessary ingredients data
    const ingredientList: Ingredient[] = [];
    $('.mntl-structured-ingredients__list')
      .find('li')
      .each((index, element) => {
        const listItem: Ingredient = {
          name: 'N/A',
          quantity: 'N/A',
          unit: 'N/A',
        };

        const listItemText = $(element)
          .text()
          .replace('\n', '')
          .trim()
          .split(',')[0];
        const listItemTextSplit = listItemText.split(' ');

        // Consider unfortunate variations in AllRecipe's website data
        let listItemQuantity = '';
        let listItemUnit = '';
        let listItemIngredient = '';

        if (listItemTextSplit[1][0] === '(') {
          listItemQuantity = listItemTextSplit[1].replace('(', '');
          listItemUnit = listItemTextSplit[2].replace(')', '');
          listItemIngredient = listItemText.slice(
            listItemTextSplit[0].length +
              listItemTextSplit[1].length +
              listItemTextSplit[2].length +
              listItemTextSplit[3].length +
              4,
          );
        } else {
          listItemQuantity = listItemTextSplit[0];
          listItemUnit = listItemTextSplit[1];
          listItemIngredient = listItemText.slice(
            listItemTextSplit[0].length + listItemTextSplit[1].length + 2,
          );
        }

        listItem.name = listItemIngredient;
        listItem.quantity = listItemQuantity;
        listItem.unit = listItemUnit;

        ingredientList.push(listItem);
      });

    // Find the necessary nutrition data
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
  } catch (error: any) {
    console.error('Error:', error.message);
    res.send(error.message);
  }
};
