import { Stack, Typography } from "@mui/material";
import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import ImageListItemBar from "@mui/material/ImageListItemBar";
import React from "react";
import { useNavigate } from "react-router-dom";
import pp from "../../assets/images/pp.jpg";
import tt from "../../assets/images/tt.jpeg";
import "./GameList.scss";

function GameList(props) {
  const navigate = useNavigate();
  const itemData = [
    {
      img: tt,
      title: "Tic Tac Toe",
      path: "tic-tac",
    },
    {
      img: pp,
      title: "Ping Pong",
      path: "ping-pong",
    },
  ];

  const game_list = (
    <ImageList className="game-list">
      {itemData.map((item) => (
        <ImageListItem
          key={item.img}
          onClick={() => {
            navigate(`${item.path}`);
          }}
          sx={{ maxHeight: "200px", width: "200px" }}
        >
          <img
            src={item.img}
            srcSet={item.img}
            alt={item.title}
            loading="lazy"
          />
          <ImageListItemBar title={item.title} />
        </ImageListItem>
      ))}
    </ImageList>
  );
  return (
    <>
      <Stack spacing={2} className="game-list-parent">
        <Typography sx={{ color: "#B9EFA4", fontSize: "20px" }}>
          Games
        </Typography>
        {game_list}
      </Stack>
    </>
  );
}

export default GameList;
