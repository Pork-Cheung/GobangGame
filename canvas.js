
class CanvasBoard {
    constructor(playHandler, options) {
        this.container = options.container,
        this.inlineCount = options.inlineCount,
        this.chessBoardWidth = options.containerWidth * 0.9,
        this.cellWidth = options.containerWidth * 0.9 / options.inlineCount,
        this.chessBoardData = options.chessBoardData,
        this.board = null,
        this.playHandler = playHandler
    }

    init() {
        let canvas = document.createElement('canvas');
        canvas.className = 'canvas-mode';
        canvas.setAttribute('width', this.chessBoardWidth);
        canvas.setAttribute('height', this.chessBoardWidth);

        // 画出棋盘
        let context = canvas.getContext('2d');
        let x = this.cellWidth / 2,
            width = this.chessBoardWidth - this.cellWidth;
        context.beginPath();
        context.rect(x, x, width, width);
        let currX = x;
        for(let i = 0; i < this.inlineCount - 2; i++) {
            currX += this.cellWidth;
            context.moveTo(currX,x);
            context.lineTo(currX, x + width);
            context.moveTo(x, currX);
            context.lineTo(x + width, currX);
        }
        context.closePath();
        context.stroke();
        
        canvas.addEventListener('click', (e) => {
            e = e || window.event;
            console.log(e)
            let [x,y] = [parseInt(e.offsetY / this.cellWidth), parseInt(e.offsetX / this.cellWidth)];
            let player = this.playHandler(x,y);
            if(player) {
                this.play(x, y, player);
            }

        }, false);
        this.container.appendChild(canvas)
        this.board = canvas;
        
        this.scanData();
    }

    // 扫描数据，画出相应棋盘
    scanData() {
        for(let i = 0; i < this.inlineCount; i++) {
            for(let j = 0; j < this.inlineCount; j++) {
                if(this.chessBoardData[i][j]) {
                    this.play(i, j, this.chessBoardData[i][j]);
                }
            }
        }
    }

    // 画出棋子
    play(x, y, player) {
        let context = this.board.getContext('2d'),
            originX = y * this.cellWidth + this.cellWidth / 2,
            originY = x * this.cellWidth + this.cellWidth / 2;
        
        context.shadowOffsetX = 2;
        context.shadowOffsetY = 2;
        context.shadowBlur = 5;
        context.shadowColor = '#777';
        context.fillStyle = player == 1? '#fff' : '#000';
        context.beginPath();
        context.arc(originX, originY, this.cellWidth * 0.4, 0, Math.PI * 2, false);
        context.closePath();
        context.fill();
    }

    // 悔棋
    wipe() {
        this.clearChessBoard();
        this.scanData();
    }

    // 清空棋盘
    clearChessBoard() {
        this.board.remove();
        this.init();
    }
}

