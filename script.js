<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8" />
<title>Échiquier personnalisé</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.css" />
<style>
  #board {
    width: 400px;
    margin: 20px auto;
  }
</style>
</head>
<body>

<div id="board"></div>

<!-- jQuery -->
<script src="https://code.jquery.com/jquery-3.6.0.min.js"></script>

<!-- Chessboard.js -->
<script src="https://cdn.jsdelivr.net/npm/chessboardjs@1.0.0/dist/chessboard-1.0.0.min.js"></script>

<script>
  $(function() { // wait DOM ready
    var board = Chessboard('board', {
      pieceTheme: function(piece) {
        var pieceName = '';
        switch(piece[1].toLowerCase()) {
          case 'p': pieceName = 'pion.png'; break;
          case 'r': pieceName = 'tour.png'; break;
          case 'n': pieceName = 'cavalier.png'; break;
          case 'b': pieceName = 'fou.png'; break;
          case 'q': pieceName = 'dame.png'; break;
          case 'k': pieceName = 'roi.png'; break;
        }
        var colorFolder = (piece[0] === 'w') ? 'w/' : 'b/';
        return 'img/chesspieces/' + colorFolder + pieceName;
      },
      position: 'start'
    });
  });
</script>

</body>
</html>
