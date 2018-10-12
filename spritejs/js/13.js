$(function(){

    const { Scene, Sprite, Group, Label } = spritejs;
    const scene = new Scene('#container',{
        resolution: [750, 2668],
    });
    const layer = scene.layer();

    //随机范围数
    function rd(n,m){
        var c = m-n+1; 
        return Math.floor(Math.random() * c + n);
    }

    //总的配置信息
    const CONFIG = {
        ballCount: 10, //坠落球体总数
    };    

    //文本信息
    var wordGroup = new Group();
    wordGroup.attr({
        pos:[20,20]
    });
    var word1 = new Label('接到的球体数量: 0个');
    word1.attr({
        pos:[0, 0],
        font:'26px Arial',
        fillColor:'#999',
    });
    var word2 = new Label('坠落的球体数量: 0个');
    word2.attr({
        pos:[0,30],
        font:'26px Arial',  
        fillColor:'#999',
    })
    wordGroup.append(word1, word2);
    layer.append(wordGroup);

    //创建新的球体
    var createBall = function(num){
        var ball = new Sprite();
        ball.attr({
            name:'ball_'+num,
            pos:[ rd(0,750-100), -100 ],
            size:[100,100],
            bgcolor:'#f00',
            borderRadius:50
        });
        layer.append(ball);        

        return ball;
    }

    // 添加到数组中
    const blocks = [];
    for(let i = 0 ; i < CONFIG.ballCount ; i++ ){
        var nb = createBall(i);
        blocks.push(nb);
    }

    //下落数
    var downNum=0;
    var timer = setInterval(()=>{
    
        //全部跑完就停止
        if( downNum > blocks.length -1 ){
            clearInterval(timer);
        }else{
            //下落动画
            blocks[downNum].animate([
                { y: -100 },
                { y: 2668 },
            ],{
                duration: rd(5000,10000),
                iterations: 1,
            });
            
            downNum++;            
            word2.text = `坠落的球体数量: ${downNum}个`;
        }
    },1000);


    //建立接球物体
    var peopel = new Sprite();
    peopel.attr({
        name:'peopel',
        size:[200,100],
        pos:[(750-200)/2,1000],
        bgcolor:'orangered'
    });
    layer.append(peopel);
    



    //移动处理
    layer.on('touchmove',function(evt){
        var x = Math.round( evt.x );
        var y = Math.round( evt.y );
        peopel.attr({
            pos:[x-100,1000]
        });
    });

    //实时更新
    var resNum=0;
    layer.on('update',function(evt){
        blocks.forEach((ball) => {
            if( peopel.OBBCollision(ball) ){
                resNum+=1;
                word1.text = `接到的球体数量: ${resNum}个`;                
                ball.attr({
                    bgcolor:'#555'
                });
                layer.remove(ball);
            }
        });
    });


});