import { type } from "os";
import mongoose from "../database/mongoose.js";
import {randomUUID} from "crypto";

const {Schema} = mongoose;

const clubeShema = new Schema({
    id:{
        type:'UUID',
        default: ()=> randomUUID()
    },
    nome:{
        type: String,
        require: true
    },
    imageurl: String,
    tecnico: String,
    nomeCurto: String,
    anoFundacao: {
        type: Number,
        require: true
    },
    estadio:{
        type: String,
        require: true
    },
    liga:{
        type: String,
        require: true
    },
    nomeLocalizacao: {
        type: String,
        require: true
    },
    pais:{
        type: String,
        require: true,
    },
    titulos:[
        {
            nome: String,  //  O nome da competição.
            numeroVezesVenceu: Number //  O número de vezes que o time venceu essa competição.
        }
    ],
    rivais:{
        type: [String],
        default: []
    },
    geocode:{
        type:{
            type: String,
            enum: ['Point'],
            require: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    visualizacoes:{
        type: Number,
        default: 0
    }
})

const Clube = mongoose.model('Clube', clubeShema);
export default Clube;