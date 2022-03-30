import { Card, CardContent } from "@mui/material";
import Button from "@mui/material/Button";
import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import tt from "../../assets/images/tt.jpeg";
import "./gameSlider.scss";

//-Game photo carousel on dashboard
function GameSlider() {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
      slidesToSlide: 1, // optional, default to 1.
    },
  };

  return (
    <Carousel
      className="slider"
      swipeable={false}
      draggable={false}
      showDots={true}
      responsive={responsive}
      ssr={true} // means to render carousel on server-side.
      infinite={true}
      autoPlaySpeed={1000}
      keyBoardControl={true}
      customTransition="all .5"
      transitionDuration={500}
      containerClass="carousel-container"
      removeArrowOnDeviceType={["tablet", "mobile"]}
      dotListClass="custom-dot-list-style"
      itemClass="carousel-item-padding-40-px"
    >
      <Card sx={{ color: "white", minHeight: "70vh" }}>
        <CardContent className="game-card">
          <img src={tt} alt="tic-tac" loading="lazy" />

          <Button className="card-button  ">Play!</Button>
        </CardContent>
      </Card>
    </Carousel>
  );
}

export default GameSlider;
