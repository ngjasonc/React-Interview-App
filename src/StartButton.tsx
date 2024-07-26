export default function StartButton({ onBattleStartClick }: { onBattleStartClick: (e: React.MouseEvent<HTMLElement>) => void; }) {
  return (
    <button type="button" className="Start-button" onClick={onBattleStartClick}>
      Start Battle!
    </button>
  );
}
