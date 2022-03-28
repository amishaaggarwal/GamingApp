export const aiMove = (upper_limit, lower_limit, ballPos, miss) => {
  return Math.min(
    upper_limit,
    Math.max(
      lower_limit,
      ballPos -
        40 + miss
        // + dir[Math.round(Math.random())] *
          // Math.floor(Math.random() * (max - min + 1) + min)
    )
  );
};