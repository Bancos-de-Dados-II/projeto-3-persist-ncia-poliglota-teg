import {  useEffect, useRef, useState } from "react";
import { useNavigate, type LinksFunction } from "react-router";
import { Button } from "@mui/material";

import styles from "./styles.css?url";
import type { Clube } from "~/types";
import { getClubById } from "~/api/custom";
export const links: LinksFunction = () => [{ rel: "stylesheet", href: styles }];

const fallbackImg = "/football-club.png"

interface ClubInfoProps {
  club: Clube;
}

export default function ClubInfo({ club }: ClubInfoProps) {
  const navigate = useNavigate();
  const [clubUS, setClubUS] = useState<Clube>(club);
  const clubId = club.id;
  const imgRef = useRef<HTMLImageElement>(null);
  const fetchedRef = useRef(false);

  useEffect(() => {
    async function fetchClub() {
      if (!clubId || fetchedRef.current) return;

      fetchedRef.current = true;

      try {
        const data = await getClubById(clubId);

        if(!data) return

        setClubUS(data);
      } catch (error) {
        console.error("Erro ao buscar clube:", error);
      }
    }

    fetchClub();
  }, [clubId]);

  function handleImageError() {
    if (imgRef.current) imgRef.current.src = fallbackImg;
  }

  return (
    <div className="club-div">
    <div className="upper-club-div">
      <h1 className="club-name">{club.nome}</h1>
      <div className="button-div">
        <Button variant="contained" onClick={() => navigate(`/edit/${club.id}`)}>Edit</Button>
        <Button variant="contained" color="error" onClick={() => navigate("/")}>Close</Button>
      </div>
    </div>
    <div className="bottom-club-div">
      <div className="club-logo">
        <img ref={imgRef} className="club-logo-img" src={club.imageurl || fallbackImg} onError={handleImageError} alt={club.nome} />
      </div>
        <ClubData club={clubUS} />
    </div>
    </div>
  );
};

function ClubData({club}: { club: Clube}) {
 const details = [
    { label: "Técnico", value: club.tecnico },
    { label: "Ano Fundação", value: club.anoFundacao },
    { label: "Estádio", value: club.estadio },
    { label: "Liga", value: club.liga },
    { label: "Local", value: club.nomeLocalizacao },
    { label: "País", value: club.pais },
    { label: "Visualizações", value: club.visualizacoes }
  ];

  return (
    <div className="club-info">
    <div className="club-details club-section">
      <h2 className="text-dark club-section-title">Details</h2>
      <ul>
        {details.map(({ label, value }) => (
          <li className="club-detail" key={label}>
            <p className="player-info-subtitle text-green">
              <span className="text-dark">{label}: </span>
              {value}
            </p>
          </li>
        ))}
      </ul>
    </div>
    <div className="club-titles club-section">
      <h2 className="text-dark club-section-title">Títulos</h2>
      {club.titulos.length === 0 ? (
        <p>No titles conquered</p>
      ) : (
        <ul>
          {club.titulos.map(({ nome, numeroVezesVenceu }, ind) => (
            <li key={ind}>
              <p className="player-info-subtitle text-green">
                <span className="text-dark text-lower">{numeroVezesVenceu}x: </span>
                {nome}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
    </div>
  );
}
