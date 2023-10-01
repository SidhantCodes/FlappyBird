let moveSpeed = 3;
let gravity = 0.5;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird1');

let bg = document.querySelector('.background').getBoundingClientRect();
let scoreVal = document.querySelector('.score-val');
let message = document.querySelector('.message');
let scoreTitle = document.querySelector('.score-title');
let gameState = 'Start';
let highScore = 0;
let highScoreElement = document.getElementById('high-score');

let soundPoint = new Audio('audio/point.mp3');
let hs = new Audio('audio/hs.mp3');
let die = new Audio('audio/die.mp3');
let flag = 0;

img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && gameState !== 'Play') {
        document.querySelectorAll('.pipe_sprite').forEach((e) => {
            e.remove();
        });
        img.style.display = 'block';
        bird.style.top = '40vh';
        gameState = 'Play';
        message.innerHTML = '';
        scoreTitle.innerHTML = 'Score: ';
        scoreVal.innerHTML = '0';
        message.classList.remove('messageStyle');
        play();
    }
});

function play() {
    function move() {
        if (gameState !== 'Play') return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            let birdProps = bird.getBoundingClientRect(); // Move this line inside the loop

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (
                    birdProps.left < pipe_sprite_props.left + pipe_sprite_props.width &&
                    birdProps.left + birdProps.width > pipe_sprite_props.left &&
                    birdProps.top < pipe_sprite_props.top + pipe_sprite_props.height &&
                    birdProps.top + birdProps.height > pipe_sprite_props.top
                ) {
                    gameState = 'End';
                    message.innerHTML = ('Game Over ~_~').fontcolor('red') + '<br>Press Enter to restart!';
                    message.classList.add('messageStyle');
                    die.play();
                    img.style.display = 'none';
                    return;
                } else {
                    if (
                        pipe_sprite_props.right < birdProps.left &&
                        pipe_sprite_props.right + moveSpeed >= birdProps.left &&
                        element.increase_score === '1'
                    ) {
                        scoreVal.innerHTML++;
                        
                        if (parseInt(scoreVal.innerHTML) > highScore) {
                            highScore = parseInt(scoreVal.innerHTML);
                            highScoreElement.innerHTML = highScore; 
                            flag = 1;
                            
                        }

                        if(flag === 0){
                            soundPoint.play();
                        }else{
                            hs.play();
                            flag = 0;
                        }
                    }
                    element.style.left = pipe_sprite_props.left - moveSpeed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let birdDy = 0;
    let birdProps = bird.getBoundingClientRect(); // Initialize birdProps

    function applyGravity() {
        if (gameState !== 'Play') return;

        birdDy = birdDy + gravity;

        document.addEventListener('keydown', (e) => {
            if (e.key === ' ') { // Fixed here
                img.src = 'img/b2.png';
                birdDy = -7.6;
            }
        });

        document.addEventListener('keyup', (e) => {
            if (e.key === ' ') {
                img.src = 'img/b1.png';
            }
        });

        if (birdProps.top <= 0 || birdProps.bottom >= bg.bottom) {
            gameState = 'End';
            message.style.left = '28vw';
            window.location.reload();
            message.classList.remove('messageStyle');
            return;
        }

        bird.style.top = birdProps.top + birdDy + 'px';
        birdProps = bird.getBoundingClientRect(); // Update birdProps
        requestAnimationFrame(applyGravity);
    }

    requestAnimationFrame(applyGravity);

    let pipeSep = 0;
    let pipeGap = 35;

    function createPipe() {
        if (gameState !== 'Play') return;

        if (pipeSep > 115) {
            pipeSep = 0;

            let pipePos = Math.floor(Math.random() * 43) + 8;
            let pipeSpritInv = document.createElement('div');
            pipeSpritInv.className = 'pipe_sprite';
            pipeSpritInv.style.top = pipePos - 70 + 'vh';
            pipeSpritInv.style.left = '100vw';

            document.body.appendChild(pipeSpritInv);

            let pipeSprite = document.createElement('div');
            pipeSprite.className = 'pipe_sprite';
            pipeSprite.style.top = pipePos + pipeGap + 'vh';
            pipeSprite.style.left = '100vw';
            pipeSprite.increase_score = '1';

            document.body.appendChild(pipeSprite);
        }
        pipeSep++;
        requestAnimationFrame(createPipe);
    }
    requestAnimationFrame(createPipe);
}
