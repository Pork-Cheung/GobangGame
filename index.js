
const skins = ['dom', 'canvas'],
    chessColors = ['空','白子','黑子']
// 循环链表表示玩家，1为白子，2为黑子，白子先手
const players = {val: 1, next: null};
players.next = {val: 2, next: null};
players.next.next = players;
let currentPlayer = players;
const playerEl = document.getElementById('player'),
    modeEl = document.getElementById('mode');
playerEl.innerHTML = `${chessColors[currentPlayer.val]}`;
modeEl.innerHTML = `${skins[0]}`;

// 换人
function changePlayer() {
    currentPlayer = currentPlayer.next;
    playerEl.innerHTML = `${chessColors[currentPlayer.val]}`;
}

/**
 * 以坐标[x, y]记录下棋过程
 * 调用
 */
class History {
    constructor() {
        this.history = [];
        this.flag = -1;
    }
    play(val) {
        this.history.splice(this.flag + 1);
        this.history.push(val);
        this.flag++;
    }
    rollback() {
        if(this.isRollbackValid()) {
            return this.history[this.flag--];
        }
    }
    cancelRollback() {
        if(this.isCancelValid()) {
            return this.history[++this.flag];
        }
    }
    isRollbackValid() {
        return this.flag > -1;
    }
    isCancelValid() {
        return this.flag < this.history.length - 1;
    }
}

class GobangGame {
    constructor() {
        this.skin = skins[0];
        this.inlineCount = 5;
        this.chessBoardData = null;
        this.history = null;
        this.step = 0;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.chessBoard = null;
    }

    // 初始化，清空记录
    init() {
        const InitData = new Array(this.inlineCount).fill(0).map(() => new Array(this.inlineCount).fill(0));
        this.chessBoardData = InitData;
        this.history = new History();
        this.step = this.inlineCount ** 2;
        if(this.chessBoard) {
            this.chessBoard.chessBoardData = this.chessBoardData;
        }
    }

    // 获取视图渲染实例
    getChessBoard() {
        let container = document.getElementById('chessboard-container'),
            containerWidth = Math.min(container.clientWidth, container.clientHeight);
        let options = {
            container: container,
            inlineCount: this.inlineCount,
            containerWidth: containerWidth,
            chessBoardData: this.chessBoardData
        }
        if(this.skin == skins[0]) {
            this.chessBoard = new DomBoard(this.play(), options);
        } else {
            this.chessBoard = new CanvasBoard(this.play(), options);
        }
    }

    play() {
        // 返回一个闭包匿名函数，是用户点击棋盘的事件处理函数
        // 若位置为空则下子
        return (x, y) => {
            if(this.chessBoardData[x][y] == 0) {
                this.chessBoardData[x][y] = currentPlayer.val;
                this.history.play([x,y]);
                this.step--;
                setTimeout(() => {
                    // 判赢
                    if(this.isWin(x,y)) {
                        window.alert(this.chessBoardData[x][y] == 1? '白棋' : '黑棋' + ' Win!');
                        this.reStart();
                        return;
                    }
                    // 判和
                    if(this.isDrawGame()) {
                        window.alert('平局');
                        this.reStart();
                        return;
                    }
                    changePlayer();
                }, 0)
                return currentPlayer.val;
            } else {
                return 0;
            }
        }
    }

    // 若在一个方向上，当前玩家超过有超过5个连续的棋子则获胜
    isWin(x, y) {
        const directions = [[-1,-1],[-1,0],[-1,1],[0,1]];
        const player = {val: currentPlayer.val, count: 1};
        for(let [xOffset,yOffset] of directions) {
            player.count = 1;
            let newX = x + xOffset, newY = y + yOffset;
            this.checkWithDirection(player, xOffset, yOffset, newX, newY);
            // 反方向
            xOffset *= -1;
            yOffset *= -1;
            newX = x + xOffset;
            newY = y + yOffset;
            this.checkWithDirection(player, xOffset, yOffset, newX, newY);
            if(player.count >= 5) {
                return true;
            }
        }
        return false;
    }
    // 从curr位置出发，向某个方向遍历至 边界 || 不同色棋 || 无棋
    checkWithDirection(player, xOffset,yOffset,currX,currY) {
        while(currX >= 0 && currX < this.inlineCount && currY >= 0 && currY < this.inlineCount && this.chessBoardData[currX][currY] == player.val) {
            player.count++;
            currX += xOffset;
            currY += yOffset;
        }
    }
    // 棋盘已经填满，平局
    isDrawGame() {
        return !this.step;
    }

    // 悔棋
    rollback() {
        if(this.history.isRollbackValid()) {
            let [x, y] = this.history.rollback();
            this.chessBoardData[x][y] = 0;
            this.step++;
            this.chessBoard.wipe(x, y);
            changePlayer();
        }
    }

    // 撤销悔棋
    cancelRollback() {
        if(this.history.isCancelValid()) {
            let [x, y] = this.history.cancelRollback();
            this.chessBoardData[x][y] = currentPlayer.val;
            this.step--;
            this.chessBoard.play(x, y, currentPlayer.val)
            changePlayer();
        }
    }

    // 重开
    reStart() {
        this.init();
        this.chessBoard.clearChessBoard();
    }
}


// 创建游戏实例，初始化棋盘，默认‘dom'模式
const game = new GobangGame();
game.init();
game.getChessBoard();
game.chessBoard.init();


document.getElementById('change-style').addEventListener('click', () => {
    if(game.skin == skins[0]) {
        game.skin = skins[1];
    } else {
        game.skin = skins[0];
    }
    game.chessBoard.board.remove();
    game.getChessBoard();
    game.chessBoard.init();
    document.querySelector('aside > p:first-child > span:last-child').innerHTML = `${game.skin}`;
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
    game.getChessBoard();
    game.chessBoard.init();
}, false);