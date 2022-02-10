import * as React from 'react'
import { IMaskInput } from 'react-imask'

interface MoneyInputFieldProps {
    //onChange: (event: { target: { name: string; value: number } }) => void
    onChange: (elem: any) => any
    name: string
}

const MoneyInputField = React.forwardRef<HTMLElement, MoneyInputFieldProps>(function MoneyInputField(props, ref) {
    const { onChange, ...other } = props
    return (
        <IMaskInput
            {...other}
            //@ts-ignore
            mask={Number}
            radix=","
            mapToRadix={['.']}
            scale={2}
            signed={false}
            thousandsSeparator=" "
            padFractionalZeros={true}
            lazy
            unmask={true}
            inputRef={ref}
            onAccept={(value: number) => onChange({ target: { name: props.name, value } })}
            overwrite
        />
    )
})

export default MoneyInputField
