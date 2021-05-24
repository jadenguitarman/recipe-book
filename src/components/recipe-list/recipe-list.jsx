import React, {Component, Fragment} from 'react';
import RecipeListItem from './recipe-list-item';
import baseTheme from '../../base.module.css';
import theme from './recipe-list.module.css';

const RecipeList = (props) => {
  const {
    recipes,
  } = props;

  const recipeListItems = recipes.map(recipe => <RecipeListItem key={recipe.title} {...recipe}/>);
  return (
    <Fragment>
      <div className={theme.recipeList}>
        <div className={baseTheme.container}>
          <ul>
            {recipeListItems}
          </ul>
        </div>
      </div>
    </Fragment>
  );
}

export default RecipeList