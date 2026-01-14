import './CleanButton.css';

function CleanButton({ onClick }) {
    return (
        <div className="clean-btn" onClick={onClick}>
            ✨ начать заново
        </div>
    );
}

export default CleanButton;
