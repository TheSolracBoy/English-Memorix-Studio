import { useEffect, useState } from "react";

export default function useTimer() {
	const [seconds, setSeconds] = useState(0);
	const [timerIsRunning, setTimerIsRunning] = useState(false);

	function handleStartTimer() {
		setTimerIsRunning(true)
	}
	function handleStopTimer() {
		setTimerIsRunning(false)
	}
	function handleRestartTimer() {
		setTimerIsRunning(true)
		setSeconds(0)
	}

	useEffect(() => {
		let intervalId: NodeJS.Timeout
		if (timerIsRunning) {

			const updateTimer = () => {
				setSeconds((prevSeconds) => prevSeconds + 1);
			};

			intervalId = setInterval(updateTimer, 1000);
		}

		return () => clearInterval(intervalId);
	}, [timerIsRunning]);

	return { seconds, handleStartTimer, handleStopTimer, handleRestartTimer }
}