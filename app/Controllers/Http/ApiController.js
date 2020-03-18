'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const jsonpack = require('jsonpack');
const moment = require('moment');
const {performance, PerformanceObserver} = require('perf_hooks');

const obs = new PerformanceObserver((list) => {
    const entry = list.getEntries()[0]
    console.log(`Time for ('${entry.name}')`, entry.duration);
});
obs.observe({entryTypes: ['measure'], buffered: false});


mongoose.connect('mongodb://localhost:27017/test', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    keepAlive: true,
    keepAliveInitialDelay: 300000,
    poolSize: 20
});
const mongoExamen = mongoose.model('examen', {
    id: Number,
    indice: String,
    codigo: String,
    nombre: String,
    cAyuna: String,
    tipoExamen: String,
    grupoPrestacion: String,
    nrequerimientos: Number,
    requerimientos: [{
        id: Number,
        indice: String,
        codigo: String,
        nombre: String,
        cAyuna: String,
        tipoExamen: String,
        grupoPrestacion: String,
    }]
})
const mongoPaciente = mongoose.model('paciente', {
    ticket: String,
    sede: String,
    dni: String,
    nombre: String,
    sexo: String,
    edad: Number,
    celular: String,
    correo: String,
    dtCita: String,
    dtCheckin: String,
    episodios: [{
        codigoEpisodio: String,
        titular: String,
        unidad: String,
        contrata: String,
        puesto: String,
        Protocolo: String,
        TipoExamen: String,
        TiempoTeorico: Number,
        pruebas: Array,
    }]


});
const mongoUser = mongoose.model('user', {
    id: Number,
    nombre: String,
    username: String,
    password: String,
    token: String,
    nodos: Array,
    info: Array
});
const mongoSede = mongoose.model('sede', {
    id: Number,
    nombre: String,
    descripcion: String,
    codigo: String
})
const mongoNodo = mongoose.model('nodo', {
    id: Number,
    nombre: String,
    sede_id: Number,
    user_id: Number,
    paciente_id: Number,
    area: String,
    color: String,
    codigo: String,
    estado: String,
    tiempo_atencion: Number,
    tiempo_llamada: Number,
    tiempo_espera: Number,
    tiempo_max: Number,
    grupo_nodo: String,
    examenes: [{
        id: Number,
        indice: String,
        codigo: String,
        nombre: String,
        cAyuna: String,
        tipoExamen: String,
        grupoPrestacion: String,
        nrequerimientos: Number,
        requerimientos: [{
            id: Number,
            indice: String,
            codigo: String,
            nombre: String,
            cAyuna: String,
            tipoExamen: String,
            grupoPrestacion: String,
        }]
    }],
    pacientes: Array,
    cola: Array,
});

class ApiController {
    async sedes({params, request, response, view, auth, session}) {
        performance.mark('Checking api/sedes response...');
        try {
            let sedes = await mongoSede.find().lean();
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
            let sedes = await mongoSede.find().lean();
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
            let model =  new mongoSede(data);
            await model.save();
            let sede = await mongoSede.findOne({_id: model._id}).lean();
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
            let model =  new mongoSede(data);
            await model.save();
            let sede = await mongoSede.findOne({_id: model._id}).lean();
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
            let sede = await mongoSede.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            let nodos = await mongoNodo.find(
                {sede_id: sede.id},
                {_id: 1, codigo: 1, grupo_nodo: 1, estado: 1, id: 1 }
            ).lean();
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
            let sede = await mongoSede.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            let nodos = await mongoNodo.find(
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
            let examenes = await mongoExamen.find(
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
            let examenes = await mongoExamen.find(
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
    async registro({params, request, response, view, auth, session}) {
        try {
            let query = request.post();
            performance.mark('Checking api/registro response...');
            let object = _.clone(query)
            let allPruebas = [];
            object.dtCita = moment(object.dtCita).format('YYYYMMDDhhmmss');
            object.dtCheckin = moment(object.dtCheckin).format('YYYYMMDDhhmmss');
            for (let episodio in object.episodios) {
                let pruebas = [];

                for (let prueba of object.episodios[episodio].pruebas) {
                    let _prueba = await mongoExamen.findOne({codigo: prueba});
                    if (_prueba) {
                        pruebas.push(_prueba);
                    }
                }
                allPruebas = _.uniq(_.concat(allPruebas, pruebas));
                object.episodios[episodio].pruebas = pruebas;
            }
            object.allPruebas = allPruebas;
            await mongoPaciente.create(object);
            performance.mark('Ending api/registro check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            return response.ok(object);
        } catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async login({params, request, response, view, auth, session}) {
        let query = request.post();
        performance.mark('Checking api/login response...');
        try {
            if (query.username === 'mateo' && query.password === 'mateo') {
                performance.mark('Ending api/registro check');
                performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
                return response.ok('');
            }
            else {
                performance.mark('Ending api/sedes check');
                performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
                return response.unauthorized('')
            }
        }
        catch (e) {
            performance.mark('Ending api/sedes check');
            performance.measure('Inputs validation', 'Checking api/registro response...', 'Ending api/registro check');
            console.log(e);
            return response.internalServerError(e);
        }
    }
    async users({params, request, response, view, auth, session}) {
        performance.mark('Checking api/users response...');
        try {
            let users = await mongoUser.find().lean();
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
            let users = await mongoUser.find().lean();
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

            console.log(data);

            let model =  new mongoUser(data);
            await model.save();
            let user = await mongoUser.findOne({_id: model._id}).lean();
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
            let model =  new mongoUser(data);
            await model.save();
            let user = await mongoUser.findOne({_id: model._id}).lean();
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
            let user = await mongoUser.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            // let nodos = await mongoNodo.find(
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
            let user = await mongoUser.findOne({_id: mongoose.Types.ObjectId(_id)}).lean();
            // let nodos = await mongoNodo.find(
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
}

module.exports = ApiController
