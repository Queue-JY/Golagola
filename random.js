const { useState, useEffect, useRef } = React;

const Header = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (loggedInUser) {
            setUser(JSON.parse(localStorage.getItem('user_' + loggedInUser)));
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('loggedInUser');
        window.location.href = 'index.html';
        alert('로그아웃되었습니다!');
    };

    return (
        <header className="bg-white shadow-sm py-4 sticky top-0 z-20">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-pink-600"><span className="gola-font">GOLAGOLA</span></h1>
                <nav>
                    <ul className="flex space-x-6 text-gray-600 items-center">
                        <li><a href="index.html" className="hover:text-pink-600 transition">홈</a></li>
                        <li><a href="random.html" className="font-bold text-pink-600">랜덤 도구</a></li>
                        <li><a href="community.html" className="hover:text-pink-600 transition">커뮤니티</a></li>
                        <li>
                            {user ? (
                                <>
                                    <span className="text-pink-600">{user.name}님</span>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <button onClick={logout} className="text-gray-600 hover:text-pink-600 transition">로그아웃</button>
                                </>
                            ) : (
                                <>
                                    <a href="login.html" className="hover:text-pink-600 transition">로그인</a>
                                    <span className="mx-2 text-gray-400">|</span>
                                    <a href="signup.html" className="hover:text-pink-600 transition">회원가입</a>
                                </>
                            )}
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

const Roulette = () => {
    const canvasRef = useRef(null);
    const [options, setOptions] = useState('');
    const [spinning, setSpinning] = useState(false);
    const [result, setResult] = useState('');

    const drawRoulette = (opts) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const colors = ['#A7F3D0', '#FECACA', '#BAE6FD', '#FBCFE8', '#E5E7EB'];
        const arc = Math.PI * 2 / opts.length;
        let startAngle = -Math.PI / 2; // 12시 방향 시작

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < opts.length; i++) {
            ctx.beginPath();
            ctx.fillStyle = colors[i % colors.length];
            ctx.moveTo(150, 150);
            ctx.arc(150, 150, 150, startAngle, startAngle + arc);
            ctx.fill();
            ctx.fillStyle = '#1F2937';
            ctx.font = '16px HancomMalangMalang-Regular';
            ctx.save();
            ctx.translate(150, 150);
            ctx.rotate(startAngle + arc / 2);
            ctx.fillText(opts[i], 80, 10);
            ctx.restore();
            startAngle += arc;
        }
    };

    const spinRoulette = () => {
        const opts = options.split(',').map(opt => opt.trim()).filter(opt => opt);
        if (opts.length < 2) {
            alert('최소 2개의 옵션을 입력해주세요!');
            return;
        }
        setSpinning(true);
        setResult('');
        drawRoulette(opts);

        let rotation = 0;
        const spinTime = 5000;
        const start = Date.now();
        const totalRotations = 5 + Math.random() * 5;
        const spin = setInterval(() => {
            const elapsed = Date.now() - start;
            const progress = elapsed / spinTime;
            const easeOut = 1 - Math.pow(1 - progress, 3);
            rotation = totalRotations * 2 * Math.PI * easeOut;
            canvasRef.current.style.transform = `rotate(${rotation}rad)`;

            if (elapsed > spinTime) {
                clearInterval(spin);
                const arc = Math.PI * 2 / opts.length;
                const finalAngle = rotation % (2 * Math.PI);
                const normalizedAngle = (finalAngle + Math.PI / 2) % (2 * Math.PI);
                const selectedIndex = Math.floor(normalizedAngle / arc);
                const selectedOption = opts[selectedIndex];
                alert(`선택된 결과: ${selectedOption}`);
                setResult(`결과: ${selectedOption}`);
                const targetAngle = selectedIndex * arc - Math.PI / 2;
                canvasRef.current.style.transform = `rotate(${rotation - finalAngle + targetAngle}rad)`;
                setSpinning(false);
            }
        }, 16);
    };

    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const opts = urlParams.get('options');
        if (opts) {
            setOptions(decodeURIComponent(opts));
            drawRoulette(decodeURIComponent(opts).split(',').map(opt => opt.trim()).filter(opt => opt));
        } else {
            drawRoulette(['옵션1', '옵션2', '옵션3']);
        }
    }, []);

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">룰렛 돌리기</h3>
            <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                placeholder="옵션 입력 (쉼표로 구분, 예: 짜장면,짬뽕,탕수육)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">쉼표로 구분된 옵션을 입력해 무작위로 하나를 선택하세요.</p>
            <div className="roulette-container">
                <div className="roulette-pointer"></div>
                <canvas ref={canvasRef} width="300" height="300" className="mx-auto mb-4"></canvas>
            </div>
            <button onClick={spinRoulette} disabled={spinning} className={`bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover w-full ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {spinning ? '돌리는 중...' : '돌리기'}
            </button>
            {result && <div className="text-center text-lg font-semibold text-gray-800 mt-4">{result}</div>}
        </div>
    );
};

const Ladder = () => {
    const canvasRef = useRef(null);
    const [participants, setParticipants] = useState('');
    const [results, setResults] = useState('');
    const [ladderLines, setLadderLines] = useState([]);
    const [ladderResults, setLadderResults] = useState([]);
    const [isAddingLine, setIsAddingLine] = useState(false);

    const drawLadderCanvas = (parts, res) => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        const step = 300 / (parts.length + 1);
        for (let i = 1; i <= parts.length; i++) {
            ctx.beginPath();
            ctx.moveTo(i * step, 50);
            ctx.lineTo(i * step, 250);
            ctx.strokeStyle = '#1F2937';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#1F2937';
            ctx.font = '14px HancomMalangMalang-Regular';
            ctx.fillText(parts[i - 1], i * step - 20, 40);
            if (res[i - 1]) {
                ctx.fillText(res[i - 1], i * step - 20, 270);
            }
        }

        ladderLines.forEach(line => {
            ctx.beginPath();
            ctx.moveTo(line.col * step, line.y);
            ctx.lineTo((line.col + 1) * step, line.y);
            ctx.strokeStyle = '#EF4444';
            ctx.lineWidth = 2;
            ctx.stroke();
        });
    };

    const addLadderLine = () => {
        const parts = participants.split(',').map(p => p.trim()).filter(p => p);
        if (parts.length < 2) {
            alert('최소 2명의 참가자를 입력해주세요!');
            return;
        }
        setIsAddingLine(true);
    };

    const handleCanvasClick = (e) => {
        e.stopPropagation();
        if (!isAddingLine) return;
        const parts = participants.split(',').map(p => p.trim()).filter(p => p);
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const step = 300 / (parts.length + 1);
        const col = Math.round(x / step);
        if (col >= 1 && col < parts.length && y > 50 && y < 250) {
            const lineY = Math.round((y - 50) / 50) * 50 + 50;
            setLadderLines(prev => {
                const newLines = [...prev, { col, y: lineY }];
                drawLadderCanvas(parts, results.split(',').map(r => r.trim()).filter(r => r));
                return newLines;
            });
            setIsAddingLine(false);
        }
    };

    const calculateLadderResults = (parts, res, lines) => {
        const step = 300 / (parts.length + 1);
        const finalResults = [];

        for (let i = 0; i < parts.length; i++) {
            let currentCol = i + 1;
            let currentY = 50;

            while (currentY < 250) {
                const line = lines.find(l => l.col === currentCol && Math.abs(l.y - currentY) < 25) ||
                            lines.find(l => l.col === currentCol - 1 && Math.abs(l.y - currentY) < 25);

                if (line) {
                    if (line.col === currentCol) {
                        currentCol -= 1;
                    } else if (line.col === currentCol - 1) {
                        currentCol += 1;
                    }
                    currentY = line.y + 1;
                } else {
                    currentY += 25;
                }
            }

            finalResults.push({
                participant: parts[i],
                result: res[currentCol - 1]
            });
        }

        return finalResults;
    };

    const startLadder = () => {
        const parts = participants.split(',').map(p => p.trim()).filter(p => p);
        const res = results.split(',').map(r => r.trim()).filter(r => r);
        if (parts.length < 2 || res.length !== parts.length) {
            alert('참가자와 결과는 같은 수로 입력해주세요!');
            return;
        }

        const finalResults = calculateLadderResults(parts, res, ladderLines);
        setLadderResults(finalResults);
    };

    useEffect(() => {
        const loadFonts = async () => {
            const font1 = new FontFace('Cafe24Nyangi-W-v1.0', 'url(https://fastly.jsdelivr.net/gh/projectnoonnu/2410-1@1.0/Cafe24Nyangi-W-v1.0.woff2)');
            const font2 = new FontFace('HancomMalangMalang-Regular', 'url(https://fastly.jsdelivr.net/gh/projectnoonnu/2406-1@1.0/HancomMalangMalang-Regular.woff2)');
            await Promise.all([font1.load(), font2.load()]).then(loadedFonts => {
                loadedFonts.forEach(font => document.fonts.add(font));
                document.fonts.ready.then(() => {
                    const parts = participants.split(',').map(p => p.trim()).filter(p => p);
                    const res = results.split(',').map(r => r.trim()).filter(r => r);
                    if (parts.length >= 2) {
                        drawLadderCanvas(parts, res);
                    } else {
                        setLadderLines([]);
                        setLadderResults([]);
                        if (canvasRef.current) {
                            const ctx = canvasRef.current.getContext('2d');
                            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
                        }
                    }
                });
            });
        };
        loadFonts();
    }, [participants, results, ladderLines]);

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">사다리타기</h3>
            <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                placeholder="참가자 입력 (쉼표로 구분, 예: 철수,영희,민수)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <input
                type="text"
                value={results}
                onChange={(e) => setResults(e.target.value)}
                onFocus={(e) => e.stopPropagation()}
                placeholder="결과 입력 (쉼표로 구분, 예: 짜장면,짬뽕,탕수육)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">참가자와 결과를 입력하고 가로선을 추가해 결과를 배정하세요.</p>
            <canvas
                ref={canvasRef}
                width="300"
                height="300"
                className="mx-auto mb-4"
                style={{ width: '300px', height: '300px' }}
                onClick={handleCanvasClick}
            ></canvas>
            <div className="flex justify-center mb-4">
                <button
                    onClick={addLadderLine}
                    className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold btn-hover mr-2"
                >
                    {isAddingLine ? '가로선 위치 선택 중...' : '가로선 추가'}
                </button>
                <button
                    onClick={startLadder}
                    className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover"
                >
                    사다리 시작
                </button>
            </div>
            <div className="text-center text-lg font-semibold text-gray-800 mb-4">
                {ladderResults.length > 0 ? (
                    <div>
                        <h4 className="font-semibold">결과:</h4>
                        {ladderResults.map((res, index) => (
                            <div key={index}>{`${res.participant} → ${res.result}`}</div>
                        ))}
                    </div>
                ) : (
                    <div>참가자와 결과를 입력하고 사다리를 시작하세요.</div>
                )}
            </div>
        </div>
    );
};

const Race = () => {
    const [options, setOptions] = useState('');
    const [racing, setRacing] = useState(false);

    const startRace = () => {
        const opts = options.split(',').map(opt => p.trim()).filter(p => p);
        if (opts.length < 2) {
            alert('최소 2개의 입력해주세요!');
            return;
        }
        setRacing(true);
        setTimeout(() => {
            const winnerIndex = Math.floor(Math.random() * opts.length);
            setTimeout(() => {
                alert(`우승 결과: ${opts[winnerIndex]}`);
                setRacing(false);
            }, 2100);
        }, 100);
    };

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">레이스</h3>
            <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="옵션 입력 (쉼표로 구분, 예: 짜장면,짬뽕,탕수육)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">옵션들이 경주를 벌여 승자를 결정합니다.</p>
            <div id="raceTrack" className="space-y-4 mb-4">
                {options.split(',').map(opt => opt.trim()).filter(opt => opt).map((option, index) => (
                    <div key={index} className="relative h-10 bg-gray-200 rounded-lg overflow-hidden">
                        <div
                            className={`absolute h-full bg-pink-600 text-white text-sm flex items-center px-2 transition-all duration-2000`}
                            style={{ width: racing ? (index === Math.floor(Math.random() * options.split(',').length) ? '100%' : `${Math.random() * 80 + 10}%`) : '0%' }}
                        >
                            {option}
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={startRace} disabled={racing} className={`bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover w-full ${racing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {racing ? '레이스 진행 중...' : '레이스 시작'}
            </button>
        </div>
    );
};

const Queue = () => {
    const [options, setOptions] = useState('');
    const [queueResult, setQueueResult] = useState([]);

    const startQueue = () => {
        const opts = [...options].split(',').map(opt => opt.trim()).filter(opt => opt.length);
        if (opts.length < 2) {
            alert('최소 2개의 옵션을 입력해주세요!');
            return;
        }
        const shuffled = [...opts].sort(() => Math.random() - 0.5);
        setQueueResult(shuffled);
        localStorage.setItem('queueResult', JSON.stringify(shuffled));
    };

    const shareQueue = () => {
        const result = JSON.parse(localStorage.getItem('queueResult') || '[]');
        if (result.length === 0) {
            alert('먼저 줄서기를 실행해주세요!');
            return;
        }
        const text = `줄서기 결과:\n${result.map((opt, i) => `${i + 1}. ${opt}`).join('\n')}`;
        navigator.clipboard.writeText(text).then(() => {
            alert('결과가 클립보드에 복사되었습니다!');
        });
    };

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">줄서기</h3>
            <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                onChange={(e) => setOptions(e)}
                placeholder="옵션 입력 (쉼표로 구분, 예: 짜장면,짬뽕,탕수육)"
                className="w-full p-3 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">옵션들을 무작위로 순서를 정렬합니다.</p>
            <div id="queueResult" className="space-y-2 mb-4">
                {queueResult.map((opt, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        <span className="text-pink-600 font-semibold">{index + 1}등</span>
                        <span>{opt}</span>
                    </div>
                ))}
            </div>
            <button onClick={startQueue} className="bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover mr-2">줄세우기</button>
            <button onClick={shareQueue} className="bg-gray-500 text-white px-6 py-3 rounded-lg font-semibold btn-hover">결과 공유</button>
        </div>
    );
};

const Draw = () => {
    const [options, setOptions] = useState('');
    const [result, setResult] = useState('');
    const [drawing, setDrawing] = useState(false);

    const startDraw = () => {
        const opts = options.split(',').map(opt => opt.trim()).filter(opt => opt);
        if (opts.length < 1) {
            alert('최소 1개의 옵션을 입력해주세요!');
            return;
        }
        setDrawing(true);
        setResult('뽑는 중...');
        setTimeout(() => {
            const selected = opts[Math.floor(Math.random() * opts.length)];
            setResult(`뽑힌 결과: ${selected}`);
            setDrawing(false);
        }, 1000);
    };

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">뽑기</h3>
            <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="옵션 입력 (쉼표로 구분, 예: 짜장면,짬뽕,탕수육)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">입력한 옵션 중 하나를 무작위로 선택합니다.</p>
            <div className="text-center text-lg font-semibold text-gray-800 mb-4">{result}</div>
            <button onClick={startDraw} disabled={drawing} className={`bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover w-full ${drawing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {drawing ? '뽑는 중...' : '뽑기'}
            </button>
        </div>
    );
};

const Luck = () => {
    const [options, setOptions] = useState('');
    const [result, setResult] = useState('');
    const [drawing, setDrawing] = useState(false);

    const startLuck = () => {
        const opts = options.split(',').map(opt => opt.trim()).filter(opt => opt);
        if (opts.length < 1) {
            alert('최소 1개의 옵션을 입력해주세요!');
            return;
        }
        setDrawing(true);
        setResult('복불복 진행 중...');
        setTimeout(() => {
            const isLucky = Math.random() > 0.3;
            const selected = isLucky ? opts[Math.floor(Math.random() * opts.length)] : '꽝!';
            setResult(`결과: ${selected}`);
            setDrawing(false);
        }, 1000);
    };

    return (
        <div className="card p-8 max-w-3xl mx-auto mb-12 fade-in">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">복불복</h3>
            <input
                type="text"
                value={options}
                onChange={(e) => setOptions(e.target.value)}
                placeholder="옵션 입력 (쉼표로 구분, 예: 당첨,꽝)"
                className="w-full p-3 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-pink-400"
            />
            <p className="tool-description">옵션 중 하나를 선택하거나 30% 확률로 '꽝'이 나옵니다.</p>
            <div className="text-center text-lg font-semibold text-gray-800 mb-4">{result}</div>
            <button onClick={startLuck} disabled={drawing} className={`bg-pink-600 text-white px-6 py-3 rounded-lg font-semibold btn-hover w-full ${drawing ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {drawing ? '진행 중...' : '복불복 시작'}
            </button>
        </div>
    );
};

const App = () => {
    return (
        <>
            <Header />
            <section className="py-12">
                <div className="container mx-auto px-4">
                    <h2 className="text-4xl font-bold text-white text-center mb-8 fade-in drop-shadow-lg">랜덤 결정 도구</h2>
                    <p className="text-lg text-white text-center mb-12 max-w-2xl mx-auto fade-in drop-shadow">고민될 때, 재미있고 빠르게 결정을 도와드립니다!</p>
                    <Roulette />
                    <Ladder />
                    <Race />
                    <Queue />
                    <Draw />
                    <Luck />
                </div>
            </section>
            <footer className="bg-gray-900 text-white py-6">
                <div className="container mx-auto px-4 text-center">
                    <p>© GOLAGOLA. All rights reserved.</p>
                </div>
            </footer>
        </>
    );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
