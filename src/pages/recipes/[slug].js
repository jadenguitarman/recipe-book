import React, {Fragment, Component} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Error from 'next/error'
import format from 'date-fns/format'
import TakeShape from '../../providers/takeshape'
import HtmlContent from '../../components/content'
import baseTheme from '../../base.module.css'
import theme from './recipe.module.css'

export const recipeQuery = (slug) => `
  query {
    recipes: getRecipeList(filter: {term: {slug: "${slug}"}}) {
      total
      items {
        _id
        _contentTypeName
        _enabledAt
        title
        tags {
          name
        }
        deck
        author {
          _id
          name
          slug
        }
        featureImage {
          path
        }
        bodyHtml
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
    title,
    deck,
    tags,
    author,
    bodyHtml
  } = data.recipes.items[0];
  const date = new Date(_enabledAt)
  return (
    <Fragment>
      <Head>
        <title key="title">{title} / Recipes / Shape Blog</title>
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
      <HtmlContent bodyHtml={bodyHtml}/>
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
