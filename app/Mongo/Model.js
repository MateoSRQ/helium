const mongoose = require('mongoose');

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
    pruebas: Array,
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
    session: String,
    token: String,
    nodos: Array,
    info: Array
});
const mongoSede = mongoose.model('sede', {
    id: Number,
    nombre: String,
    descripcion: String,
    codigo: String,
    sede_id: String
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

module.exports.User = mongoUser;
module.exports.Examen = mongoExamen;
module.exports.Paciente = mongoPaciente;
module.exports.Sede = mongoSede;
module.exports.Nodo = mongoNodo;

// export {mongoExamen, mongoPaciente, mongoUser, mongoSede, mongoNodo};
