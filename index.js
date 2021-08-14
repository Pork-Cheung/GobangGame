/**
 * 控制层，负责html的事件处理
 * 控制视图渲染，将数据提交逻辑层
 * 
 */


const skins = ['dom', 'canvas'],
    views = new Map(),
    chessColors = [' ','white','black'];
    
views.set('dom', DomBoard);
views.set('canvas', CanvasBoard);


// 创建游戏实例，初始化棋盘，默认‘dom', 15 * 15
const game = new GobangGame(views, 'dom', 15);
game.init();
game.getChessBoard(playHandler);
game.chessBoard.init();


function playHandler(x, y) {
    let player = game.play(x,y);
    if(player) {
        game.chessBoard.play(x, y, player);
    }
}

const playerEl = document.getElementById('player'),
    modeEl = document.getElementById('mode');
playerEl.innerHTML = `${chessColors[game.currentPlayer.val]}`;
modeEl.innerHTML = `${game.skin}`;

document.getElementById('change-style').addEventListener('click', () => {
    if(game.skin == skins[0]) {
        game.skin = skins[1];
    } else {
        game.skin = skins[0];
    }
    game.chessBoard.board.remove();
    game.getChessBoard(playHandler);
    game.chessBoard.init();
    modeEl.innerHTML = `${game.skin}`;
}, false);

document.getElementById('re-start').addEventListener('click', () => {
    game.reStart();
}, false);

document.getElementById('rollback').addEventListener('click',  () => {
    game.rollback();
}, false);

document.getElementById('cancel-rollback').addEventListener('click',  () => {
    game.cancelRollback();
}, false);

document.getElementById('length-selector').addEventListener('change',  (e) => {
    game.inlineCount = parseInt(e.target.value);
    game.chessBoard.board.remove();
    game.init();
    game.getChessBoard(playHandler);
    game.chessBoard.init();
}, false);