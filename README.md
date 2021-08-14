# GobangGame

web版五子棋
功能：
1. 支持dom和canvas两种渲染方式
2. 可以切换棋盘大小调整难度
3. 支持悔棋和撤销悔棋
4. 双方轮流操作，无AI


实现：
技术栈：js + css3

基于mvc架构设计
model
    game类：
        渲染器
        棋盘落子数据
        游戏历史（记录落子位置和顺序，实现悔棋和撤销悔棋的数据结构）-- history类
        棋盘大小（n阶）
        方法：
            getRender()
            play()
            restart()
            rollback()
            cancelRollback()
            isWin()
            isDrawGame()

    history类：
        落子位置链表
        当前位置（表示当前视图里的信息）
        方法：
            play() -- push操作
            rollback()
            cancelRollback()
            isRollbackValid() -- 当前进度是否可以悔棋
            isCancelValid() -- 当前进度是否可以撤销悔棋

controller
    监听用户操作
    将用户操作信息传递到model
    控制视图渲染

view
    渲染器抽象基类：
        棋盘大小（n阶）
        棋盘渲染宽度（高度）
        棋盘格子宽度（高度）
        棋盘落子数据
        方法：
            init() -- 初始化棋盘，渲染视图
            play() -- 渲染当前落子
            wipe() -- 悔棋，擦除某个棋子
            clear() -- 擦除所有棋子

