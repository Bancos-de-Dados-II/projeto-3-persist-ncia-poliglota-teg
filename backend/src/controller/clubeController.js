import Clube from "../model/clube.js";
import client from "../database/redis.js";

function convertToUUID(hexString) {
  let paddedHex = hexString.padEnd(32, '0');
  return `${paddedHex.slice(0, 8)}-${paddedHex.slice(8, 12)}-${paddedHex.slice(12, 16)}-${paddedHex.slice(16, 20)}-${paddedHex.slice(20, 32)}`;
}

// const geocode = {
//   point: "POINT",
//   coordinates: [1234, 1242]
// }
//
// const goecodestr = '{point: "POINT", coordinates: [1234,13134]}'

export async function findByIdClub(req, res){
    try {
      const id = req.params.id;
      const clubes = await client.get('clubes');
      if(clubes){
        const objClubes = JSON.parse(clubes);
        const cache = objClubes.find(clube => clube._id === id);

        if(cache){
          res.status(200).json(cache);
          console.log("Retornando do Redis");
          return;
        }
      }
      const clube = await Clube.findById(id);
      if(!clube){
        res.status(404).json({ message: "Error clube não encontrado" });
        return;
      }
      const updatedClubes = clubes ? [...JSON.parse(clubes), clube] : [clube];
      await client.set('clubes', JSON.stringify(updatedClubes), {'EX': 3600});

      res.status(200).json(clube);
      console.log("Retornando do MongoDB");

    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Internal Server Error" });
    }
}

export async function findAllClubs(req, res){
    try {
        const clubes = await Clube.find();
        res.status(200).json(clubes);
    } catch (error) {
        res.status(400).json({message: "Error a buscar todos os clubes"});
    }
}

function convertToValidGeocode(geocode) {
  if (typeof geocode === "string") {
    try {
      return JSON.parse(geocode);
    } catch (error) {
      throw new Error("Formato de geocode inválido");
    }
  }
  return geocode;
}

export async function createClub(req, res) {
  try {
    const {
      nome,
      tecnico,
      nomeCurto,
      anoFundacao,
      estadio,
      liga,
      nomeLocalizacao,
      pais,
      titulos,
      rivais,
      geocode,
      imageurl,
    } = req.body;

    const geocodeObjeto = convertToValidGeocode(geocode);

    const clube = new Clube({
      nome,
      imageurl,
      tecnico,
      nomeCurto,
      anoFundacao,
      estadio,
      liga,
      nomeLocalizacao,
      pais,
      titulos,
      rivais,
      geocode: geocodeObjeto,
    });

    await clube.save();
    res.status(201).json(clube);
  } catch (error) {
    console.log(error)
    res.status(400).json({ message: "Error ao tentar criar clube" });
  }
}

export async function deleteClub(req, res) {
  try {
    let id = req.params.id;
    id = id.trim();

    await Clube.deleteOne({ _id: id }).then((resultado) => {
      if (resultado.deletedCount > 0) {
        res.status(200).json({ message: "Clube deletado com sucesso" });
        return;
      } else {
        res.status(404).json({ message: "Error: Clube não encontrado"})
      }
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export async function updateClub(req, res) {
  try {
    const id = req.params.id;
    if (req.body.geocode)
      req.body.geocode = convertToValidGeocode(req.body.geocode);

    const clube = await Clube.findOneAndUpdate({ _id: id }, req.body, {
      new: true,
    });

    res.status(200).json(clube);
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
