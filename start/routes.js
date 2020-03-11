'use strict'

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('api/sedes', 'ApiController.sedes');
Route.get('api/packed/sedes', 'ApiController.packed_sedes');
Route.post('api/sede', 'ApiController.save_sede');
Route.post('api/packed/sede', 'ApiController.packed_save_sede');
Route.get('api/sede/:id', 'ApiController.sede');
Route.get('api/packed/sede/:id', 'ApiController.packed_sede');
Route.get('api/examenes', 'ApiController.examenes');
Route.get('api/packed/examenes', 'ApiController.packed_examenes');
