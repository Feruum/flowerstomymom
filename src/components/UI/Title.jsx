import './Title.css';

function Title() {
    return (
        <div className="romantic-overlay">
            <div className="heart-container">
                <svg
                    className="heart-svg"
                    viewBox="0 0 32 29.6"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M23.6,0c-3.4,0-6.3,2.7-7.6,5.6C14.7,2.7,11.8,0,8.4,0C3.8,0,0,3.8,0,8.4c0,9.4,9.5,11.9,16,21.2
            c6.1-9.3,16-12.1,16-21.2C32,3.8,28.2,0,23.6,0z"
                        fill="url(#heartGradient)"
                    />
                    <defs>
                        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#ff6b9d" />
                            <stop offset="50%" stopColor="#ff4757" />
                            <stop offset="100%" stopColor="#c44569" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <h1 className="romantic-title">Туған күнінмен , анашым!</h1>
            <p className="romantic-subtitle">Каждый клик цветок для тебя</p>
            <p className="romantic-hint">Нажми, чтобы вырастить цветы</p>
        </div>
    );
}

export default Title;
