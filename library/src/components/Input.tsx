import * as React from 'react'
import styled from 'styled-components'

interface IProps {
  name: string
  placeholder?: string
  type: 'text' | 'password' | 'number'
  onChange?: Function
  forwardedRef?: any
  noMargin?: boolean
}

const InputComponent = styled.input`
  position: relative;
  display: block;
  margin-bottom: 20px;
  padding: 10px 20px;
  border: 1px solid ${(props: any) => props.theme.bordercolor};
  border-radius: 4px;
  outline-color: ${(props: any) => props.theme.primaryColor};
  color: #000;
  transition: border-color 0.5s ease-out;
  box-shadow: none;

  &::placeholder {
    color: ${(props: any) => props.theme.darkGray};
  }

  ${(p: IProps) =>
    p.noMargin &&
    `
    margin: 0;
  `}
`

const Input = React.forwardRef((props: IProps, ref: any) => {
  const { name, placeholder, type, onChange, noMargin = false } = props
  const inputEl: any = React.useRef(null)

  const [value, setValue] = React.useState()

  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return ''
    }
    return value
  }

  const onChangeLocal = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setValue(value)

    if (onChange) {
      let event = e
      if (e.type === 'click') {
        // click clear icon
        event = Object.create(e)
        event.target = inputEl
        event.currentTarget = inputEl
        const originalInputValue = inputEl.value
        // change input value cause e.target.value should be '' when clear input
        inputEl.value = ''
        onChange(event as React.ChangeEvent<HTMLInputElement>)
        // reset input value
        inputEl.value = originalInputValue
        return
      }
      onChange(event as React.ChangeEvent<HTMLInputElement>)
    }
  }

  return (
    <InputComponent
      ref={ref}
      placeholder={placeholder}
      value={fixControlledValue(value)}
      type={type}
      name={name}
      onChange={onChangeLocal}
      noMargin={noMargin}
    />
  )
})

export default Input
