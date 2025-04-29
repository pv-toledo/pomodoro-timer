import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' //Usando assim pois zod não tem export default
import { createContext, useState } from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown";


interface Cycle {
    id: string
    task: string
    minutesAmount: number
    startDate: Date
    interruptedDate?: Date
    finishedDate?: Date
}

interface CyclesContextType {
    activeCycle: Cycle | undefined
    activeCycleId: string | null
    markCurrentCycleAsFinished: () => void
    amountSecondPassed:number
    setSecondsPassed: (seconds: number) => void
}


//Coloco no contexto um objeto que contém variáveis que serão compartilhadas entre os componentes. Pai --> Filhos
export const CyclesContext = createContext({} as CyclesContextType)

export function Home() {

    const [cycles, setCycles] = useState<Cycle[]>([])
    const [activeCycleId, setActiveCycleId] = useState<string | null>(null) //Começa sem ciclo ativo (null)
    const [amountSecondPassed, setAmountSecondPassed] = useState(0)

    /** a função register recebe um nome e retorna várias propriedades de input como:
         * onChange ()
         * onBlur ()
         * onFocus ()
         * por isso se usa o spread operator
         */
    
        //Object é o formato de data que vem do form
        const newCycleFormValidationSchema = zod.object({
            //Deve ser uma string, com no mínimo 1 caracter. Se não, mostra a mensagem no segundo argumento de min
            task: zod.string().min(1, 'Informe a tarefa'),
            minutesAmount: zod
                .number()
                .min(5, 'o ciclo precisa ser de no mínimo 5 minutos')
                .max(60, 'o ciclo precisa ser de no máximo 60 minutos')
        })
    
        //Infere a tipagem do data do form a partir do schema que foi feito previamente
        type newCycleFormData = zod.infer<typeof newCycleFormValidationSchema>

    //formState mostra os erros de validação
        const newCycleForm = useForm<newCycleFormData>({
            resolver: zodResolver(newCycleFormValidationSchema),
            defaultValues: {
                task: '',
                minutesAmount: 0
            }
        })

    
    const { handleSubmit, watch, reset } = newCycleForm
    
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


    // data é onde eu acesso todas as informações que vêm do form
    function handleCreateNewCycle(data: newCycleFormData) {

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

        reset(); //Volta os campos do formulário segundo foi colocado no default values no schema
    }

    function handleInterruptCycle () {

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

    const task = watch('task') //Monitora o campo task que foi declarado no register do input task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            {/* handleSubmit do hookForm passa uma função para dentro do onSubmit do form html */}
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                <CyclesContext.Provider 
                    value={{activeCycle, activeCycleId, markCurrentCycleAsFinished, amountSecondPassed, setSecondsPassed}}
                >
                    <FormProvider {...newCycleForm}>
                        <NewCycleForm />
                    </FormProvider>
                    
                    <Countdown />

                </CyclesContext.Provider>
                {activeCycle ? (
                    <StopCountdownButton onClick={handleInterruptCycle} type="button">
                        <HandPalm size={24} />
                        Interromper
                    </StopCountdownButton>
                ) : (
                    <StartCountdownButton disabled={isSubmitDisabled} type="submit">
                        <Play size={24} />
                        Começar
                    </StartCountdownButton>
                )}
            </form>
        </HomeContainer>

    )
}