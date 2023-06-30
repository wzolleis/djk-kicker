import {configuration, isGameLocation} from "~/config";
import {ChangeEvent, ChangeEventHandler, useState} from "react";
import messages from "~/components/i18n/messages";
import ControlledInputWithLabel from "~/components/common/form/ControlledInputWithLabel";


export type LocationInputProps = {
    defaultValue?: string
    name?: string
}

const LocationSuggestions = ({onChange, name}: { onChange: (value: string) => void, name: string }) => {
    return (
        <div className={"flex w-full flex-col col-span-4 py-1 ml-2 my-5"}>
            <label
                htmlFor={`${name}`}
                className="mb-2 block md:font-medium text-gray-400"
            >
                {messages.commonForm.gameLocations}
            </label>
            <select className={"rounded-lg border-2 border-gray-600 text-gray-400"}
                    id={name}
                    name={name}
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => onChange(event.target.value)}
            >
                {
                    Object.keys(configuration.gameLocations).map(key => {
                        if (isGameLocation(key)) {
                            return <option key={key} value={configuration.gameLocations[key]} label={configuration.gameLocations[key]}/>
                        }
                    })
                }
            </select>
        </div>
    )
}


const LocationInput = ({defaultValue, name = 'location'}: LocationInputProps) => {
    const [gameLocation, setGameLocation] = useState<string>(defaultValue || 'Halle')

    const onGameLocationSelect = (value: string) => {
        setGameLocation(value)
    }

    const onInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setGameLocation(event.target.value)
    }

    return (
        <div className={'grid grid-cols-1 xl:grid-cols-12 py-2 gap-2'}>
            <div className={"flex flex-col col-span-4"}>
                <ControlledInputWithLabel id={'location'} type={'text'} name={name} label={'Spielort'} value={gameLocation} onChange={onInputChange}/>
            </div>
            <LocationSuggestions onChange={onGameLocationSelect} name={`${name}-suggestions`}/>
        </div>
    )
}

export default LocationInput