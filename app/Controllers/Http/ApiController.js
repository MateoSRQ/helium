'use strict'
const _ = require('lodash');
const mongoose = require('mongoose');
const crypto = require('crypto');
const jsonpack = require('jsonpack');
const moment = require('moment');
const nanoid = require('nanoid');
const faker  = require('faker');

const {performance, PerformanceObserver} = require('perf_hooks');

const obs = new PerformanceObserver((list) => {
    const entry = list.getEntries()[0]
    console.log(`Time for ('${entry.name}')`, entry.duration);
});
obs.observe({entryTypes: ['measure'], buffered: false});

const mongo = require('../../Mongo/Model');

class ApiController {
    async sedes({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let sedes = await mongo.Sede.find().lean();
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sedes)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_sedes({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let sedes = await mongo.Sede.find().lean();
            sedes = jsonpack.pack(JSON.parse(JSON.stringify(sedes)));
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sedes)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async save_sede({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let data = request.post();
            let model =  new mongo.Sede(data);
            await model.save();
            let sede = await mongo.Sede.findOne({_id: model._id}).lean();
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sede)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_save_sede({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let data = request.post();
            let model =  new mongo.Sede(data);
            await model.save();
            let sede = await mongo.Sede.findOne({_id: model._id}).lean();
            sede = jsonpack.pack(JSON.parse(JSON.stringify(sede)));
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sede)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async sede({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let _id = params.id;
            let sede = await mongo.Sede.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            let nodos = await mongo.Nodo.find(
                {sede_id: sede.id},
                {_id: 1, codigo: 1, grupo_nodo: 1, estado: 1, id: 1 }
            ).lean();

            // temporary
            nodos = nodos.map(nodo => {
                let estado = faker.random.arrayElement(['No iniciado', 'Esperando', 'Procesando', 'Terminado']);
                nodo.estado = estado;
                switch (nodo.estado) {
                    case 'No iniciado':
                        nodo.usuario = ' ';
                        nodo.paciente = ' ';
                        nodo.esperando = 0;
                        nodo.atendidos = 0;
                        nodo.abandono = 0;
                        nodo.inicio = ' ';
                        nodo.activo = ' ';
                        nodo.inactivo = ' ';

                        break;
                    case 'Esperando':
                        nodo.usuario = faker.name.firstName() + ' ' + faker.name.lastName();
                        nodo.paciente = faker.name.firstName() + ' ' + faker.name.lastName();
                        nodo.esperando = faker.random.number({min: 1, max: 10});
                        nodo.atendidos = faker.random.number({min: 0, max: 5});
                        nodo.abandono = faker.random.number({min: 0, max: 3});
                        nodo.inicio = faker.random.number({min: 8, max: 11}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.activo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.inactivo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');

                        break;
                    case 'Procesando':
                        nodo.usuario = faker.name.firstName() + ' ' + faker.name.lastName();
                        nodo.paciente = faker.name.firstName() + ' ' + faker.name.lastName();
                        nodo.esperando = faker.random.number({min: 1, max: 10});
                        nodo.atendidos = faker.random.number({min: 0, max: 5});
                        nodo.abandono = faker.random.number({min: 0, max: 3});
                        nodo.inicio = faker.random.number({min: 8, max: 11}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.activo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.inactivo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        break;
                    case 'Terminado':
                        nodo.usuario = faker.name.firstName() + ' ' + faker.name.lastName();
                        nodo.atendidos = faker.random.number({min: 5, max: 10});
                        nodo.abandono = faker.random.number({min: 0, max: 3});
                        nodo.paciente = ' ';
                        nodo.esperando = 0;
                        nodo.inicio = faker.random.number({min: 8, max: 11}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.activo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        nodo.inactivo = faker.random.number({min: 0, max: 4}).toString().padStart(2, '00') + ':' + faker.random.number({min: 0, max: 59}).toString().padStart(2, '00');
                        break;
                }
                return nodo;
            });

            // end temporary

            sede.nodos = JSON.parse(JSON.stringify(_.groupBy(nodos, 'grupo_nodo')));
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sede)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_sede({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let _id = params.id;
            let sede = await mongo.Sede.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            let nodos = await mongo.Nodo.find(
                {sede_id: sede.id},
                {_id: 1, codigo: 1, grupo_nodo: 1, estado: 1, id: 1 }
            ).lean();
            sede.nodos = JSON.parse(JSON.stringify(_.groupBy(nodos, 'grupo_nodo')));
            sede = jsonpack.pack(JSON.parse(JSON.stringify(sede)));
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(sede)
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async examenes({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let examenes = await mongo.Examen.find(
                {
                    tipoExamen: 'Prestacion Presencial'
                },
                {
                    requerimientos: 0
                }
            ).lean();
            examenes = _.groupBy(examenes, (examen) => { return examen.codigo.substr(0, 3)})
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            return response.ok(examenes)
        }
        catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_examenes({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let examenes = await mongo.Examen.find(
                {
                    tipoExamen: 'Prestacion Presencial'
                },
                {
                    requerimientos: 0
                }
            ).lean();
            examenes = _.groupBy(examenes, (examen) => { return examen.codigo.substr(0, 3)})
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            examenes = jsonpack.pack(JSON.parse(JSON.stringify(examenes)));
            return response.ok(examenes)
        }
        catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/sedes response...', 'Ending api/sedes check');
            console.log(e)
            return response.internalServerError(e)
        }
    }

    async login({params, request, response, view, auth, session}) {
        let query = request.post();
        performance.mark('Checking api/login response...');
        try {
            let user = await mongo.User.findOne({
                username: query.username,
                password: crypto.createHash('sha256').update(query.password).digest('hex')
            }, { password: 0 }).lean();
            if (user !== null) {
                if (!user.session) {
                    let session_id = await nanoid(20);
                    let x = await mongo.User.updateOne({_id: user._id}, {
                        session: session_id
                    });
                    console.log(x)
                }

                performance.mark('Ending api/login check');
                performance.measure('Inputs validation', 'Checking api/login response...', 'Ending api/login check');
                return response.ok(user);
            }
            else {
                performance.mark('Ending api/login check');
                performance.measure('Inputs validation', 'Checking api/login response...', 'Ending api/login check');
                return response.unauthorized('')
            }
        }
        catch (e) {
            performance.mark('Ending api/login check');
            performance.measure('Inputs validation', 'Checking api/login response...', 'Ending api/login check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async users({params, request, response, view, auth, session}) {
        performance.mark('Checking api/users response...');
        try {
            let users = await mongo.User.find().lean();
            performance.mark('Ending api/users check');
            performance.measure('Inputs validation', 'Checking api/users response...', 'Ending api/users check');
            return response.ok(users);
        } catch (e) {
            performance.mark('Ending api/users check');
            performance.measure('Inputs validation', 'Checking api/users response...', 'Ending api/users check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async packed_users({params, request, response, view, auth, session}) {
        performance.mark('Checking api/users response...');
        try {
            let users = await mongo.User.find().lean();
            performance.mark('Ending api/users check');
            performance.measure('Inputs validation', 'Checking api/users response...', 'Ending api/users check');
            users = jsonpack.pack(JSON.parse(JSON.stringify(users)));
            return response.ok(users);
        } catch (e) {
            performance.mark('Ending api/users check');
            performance.measure('Inputs validation', 'Checking api/users response...', 'Ending api/users check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async save_user({params, request, response, view, auth, session}) {
        performance.mark('Checking api/save_user response...');
        try {
            let data = request.post();
            data.password = crypto.createHash('sha256').update(data.password).digest('hex');
            let model =  new mongo.User(data);
            await model.save();
            let user = await mongo.User.findOne({_id: model._id}).lean();
            performance.mark('Ending api/save_user check');
            performance.measure('Inputs validation', 'Checking api/save_user response...', 'Ending api/save_user check');
            return response.ok(user)
        } catch (e) {
            performance.mark('Ending api/save_user check');
            performance.measure('Inputs validation', 'Checking api/save_user response...', 'Ending api/save_user check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_save_user({params, request, response, view, auth, session}) {
        performance.mark('Checking api/save_user response...');
        try {
            let data = request.post();
            let model =  new mongo.User(data);
            await model.save();
            let user = await mongo.User.findOne({_id: model._id}).lean();
            performance.mark('Ending api/save_user check');
            performance.measure('Inputs validation', 'Checking api/save_user response...', 'Ending api/save_user check');
            user = jsonpack.pack(JSON.parse(JSON.stringify(user)));
            return response.ok(user)
        } catch (e) {
            performance.mark('Ending api/save_user check');
            performance.measure('Inputs validation', 'Checking api/save_user response...', 'Ending api/save_user check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async user({params, request, response, view, auth, session}) {
        performance.mark('Checking api/user response...');
        try {
            let _id = params.id;
            let user = await mongo.User.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            // let nodos = await mongo.Nodo.find(
            //     {sede_id: sede.id},
            //     {_id: 1, codigo: 1, grupo_nodo: 1, estado: 1, id: 1 }
            // ).lean();
            // sede.nodos = JSON.parse(JSON.stringify(_.groupBy(nodos, 'grupo_nodo')));
            performance.mark('Ending api/user check');
            performance.measure('Inputs validation', 'Checking api/user response...', 'Ending api/user check');
            return response.ok(user)
        } catch (e) {
            performance.mark('Ending api/user check');
            performance.measure('Inputs validation', 'Checking api/user response...', 'Ending api/user check');
            console.log(e)
            return response.internalServerError(e)
        }
    }
    async packed_user({params, request, response, view, auth, session}) {
        performance.mark('Checking api/user response...');
        try {
            let _id = params.id;
            let user = await mongo.User.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            // let nodos = await mongo.Nodo.find(
            //     {sede_id: sede.id},
            //     {_id: 1, codigo: 1, grupo_nodo: 1, estado: 1, id: 1 }
            // ).lean();
            // sede.nodos = JSON.parse(JSON.stringify(_.groupBy(nodos, 'grupo_nodo')));
            performance.mark('Ending api/user check');
            performance.measure('Inputs validation', 'Checking api/user response...', 'Ending api/user check');
            user = jsonpack.pack(JSON.parse(JSON.stringify(user)));
            return response.ok(user)
        } catch (e) {
            performance.mark('Ending api/user check');
            performance.measure('Inputs validation', 'Checking api/user response...', 'Ending api/user check');
            console.log(e)
            return response.internalServerError(e)
        }
    }

    async registro({params, request, response, view, auth, session}) {
        try {
            let query = request.post();
            performance.mark('Checking api/registro response...');
            let allPruebas = [];
            query.dtCita = moment(query.dtCita).format('YYYYMMDDhhmmss');
            query.dtCheckin = moment(query.dtCheckin).format('YYYYMMDDhhmmss');
            for (let episodio in query.episodios) {
                let pruebas = [];

                for (let prueba of query.episodios[episodio].pruebas) {
                    let _prueba = await mongo.Examen.findOne({codigo: prueba, }).lean();
                    if (_prueba) {
                        pruebas.push(_prueba);
                    }
                }
                allPruebas = _.concat(allPruebas, pruebas);
                query.episodios[episodio].pruebas = pruebas;
            }
            query.pruebas = _.uniqBy(allPruebas, item => { return item._id.toString() } );

            await mongo.Paciente.create(query);
            performance.mark('Ending api/registro check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            return response.ok(query);
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async packed_registro({params, request, response, view, auth, session}) {
        try {
            let query = request.post();
            performance.mark('Checking api/registro response...');
            let allPruebas = [];
            query.dtCita = moment(query.dtCita).format('YYYYMMDDhhmmss');
            query.dtCheckin = moment(query.dtCheckin).format('YYYYMMDDhhmmss');

            for (let episodio in query.episodios) {
                let pruebas = [];
                for (let prueba of query.episodios[episodio].pruebas) {
                    let _prueba = await mongo.Examen.findOne({codigo: prueba});
                    if (_prueba) {
                        pruebas.push(_prueba);
                    }
                }
                allPruebas = _.uniq(_.concat(allPruebas, pruebas));
                query.episodios[episodio].pruebas = pruebas;
            }
            query.allPruebas = allPruebas;

            await mongo.Paciente.create(query);
            performance.mark('Ending api/registro check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            query = jsonpack.pack(JSON.parse(JSON.stringify(query)));
            return response.ok(query);
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async checkin({params, request, response, view, auth, session}) {
        try {
            //let query = request.post();
            performance.mark('Checking api/checkin response...');
            let paciente = await mongo.Paciente.findOne(
                {
                    _id: mongoose.Types.ObjectId('5e75b329a2c0be6618897148'),
                }
            ).lean();

            let pruebas = paciente.pruebas.map(item => { return item.codigo});

            for (let prueba of pruebas) {
                // console.log(prueba);
                let nodos = await mongo.Nodo.find({
                    "examenes.codigo": prueba,
                    "sede_id": 1
                }, {
                    "_id": 1,
                    "codigo": 1,
                    "examenes.codigo": 1

                }).lean();
                nodos = _.shuffle(nodos);
                _.sortBy(nodos, [function(o) { return (o.pacientes !== undefined)?o.pacientes.length:0; }]);

                for (let nodo of nodos) {
                    // aqui estan todos los nodos, y debe ser donde se escoge el "mejor"

                    //console.log('NODOS');
                    // console.log(nodo.codigo)
                    let codigos = nodo.examenes.map(item => {  return item.codigo });
                    let interseccion  = _.intersection(pruebas, codigos)
                    //console.log('INTERSECCIÓN');
                    // console.log(interseccion);

                    await mongo.Nodo.updateOne(
                        {_id: nodo._id},
                        {
                            $push: {"pacientes": {
                                "_id": paciente._id
                            }}
                        }
                    )

                    _.pullAll(pruebas, interseccion);
                }
            }
            // for (let prueba in paciente.pruebas) {
            //     console.log(paciente.pruebas[prueba].codigo);
            //     // let r = await mongo.Nodo.find({"examenes._id": paciente.pruebas[prueba]._id }).lean();
            //     // console.log(r);
            //     let r = await mongo.Nodo.find({
            //         "examenes.codigo": paciente.pruebas[prueba].codigo,
            //         "sede_id": 1
            //     }, {
            //         "_id": 1,
            //         "codigo": 1,
            //
            //     }).lean();

            // }

            performance.mark('Ending api/checkin check');
            performance.measure('Inputs validation', 'Checking api/checkin response...', 'Ending api/checkin check');
            return response.ok('');
        } catch (e) {
            performance.mark('Ending api/checkin check');
            performance.measure('Inputs validation', 'Checking api/checkin response...', 'Ending api/checkin check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
}

module.exports = ApiController
