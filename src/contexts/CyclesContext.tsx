import { createContext, ReactNode, useEffect, useReducer, useState } from "react";
import { Cycle, cyclesReducer } from "../reducers/cycles/reducer";
import { AddNewCycleAction, interruptCurrentCycleAction, markCurrentCycleAsFinishedAction } from "../reducers/cycles/actions";
import { differenceInSeconds } from "date-fns";

interface CreateCycleData {
    task:string,
    minutesAmount:number
}

interface CyclesContextType {
    cycles:Cycle[]
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondPassed:number
    setSecondsPassed: (seconds: number) => void
    createNewCycle: (data: CreateCycleData) => void
    interruptCurrentCycle: () => void
}


//Coloco no contexto um objeto que contém variáveis que serão compartilhadas entre os componentes. Pai --> Filhos
export const CyclesContext = createContext({} as CyclesContextType)

interface CyclesContextProviderProps {
    children: ReactNode //É qualquer jsx ou html válido (tipo divs, textos ...)
}



//O conteúdo de children é criado automaticamente pelo react, sendo tudo que é passado dentro do componente (no caso CyclesContextProvider)
export function CyclesContextProvider ({children}: CyclesContextProviderProps) {

    //dispatch dispara a action
    const [cyclesState, dispatch] = useReducer(cyclesReducer, 
    {
        cycles: [], 
        activeCycleId:null
    },

    (initialState) => {
        const storedStateAsJSON = localStorage.getItem('@ignite-timer: cycles-state-1.0.0')

        if (storedStateAsJSON) {
            return JSON.parse(storedStateAsJSON)
        }

        return initialState
    }
    
    
    )

    const {activeCycleId, cycles} = cyclesState
    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)


    const [amountSecondPassed, setAmountSecondPassed] = useState(() => {
        if(activeCycle) {
            return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
        }

        return 0
    })

    useEffect(() => {

        const stateJSON = JSON.stringify(cyclesState)
        localStorage.setItem('@ignite-timer: cycles-state-1.0.0', stateJSON)

    }, [cyclesState])

    

    

    function setSecondsPassed (seconds: number) {
        setAmountSecondPassed(seconds)
    }

    function markCurrentCycleAsFinished () {

        dispatch(markCurrentCycleAsFinishedAction())
    }

    function createNewCycle(data: CreateCycleData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date() //Data atual
        }

        dispatch(AddNewCycleAction(newCycle))

        setAmountSecondPassed(0) //Zera a variável antes de começar um novo ciclo para não reaproveitar esse valor para o outro ciclo

    }

    function interruptCurrentCycle () {

        dispatch(interruptCurrentCycleAction())

    }


    return (
        <CyclesContext.Provider 
            value={{
                cycles,
                activeCycle, 
                activeCycleId, 
                markCurrentCycleAsFinished, 
                amountSecondPassed, 
                setSecondsPassed,
                createNewCycle,
                interruptCurrentCycle
            }}
        >
            {children}
        </CyclesContext.Provider>
    )
}