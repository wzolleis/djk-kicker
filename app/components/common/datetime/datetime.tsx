import {DateTime} from "luxon";
import messages from "~/components/i18n/messages";
import {ChangeEvent, useState} from "react";
import dateUtils from "~/dateUtils";

type DateTimeInputProps = {
    defaultValue?: DateTime | undefined
    name: string
}

const calculateDateSuggestions = (startDate: DateTime = DateTime.now()): DateTime[] => {
    const dayOfWeek = startDate.weekday // 1 Monday, 7 Sunday, 3 Wednesday
    const wednesday: number = 3;
    const weekNumber = dayOfWeek <= wednesday ? startDate.weekNumber : startDate.weekNumber + 1
    const keys = [...Array(10).keys()]
    return keys.map((index) => DateTime.now().set({weekday: wednesday, weekNumber: weekNumber + index}))
}

const calculateTimeSuggestions = ({start, end, step}: { start: DateTime, end: DateTime, step: number }): DateTime[] => {
    let currentTime = start
    const times = []
    while (currentTime < end) {
        times.push(currentTime)
        currentTime = currentTime.plus({minute: step})
    }
    return times
}

export const formatForDatePicker = (value: DateTime): string => value.toFormat('yyyy-MM-dd')
const formatForTimePicker = (value: DateTime): string => value.toFormat('HH:mm')
export const formatLabelForDatePicker = (value: DateTime): string => `${value.toFormat('dd.MM.yyyy')}`

export const DateInput = ({
                              onChange,
                              value,
                              name,
                              label
                          }: { onChange: (value: string) => void, value: string, name: string, label: string }) => {
    return (
        <>
            <div className={"flex flex-col col-span-2"}>
                <label
                    htmlFor={`${name}`}
                    className="mb-2 block md:font-medium text-gray-900"
                >
                    {label}
                </label>
                <input className={"rounded-lg border-2 border-gray-600 focus:border-blue-500"}
                       id={`${name}`}
                       type={'date'}
                       name={name}
                       value={value}
                       onChange={(event) => onChange(event.target.value)}/>
            </div>
        </>
    )
}

const TimeInput = ({
                       onChange,
                       value,
                       name
                   }: { onChange: (value: string) => void, value: string, name: string }) => {

    return (
        <div className={"flex flex-col col-span-2"}>
            <label
                htmlFor={`${name}-time`}
                className="mb-2 block md:font-medium text-gray-900"
            >
                {messages.commonForm.time}
            </label>
            <input className={"rounded-lg border-2 border-gray-600"}
                   type={'time'}
                   name={`${name}-time`}
                   list={"timevalues"}
                   value={value}
                   onChange={(event) => onChange(event.target.value)}/>
        </div>
    )
}

const DateSuggestion = ({
                            suggestions,
                            onChange,
                            name
                        }: { suggestions: DateTime[], onChange: (value: string) => void, name: string }) => {
    return (
        <div className={"flex flex-col col-span-2"}>
            <label
                htmlFor={`${name}`}
                className="mb-2 block md:font-medium text-gray-400"
            >
                {messages.commonForm.dateSuggestion}
            </label>
            <select className={"rounded-lg border-2 border-gray-600 text-gray-400"}
                    id={name}
                    name={name}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
            >
                {
                    suggestions.map((dateValue) => {
                        const value = formatForDatePicker(dateValue)
                        const label = formatLabelForDatePicker(dateValue)
                        return (
                            <option key={value} value={value}>{label}</option>
                        )
                    })
                }
            </select>
        </div>
    )
}

const TimeSuggestion = ({
                            suggestions,
                            onChange,
                            name
                        }: { suggestions: DateTime[], onChange: (value: string) => void, name: string }) => {
    return (
        <div className={"flex flex-col col-span-2"}>
            <label
                htmlFor={name}
                className="mb-2 block md:font-medium text-gray-400"
            >
                {messages.commonForm.timeSuggestion}
            </label>
            <select className={"rounded-lg border-2 border-gray-600 text-gray-400"}
                    name={name}
                    id={name}
                    onChange={(event) => onChange(event.target.value)}
            >
                {suggestions.map((time) => {
                    const value = formatForTimePicker(time)
                    const label = formatForTimePicker(time)
                    return (
                        <option key={label} value={value}>{label}</option>
                    )
                })}
            </select>
        </div>
    )
}

const DateTimeInput = ({defaultValue, name}: DateTimeInputProps) => {
    const [dateValue, setDateValue] = useState<DateTime>(defaultValue || DateTime.now())

    const onTimeValueSelect = (value: string) => {
        const timePickerValue = DateTime.fromFormat(value, 'HH:mm')
        const newValue = dateValue.set({hour: timePickerValue.hour, minute: timePickerValue.minute})
        setDateValue(newValue)
    }

    const onDateValueSelect = (value: string) => {
        const datePickerValue = DateTime.fromFormat(value, dateUtils.datePickerFormat)
        setDateValue(dateValue.set({
            year: datePickerValue.year,
            month: datePickerValue.month,
            day: datePickerValue.day
        }))
    }

    const dateSuggestions = calculateDateSuggestions()
    const timeSuggestions = calculateTimeSuggestions({
        start: DateTime.now().set({hour: 17, minute: 0}),
        end: DateTime.now().set({hour: 20, minute: 15}),
        step: 15
    })

    const dateValueTxt = dateUtils.dateTimeToFormat({value: dateValue})
    return (
        <div className={'grid grid-cols-1 xl:grid-cols-12 py-2 gap-2'}>
            <datalist id={"timevalues"}>
                {timeSuggestions.map((time) => {
                    const value = formatForTimePicker(time)
                    return <option key={value} value={value}/>
                })}
            </datalist>
            <input name={name} type={'hidden'} value={dateValueTxt}/>
            <DateInput
                onChange={onDateValueSelect}
                value={formatForDatePicker(dateValue)}
                name={`${name}.date`}
                label={messages.commonForm.date}
            />
            <TimeInput onChange={onTimeValueSelect} value={formatForTimePicker(dateValue)} name={`${name}.time`}/>
            <DateSuggestion suggestions={dateSuggestions} onChange={onDateValueSelect} name={`${name}-datesuggestion`}/>
            <TimeSuggestion suggestions={timeSuggestions} onChange={onTimeValueSelect} name={`${name}-timesuggestion`}/>
        </div>
    )
}

export default DateTimeInput