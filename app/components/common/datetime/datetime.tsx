import {DateTime} from "luxon";
import messages from "~/components/i18n/messages";
import {ChangeEvent, useState} from "react";

type DateTimeInputProps = {
    defaultValue?: DateTime | undefined
    name: string
}

const DateTimeInput = ({defaultValue, name}: DateTimeInputProps) => {
    const [dateValue, setDateValue] = useState<DateTime>(defaultValue || DateTime.now)

    const handleDatePicker = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const datePickerValue = DateTime.fromFormat(value, 'yyyy-MM-dd')
        setDateValue(datePickerValue.set({hour: dateValue.hour, minute: dateValue.minute}))
    }

    const handleTimePicker = (event: ChangeEvent<HTMLInputElement>) => {
        const value = event.target.value
        const timePickerValue = DateTime.fromFormat(value, 'HH:mm')
        setDateValue(timePickerValue.set({hour: timePickerValue.hour, minute: timePickerValue.minute}))
    }

    const handleDefaultValueSelect = (event: ChangeEvent<HTMLSelectElement>) => {
        const value = event.target.value
        console.log(value)
        const timePickerValue = DateTime.fromFormat(value, 'HH:mm')
        setDateValue(timePickerValue.set({hour: timePickerValue.hour, minute: timePickerValue.minute}))
    }

    const datePickerTimeAsString = dateValue.toFormat('yyyy-MM-dd')
    const timePickerValueAsString = dateValue.toFormat('HH:mm')

    return (
        <div className={'grid grid-cols-1 xl:grid-cols-12 py-2 gap-2'}>
            <datalist id={"timevalues"}>
                <option value={"18:00"}/>
                <option value={"18:30"}/>
                <option value={"19:00"}/>
                <option value={"19:30"}/>
                <option value={"20:00"}/>
            </datalist>
            <div className={"flex flex-col col-span-2"}>
                <label
                    htmlFor={`${name}-date`}
                    className="mb-2 block md:font-medium text-gray-900"
                >
                    {messages.commonForm.date}
                </label>
                <input className={"rounded-lg border border-2 border-gray-600 focus:border-blue-500"}
                       id={`${name}-date`}
                       type={'date'}
                       name={'datepicker-date'}
                       value={datePickerTimeAsString}
                       onChange={handleDatePicker}/>
            </div>
            <div className={"flex flex-col col-span-2"}>
                <label
                    htmlFor={`${name}-time`}
                    className="mb-2 block md:font-medium text-gray-900"
                >
                    {messages.commonForm.time}
                </label>
                <input className={"rounded-lg border border-2 border-gray-600"}
                       type={'time'}
                       name={`${name}-time`}
                       list={"timevalues"}
                       value={timePickerValueAsString}
                       onChange={handleTimePicker}/>
            </div>
            <div className={"flex flex-col col-span-2"}>
                <label
                    htmlFor={`${name}-predefined-time`}
                    className="mb-2 block md:font-medium text-gray-900"
                >
                    {messages.commonForm.suggestion}
                </label>
                <select className={"rounded-lg border border-2 border-gray-600"}
                        name={`${name}-predefinedtime`}
                        onChange={handleDefaultValueSelect}
                >
                    <option value={"18:00"}>{"18:00"}</option>
                    <option value={"18:30"}>{"18:30"}</option>
                    <option value={"19:00"}>{"19:00"}</option>
                    <option value={"19:30"}>{"19:30"}</option>
                    <option value={"20:00"}>{"20:00"}</option>
                </select>
            </div>
        </div>
    )
}

export default DateTimeInput