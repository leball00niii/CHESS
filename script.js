let board = null;
let game = new Chess();
let username = "";
let elo = 1200;
let users = JSON.parse(localStorage.getItem("users") || "{}");

function login() {
  username = document.getElementById("username").value;
  if (!username) return alert("Please enter a username");

  if (!users[username]) {
    users[username] = { elo: 1200 };
    localStorage.setItem("users", JSON.stringify(users));
  }

  elo = users[username].elo;
  document.getElementById("login-container").style.display = "none";
  document.getElementById("chess-container").style.display = "block";
  document.getElementById("welcome").innerText = `Welcome, ${username} (ELO: ${elo})`;

  board = Chessboard('board', {
    draggable: true,
    position: 'start',
    onDrop: onDrop
  });

  if (game.turn() === 'b') setTimeout(aiMove, 500);
}

function onDrop(source, target) {
  const move = game.move({ from: source, to: target, promotion: 'q' });
  if (!move) return 'snapback';

  window.setTimeout(() => {
    aiMove();
    updateElo();
  }, 500);
}

function aiMove() {
  const bestMove = getBestMove(game);
  game.move(bestMove);
  board.position(game.fen());
}

function getBestMove(game) {
  const moves = game.moves({ verbose: true });
  let bestEval = -9999, bestMove = null;

  for (let move of moves) {
    game.move(move);
    let eval = -minimax(game, 2, -10000, 10000, false);
    game.undo();

    if (eval > bestEval) {
      bestEval = eval;
      bestMove = move;
    }
  }

  return bestMove || moves[0];
}

function minimax(game, depth, alpha, beta, isMaximizing) {
  if (depth === 0 || game.game_over()) return evaluateBoard(game);

  let moves = game.moves();
  if (isMaximizing) {
    let maxEval = -Infinity;
    for (let move of moves) {
      game.move(move);
      let eval = minimax(game, depth - 1, alpha, beta, false);
      game.undo();
      maxEval = Math.max(maxEval, eval);
      alpha = Math.max(alpha, eval);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (let move of moves) {
      game.move(move);
      let eval = minimax(game, depth - 1, alpha, beta, true);
      game.undo();
      minEval = Math.min(minEval, eval);
      beta = Math.min(beta, eval);
      if (beta <= alpha) break;
    }
    return minEval;
  }
}

function evaluateBoard(game) {
  const values = { p: 1, n: 3, b: 3, r: 5, q: 9, k: 0 };
  let eval = 0;
  const board = game.board();
  for (let row of board) {
    for (let piece of row) {
      if (piece) {
        let val = values[piece.type];
        eval += piece.color === 'w' ? val : -val;
      }
    }
  }
  return eval;
}

function updateElo() {
  if (!game.game_over()) return;
  const isWin = game.in_checkmate() && game.turn() === 'b';
  const isLoss = game.in_checkmate() && game.turn() === 'w';
  const k = 32;
  const expected = 1 / (1 + Math.pow(10, (1400 - elo) / 400));

  if (isWin) elo += Math.round(k * (1 - expected));
  else if (isLoss) elo += Math.round(k * (0 - expected));

  users[username].elo = elo;
  localStorage.setItem("users", JSON.stringify(users));
  alert(`${isWin ? "Victory!" : "Defeat!"} New ELO: ${elo}`);
  document.getElementById("welcome").innerText = `Welcome, ${username} (ELO: ${elo})`;
}