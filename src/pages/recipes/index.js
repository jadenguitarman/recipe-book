import React, {Fragment, Component} from 'react'
import Head from 'next/head'
import TakeShape from '../../providers/takeshape'
import RecipeList from '../../components/recipe-list'
import baseTheme from '../../base.module.css'

export const recipeListQuery = `
	query {
	  recipes: getRecipeList {
		  items {
			  _enabledAt
			  author {
				  biography
				  name
				  photo {
					  sourceUrl
				  }
				  slug
			  }
			  blogPost
			  cookTime
			  deck
			  featureImage {
				  sourceUrl
			  }
			  prepTime
			  recipe
			  slug
			  tags {
				  name
			  }
			  title
		  }
	  }
	}
`

const RecipeListPage = (props) => {
  const {
    data,
  } = props;
  return (
    <Fragment>
      <Head>
        <title key="title">Recipes / Shape Blog</title>
        <meta key="description" name="description" content="The Shape Blog recipe archive" />
      </Head>
      <header className={baseTheme.header}>
        <h1>All Recipes</h1>
      </header>
      <RecipeList recipes={data.recipes.items} />
    </Fragment>
  )
}

export async function getStaticProps() {
  try {
    const res = await TakeShape.graphql({query: recipeListQuery})
    const json = await res.json()
    if (json.errors) throw json.errors
    const data = json.data
    return {
      props: {
        data
      }
    }
  } catch (error) {
    console.error(error)
    return error
  }
}

export default RecipeListPage
