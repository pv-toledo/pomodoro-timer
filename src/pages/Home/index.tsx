import { HandPalm, Play } from "phosphor-react";
import { HomeContainer, StartCountdownButton, StopCountdownButton } from "./styles";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod' //Usando assim pois zod não tem export default
import {useContext} from "react";
import { NewCycleForm } from "./components/NewCycleForm";
import { Countdown } from "./components/Countdown"
import { CyclesContext } from "../../contexts/CyclesContext";

export function Home() {
    const {activeCycle ,createNewCycle, interruptCurrentCycle} = useContext(CyclesContext)
    

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

    function handleCreateNewCycle (data: newCycleFormData) {
        createNewCycle(data)
        reset() //Reseta os campos do formulário (vem do react hook form)
    }
    
    // data é onde eu acesso todas as informações que vêm do form
    
    const task = watch('task') //Monitora o campo task que foi declarado no register do input task
    const isSubmitDisabled = !task

    return (
        <HomeContainer>
            {/* handleSubmit do hookForm passa uma função para dentro do onSubmit do form html */}
            <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">

                
                <FormProvider {...newCycleForm}>
                    <NewCycleForm />
                </FormProvider>
                
                <Countdown />

            
                {activeCycle ? (
                    <StopCountdownButton onClick={interruptCurrentCycle} type="button">
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