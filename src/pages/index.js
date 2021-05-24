import React from 'react'
import Error from 'next/error'
import Link from 'next/link'
import cx from 'classnames'
import fetch from 'isomorphic-fetch'
import TakeShape from '../providers/takeshape'
import RecipeList from '../components/recipe-list'
import baseTheme from '../base.module.css';
import theme from './homepage.module.css';

const HomePage = (props) => {
	const {hero, recipes} = props
	if (!hero || !recipes) {
		/* We return Next's built in Error handler in lieu of
		developing a custom component ourselves. */
		return <Error statusCode="500" />
	}
	const heroImageOptions = {
		w: 1000,
		fit: 'crop'
	}
	const heroImageSrc = TakeShape.getImageUrl(hero.image.path, heroImageOptions)
  return (
    <React.Fragment>
      <div className={theme.hero} style={{backgroundImage: `url(${heroImageSrc})`}}>
        <div className={cx(theme.heroContainer, baseTheme.container)}>
          {hero.featuredRecipe &&
          <div className={theme.feature}>
            <Link href="/recipes/[slug]" as={`/recipes/${hero.featuredRecipe.slug}`}>
            	<a>
	              <p>Featured Recipe</p>

	              <h2>{hero.featuredRecipe.title}</h2>
	              <p>by {hero.featuredRecipe.author.name}</p>
              </a>
            </Link>
          </div>
          }
        </div>
      </div>

      <section>
        <header className={baseTheme.header}>
          <h2>Recent Recipes</h2>
        </header>

        <RecipeList recipes={recipes}/>

        <div className={baseTheme.buttonContainer}>
          <Link href="/recipes">
          	<a className={baseTheme.button}>
          		View all recipes
          	</a>
          </Link>
        </div>
      </section>
    </React.Fragment>
  )
}

export const homePageQuery = `
	query {
	  page: getHomepage {
	    title
	    hero {
	      image {
	        path
	      }
	      featuredRecipe {
	      	_id
	        title
	        slug
	        author {
	          name
	          slug
	        }
	      }
	    }
	  }
	  recipes: getRecipeList {
	    total
	    items {
	    	_id
	      title
	      slug
	      _enabledAt
	      deck
	      featureImage {
	        path
	      }
	    }
	  }
	}
`

export async function getStaticProps() {
	try {
		const res = await TakeShape.graphql({query: homePageQuery})
		const json = await res.json()
		if (json.errors) throw json.errors
		const data = json.data
		return {
			props: {
				hero: data.page.hero,
  			recipes: data.recipes.items.slice(0, 3)
  		}
		}
	} catch (error) {
		console.error(error)
		return error
	}
}

export default HomePage
