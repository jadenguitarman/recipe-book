import React, {Fragment, Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Error from 'next/error'
import format from 'date-fns/format'
import TakeShape from '../../providers/takeshape'
import HtmlContent from '../../components/content'
import baseTheme from '../../base.module.css'
import theme from './recipe.module.css'
let unified = require('unified')
let remarkMarkdown = require('remark-parse')
let remarkReact = require('remark-react')

export const recipeQuery = (slug) => `
	query {
	  recipes: getRecipeList(filter: {term: {slug: "${slug}"}}) {
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

export const recipeSlugsQuery = `
  query {
    recipes: getRecipeList(sort: [{field: "_enabledAt", order: "desc"}]) {
      items {
        slug
      }
    }
  }
`

const RecipePage = ({data}) => {
  if (!data || data.errors) {
    return <Error statusCode={500} />
  } else if (data.recipes.total < 1) {
    return <Error statusCode={404} />
  }
  const {
    _enabledAt,
	author,
	blogPost,
	cookTime,
	deck,
	featureImage,
	prepTime,
	recipe,
	slug,
	tags,
	title
  } = data.recipes.items[0];
  const date = new Date(_enabledAt)
  const bodyHTML = `<div>HELLO WORLD</div>`;


  let blogPostHTML = unified()
	.use(remarkMarkdown)
	.use(remarkReact)
	.processSync(blogPost, err => {
	  if (err) throw err
	  return "<p>md didn't parse</p>"
	})

  let recipeHTML = unified()
  	.use(remarkMarkdown)
  	.use(remarkReact)
  	.processSync(blogPost, err => {
  	  if (err) throw err
  	  return "<p>md didn't parse</p>"
  	})

  return (
    <Fragment>
      <Head>
        <title key="title">{title} | The New Dynamic Recipe Book</title>
        <meta key="description" name="description" content={deck} />
      </Head>
      <header className={theme.recipeHeader}>
        <div className={baseTheme.container}>
          <div className={theme.recipeHeaderContent}>
            <h2>{title}</h2>
            <p><Link href="/author/[slug]" as={`/author/${author.slug}`}><a>By {author.name}</a></Link></p>
            <p>{format(date, 'MMMM d, yyyy')}</p>
            {tags.length &&
              <p>Tags: {tags.map(t => t.name).join(', ')}</p>
            }
          </div>
        </div>
      </header>
	  <div className={theme.content}>
	  	<div className={theme.blogPost}>{blogPostHTML}</div>

		<div className={theme.recipe}>
			<div className={theme.recipeRow}>
				<span className={theme.recipeRowTitle}>{title}</span>
				<span className={theme.recipeRowCookTime}>Cooks for {cookTime} minutes</span>
				<span className={theme.recipeRowPrepTime}>Preps for {prepTime} minutes</span>
			</div>
			<div className={theme.recipeContent}>{recipeHTML}</div>
		</div>
      </div>
    </Fragment>
  )
}

export async function getStaticProps({ params }) {
  try {
    const {slug} = params
    const res = await TakeShape.graphql({query: recipeQuery(slug)})
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

export async function getStaticPaths() {
  try {
    const res = await TakeShape.graphql({query: recipeSlugsQuery})
    const json = await res.json()
    if (json.errors) throw json.errors
    const data = json.data
    const recipes = data.recipes.items

	return {
		paths: recipes.map(recipe => ({params: {slug: recipe.slug}})),
		fallback: false
	};
  } catch (error) {
    console.error(error)
    return error
  }
}

export default RecipePage
