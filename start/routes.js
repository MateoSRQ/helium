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

Route.post('api/registro', 'ApiController.registro');
Route.post('api/packed/registro', 'ApiController.packed_registro');

Route.post('api/login', 'ApiController.login');
Route.post('api/checkin', 'ApiController.checkin');

//Route.get('api/users', 'ApiController.users').middleware(['session']);
Route.get('api/users', 'ApiController.users');
Route.get('api/packed/users', 'ApiController.packed_users');
//Route.post('api/sede', 'ApiController.save_sede');
//Route.post('api/packed/sede', 'ApiController.packed_save_sede');
Route.get('api/user/:id', 'ApiController.user');
Route.get('api/packed/user/:id', 'ApiController.packed_user');
Route.post('api/user', 'ApiController.save_user');
Route.post('api/packed/user', 'ApiController.packed_save_user');
