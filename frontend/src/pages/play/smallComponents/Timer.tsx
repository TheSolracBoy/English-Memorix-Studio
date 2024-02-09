
interface TimerProps {
  seconds: number
}
export default function Timer({ seconds }: TimerProps) {

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Use String.prototype.padStart to ensure two-digit format
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
  };

  return (
    <div className="border-2 border-cyan-100 rounded-md px-2 py-1 w-24 ">
      <p className="text-2xl text-center ">{formatTime()}</p>
    </div>
  );
}
