import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Forum from 'App/Models/Forum'

export default class ForumsController {
  public async index() {
    const forums = await Forum.query().preload('user').preload('posts')
    return forums
  }
  public async show({ params }: HttpContextContract) {
    try {
      const forum = await Forum.find(params.id)
      if (forum) {
        await forum.preload('user')
        await forum.preload('posts')
        return forum
      }
    } catch (error) {
      console.log(error)
    }
  }
  public async update({ request, params }: HttpContextContract) {
    const forum = await Forum.find(params.id)

    if (forum) {
      forum.title = request.input('title')
      forum.description = request.input('description')
      if (await forum.save()) {
        await forum.preload('user')
        await forum.preload('posts')
        return forum
      }
      return
    }

    return
  }
  public async store({ auth, request }: HttpContextContract) {
    const user = await auth.authenticate()
    const forum = new Forum()
    forum.title = request.input('title')
    forum.description = request.input('description')
    await user.related('forums').save(forum)
    return forum
  }
  public async destroy({ auth, params, response }: HttpContextContract) {
    const user = await auth.authenticate()
    await Forum.query().where('user_id', user.id).where('id', params.id).delete()
    return response.redirect('/dashboard')
  }
}
