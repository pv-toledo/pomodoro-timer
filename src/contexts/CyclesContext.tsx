import { createContext, ReactNode, useState } from "react";

interface CreateCycleData {
    task:string,
    minutesAmount:number
}

interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
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
    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null) //Começa sem ciclo ativo (null)
    const [amountSecondPassed, setAmountSecondPassed] = useState(0)

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    function setSecondsPassed (seconds: number) {
        setAmountSecondPassed(seconds)
    }

    function markCurrentCycleAsFinished () {
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId) {
                return {...cycle, finishedDate: new Date ()}
            } else {
                return cycle
            }
        }))
    }

    function createNewCycle(data: CreateCycleData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount,
            startDate: new Date() //Data atual
        }

        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)

        setAmountSecondPassed(0) //Zera a variável antes de começar um novo ciclo para não reaproveitar esse valor para o outro ciclo

    }

    function interruptCurrentCycle () {

        //Anoto dentro do ciclo que ele foi interrompido na data atual
        setCycles(state => state.map(cycle => {
            if(cycle.id === activeCycleId) {
                return {...cycle, interruptedDate: new Date ()}
            } else {
                return cycle
            }
        }))

        //Digo que não tenho mais nenhum ciclo ativo
        setActiveCycleId(null)
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