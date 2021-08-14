/**
 * 逻辑层
 * 负责棋盘数据的处理
 * 
 */


// 循环链表表示玩家，1为白子，2为黑子，白子先手
const players = {val: 1, next: null};
players.next = {val: 2, next: null};
players.next.next = players;

/**
 * 以坐标[x, y]记录下棋过程
 * 调用
 */
 class History {
    constructor() {
        this.history = [];
        this.position = -1;
    }
    play(val) {
        this.history.splice(this.position + 1);
        this.history.push(val);
        this.position++;
    }
    rollback() {
        if(this.isRollbackValid()) {
            return this.history[this.position--];
        }
    }
    cancelRollback() {
        if(this.isCancelValid()) {
            return this.history[++this.position];
        }
    }
    isRollbackValid() {
        return this.position > -1;
    }
    isCancelValid() {
        return this.position < this.history.length - 1;
    }
}



/**
 * 游戏实例，负责逻辑处理
 * params:
 * @views 渲染器哈希映射表，key:skin, value: 渲染器
 * @skin 渲染器列表的key
 * @inlineCount 定义n阶棋盘
 */
class GobangGame {
    constructor(viewsMap, skin, inlineCount) {
        this.views = viewsMap;
        this.currentPlayer = players;
        this.skin = skin;
        this.inlineCount = inlineCount;
        this.chessBoardData = null;
        this.history = null;
        this.remainBlankCell = 0;
        this.containerWidth = 0;
        this.containerHeight = 0;
        this.chessBoard = null;
    }

    // 初始化，清空记录
    init() {
        const InitData = new Array(this.inlineCount).fill(0).map(() => new Array(this.inlineCount).fill(0));
        this.chessBoardData = InitData;
        this.history = new History();
        this.remainBlankCell = this.inlineCount ** 2;
        if(this.chessBoard) {
            this.chessBoard.chessBoardData = this.chessBoardData;
        }
    }

    // 获取视图渲染实例
    getChessBoard(f) {
        let container = document.getElementById('chessboard-container'),
            containerWidth = Math.min(container.clientWidth, container.clientHeight);
        let options = {
            container: container,
            inlineCount: this.inlineCount,
            containerWidth: containerWidth,
            chessBoardData: this.chessBoardData
        }
        const ChessBoard = this.views.get(this.skin);
        this.chessBoard = new ChessBoard(f, options);
    }

    play(x, y) {
        // 返回一个闭包匿名函数，是用户点击棋盘的事件处理函数
        // 若位置为空则下子
            if(this.chessBoardData[x][y] == 0) {
                this.chessBoardData[x][y] = this.currentPlayer.val;
                this.history.play([x,y]);
                this.remainBlankCell--;

                // 待最后一颗棋子渲染完成，判断是否结束游戏
                setTimeout(() => {
                    // 判赢
                    if(this.isWin(x,y)) {
                        window.alert((this.chessBoardData[x][y] == 1? 'White' : 'Black') + ' Win!');
                        this.reStart();
                        return;
                    }
                    // 判和
                    if(this.isDrawGame()) {
                        window.alert('Draw Game!');
                        this.reStart();
                        return;
                    }
                    this.changePlayer();
                }, 0)

                return this.currentPlayer.val;
            } else {
                return 0;
            }
        
    }

    // 若在一个方向上，当前玩家超过有超过5个连续的棋子则获胜
    isWin(x, y) {
        const directions = [[-1,-1],[-1,0],[-1,1],[0,1]];
        const player = this.currentPlayer.val;
        for(let [xOffset,yOffset] of directions) {
            let count = 1;
            let newX = x + xOffset, newY = y + yOffset;
            count += this.checkWithDirection(player, xOffset, yOffset, newX, newY);
            // 反方向
            xOffset *= -1;
            yOffset *= -1;
            newX = x + xOffset;
            newY = y + yOffset;
            count += this.checkWithDirection(player, xOffset, yOffset, newX, newY);
            if(count >= 5) {
                return true;
            }
        }
        return false;
    }

    // 从curr位置出发，向某个方向遍历至 边界 || 不同色棋 || 无棋
    checkWithDirection(player, xOffset,yOffset,currX,currY) {
        let count = 0;
        while(currX >= 0 && currX < this.inlineCount && currY >= 0 && currY < this.inlineCount && this.chessBoardData[currX][currY] == player) {
            count++;
            currX += xOffset;
            currY += yOffset;
        }
        return count;
    }

    // 棋盘已经填满，平局
    isDrawGame() {
        return !this.remainBlankCell;
    }

    // 悔棋
    rollback() {
        if(this.history.isRollbackValid()) {
            let [x, y] = this.history.rollback();
            this.chessBoardData[x][y] = 0;
            this.remainBlankCell++;
            this.chessBoard.wipe(x, y);
            this.changePlayer();
        }
    }

    // 撤销悔棋
    cancelRollback() {
        if(this.history.isCancelValid()) {
            let [x, y] = this.history.cancelRollback();
            this.chessBoardData[x][y] = this.currentPlayer.val;
            this.remainBlankCell--;
            this.chessBoard.play(x, y, this.currentPlayer.val)
            this.changePlayer();
        }
    }

    // 重开
    reStart() {
        this.init();
        this.chessBoard.clearChessBoard();
    }

    // 换人
    changePlayer() {
        this.currentPlayer = this.currentPlayer.next;
        playerEl.innerHTML = `${chessColors[this.currentPlayer.val]}`;
    }
}