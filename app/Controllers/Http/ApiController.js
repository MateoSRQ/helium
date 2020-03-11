'use strict'
const mongoose = require('mongoose');
const _ = require('lodash');
const jsonpack = require('jsonpack');
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

}

module.exports = ApiController
