
class DomBoard {
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
        let dom = document.createElement('div');
        dom.id = 'dom-board';
        dom.className = 'dom-mode';
        dom.style.width = this.chessBoardWidth + 'px';
        dom.style.height = this.chessBoardWidth + 'px';
        for(let i = 0; i < this.inlineCount; i++) {
            let domRow = document.createElement('div');
            domRow.className = 'cell-inline';
            for(let j = 0; j < this.inlineCount; j++) {
                let domCol = document.createElement('div');
                domCol.id = i + ',' + j;
                domCol.className = 'cell';
                domCol.style.width = this.cellWidth + 'px';
                domCol.style.height = this.cellWidth + 'px';
                domRow.appendChild(domCol);
            }
            dom.appendChild(domRow);
        }
        dom.addEventListener('click',(e) => {
            e = e || window.event;
            let [x,y] = [...e.target.id.split(',').map(item => parseInt(item))];
            let player = this.playHandler(x,y);
            if(player) {
                this.play(x, y, player);
            }
        }, false);
        this.container.appendChild(dom)
        this.board = dom;
        
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

    play(x, y, player) {
        const cellEl = document.getElementById(x + ',' + y);
        if(player == 1) {
            cellEl.className = 'cell white-chess';
        } else {
            cellEl.className = 'cell black-chess';
        }
    }

    wipe(x, y) {
        const cellEl = document.getElementById(x + ',' + y);
        cellEl.className = 'cell';
    }

    clearChessBoard() {
        this.board.remove();
        this.init();
    }

}
