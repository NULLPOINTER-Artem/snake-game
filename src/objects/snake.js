class Snake {
  constructor(
    score,
    bestScore,
    size,
    position = {
      x: 0,
      y: 0,
    }
  ) {
    this.score = score;
    this.bestScore = bestScore;
    this.size = size;
    this.position = Object.assign({}, position);
  }

  move(x, y) {
    this.position.x += x;
    this.position.y += y;
  }

  addPointToScore(point) {
    this.score += point;
  }

  setBestScore(score) {
    this.bestScore = score;
  }

  addPointToSize(point) {
    this.size += point;
  }
}

export { Snake };
