import TakeShape from '../../../providers/takeshape'
import {recipeListQuery} from '../../recipes'
import {getTakeShapeData} from '../index'

export default async (req, res) => {
	return getTakeShapeData(req, res, recipeListQuery)
}