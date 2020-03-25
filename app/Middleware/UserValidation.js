'use strict'
/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

const mongo = require('../Mongo/Model');
// const crypto = require('crypto');

class UserValidation {
    /**
     * @param {object} ctx
     * @param {Request} ctx.request
     * @param {Function} next
     */
    async handle({request, response}, next) {
        // call next to advance the request
        let token =  request.request.headers.authorization.split(' ');
        let n  = await mongo.User.findOne({session: token})
        if (!n) {
            return response.unauthorized();
        }
        await next()
    }
}

module.exports = UserValidation
