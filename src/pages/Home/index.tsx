import { Play } from "phosphor-react";
import { CountdownContainer, FormContainer, HomeContainer, MinutesAmountInput, Separator, StartCoutdownButton, TaskInput } from "./styles";
import { useForm } from "react-hook-form";
import {zodResolver} from '@hookform/resolvers/zod'
import * as zod from 'zod' //Usando assim pois zod não tem export default
import { useState } from "react";


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

interface Cycle {
    id: string;
    task: string;
    minutesAmount: number
}

const [cycles, setCycles] = useState<Cycle[]>([])
const [activeCycleId, setActiveCycleId] = useState<string | null>(null) //Começa sem ciclo ativo (null)

export function Home () {
    //formState mostra os erros de validação
    const {register, handleSubmit, watch, reset} = useForm<newCycleFormData>({
        resolver: zodResolver(newCycleFormValidationSchema),
        defaultValues: {
            task: '',
            minutesAmount: 0
        }
    })

    //data é onde eu acesso todas as informações que vêm do form
    function handleCreateNewCycle (data: newCycleFormData) {

        const id = String(new Date().getTime())

        const newCycle: Cycle = {
            id,
            task: data.task,
            minutesAmount: data.minutesAmount
        }
        
        setCycles((state) => [...state, newCycle])
        setActiveCycleId(id)

        reset(); //Volta os campos do formulário segundo foi colocado no default values no schema
    }

    const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

    const task = watch('task') //Monitora o campo task que foi declarado no register do input task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            {/* handleSubmit do hookForm passa uma função para dentro do onSubmit do form html */}
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action=""> 
                <FormContainer>
                    <label htmlFor="task">Vou trabalhar em</label>
                    <TaskInput 
                        type="text"
                        id="task" 
                        placeholder="Dê um nome para o seu projeto" 
                        list="task-suggestion"
                        {...register('task')}
                    />

                    <datalist id="task-suggestion">
                        <option value="Projeto 1" />
                        <option value="Projeto 2" />
                        <option value="Projeto 3" />
                    </datalist>

                    <label htmlFor="minutesAmount">durante</label>
                    <MinutesAmountInput 
                        type="number" 
                        id="minutesAmount" 
                        placeholder="00"
                        step={5}
                        min={5}
                        max={60}
                        {...register('minutesAmount', {valueAsNumber: true})} //Para vir como número
                    />

                    <span>minutos.</span>
                </FormContainer>
                
                <CountdownContainer>
                    <span>0</span>
                    <span>0</span>
                    <Separator>:</Separator>
                    <span>0</span>
                    <span>0</span>
                </CountdownContainer>

                <StartCoutdownButton disabled={isSubmitDisabled} type="submit">
                    <Play size={24} />
                    Começar
                </StartCoutdownButton>
            </form>
        </HomeContainer>
        
    )
}