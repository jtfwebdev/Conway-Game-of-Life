import { useEffect, useRef, useState, useContext } from 'react';
import Select from 'react-select';
import './ConwayBoard.css';
import { screenWidthContext } from './App';

const ConwayBoard = () => {

    const screenWidth = useContext(screenWidthContext);

    const [WIDTH, setWIDTH] = useState<number>(screenWidth > 420 ? 400 : 300);
    const [HEIGHT, setHEIGHT] = useState<number>(screenWidth > 420 ? 400 : 300);
    const [CELL_SIZE, setCELL_SIZE] = useState<number>(screenWidth > 420 ? 8 : 6);
    const NUM_ROWS = WIDTH / CELL_SIZE;
    const NUM_COLS = HEIGHT / CELL_SIZE;
    const [tickTime, setTickTime] = useState<number>(100);
    const [generation, setGeneration] = useState<number>(0);

    useEffect(() => {
        const resizeListener = () => {
            if (window.innerWidth > 420) {
                setWIDTH(400);
                setHEIGHT(400);
                setCELL_SIZE(8);
            } else {
                setWIDTH(300);
                setHEIGHT(300);
                setCELL_SIZE(6);
            }
        }

        window.addEventListener("resize", resizeListener);

        return () => window.removeEventListener("resize", resizeListener);
    }, []);

    const colours = ["black", "white"];

    type Board = number[][];

    function createBoard() : Board {
        return Array.from({length: NUM_ROWS}, () => 
            Array.from({length: NUM_COLS}, () => 0))
    }

    const board = createBoard();
    
    const [boardState, setBoardState] = useState<Board>(board)

    const canvasRef = useRef<null | HTMLCanvasElement>(null);

    useEffect(() => {
        if(canvasRef.current) {
            const ctx = canvasRef.current.getContext("2d");
            if(!ctx) return;

            ctx.clearRect(0, 0, WIDTH, HEIGHT);
            ctx.strokeStyle = "gray";
            ctx.lineWidth = 0.01;

            for (let r = 0; r < NUM_ROWS; r++) {
                for (let c = 0; c < NUM_COLS; c++) {
                    ctx.fillStyle = colours[boardState[r][c]]
                    ctx.fillRect(Math.floor(WIDTH / NUM_ROWS * r), Math.floor(HEIGHT / NUM_COLS * c), CELL_SIZE, CELL_SIZE);
                    ctx.strokeRect(Math.floor(WIDTH / NUM_ROWS * r), Math.floor(HEIGHT / NUM_COLS * c), CELL_SIZE, CELL_SIZE)
                }
            }
        }
    }, [boardState]);

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const x = Math.floor(e.nativeEvent.offsetX / CELL_SIZE);
        const y = Math.floor(e.nativeEvent.offsetY / CELL_SIZE);

        let updatedBoardState = [...boardState];
        if(updatedBoardState[x][y] === 0) {
            updatedBoardState[x][y] = 1;
        } else updatedBoardState[x][y] = 0;
        setBoardState(updatedBoardState);
    }

    const countNbors = (r0: number, c0: number) => {

        let count = 0;

        for (let dr = -1; dr <= 1; dr++) {
            for (let dc = -1; dc <= 1; dc++) {
                if (dr != 0 || dc != 0) {
                    const r = (r0 + dr + NUM_ROWS) % NUM_ROWS;
                    const c = (c0 + dc + NUM_COLS) % NUM_COLS;

                    if (boardState[r][c] === 1) {
                        count++;
                    }
                }
            }
        }
        return count;
    }

    const computeNextBoard = () => {
        setBoardState((prevBoardState) => {

            let newBoard = prevBoardState.map((r) => [...r]);

            for (let r = 0; r < NUM_ROWS; r++) {
                for (let c = 0; c < NUM_COLS; c++) {
                    const aliveCount = countNbors(r, c);
                    
                    if(prevBoardState[r][c] === 0) {
                        if(aliveCount === 3) {
                            newBoard[r][c] = 1
                        }
                    } else {
                            if (aliveCount !== 2 && aliveCount !== 3) {
                                newBoard[r][c] = 0 
                            }
                        }
                    }
                }
            setGeneration((prev) => prev + 1);
            return newBoard;
        });  
    }

    const [animationRunning, setAnimationRunning] = useState(false);

    useEffect(() => {
        if (!animationRunning) return;
        const interval = setInterval(computeNextBoard, tickTime);
        return () => clearInterval(interval);
    }, [animationRunning, computeNextBoard]);

    const handleRandomise = () => {

        resetCells();
        setGeneration(0);

        let updatedBoardState = [...boardState];

        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                const nbors = countNbors(r, c);
                const randomiser = Math.round(Math.random() - (nbors > 0 ? 0.25 : 0.49));
                updatedBoardState[r][c] = randomiser;
            }
        }
        setBoardState(updatedBoardState);
    }

    const resetCells = () => {
        let updatedBoardState = [...boardState];

        for (let r = 0; r < NUM_ROWS; r++) {
            for (let c = 0; c < NUM_COLS; c++) {
                updatedBoardState[r][c] = 0;
            }
        }
        setBoardState(updatedBoardState);
        setGeneration(0);
    }

    const handleReset = () => {
        resetCells();
        setAnimationRunning(false);
    }

    const gosperGliderGun: Board = [[0, 0], [-1, 0], [-3, 0], [-7, 0], [-16, 0], [-17, 0], [-1, -1], [-7, -1], [-16, -1], [-17, -1], [-2, -2], [-6, -2], [-4, -3], [-5, -3], [-1, 1], [-7, 1], [-2, 2], [-6, 2], [-4, 3],
    [-5, 3], [3, -1], [3, -2], [3, -3], [4, -1], [4, -2], [4, -3], [5, 0], [5, -4], [7, 0], [7, 1], [7, -4], [7, -5], [17, -2], [17, -3], [18, -2], [18, -3]];

    const pulsar: Board = [[-1, 0], [0, 0], [-2, 0], [-4, -2], [-4, -3], [4, 0], [5, 0], [6, 0], [1, 5], [-4, -1], [1, -1], [3, -1], [8, -1], [1, -2], [3, -2], [8, -2], [1, -3], [3, -3], [8, -3], [0, -5], [-1, -5], [-2, -5], [4, -5], [5, -5], [6, -5],
    [0, 2], [-1, 2], [-2, 2], [4, 2], [5, 2], [6, 2], [-4, 3], [1, 3], [3, 3], [8, 3], [-4, 4], [1, 4], [3, 4], [8, 4], [-4, 5], [1, 4], [3, 5], [8, 5], [-2, 7], [-1, 7], [0, 7], [4, 7], [5, 7], [6, 7]];

    const pentaDecathlon: Board = [[0, 0], [0, -1], [0, 1], [1, 0], [1, -1], [1, 1], [2, -1], [2, 1], [3, 0], [3, -1], [3, 1], [-1, 0], [-1, 1], [-1, -1], [-2, 0], [-2, -1], [-2, 1], [-3, -1], [-3, 1], [-4, 0], [-4, -1], [-4, 1]];

    const generatePreset = (arg: Board) => {

        resetCells();

        let updatedBoardState = [...boardState];

        arg.map((coords) => {
            updatedBoardState[(coords[0] + (WIDTH / CELL_SIZE / 2))][(coords[1] + (HEIGHT / CELL_SIZE / 2))] = 1;
        })
        setBoardState(updatedBoardState);
    }

    const [preset, setPreset] = useState<Board>([]);

    const options = [
        {value: gosperGliderGun, label: "Gosper Glider Gun"},
        {value: pulsar, label: "Pulsar"},
        {value: pentaDecathlon, label: "Penta-decathlon"}
    ]

    const handlePresetChange = (newPreset: any) => {
        setPreset(newPreset.value);
    }

    useEffect(() => {
        if (preset.length == 0) return;
        generatePreset(preset);
    }, [preset]);

    return ( 
        <div className="canvas_container">
            <div className="canvas_wrap">
                <canvas
                    width={WIDTH}
                    height={HEIGHT}
                    ref={canvasRef}
                    onClick={(e) => handleCanvasClick(e)}>
                </canvas>
                <h2>Generation {generation}</h2>
                {screenWidth < 631 && <button onClick={() => setAnimationRunning(!animationRunning)}>Start/Stop</button>}
            </div>
            {screenWidth < 631 && <div>
                <button onClick={() => handleReset()}>Reset</button>
                <button onClick={() => handleRandomise()}>Randomise</button>
            </div>}
            <div className="options_container">
                <div>
                    <label htmlFor="preset" className="presetTitle">Presets</label>
                    <Select options={options} onChange={handlePresetChange} />
                    {screenWidth < 631 && <div className="tickSelectWrap">
                        <h4>Tick duration</h4>
                        <div>
                            <input
                                type="range"
                                min="50"
                                max="300"
                                className="tickInput"
                                value={tickTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTickTime(e.currentTarget.valueAsNumber)}
                            />
                            <div className="tickSpeed">{`${tickTime}ms`}</div>
                        </div>
                    </div>}
                </div>
                {screenWidth > 630 && <div>
                    <button onClick={() => handleReset()}>Reset</button>
                    <button onClick={() => handleRandomise()}>Randomise</button>
                    <div className="tickSelectWrap">
                        <h4>Tick duration</h4>
                        <div>
                            <input
                                type="range"
                                min="50"
                                max="300"
                                className="tickInput"
                                value={tickTime}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTickTime(e.currentTarget.valueAsNumber)}
                            />
                            <div className="tickSpeed">{`${tickTime}ms`}</div>
                        </div>
                    </div>
                </div>}
                {screenWidth > 630 && <button onClick={() => setAnimationRunning(!animationRunning)}>Start/Stop</button>}
            </div>
        </div>
     );
}
 
export default ConwayBoard;