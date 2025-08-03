import { useEffect, useRef, useState } from "react"

export function useTimer(startInitially = false) {
    const [seconds, setSeconds] = useState(0)
    const [isRunning, setIsRunning] = useState(startInitially)
    const intervalRef = useRef<NodeJS.Timeout | null>(null)
  
    useEffect(() => {
      if (isRunning) {
        intervalRef.current = setInterval(() => {
          setSeconds((prev) => prev + 1)
        }, 1000)
      } else if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
  
      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current)
        }
      }
    }, [isRunning])
  
    const start = () => setIsRunning(true)
    const pause = () => setIsRunning(false)
    const reset = () => {
      setSeconds(0)
      setIsRunning(false)
    }
  
    return {
      seconds,
      isRunning,
      start,
      pause,
      reset,
    }
  }