import { FormContainer, MinutesAmountInput, TaskInput } from "./styles";
import { useContext } from "react";

import { useFormContext } from "react-hook-form";
import { CyclesContext } from "../../../../contexts/CyclesContext";




export function NewCycleForm() {
    const {activeCycle} = useContext(CyclesContext)

    const {register} = useFormContext() //Próprio do react hook form

    return (
        <FormContainer>
            <label htmlFor="task">Vou trabalhar em</label>
            <TaskInput
                type="text"
                id="task"
                placeholder="Dê um nome para o seu projeto"
                list="task-suggestion"
                disabled={!!activeCycle} //Se tiver valor dentro converte para true
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
                disabled={!!activeCycle}
                {...register('minutesAmount', { valueAsNumber: true })} //Para vir como número
            />

            <span>minutos.</span>
        </FormContainer>
    )
}