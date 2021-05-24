import TakeShape from '../../../providers/takeshape'
import {recipeQuery} from '../../recipes/[slug].js'
import {getTakeShapeData} from '../index'

export default async (req, res) => {
	const { query: { slug } } = req
	return getTakeShapeData(req, res, recipeQuery(slug))
}