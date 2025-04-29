import { useContext, useEffect } from "react";
import { CountdownContainer, Separator } from "./styles";
import { differenceInSeconds } from "date-fns";
import { CyclesContext } from "../../../../contexts/CyclesContext";




export function Countdown() {
    const {activeCycle,activeCycleId,markCurrentCycleAsFinished, amountSecondPassed, setSecondsPassed} = useContext(CyclesContext)
    

    const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0

    useEffect(() => {
        let interval:number

        if (activeCycle) {
            interval = setInterval(() => {

                const secondsDifference = differenceInSeconds(new Date(), activeCycle.startDate)

                //Caso o total de segundos percorridos é igual ao total de segundos do ciclo, marca como completo e não atualiza mais a diferença de segundos
                if ( secondsDifference>=totalSeconds) {
                    markCurrentCycleAsFinished()
                    setSecondsPassed(totalSeconds)
                    clearInterval(interval)
                } else {
                    setSecondsPassed(secondsDifference)
                }
                
            }, 1000)
        }

        return () => { //Limpa o intervalo anterior quando se cria um novo ciclo
            clearInterval(interval)
        }
    }, [activeCycle, totalSeconds, activeCycleId, markCurrentCycleAsFinished])

    const currentSeconds = activeCycle ? totalSeconds - amountSecondPassed : 0
    
        const minutesAmount = Math.floor(currentSeconds / 60)
        const secondsAmount = currentSeconds % 60
    
        //Preenche a string com 0 para ter 2 caracteres
        const minutes = String(minutesAmount).padStart(2, '0')
        const seconds = String(secondsAmount).padStart(2, '0')
    
        useEffect(() => {
            if (activeCycle) {
                document.title = `${minutes}:${seconds}`
            }
            
        }, [minutes, seconds])


    return (
        <CountdownContainer>
            <span>{minutes[0]}</span>
            <span>{minutes[1]}</span>
            <Separator>:</Separator>
            <span>{seconds[0]}</span>
            <span>{seconds[1]}</span>
        </CountdownContainer>
    )
}